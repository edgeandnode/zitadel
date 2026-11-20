// Amp's texts: `amp-locales/<locale>.json` is merged over upstream's `locales/<locale>.json` (see AMP.md).

/**
 * Loads Amp's texts for a locale, or nothing if it has none, so the locale's own and English texts show instead.
 */
export async function loadAmpMessages(locale: string): Promise<Record<string, unknown>> {
  try {
    return (await import(`../../amp-locales/${locale}.json`)).default;
  } catch {
    return {};
  }
}

// The audience scope of a project, whose ID differs per environment: `urn:zitadel:iam:org:project:id:<id>:aud`.
// Zitadel's IDs are numeric, which leaves out the `zitadel` project's own audience scope.
const PROJECT_AUDIENCE_SCOPE = /^urn:zitadel:iam:org:project:id:\d+:aud$/;
const PROJECT_AUDIENCE_KEY = "urn:zitadel:iam:org:project:id:{projectId}:aud";

type Translator = { (key: string): string; has(key: string): boolean };

/**
 * What the consent page shows for a scope: its text from `device.scope`, matching the project audience scope by
 * pattern, or the scope itself when it has no text, rather than a blank row.
 */
export function scopeLabel(t: Translator, scope: string): string {
  const keys = [scope];
  if (PROJECT_AUDIENCE_SCOPE.test(scope)) {
    keys.push(PROJECT_AUDIENCE_KEY);
  }
  for (const key of keys) {
    if (t.has(`device.scope.${key}`)) {
      return t(`device.scope.${key}`);
    }
  }
  return scope;
}
