'use client';

import React from 'react';
import { Link, NavLink, useNavigate } from '@/lib/router-compat';
import { logoutAdmin } from '../../api/adminApi.js';
import Button from '../common/Button.jsx';
import BrandLogo from '../common/BrandLogo.jsx';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../api/settingsApi.js';

const links = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/services', label: 'Services', icon: 'design_services' },
  { to: '/admin/projects', label: 'Projects', icon: 'view_quilt' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'format_quote' },
  { to: '/admin/technologies', label: 'Technologies', icon: 'code' },
  { to: '/admin/partners', label: 'Partners & Clients', icon: 'domain' },
  { to: '/admin/team', label: 'Team Members', icon: 'groups' },
  { to: '/admin/navigation', label: 'Navigation', icon: 'menu' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  { to: '/admin/contact-messages', label: 'Contact Messages', icon: 'mail' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const settings = settingsQuery.data || {};

  const signOut = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand-row">
          <BrandLogo settings={settings} variant="admin" />
          <Link to="/admin" className="footer-brand">
            <span>{settings.site_name || 'DesignBeen'}</span>
            <small>Control Center</small>
          </Link>
        </div>
        <div className="admin-nav-label">Workspace</div>
        <nav className="admin-menu" aria-label="Admin navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}>
              <span className="material-symbols-outlined admin-link-icon" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-session">
          <div className="admin-session-copy">
            <span className="admin-status-dot" />
            <span>Administrator</span>
          </div>
          <Button type="button" variant="secondary" onClick={signOut}>
            <span className="material-symbols-outlined" aria-hidden="true">logout</span>
            <span>Sign out</span>
          </Button>
        </div>
      </aside>
      <section className="admin-content">
        {children}
      </section>
    </div>
  );
}
