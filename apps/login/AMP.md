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
- `src/styles/eds/`: EDS's CSS variables and the Inter font, copied from `@edgeandnode/eds-css` (MIT, Inter under the
  OFL) instead of installed, since the package depends on far more than these files.
- `src/components/logo.tsx`: always the Amp logo. `src/app/(login)/layout.tsx`: loads `amp.css`, drops Lato.

## Moving to a newer Zitadel release

`amp/base-vX.Y.Z` is upstream's `vX.Y.Z` tag plus our merged commits. To move from `vOLD` to `vX.Y.Z`, put the new tag
on a new base branch, then replay our commits on it in a PR:

```sh
git fetch origin
git fetch https://github.com/zitadel/zitadel.git tag vOLD tag vX.Y.Z --no-tags
git push origin 'vX.Y.Z^{commit}:refs/heads/amp/base-vX.Y.Z'
git switch -c benface/zitadel-vX.Y.Z origin/amp/base-vX.Y.Z
git cherry-pick vOLD..origin/amp/base-vOLD
git push -u origin benface/zitadel-vX.Y.Z
gh pr create -R edgeandnode/zitadel --base amp/base-vX.Y.Z --draft
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

To update EDS, copy `styles/variables.generated.css` to `src/styles/eds/variables.css`, and the Inter part of
`styles/fonts.css` and its font files to `src/styles/eds/`, from the new `@edgeandnode/eds-css`, then run
`pnpm exec prettier --write src/styles/eds` from `apps/login`.

## Building

From the repository root, on Linux (the build bundles native modules for the platform it runs on):

```sh
pnpm install --frozen-lockfile
pnpm nx run @zitadel/login:build
docker build -t ghcr.io/edgeandnode/zitadel-login:vX.Y.Z-amp.N apps/login
```

The image runs like upstream's `ghcr.io/zitadel/zitadel-login`, with the same environment variables.
