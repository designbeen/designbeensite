'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/lib/router-compat';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/common/Seo.jsx';
import Loading from '../components/common/Loading.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import ProjectCard from '../components/portfolio/ProjectCard.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import { getHero } from '../api/settingsApi.js';
import { getProjects } from '../api/projectsApi.js';

const defaultProjects = [
  {
    id: 1,
    title: 'Nexus AI Dashboard',
    client: 'Nexus Corp',
    short_description: 'An intuitive predictive analytics platform designed to simplify complex data architectures into real-time decision metrics.',
    cover_image_url: '/assets/project-nexus.png',
    slug: 'nexus-ai-dashboard',
    category_name: 'AI Solutions',
    featured: 1,
  },
  {
    id: 2,
    title: 'Aura DeFi Protocol',
    client: 'Aura Labs',
    short_description: 'A high-security decentralized finance interface that bridges institutional trust with Web3 transparency.',
    cover_image_url: '/assets/project-aura.png',
    slug: 'aura-defi-protocol',
    category_name: 'System Architecture',
    featured: 1,
  },
  {
    id: 3,
    title: 'Vanguard Quantum Engine',
    client: 'Vanguard Dynamics',
    short_description: 'Next-generation cloud orchestration system with ultra-low latency telemetry monitoring.',
    cover_image_url: '/assets/project-vanguard.png',
    slug: 'vanguard-quantum-engine',
    category_name: 'UI/UX Design',
    featured: 0,
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const heroQuery = useQuery({ queryKey: ['hero', 'portfolio'], queryFn: () => getHero('portfolio') });
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: getProjects });

  const hero = heroQuery.data || {};
  const rawProjects = projectsQuery.data?.length ? projectsQuery.data : defaultProjects;

  const categories = ['ALL', 'FEATURED', 'AI Solutions', 'System Architecture', 'UI/UX Design'];

  const filteredProjects = rawProjects.filter((p) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'FEATURED') return p.featured !== 0;
    return p.category_name === activeCategory || p.category === activeCategory;
  });

  const featuredProject = rawProjects.find((p) => p.featured !== 0) || rawProjects[0];

  return (
    <>
      <Seo title="DesignBeen | Portfolio Case Studies" description={hero?.description || 'Curated gallery of visionary interfaces and technical case studies.'} />

      {/* Hero Header Section */}
      <section className="section portfolio-hero-section">
        <div className="page-container">
          <SectionHeader
            badge={hero?.badge || 'CURATED CASE STUDIES'}
            title={hero?.title || 'Engineering the Exceptional'}
            description={hero?.description || 'A curated gallery of visionary interfaces, high-performance web systems, and technical masterclasses engineered for global industry leaders.'}
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

      {/* Featured Spotlight Card */}
      {featuredProject && activeCategory === 'ALL' ? (
        <section className="section spotlight-section">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="portfolio-spotlight-card">
                <div className="spotlight-badge-row">
                  <span className="spotlight-tag">FEATURED SPOTLIGHT</span>
                  <span className="spotlight-client">{featuredProject.client || 'CLIENT CASE'}</span>
                </div>

                <div className="spotlight-grid">
                  <div className="spotlight-image-col">
                    <img
                      src={featuredProject.cover_image_url || featuredProject.cover_image || '/project-placeholder.jpg'}
                      alt={featuredProject.title}
                      onError={(e) => {
                        e.currentTarget.src = '/project-placeholder.jpg';
                      }}
                    />
                    <div className="spotlight-hud">
                      <span>VERIFIED METRIC: +98% PERFORMANCE</span>
                    </div>
                  </div>

                  <div className="spotlight-info-col">
                    <span className="spotlight-category">{featuredProject.category_name || 'System Architecture'}</span>
                    <h2 className="spotlight-title">{featuredProject.title}</h2>
                    <p className="spotlight-copy">{featuredProject.short_description}</p>

                    <div className="spotlight-telemetry-row">
                      <div className="telemetry-mini-item">
                        <span className="label">DEPLOYMENT</span>
                        <span className="val">ENTERPRISE</span>
                      </div>
                      <div className="telemetry-mini-item">
                        <span className="label">IMPACT SCORE</span>
                        <span className="val">99.8/100</span>
                      </div>
                    </div>

                    <Link to={`/portfolio/${featuredProject.slug}`} className="button button-primary spotlight-btn">
                      <span>Explore Case Study</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* Main Portfolio Grid */}
      <section className="section">
        <div className="page-container">
          <div className="portfolio-grid-header">
            <h3>System Portfolio ({filteredProjects.length})</h3>
            <span className="portfolio-grid-subtitle">Displaying high-tech case studies</span>
          </div>

          {projectsQuery.isLoading ? (
            <Loading label="Loading portfolio projects" />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="card-grid grid-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Inquiry CTA Section */}
      <section className="section">
        <div className="page-container">
          <GlassCard className="portfolio-cta-card">
            <div className="portfolio-cta-content">
              <span className="contact-badge">HAVE A VISIONARY PROJECT?</span>
              <h2>Ready to Architect Your Platform?</h2>
              <p>We work with ambitious founders and enterprise engineering teams to deliver world-class products.</p>
              <Button as={Link} to="/contact" className="portfolio-cta-btn">
                <span>Start a Project Inquiry</span>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
