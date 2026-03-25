/**
 * Design tokens — single source for colors, type, and spacing.
 */
const shared = {
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    full: "9999px",
  },
  maxWidth: {
    content: "1280px",
    prose: "800px",
  },
  transition: "0.2s ease",
};

export const lightTheme = {
  ...shared,
  colors: {
    bg: "#f4f4f5",
    bgMuted: "#fafafa",
    surface: "#ffffff",
    text: "#18181b",
    textMuted: "#52525b",
    textInverse: "#fafafa",
    border: "rgba(24, 24, 27, 0.08)",
    borderStrong: "rgba(24, 24, 27, 0.14)",
    primary: "#2f7eb8",
    primaryDark: "#25649a",
    primarySoft: "#d4e8f5",
    accent: "#e8b00c",
    accentHover: "#d4a20a",
    accentMuted: "#fef3c7",
    textOnAccent: "#18181b",
    brandGreen: "#7cb342",
    headerBg: "#0a0a0a",
    headerAccent: "#c9a882",
    footerLink: "#1d6fa5",
  },
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.04)",
    md: "0 4px 20px rgba(0, 0, 0, 0.07)",
    lg: "0 12px 40px rgba(0, 0, 0, 0.1)",
  },
};

export const darkTheme = {
  ...shared,
  colors: {
    bg: "#121214",
    bgMuted: "#1c1c21",
    surface: "#1a1a1f",
    text: "#f4f4f5",
    textMuted: "#a1a1aa",
    textInverse: "#fafafa",
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.14)",
    primary: "#5ba3d4",
    primaryDark: "#3d8bc4",
    primarySoft: "rgba(47, 126, 184, 0.22)",
    accent: "#e8b00c",
    accentHover: "#f0c030",
    accentMuted: "rgba(232, 176, 12, 0.18)",
    textOnAccent: "#18181b",
    brandGreen: "#9ccc65",
    headerBg: "#0a0a0a",
    headerAccent: "#d4b896",
    footerLink: "#7ec4f0",
  },
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.35)",
    md: "0 4px 20px rgba(0, 0, 0, 0.45)",
    lg: "0 12px 40px rgba(0, 0, 0, 0.55)",
  },
};

export const theme = lightTheme;
