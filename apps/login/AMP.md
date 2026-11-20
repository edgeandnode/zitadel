# Amp's login

Zitadel's login, styled with the [Edge Design System](https://github.com/edgeandnode/eds) (EDS). Login behavior is
upstream's.

## What changes

- `src/styles/amp.css`: maps EDS's fonts and semantic colors onto the login's theme variables, light and dark. Zitadel
  sets those from the instance's branding settings at runtime, so they're `!important`: EDS wins over the console.
  It also restyles components that the variables can't reach (button and sign-in button sizes, the sign-in buttons'
  icons, primary buttons, the text fields' hover and error borders) by selecting upstream's own class names, like
  `.leading-36px`, `.bg-primary-light-500`, `.bg-input-light-background`, `.border-warn-light-500` and `.h-12.w-12`,
  and the sign-in forms by their `input[name="provider"]`. If a release renames one of them, its rule silently stops
  matching.
- `amp.tailwind.config.mjs`: upstream's Tailwind config, with the palettes components hard-code (grays, input, state…)
  pointed at EDS's tokens. `src/styles/globals.scss` loads it instead of `tailwind.config.mjs`.
- `package.json`: depends on `@edgeandnode/eds-css`, pinned to an exact version, for EDS's CSS variables and the Inter
  font, which `amp.css` imports. Only its CSS reaches the browser.
- `src/components/logo.tsx`: always the Amp logo. `src/app/(login)/layout.tsx`: loads `amp.css`, drops Lato.
- `.github/workflows/amp-login-image.yml`: builds and publishes the image (see Publishing).
- `amp-locales/<locale>.json`: Amp's texts, for every locale in `locales/`: the tab title, the registration page's
  description, the device code and consent pages' wording for our CLIs ("the code shown in your terminal", a disclaimer
  without Zitadel), and the labels of the scopes our CLIs request. `src/i18n/request.ts` merges them last, over
  upstream's `locales/` and over the texts Zitadel returns (which include Zitadel's defaults even when nothing is stored
  there), so texts stored in Zitadel can't change these keys. A unit test checks that every locale has the same keys.
- `src/lib/amp-i18n.ts`: loads `amp-locales/`, and picks each scope's label on the consent page
  (`src/components/consent.tsx`). A project's audience scope (`urn:zitadel:iam:org:project:id:<id>:aud`) is matched by
  pattern, since the project ID differs per environment. A scope without a label shows its name instead of a blank row.
- `src/app/icon.svg` and `src/app/apple-icon.png`: the Amp favicon (from ampdb-docs and ampdb-app). Upstream has none.

## Moving to a newer Zitadel release

`amp/base-vX.Y.Z` is upstream's `vX.Y.Z` tag plus our merged commits. To move from `vOLD` to `vX.Y.Z`, put the new tag
on a new base branch, then replay our commits on it in a PR. Fetch both tags first:

```sh
git fetch origin
git fetch https://github.com/zitadel/zitadel.git tag vOLD tag vX.Y.Z --no-tags
git diff --name-status --diff-filter=AR vOLD vX.Y.Z -- .github/workflows
```

If that lists a workflow, the release adds (or renames) one, and it arrives enabled: pushing the new base and opening
the PR are events it may run on. Disable it first, as "Upstream's workflows" says. Then:

```sh
git push origin 'vX.Y.Z^{commit}:refs/heads/amp/base-vX.Y.Z'
git switch -c benface/zitadel-vX.Y.Z origin/amp/base-vX.Y.Z
git cherry-pick vOLD..origin/amp/base-vOLD
git push -u origin benface/zitadel-vX.Y.Z
gh pr create -R edgeandnode/zitadel --base amp/base-vX.Y.Z --draft
```

If a cherry-pick conflicts on `pnpm-lock.yaml` (ours adds `@edgeandnode/eds-css`), take the new tag's lockfile,
add our dependency back with `pnpm install`, then continue:

```sh
git checkout --ours pnpm-lock.yaml  # in a cherry-pick, "ours" is the branch being built: the new tag's file
pnpm install
git add pnpm-lock.yaml
git cherry-pick --continue
```

