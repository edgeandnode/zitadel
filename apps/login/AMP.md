# Amp's login

Zitadel's login, styled with the [Edge Design System](https://github.com/edgeandnode/eds) (EDS). Login behavior is
upstream's.

## What changes

- `src/styles/amp.css`: maps EDS's fonts and semantic colors onto the login's theme variables, light and dark. Zitadel
  sets those from the instance's branding settings at runtime, so they're `!important`: EDS wins over the console.
- `amp.tailwind.config.mjs`: upstream's Tailwind config, with the palettes components hard-code (grays, input, state…)
  pointed at EDS's tokens. `src/styles/globals.scss` loads it instead of `tailwind.config.mjs`.
- `src/styles/eds/`: EDS's CSS variables and the Inter font, copied from `@edgeandnode/eds-css` (MIT, Inter under the
  OFL) instead of installed, since the package depends on far more than these files.
- `src/components/logo.tsx`: always the Amp logo. `src/app/(login)/layout.tsx`: loads `amp.css`, drops Lato.

## Moving to a newer Zitadel release

```sh
git fetch https://github.com/zitadel/zitadel.git tag vX.Y.Z --no-tags
git push origin 'vX.Y.Z^{commit}:refs/heads/amp/base-vX.Y.Z'
git switch benface/eds-login
git rebase --onto vX.Y.Z amp/base-vOLD
```

Then build it and check every screen in light and dark: a component that starts using a new color or class may need a
mapping in `amp.css` or `amp.tailwind.config.mjs`.

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
