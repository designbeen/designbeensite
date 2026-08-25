import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../common/GlassCard.jsx';
import Badge from '../common/Badge.jsx';

export default function ProjectCard({ project }) {
  return (
    <GlassCard className="project-card advanced-project-card">
      <div>
        <Link to={`/portfolio/${project.slug}`}>
          <div className="project-cover-container">
            <div className="project-cover">
              <img
                src={project.cover_image_url || project.cover_image || '/project-placeholder.jpg'}
                alt={project.cover_image_alt || project.title}
                onError={(event) => {
                  event.currentTarget.src = '/project-placeholder.jpg';
                }}
              />
            </div>
            <div className="project-cover-hud">
              <span className="hud-pill">CASE // 0{project.id || 1}</span>
              {project.client ? <span className="hud-pill client-pill">{project.client}</span> : null}
            </div>
          </div>
        </Link>

        <div className="project-tags">
          {project.category_name ? <Badge>{project.category_name}</Badge> : <Badge>Solution</Badge>}
          {project.featured ? <span className="tag featured-tag">Featured Case</span> : null}
        </div>

        <h3 className="project-title">{project.title}</h3>
        <p className="project-copy">{project.short_description}</p>
      </div>

      <div className="project-card-footer">
        <div className="telemetry-info">
          <span className="telemetry-label">IMPACT SCORE</span>
          <span className="telemetry-val">+98% ACCURACY</span>
        </div>

        <Link className="project-action-link" to={`/portfolio/${project.slug}`}>
          <span>Open Case Study</span>
          <span className="material-symbols-outlined arrow">arrow_forward</span>
        </Link>
      </div>
    </GlassCard>
  );
}
