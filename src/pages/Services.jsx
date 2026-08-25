import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/common/Seo.jsx';
import Loading from '../components/common/Loading.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import ServiceCard from '../components/services/ServiceCard.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import { getHero } from '../api/settingsApi.js';
import { getServices } from '../api/servicesApi.js';

const defaultServices = [
  { id: 1, title: 'System Architecture', short_description: 'High-performance, scalable infrastructures designed for next-gen web applications.', icon: 'dns', slug: 'system-architecture', category_name: 'System Architecture', featured: 1 },
  { id: 2, title: 'UI/UX Design', short_description: 'Visionary interfaces blending fluid glassmorphism with highly intuitive, user-centric journeys.', icon: 'design_services', slug: 'ui-ux-design', category_name: 'UI/UX Design', featured: 1 },
  { id: 3, title: 'AI Solutions', short_description: 'Intelligent system integrations leveraging cutting-edge machine learning algorithms.', icon: 'smart_toy', slug: 'ai-solutions', category_name: 'AI Solutions', featured: 1 },
  { id: 4, title: 'Cloud Infrastructure', short_description: 'Resilient cloud deployments with real-time telemetry, auto-scaling, and zero downtime.', icon: 'cloud_sync', slug: 'cloud-infrastructure', category_name: 'System Architecture', featured: 0 },
  { id: 5, title: 'Web3 & Decentralized Protocols', short_description: 'Decentralized smart contract interfaces engineered with security and transparency.', icon: 'hub', slug: 'web3-decentralized-protocols', category_name: 'System Architecture', featured: 0 },
  { id: 6, title: 'Performance Optimization', short_description: 'Code-splitting, sub-millisecond query optimization, and asset acceleration.', icon: 'speed', slug: 'performance-optimization', category_name: 'AI Solutions', featured: 0 },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const heroQuery = useQuery({ queryKey: ['hero', 'services'], queryFn: () => getHero('services') });
  const servicesQuery = useQuery({ queryKey: ['services'], queryFn: getServices });

  const hero = heroQuery.data || {};
  const rawServices = servicesQuery.data?.length ? servicesQuery.data : defaultServices;

  const categories = ['ALL', 'FEATURED', 'System Architecture', 'UI/UX Design', 'AI Solutions'];

  const filteredServices = rawServices.filter((s) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'FEATURED') return s.featured !== 0;
    return s.category_name === activeCategory || s.category === activeCategory;
  });

  const featuredService = rawServices.find((s) => s.featured !== 0) || rawServices[0];

  const processSteps = [
    { num: '01', title: 'DISCOVERY', desc: 'System analysis & telemetry mapping' },
    { num: '02', title: 'ARCHITECTURE', desc: 'Modular microservice & UI prototyping' },
    { num: '03', title: 'EXECUTION', desc: 'High-performance engineering & design' },
    { num: '04', title: 'DEPLOYMENT', desc: 'CI/CD pipeline & zero-downtime release' },
  ];

  return (
    <>
      <Seo title="DesignBeen | Services & Architectural Solutions" description={hero?.description || 'Curated service system for visionary digital experiences.'} />

      {/* Hero Header Section */}
      <section className="section services-hero-section">
        <div className="page-container">
          <SectionHeader
            badge={hero?.badge || 'CORE CAPABILITIES'}
            title={hero?.title || 'Architecting the Future of Digital Experience'}
            description={hero?.description || 'A curated service system built from the ground up to deliver resilient system architectures, visionary liquid interfaces, and intelligent machine learning solutions.'}
            align="center"
          />

          {/* Category Filter Pills */}
          <div className="portfolio-filter-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Core Solution Showcase */}
      {featuredService && activeCategory === 'ALL' ? (
        <section className="section spotlight-section">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="services-showcase-card">
                <div className="showcase-header-row">
                  <span className="spotlight-tag">FLAGSHIP SOLUTION</span>
                  <span className="spotlight-client">SYS // 0{featuredService.id || 1}</span>
                </div>

                <div className="showcase-grid">
                  <div className="showcase-info-col">
                    <div className="service-icon showcase-icon">
                      <span className="material-symbols-outlined icon">{featuredService.icon || 'dns'}</span>
                    </div>

                    <span className="spotlight-category">{featuredService.category_name || 'System Architecture'}</span>
                    <h2 className="spotlight-title">{featuredService.title}</h2>
                    <p className="spotlight-copy">{featuredService.short_description || featuredService.description}</p>

                    <div className="card-telemetry-bar">
                      <div className="telemetry-info">
                        <span className="telemetry-label">SOLUTION EFFICIENCY</span>
                        <span className="telemetry-val">99.9% OPTIMIZED</span>
                      </div>
                      <div className="telemetry-progress-track">
                        <div className="telemetry-progress-fill" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <Link to={`/services/${featuredService.slug}`} className="button button-primary spotlight-btn">
                      <span>Explore Capability</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>

                  <div className="showcase-highlights-col">
                    <h4>Architectural Standards</h4>
                    <div className="highlights-list">
                      <div className="highlight-item">
                        <span className="material-symbols-outlined check-icon">check_circle</span>
                        <div>
                          <strong>High-Throughput API Gateway</strong>
                          <p>Sub-millisecond query routing with error fallback layers.</p>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <span className="material-symbols-outlined check-icon">check_circle</span>
                        <div>
                          <strong>Fluid Glassmorphism Language</strong>
                          <p>60 FPS backdrop blur animations with accessible contrast.</p>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <span className="material-symbols-outlined check-icon">check_circle</span>
                        <div>
                          <strong>Real-Time Telemetry HUD</strong>
                          <p>Live health metrics and database connection monitoring.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* Main Services Grid */}
      <section className="section">
        <div className="page-container">
          <div className="portfolio-grid-header">
            <h3>Capability Grid ({filteredServices.length})</h3>
            <span className="portfolio-grid-subtitle">Managed via MySQL Admin Panel</span>
          </div>

          {servicesQuery.isLoading && !filteredServices.length ? (
            <Loading label="Loading service capabilities" />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="card-grid grid-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {filteredServices.map((service, idx) => (
                  <motion.div
                    key={service.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Execution Process Telemetry Strip */}
      <section className="section section-soft">
        <div className="page-container">
          <SectionHeader
            badge="Delivery Protocol"
            title="Our Engineering Workflow"
            description="A disciplined, 4-phase methodology ensuring predictable releases and scalable software architecture."
            align="center"
          />

          <div className="process-telemetry-grid">
            {processSteps.map((step) => (
              <div key={step.num} className="process-step-card glass-panel">
                <span className="process-num">{step.num}</span>
                <h4 className="process-title">{step.title}</h4>
                <p className="process-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services CTA Section */}
      <section className="section">
        <div className="page-container">
          <GlassCard className="portfolio-cta-card">
            <div className="portfolio-cta-content">
              <span className="contact-badge">CUSTOM ARCHITECTURE REQUIRED?</span>
              <h2>Need a Bespoke Engineering Solution?</h2>
              <p>Consult with our lead architects to scope, design, and deploy your next digital product.</p>
              <Button as={Link} to="/contact" className="portfolio-cta-btn">
                <span>Request Architectural Proposal</span>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
