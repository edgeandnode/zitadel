# Amp's login

Zitadel's login, styled with the [Edge Design System](https://github.com/edgeandnode/eds) (EDS). Login behavior is
upstream's.

## Ours until upstream catches up

- `next` 16.4.6 instead of upstream's 16.4.3, for Next.js's security advisories fixed in 16.4.5. `apps/docs` keeps
  upstream's version: we don't ship it. In `pnpm-lock.yaml`, only the login's `next` entries change: its importer,
  `next-intl`'s snapshot (its key and its `next` dependency), and the 16.4.6 `next`, `@next/env` and `@next/swc-*`
  entries.

  When moving to a newer Zitadel release, drop this commit if the release pins `next` 16.4.5 or later. Otherwise, if its
  lockfile conflicts, take the release's `pnpm-lock.yaml`, set the version again and run `pnpm install --lockfile-only`.
  That also rewrites unrelated peer entries (`debug`'s `supports-color`, `apps/docs`'s `next`). Commit them, or put
  them back and keep only the entries above. Either way, `pnpm install --frozen-lockfile` must pass and
  `pnpm --filter @zitadel/login why next` must find one version of `next`.
