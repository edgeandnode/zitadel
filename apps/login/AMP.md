# Amp's login

Zitadel's login, styled with the [Edge Design System](https://github.com/edgeandnode/eds) (EDS). Login behavior is
upstream's.

## Ours until upstream catches up

- `next` 16.4.6 instead of upstream's 16.4.3 (`package.json`, and only the `next` entries in `pnpm-lock.yaml`), for
  Next.js's security advisories fixed in 16.4.5. `apps/docs` keeps upstream's version: we don't ship it. When moving to
  a newer Zitadel release, drop this commit if the release pins `next` 16.4.5 or later. Otherwise, if its lockfile
  conflicts, take the release's `pnpm-lock.yaml`, set the version again and run `pnpm install --lockfile-only`.
