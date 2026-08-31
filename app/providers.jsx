'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import themeModule from '@/src/theme/index.js';
import { getSettings } from '@/src/api/settingsApi.js';

const { defaultTheme, toCssVariables } = themeModule;

function applyThemeVariables(theme, settings) {
  if (typeof window === 'undefined') return;
  const variables = { ...toCssVariables(theme) };

  if (settings?.primary_color) variables['--color-primary'] = settings.primary_color;
  if (settings?.primary_hover_color) variables['--color-primary-hover'] = settings.primary_hover_color;
  if (settings?.secondary_color) variables['--color-secondary'] = settings.secondary_color;
  if (settings?.accent_color) variables['--color-accent'] = settings.accent_color;
  if (settings?.background_color) variables['--color-background'] = settings.background_color;
  if (settings?.surface_color) variables['--color-surface'] = settings.surface_color;
  if (settings?.text_color) variables['--color-text'] = settings.text_color;
  if (settings?.theme_preset === 'dark') {
    variables['--color-background'] = '#080812';
    variables['--color-surface'] = 'rgba(17, 24, 39, 0.62)';
    variables['--color-text'] = '#f8fafc';
  }

  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

function applyFavicon(settings) {
  if (typeof window === 'undefined') return;
  const fallback = '/assets/favicon.svg';
  const href = settings?.favicon_url || fallback;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = href;
}

function ThemeAndSettingsInitializer() {
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: getSettings });

  useEffect(() => {
    applyThemeVariables(defaultTheme, settingsQuery.data);
    if (document.documentElement) {
      document.documentElement.dataset.theme = settingsQuery.data?.theme_preset || 'designbeen';
    }
    applyFavicon(settingsQuery.data);
  }, [settingsQuery.data]);

  return null;
}

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeAndSettingsInitializer />
      {children}
    </QueryClientProvider>
  );
}
