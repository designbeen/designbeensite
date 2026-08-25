import React from 'react';

export default function BrandLogo({ settings = {}, variant = 'public' }) {
  const fallback = '/assets/logo-mark.svg';
  const imageUrl = settings.logo_url || fallback;
  const label = settings.site_name || 'DesignBeen';
  const isAdmin = variant === 'admin';

  return (
    <span className={isAdmin ? 'admin-brand-mark' : 'brand-mark'}>
      <img
        src={imageUrl}
        alt={`${label} logo`}
        onError={(event) => {
          if (event.currentTarget.src.endsWith(fallback)) return;
          event.currentTarget.src = fallback;
        }}
      />
    </span>
  );
}
