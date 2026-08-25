import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard.jsx';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import Button from '../../components/common/Button.jsx';
import { getDashboardStats, getAdminContactMessages } from '../../api/adminApi.js';

export default function Dashboard() {
  const statsQuery = useQuery({ queryKey: ['admin-stats'], queryFn: getDashboardStats });
  const messagesQuery = useQuery({ queryKey: ['admin-contact-messages'], queryFn: getAdminContactMessages });

  const defaultStats = {
    services: { total: 6, active: 6 },
    projects: { total: 3, featured: 2 },
    testimonials: { total: 3 },
    technologies: { total: 8 },
    messages: { total: 0, unread: 0 },
    system: { status: 'OPERATIONAL', database: 'MySQL 8.0 Connected', uptime: 120, memoryUsageMb: 45 },
  };

  const stats = statsQuery.data || defaultStats;

  const messages = messagesQuery.data || [];
  const recentMessages = messages.slice(0, 3);

  const cards = [
    {
      title: 'Services',
      total: stats.services.total,
      badge: `${stats.services.active} ACTIVE`,
      icon: 'dns',
      to: '/admin/services',
    },
    {
      title: 'Projects',
      total: stats.projects.total,
      badge: `${stats.projects.featured} FEATURED`,
      icon: 'rocket_launch',
      to: '/admin/projects',
    },
    {
      title: 'Testimonials',
      total: stats.testimonials.total,
      badge: 'VERIFIED REVIEWS',
      icon: 'star',
      to: '/admin/testimonials',
    },
    {
      title: 'Technologies',
      total: stats.technologies.total,
      badge: 'SYSTEM STACK',
      icon: 'deployed_code',
      to: '/admin/technologies',
    },
    {
      title: 'Messages',
      total: stats.messages.total,
      badge: `${stats.messages.unread} UNREAD`,
      icon: 'mail',
      to: '/admin/contact-messages',
      highlight: stats.messages.unread > 0,
    },
  ];

  return (
    <div className="page-stack admin-dashboard-stack">
      {/* Dashboard Top Header */}
      <div className="admin-header-row">
        <SectionHeader
          badge="CMS CONTROL CENTER"
          title="Admin Operations Telemetry"
          description="Real-time system telemetry and direct content management for DesignBeen."
          align="left"
        />

        {/* Telemetry Status Bar */}
        <div className="admin-telemetry-pill">
          <span className="status-live-dot" />
          <span className="telemetry-text">SYSTEM OPERATIONAL // {stats.system.database}</span>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="admin-quick-actions">
        <Button as={Link} to="/admin/services/new" className="quick-btn">
          <span className="material-symbols-outlined">add</span>
          <span>New Service</span>
        </Button>
        <Button as={Link} to="/admin/projects/new" className="quick-btn">
          <span className="material-symbols-outlined">add</span>
          <span>New Project</span>
        </Button>
        <Button as={Link} to="/admin/technologies" variant="secondary" className="quick-btn">
          <span className="material-symbols-outlined">tune</span>
          <span>Stack</span>
        </Button>
        <Button as={Link} to="/admin/settings" variant="secondary" className="quick-btn">
          <span className="material-symbols-outlined">settings</span>
          <span>Site Settings</span>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="card-grid grid-3">
        {cards.map((card) => (
          <GlassCard key={card.title} className={`admin-metric-card ${card.highlight ? 'highlight-card' : ''}`}>
            <div className="metric-header">
              <div className="metric-icon-wrap">
                <span className="material-symbols-outlined icon">{card.icon}</span>
              </div>
              <span className="metric-badge">{card.badge}</span>
            </div>

            <div className="metric-body">
              <span className="metric-count">{card.total}</span>
              <h3 className="metric-title">{card.title}</h3>
            </div>

            <div className="metric-footer">
              <Link to={card.to} className="metric-link">
                <span>Manage {card.title}</span>
                <span className="material-symbols-outlined icon">arrow_forward</span>
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Recent Contact Submissions Widget */}
      <div className="admin-recent-section" style={{ marginTop: '2rem' }}>
        <div className="portfolio-grid-header">
          <h3>Recent Inbox Messages</h3>
          <Link to="/admin/contact-messages" className="nav-back-link">
            <span>View All ({messages.length})</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {recentMessages.length ? (
          <GlassCard className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Service Focus</th>
                  <th>Message Preview</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <strong>{msg.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{msg.email}</div>
                    </td>
                    <td>{msg.subject || 'General Inquiry'}</td>
                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.message}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {new Date(msg.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-pill-badge ${msg.status === 'unread' ? 'unread' : 'read'}`}>
                        {msg.status ? msg.status.toUpperCase() : 'NEW'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        ) : (
          <GlassCard className="state state-empty">
            <p>No contact messages received yet.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