Once it's merged, make the new base the default branch:
`gh repo edit edgeandnode/zitadel --default-branch amp/base-vX.Y.Z`.

Move each PR that's still open on the old base too, from a checkout of its branch:

```sh
git rebase --onto origin/amp/base-vX.Y.Z origin/amp/base-vOLD
git push --force-with-lease
gh pr edit <number> --base amp/base-vX.Y.Z
```

Then build it and check every screen in light and dark: a component that starts using a new color or class may need a
mapping in `amp.css` or `amp.tailwind.config.mjs`. Check what `amp.css` selects by class name too, since nothing fails
when a selector stops matching:

- Buttons and sign-in buttons are 40px tall, like the text fields, with the provider's logo whole and centered.
- Primary buttons have EDS's brand border, and its faded brand color when disabled.
- Text fields and sign-in buttons get EDS's gray border on hover, not black or white, and a field with an error keeps
  its red border on hover in both themes.
- A border without a color utility, like the account picker's, is EDS's muted gray, not the text color.
- The keys in `amp-locales/` still exist in `locales/en.json`, since a renamed key leaves Amp's text unused: the tab
  title, the registration page's description, and the device code and consent pages, signed in during the device flow
  and after a reload, with every scope labeled.

To update EDS, bump the pinned `@edgeandnode/eds-css` version in `package.json`, run `pnpm install` from the
repository root, and check every screen again.

## Publishing

`.github/workflows/amp-login-image.yml` builds the login on Linux and pushes `ghcr.io/edgeandnode/zitadel-login` for
`linux/amd64` and `linux/arm64`, tagged `vX.Y.Z-amp.N` and with the commit's full SHA. `vX.Y.Z` is the Zitadel release
the commit is based on: the workflow checks it's the newest upstream release the commit contains. `N` counts our builds
on it, from 1. Nothing is ever tagged `latest`, and the workflow refuses to overwrite a tag that exists.

Merging doesn't publish. To ship the default branch, tag it `login-vX.Y.Z-amp.N`, with the next `N`:

```sh
git fetch origin --tags
git tag -l 'login-vX.Y.Z-amp.*'
git tag login-vX.Y.Z-amp.N origin/amp/base-vX.Y.Z
git push origin login-vX.Y.Z-amp.N
```

The run's summary gives the image's digest. Moving to a newer Zitadel release starts again at `vX.Y.Z-amp.1`.

To build without a git tag, run the workflow by hand with the image tag:
`gh workflow run amp-login-image.yml -R edgeandnode/zitadel --ref <branch> -f tag=vX.Y.Z-amp.N`. GitHub only offers
this once the workflow is on the default branch; before that, push a git tag on the branch instead. Use a suffix for
builds that shouldn't ship (`vX.Y.Z-amp.0-test`), then delete the git tag, and the version in the package's settings.

The package is public, so the cluster pulls it without credentials.

### Upstream's workflows

The fork carries upstream's workflows, which need upstream's secrets and runners. They're disabled in the fork's
Actions settings rather than deleted, to keep the diff small: CI, Code Scanning, Add new issues to product management
project, `ready_for_review.yml`, and the reusable Lint Test Build, Package und Publish Archives and Images, Release and
Version.

GitHub only lists a workflow, and lets you disable it, once it has run. To disable a new one without running it: on a
throwaway branch, replace its file with a job that has `if: false` and runs on a push to that branch, push the branch
(GitHub records a skipped run), run `gh workflow disable <file name> -R edgeandnode/zitadel`, then delete the branch.
Leave the skipped run. When we deleted those runs, 7 of the 8 workflows went from disabled to `deleted` (CI didn't),
and the next push of their files enabled them again.

## Building locally

From the repository root, on Linux (the build bundles native modules for the platform it runs on):

```sh
pnpm install --frozen-lockfile
pnpm nx run @zitadel/login:build
docker build -t zitadel-login:local apps/login
```

The image runs like upstream's `ghcr.io/zitadel/zitadel-login`, with the same environment variables.
