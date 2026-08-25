import designbeen from './presets/designbeen.js';
import dark from './presets/dark.js';

const themes = {
  designbeen,
  dark,
};

const defaultTheme = designbeen;

function toCssVariables(theme) {
  return {
    '--color-primary': theme.colors.primary,
    '--color-primary-hover': theme.colors.primaryHover,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-accent-secondary': theme.colors.accentSecondary,
    '--color-background': theme.colors.background,
    '--color-background-secondary': theme.colors.backgroundSecondary,
    '--color-surface': theme.colors.surface,
    '--color-surface-elevated': theme.colors.surfaceElevated,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-text-muted': theme.colors.textMuted,
    '--color-border': theme.colors.border,
    '--color-border-light': theme.colors.borderLight,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-danger': theme.colors.danger,
    '--color-on-primary': theme.colors.onPrimary,
    '--gradient-primary': theme.effects.gradientPrimary,
    '--gradient-accent': theme.effects.gradientAccent,
    '--gradient-text': theme.effects.gradientText,
    '--glass-background': theme.effects.glassBackground,
    '--glass-background-hover': theme.effects.glassBackgroundHover,
    '--glass-border': theme.effects.glassBorder,
    '--glass-blur': theme.effects.glassBlur,
    '--glass-shadow': theme.effects.glassShadow,
    '--glass-radius': theme.effects.glassRadius,
    '--shadow-sm': theme.effects.shadowSm,
    '--shadow-md': theme.effects.shadowMd,
    '--shadow-lg': theme.effects.shadowLg,
    '--shadow-glow-primary': theme.effects.shadowGlowPrimary,
    '--shadow-glow-accent': theme.effects.shadowGlowAccent,
    '--font-heading': theme.typography.heading,
    '--font-body': theme.typography.body,
    '--font-mono': theme.typography.mono,
    '--container-width': '1280px',
    '--section-spacing': '120px',
    '--section-spacing-mobile': '72px',
    '--grid-gap': '24px',
    '--card-padding': '24px',
    '--card-padding-large': '32px',
    '--radius-sm': '8px',
    '--radius-md': '12px',
    '--radius-lg': '20px',
    '--radius-xl': '28px',
    '--radius-pill': '9999px',
  };
}

export { themes, defaultTheme, toCssVariables };

export default {
  themes,
  defaultTheme,
  toCssVariables,
};
