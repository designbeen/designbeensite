import React from 'react';
import GlassCard from '../common/GlassCard.jsx';

export default function TechnologyBadge({ technology }) {
  return (
    <GlassCard className="technology-card advanced-tech-card">
      <div>
        <div className="tech-card-header">
          <div className="tech-icon">
            <span className="material-symbols-outlined icon" aria-hidden="true">
              {technology.icon || 'deployed_code'}
            </span>
          </div>
          <div className="tech-status">
            <span className="status-dot" />
            <span>ACTIVE</span>
          </div>
        </div>

        <div className="tech-card-body">
          <h4 className="tech-title">{technology.name}</h4>
          <span className="tech-category">CORE ENGINE PROTOCOL</span>
        </div>

        {/* Aesthetic Tech Signal Meter */}
        <div className="card-telemetry-bar">
          <div className="telemetry-info">
            <span className="telemetry-label">SIGNAL STABILITY</span>
            <span className="telemetry-val">1.2ms</span>
          </div>
          <div className="telemetry-progress-track">
            <div className="telemetry-progress-fill blue-fill" style={{ width: '94%' }} />
          </div>
        </div>
      </div>

      {technology.website_url ? (
        <a className="tech-action-link" href={technology.website_url} target="_blank" rel="noreferrer">
          <span>Documentation</span>
          <span className="material-symbols-outlined external-icon">north_east</span>
        </a>
      ) : (
        <div className="tech-action-link static-link">
          <span>Verified Integration</span>
          <span className="material-symbols-outlined external-icon">check_circle</span>
        </div>
      )}
    </GlassCard>
  );
}
