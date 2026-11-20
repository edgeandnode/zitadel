// Amp: Zitadel's Tailwind config, with the palettes its components hard-code pointed at EDS's tokens
// (src/styles/eds/variables.css). Its theme colors (primary, background, …) are CSS variables already;
// src/styles/amp.css maps those.
import config from "./tailwind.config.mjs";

// Tailwind's 50–950 steps onto an EDS scale's 100–900
const scale = (eds) =>
  Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [
      step,
      `var(--eds-color-${eds}-${Math.min(Math.max(step, 100), 900)})`,
    ]),
  );

const colors = config.theme.extend.colors;

export default {
  ...config,
  theme: {
    ...config.theme,
    extend: {
      ...config.theme.extend,
      colors: {
        ...colors,
        // Neutrals: EDS's foam (light) then space (dark) grays
        gray: {
          50: "var(--eds-color-foam-100)",
          100: "var(--eds-color-foam-200)",
          200: "var(--eds-color-foam-300)",
          300: "var(--eds-color-foam-500)",
          400: "var(--eds-color-foam-700)",
          500: "var(--eds-color-foam-800)",
          600: "var(--eds-color-foam-900)",
          700: "var(--eds-color-space-100)",
          800: "var(--eds-color-space-300)",
          900: "var(--eds-color-space-500)",
          950: "var(--eds-color-space-800)",
        },
        red: scale("sonja"),
        // Alerts are yellow, but nearly all of them are errors
        yellow: scale("sonja"),
        green: scale("starfield"),
        blue: scale("galactic"),
        state: {
          success: {
            light: { background: "var(--eds-color-starfield-100)", color: "var(--eds-color-starfield-700)" },
            dark: { background: "var(--eds-color-starfield-800)", color: "var(--eds-color-starfield-200)" },
          },
          error: {
            light: { background: "var(--eds-color-sonja-100)", color: "var(--eds-color-sonja-700)" },
            dark: { background: "var(--eds-color-sonja-800)", color: "var(--eds-color-sonja-200)" },
          },
          neutral: {
            light: { background: "var(--eds-color-foam-300)", color: "var(--eds-color-space-900)" },
            dark: { background: "var(--eds-color-space-500)", color: "var(--eds-color-white)" },
          },
          alert: {
            light: { background: "var(--eds-color-solar-100)", color: "var(--eds-color-solar-700)" },
            dark: { background: "var(--eds-color-solar-800)", color: "var(--eds-color-solar-200)" },
          },
        },
        // Components use these without a `dark:` pair too, so both get EDS's semantic tokens, which follow the theme
        divider: {
          light: "var(--eds-border-color-subtle)",
          dark: "var(--eds-border-color-subtle)",
        },
        input: Object.fromEntries(
          ["light", "dark"].map((theme) => [
            theme,
            {
              label: "var(--eds-text-color-default)",
              background: "var(--eds-background-color-form-idle)",
              border: "var(--eds-border-color-form-idle)",
              hoverborder: "var(--eds-border-color-form-hover)",
            },
          ]),
        ),
        button: {
          light: { border: "var(--eds-border-color-button-secondary-idle)" },
          dark: { border: "var(--eds-border-color-button-secondary-idle)" },
        },
      },
    },
  },
};
