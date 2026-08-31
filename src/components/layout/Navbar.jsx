'use client';

import React, { useEffect, useState } from 'react';
import { Link, NavLink } from '@/lib/router-compat';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { getNavigation, getSettings } from '../../api/settingsApi.js';
import Loading from '../common/Loading.jsx';
import BrandLogo from '../common/BrandLogo.jsx';

const defaultNav = [
  { label: 'Home', url: '/' },
  { label: 'Services', url: '/services' },
  { label: 'Portfolio', url: '/portfolio' },
  { label: 'About', url: '/about' },
  { label: 'Contact', url: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const navigationQuery = useQuery({ queryKey: ['navigation'], queryFn: getNavigation });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  if (settingsQuery.isLoading || navigationQuery.isLoading) {
    return <Loading label="Loading navigation" />;
  }

  const settings = settingsQuery.data || {};
  const navigation = navigationQuery.data?.length ? navigationQuery.data : defaultNav;
  const visibleNavigation = navigation.filter((item) => item.visible !== 0);

  const renderNavigationLinks = (className = 'nav-link') =>
    visibleNavigation.map((item) => (
      <NavLink
        key={item.id || item.url}
        to={item.url}
        onClick={() => setMenuOpen(false)}
        className={({ isActive }) => `${className} ${isActive ? 'active' : ''}`}
      >
        <span className="nav-text">{item.label}</span>
        <span className="active-dot" />
      </NavLink>
    ));

  return (
    <header className={`navbar glass-card ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-top-line" />
      <div className="navbar-inner page-container">
        {/* Brand Lockup */}
        <Link to="/" className="brand-lockup" onClick={() => setMenuOpen(false)}>
          <BrandLogo settings={settings} />
          <div className="brand-text">
            <div className="brand-header">
              <strong className="brand-name">{settings.site_name || 'DesignBeen'}</strong>
              <span className="status-live-dot" title="System Status: Online" />
            </div>
            <small className="brand-tagline">{settings.site_tagline || 'Engineering Future Realities'}</small>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="navbar-links" aria-label="Main navigation">
          {renderNavigationLinks()}
        </nav>

        {/* Header Right Actions */}
        <div className="navbar-right-actions">
          <Link className="button button-primary navbar-cta" to="/contact">
            <span>{settings.primary_cta_label || 'Get Started'}</span>
            <span className="material-symbols-outlined cta-arrow">arrow_forward</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-menu-toggle ${menuOpen ? 'is-open' : ''}`}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            id="mobile-navigation"
            className="mobile-navigation"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <nav aria-label="Mobile navigation" className="mobile-navigation-links">
              {renderNavigationLinks('mobile-nav-link')}
            </nav>
            <Link className="button button-primary mobile-navigation-cta" to="/contact" onClick={() => setMenuOpen(false)}>
              <span>{settings.primary_cta_label || 'Get Started'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
