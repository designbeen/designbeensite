import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSettings, getNavigation } from '../../api/settingsApi.js';
import Loading from '../common/Loading.jsx';
import BrandLogo from '../common/BrandLogo.jsx';

export default function Footer() {
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const navigationQuery = useQuery({ queryKey: ['navigation'], queryFn: getNavigation });

  if (settingsQuery.isLoading || navigationQuery.isLoading) {
    return <Loading label="Loading footer" />;
  }

  const settings = settingsQuery.data || {};
  const navigation = navigationQuery.data || [];
  const footerLinks = navigation.slice(0, 5);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer glass-card">
      <div className="footer-top-accent" />
      <div className="page-container">
        {/* Newsletter / Project Teaser Strip */}
        <motion.div
          className="footer-newsletter-card glass-panel"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="footer-newsletter-text">
            <h4>Architecting the Next Digital Reality</h4>
            <p>Subscribe to our engineering & UI release telemetry.</p>
          </div>
          <div className="footer-newsletter-action">
            <Link to="/contact" className="button button-primary">
              <span>Start a Project</span>
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
            </Link>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <BrandLogo settings={settings} />
              <div className="footer-brand-text">
                <span className="name">{settings.site_name || 'DesignBeen'}</span>
                <span className="tagline">{settings.site_tagline || 'Engineering Future Realities'}</span>
              </div>
            </Link>
            <p className="footer-copy">{settings.footer_description || 'Engineering Excellence in Design. Crafting the interfaces of tomorrow.'}</p>
            <div className="footer-status-pill">
              <span className="status-dot" />
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          <div className="footer-col">
            <p className="footer-label">Navigation</p>
            <div className="footer-links-list">
              {footerLinks.map((item) => (
                <Link key={item.id || item.url} to={item.url} className="footer-link">
                  <span className="link-arrow">›</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <p className="footer-label">Contact & Direct</p>
            <div className="footer-links-list footer-meta">
              {settings.email ? (
                <a href={`mailto:${settings.email}`} className="footer-meta-item">
                  <span className="material-symbols-outlined icon">mail</span>
                  <span>{settings.email}</span>
                </a>
              ) : null}
              {settings.phone ? (
                <a href={`tel:${settings.phone}`} className="footer-meta-item">
                  <span className="material-symbols-outlined icon">call</span>
                  <span>{settings.phone}</span>
                </a>
              ) : null}
              {settings.address ? (
                <div className="footer-meta-item">
                  <span className="material-symbols-outlined icon">location_on</span>
                  <span>{settings.address}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom">
          <div className="footer-bottom-info">
            <span>{settings.copyright_text || `© ${new Date().getFullYear()} DesignBeen. All rights reserved.`}</span>
            <span className="footer-tech-badge">HIGH-PERFORMANCE CMS</span>
          </div>

          <div className="footer-socials">
            {settings.instagram_url ? (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="social-pill">
                Instagram
              </a>
            ) : null}
            {settings.linkedin_url ? (
              <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-pill">
                LinkedIn
              </a>
            ) : null}
            {settings.behance_url ? (
              <a href={settings.behance_url} target="_blank" rel="noopener noreferrer" className="social-pill">
                Behance
              </a>
            ) : null}

            <button type="button" onClick={scrollToTop} className="scroll-top-button" aria-label="Scroll to top">
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
