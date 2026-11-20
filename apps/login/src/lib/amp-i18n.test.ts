import { readdirSync } from "fs";
import { createTranslator } from "next-intl";
import { join } from "path";
import { describe, expect, it } from "vitest";
import en from "../../amp-locales/en.json";
import { loadAmpMessages, scopeLabel } from "./amp-i18n";
import { LANGS } from "./i18n";
import { mergeMessages } from "./merge-messages";

const translator = (messages: Record<string, unknown>) =>
  createTranslator({ locale: "en", messages: messages as never, onError: () => {} }) as unknown as Parameters<
    typeof scopeLabel
  >[0];

function keys(messages: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    value && typeof value === "object" ? keys(value as Record<string, unknown>, `${prefix}${key}/`) : [prefix + key],
  );
}

describe("Amp's texts", () => {
  it("cover every locale the login ships, with the same keys as English", async () => {
    const files = readdirSync(join(__dirname, "../../amp-locales")).sort();
    expect(files).toEqual(LANGS.map((l) => `${l.code}.json`).sort());
    for (const { code } of LANGS) {
      expect(keys(await loadAmpMessages(code)).sort(), code).toEqual(keys(en).sort());
    }
  });

  it("load nothing for a locale without them", async () => {
    expect(await loadAmpMessages("xx")).toEqual({});
  });
});

describe("scopeLabel", () => {
  const t = translator(mergeMessages({ device: { scope: { openid: "Verify your identity." } } }, en));

  it("uses a scope's text", () => {
    expect(scopeLabel(t, "openid")).toBe("Verify your identity.");
    expect(scopeLabel(t, "urn:zitadel:iam:org:projects:roles")).toBe("See your Amp roles.");
  });

  it("matches any project's audience scope", () => {
    expect(scopeLabel(t, "urn:zitadel:iam:org:project:id:400472439856824323:aud")).toBe("Use Amp with your access.");
    expect(scopeLabel(t, "urn:zitadel:iam:org:project:id:1:aud")).toBe("Use Amp with your access.");
  });

  it("prefers a text stored for the exact scope", () => {
    const stored = translator(
      mergeMessages(en, { device: { scope: { "urn:zitadel:iam:org:project:id:123:aud": "Stored text." } } }),
    );
    expect(scopeLabel(stored, "urn:zitadel:iam:org:project:id:123:aud")).toBe("Stored text.");
  });

  it("shows the scope's name when it has no text", () => {
    expect(scopeLabel(t, "urn:zitadel:iam:org:project:id:zitadel:aud")).toBe("urn:zitadel:iam:org:project:id:zitadel:aud");
    expect(scopeLabel(t, "urn:zitadel:iam:org:id:123")).toBe("urn:zitadel:iam:org:id:123");
    expect(scopeLabel(t, "custom.scope")).toBe("custom.scope");
  });
});
