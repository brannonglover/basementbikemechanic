/**
 * Design tokens — single source for colors, type, and spacing.
 */
export const theme = {
  colors: {
    bg: "#f4f4f5",
    bgMuted: "#fafafa",
    surface: "#ffffff",
    text: "#18181b",
    textMuted: "#52525b",
    textInverse: "#fafafa",
    border: "rgba(24, 24, 27, 0.08)",
    borderStrong: "rgba(24, 24, 27, 0.14)",
    /** Brand — tuned from existing palette */
    primary: "#2f7eb8",
    primaryDark: "#25649a",
    primarySoft: "#d4e8f5",
    accent: "#e8b00c",
    accentHover: "#d4a20a",
    accentMuted: "#fef3c7",
    brandGreen: "#7cb342",
    headerBg: "#0a0a0a",
    headerAccent: "#c9a882",
    footerLink: "#1d6fa5",
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.04)",
    md: "0 4px 20px rgba(0, 0, 0, 0.07)",
    lg: "0 12px 40px rgba(0, 0, 0, 0.1)",
  },
  maxWidth: {
    content: "1280px",
    prose: "800px",
  },
  transition: "0.2s ease",
};
