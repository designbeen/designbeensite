import React from 'react';
import GlassCard from '../common/GlassCard.jsx';
import Badge from '../common/Badge.jsx';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  return (
    <GlassCard className="service-card advanced-service-card">
      <div>
        <div className="service-card-header">
          <div className="service-icon">
            <span className="material-symbols-outlined icon" aria-hidden="true">
              {service.icon || 'design_services'}
            </span>
          </div>
          <span className="service-tech-id">SYS // 0{service.id || 1}</span>
        </div>

        <div className="service-card-body">
          <h3 className="service-title">{service.title}</h3>
          <p className="service-copy">{service.short_description || service.description}</p>
        </div>

        {/* Aesthetic Telemetry Meter */}
        <div className="card-telemetry-bar">
          <div className="telemetry-info">
            <span className="telemetry-label">PERFORMANCE PROTOCOL</span>
            <span className="telemetry-val">99.8%</span>
          </div>
          <div className="telemetry-progress-track">
            <div className="telemetry-progress-fill" style={{ width: '88%' }} />
          </div>
        </div>
      </div>

      <div className="service-card-footer">
        <div className="tag-row">
          {service.category_name ? (
            <Badge tone="secondary">{service.category_name}</Badge>
          ) : (
            <span className="service-badge-pill">ENTERPRISE</span>
          )}
        </div>

        <Link className="service-action-link" to={`/services/${service.slug}`}>
          <span>Explore Service</span>
          <span className="material-symbols-outlined arrow">arrow_forward</span>
        </Link>
      </div>
    </GlassCard>
  );
}
