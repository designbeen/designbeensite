'use client';

import React from 'react';
import LinkNext from 'next/link';
import { useRouter as useNextRouter, usePathname as useNextPathname, useParams as useNextParams } from 'next/navigation';

export function Link({ to, href, children, className, onClick, style, ...props }) {
  const destination = to || href || '/';
  return (
    <LinkNext href={destination} className={className} style={style} onClick={onClick} {...props}>
      {children}
    </LinkNext>
  );
}

export function NavLink({ to, href, children, className, activeClassName = 'active', ...props }) {
  const pathname = useNextPathname();
  const destination = to || href || '/';
  const isActive = pathname === destination || (destination !== '/' && pathname?.startsWith(destination));
  const combinedClassName = typeof className === 'function'
    ? className({ isActive })
    : `${className || ''} ${isActive ? activeClassName : ''}`.trim();

  return (
    <LinkNext href={destination} className={combinedClassName} {...props}>
      {children}
    </LinkNext>
  );
}

export function useNavigate() {
  const router = useNextRouter();
  return (path) => {
    if (typeof path === 'number') {
      if (path === -1) router.back();
    } else {
      router.push(path);
    }
  };
}

export function useLocation() {
  const pathname = useNextPathname();
  return { pathname, search: '', hash: '', state: null };
}

export function useParams() {
  return useNextParams() || {};
}

export function Outlet() {
  return null;
}
