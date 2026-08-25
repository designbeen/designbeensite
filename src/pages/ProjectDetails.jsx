import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Seo from '../components/common/Seo.jsx';
import Loading from '../components/common/Loading.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import { getProjectBySlug } from '../api/projectsApi.js';

const defaultProjectDetails = {
  id: 1,
  title: 'Nexus AI Dashboard',
  client: 'Nexus Corp',
  category_name: 'AI Solutions',
  short_description: 'An intuitive, predictive analytics platform designed to simplify complex data architectures into real-time decision metrics.',
  full_description: 'Nexus AI Dashboard is an enterprise-grade analytics engine engineered to monitor cloud infrastructure telemetry, predict system bottlenecks using machine learning models, and deliver 60 FPS fluid glassmorphism visualization. Built with React, Express, and high-performance MySQL data pipelines.',
  cover_image_url: '/assets/project-nexus.png',
  project_url: 'https://example.com',
  github_url: 'https://github.com',
  technologies: [
    { id: 1, name: 'React.js' },
    { id: 2, name: 'Node.js' },
    { id: 3, name: 'MySQL' },
    { id: 4, name: 'Framer Motion' },
    { id: 5, name: 'Tailwind CSS' },
  ],
  gallery: [
    { id: 1, image_url: '/assets/project-nexus.png', alt_text: 'Dashboard Telemetry' },
    { id: 2, image_url: '/assets/project-aura.png', alt_text: 'DeFi Protocol Interface' },
  ],
};

export default function ProjectDetails() {
  const { slug } = useParams();
  const projectQuery = useQuery({ queryKey: ['project', slug], queryFn: () => getProjectBySlug(slug) });
  const fetchedProject = projectQuery.data;

  const project = fetchedProject || defaultProjectDetails;

  const metrics = [
    { label: 'IMPACT SCORE', val: '99.8/100' },
    { label: 'SYSTEM LATENCY', val: '< 1.2ms' },
    { label: 'FRAME RATE', val: '60 FPS' },
    { label: 'SECURITY SCORE', val: '100% VERIFIED' },
  ];

  return (
    <>
      <Seo
        title={`DesignBeen | ${project.title} Case Study`}
        description={project.full_description || project.short_description}
        canonical={`/portfolio/${project.slug || slug}`}
      />

      <section className="section case-study-section">
        <div className="page-container">
          {/* Breadcrumb Navigation */}
          <div className="case-study-nav">
            <Link to="/portfolio" className="nav-back-link">
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back to Portfolio</span>
            </Link>
            <span className="case-id-badge">CASE // 0{project.id || 1}</span>
          </div>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="case-study-hero-card">
              <div className="hero-category-tag">{project.category_name || 'SYSTEM ARCHITECTURE'}</div>
              <h1 className="case-study-title">{project.title}</h1>
              <p className="case-study-lead">{project.full_description || project.short_description}</p>

              {/* Metadata Telemetry Bar */}
              <div className="case-meta-grid">
                {project.client ? (
                  <div className="meta-item">
                    <span className="meta-label">CLIENT / ORGANIZATION</span>
                    <span className="meta-val">{project.client}</span>
                  </div>
                ) : null}

                <div className="meta-item">
                  <span className="meta-label">ARCHITECTURE TYPE</span>
                  <span className="meta-val">{project.category_name || 'Full-Stack Web App'}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">DEPLOYMENT STATUS</span>
                  <span className="meta-val status-live">LIVE IN PRODUCTION</span>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="case-tech-row">
                <span className="tech-row-label">ENGINEERING STACK:</span>
                <div className="tech-pill-list">
                  {(project.technologies?.length ? project.technologies : defaultProjectDetails.technologies).map((t) => (
                    <span key={t.id || t.name} className="tech-pill">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="case-actions">
                {project.project_url ? (
                  <Button as="a" href={project.project_url} target="_blank" rel="noreferrer" className="action-btn">
                    <span>Visit Live Platform</span>
                    <span className="material-symbols-outlined icon">north_east</span>
                  </Button>
                ) : null}

                {project.github_url ? (
                  <Button as="a" href={project.github_url} variant="secondary" target="_blank" rel="noreferrer" className="action-btn">
                    <span>View Repository</span>
                    <span className="material-symbols-outlined icon">code</span>
                  </Button>
                ) : null}
              </div>
            </GlassCard>
          </motion.div>

          {/* Featured Visual Mockup */}
          <motion.div
            className="case-study-visual-wrapper"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="case-visual-card">
              <div className="visual-hud-header">
                <div className="hud-status-dot" />
                <span className="hud-title">SYSTEM INTERFACE MOCKUP // HIGH-RESOLUTION TELEMETRY</span>
              </div>
              <div className="case-visual-image">
                <img
                  src={project.cover_image_url || project.cover_image || '/project-placeholder.jpg'}
                  alt={project.cover_image_alt || project.title}
                  onError={(e) => {
                    e.currentTarget.src = '/project-placeholder.jpg';
                  }}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Performance Telemetry Strip */}
          <div className="case-telemetry-grid">
            {metrics.map((m) => (
              <div key={m.label} className="telemetry-card glass-panel">
                <span className="telemetry-card-val">{m.val}</span>
                <span className="telemetry-card-label">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Technical Breakdown & Challenge/Solution */}
          <div className="card-grid grid-2 case-details-grid">
            <GlassCard className="details-card">
              <div className="card-header-badge">
                <span className="material-symbols-outlined icon">verified_user</span>
                <span>CHALLENGE & REQUIREMENTS</span>
              </div>
              <h3 className="details-card-title">Architectural Scope</h3>
              <p className="details-card-copy">
                The objective was to engineer a high-throughput platform capable of processing dynamic telemetry feeds, eliminating visual clutter, and delivering responsive 60 FPS interactions on desktop and mobile devices without degradation.
              </p>
            </GlassCard>

            <GlassCard className="details-card">
              <div className="card-header-badge">
                <span className="material-symbols-outlined icon">auto_awesome</span>
                <span>ENGINEERED SOLUTION</span>
              </div>
              <h3 className="details-card-title">Technical Execution</h3>
              <p className="details-card-copy">
                We designed a decoupled architecture featuring Express REST API routes, indexed MySQL database schemas, and a custom React glassmorphism design system powered by Framer Motion entrance dynamics.
              </p>
            </GlassCard>
          </div>

          {/* Gallery Section */}
          {project.gallery?.length ? (
            <div className="case-gallery-section">
              <SectionHeader badge="Gallery" title="Interface Showcase" description="Additional visual artifacts and component layouts engineered for this case study." align="left" />
              <div className="card-grid grid-2">
                {project.gallery.map((img) => (
                  <GlassCard key={img.id} className="gallery-item-card">
                    <div className="gallery-cover">
                      <img src={img.image_url} alt={img.alt_text || project.title} />
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ) : null}

          {/* Bottom CTA */}
          <div className="case-bottom-cta">
            <GlassCard className="portfolio-cta-card">
              <div className="portfolio-cta-content">
                <span className="contact-badge">NEXT STEP</span>
                <h2>Inspired by this Case Study?</h2>
                <p>Let us engineer a custom platform tailored to your technical requirements.</p>
                <Button as={Link} to="/contact" className="portfolio-cta-btn">
                  <span>Start Your Project</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </>
  );
}
