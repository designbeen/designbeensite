import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/common/Seo.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Methodology from '../components/home/Methodology.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import { getHero, getMethodology, getSettings, getTeam, getTeamDepartments } from '../api/settingsApi.js';

export default function About() {
  const [selectedDept, setSelectedDept] = React.useState('ALL');
  const heroQuery = useQuery({ queryKey: ['hero', 'about'], queryFn: () => getHero('about') });
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const methodologyQuery = useQuery({ queryKey: ['methodology'], queryFn: getMethodology });
  const teamQuery = useQuery({ queryKey: ['team'], queryFn: getTeam });
  const deptQuery = useQuery({ queryKey: ['team-departments'], queryFn: getTeamDepartments });

  const hero = heroQuery.data || {};
  const settings = settingsQuery.data || {};
  const methodology = methodologyQuery.data || [];

  const defaultTeamList = [
    {
      id: 1,
      name: 'Alexander Vance',
      role: 'Chief Technology Officer',
      department: 'Engineering',
      bio: 'Ex-Google principal systems architect specializing in high-throughput distributed infrastructure and zero-latency real-time protocols.',
      avatar_url: '/assets/testimonial-sarah.png',
      linkedin_url: 'https://linkedin.com/in/alexandervance',
      github_url: 'https://github.com/alexvance',
      twitter_url: 'https://twitter.com/alexvance',
      skills: 'Distributed Systems, Rust, Node.js, Cloud',
    },
    {
      id: 2,
      name: 'Elena Rostova',
      role: 'Chief Design Officer',
      department: 'Design',
      bio: 'Visionary UI/UX director pioneer of liquid glassmorphism, procedural animations, and human-computer interactions.',
      avatar_url: '/assets/testimonial-elena.png',
      linkedin_url: 'https://linkedin.com/in/elenarostova',
      github_url: 'https://github.com/elenarostova',
      twitter_url: 'https://twitter.com/elenarostova',
      skills: 'Glassmorphism, Motion, Figma, Design Systems',
    },
    {
      id: 3,
      name: 'Dr. Marcus Thorne',
      role: 'Head of AI & Intelligence',
      department: 'AI & Research',
      bio: 'PhD in Applied Machine Learning from MIT, leading neural network integration and predictive intelligence architectures.',
      avatar_url: '/assets/testimonial-marcus.png',
      linkedin_url: 'https://linkedin.com/in/marcusthorne',
      github_url: 'https://github.com/marcusthorne',
      twitter_url: 'https://twitter.com/marcusthorne',
      skills: 'PyTorch, Neural Networks, LLMs, Computer Vision',
    },
    {
      id: 4,
      name: 'Sophia Chen',
      role: 'Principal Systems Engineer',
      department: 'Engineering',
      bio: 'Full-stack performance specialist focusing on React micro-frontends, WebGL canvas shaders, and sub-millisecond database queries.',
      avatar_url: null,
      linkedin_url: 'https://linkedin.com/in/sophiachen',
      github_url: 'https://github.com/sophiachen',
      twitter_url: 'https://twitter.com/sophiachen',
      skills: 'React, TypeScript, Three.js, MySQL',
    },
  ];

  const teamList = teamQuery.data?.length ? teamQuery.data : defaultTeamList;

  const fetchedDeptNames = deptQuery.data?.map((d) => d.name) || [];
  const memberDeptNames = teamList.map((m) => m.department || 'Engineering');
  const departments = ['ALL', ...Array.from(new Set([...fetchedDeptNames, ...memberDeptNames]))];

  const filteredTeam = selectedDept === 'ALL'
    ? teamList
    : teamList.filter((m) => (m.department || 'Engineering').toLowerCase() === selectedDept.toLowerCase());

  const corePillars = [
    {
      id: '01',
      icon: 'dns',
      title: 'Precision Architecture',
      description: 'Engineered on modular microservices, high-throughput Express endpoints, and scalable database schemas designed for maximum uptime.',
      metricLabel: 'SYSTEM UP-TIME',
      metricVal: '99.99%',
    },
    {
      id: '02',
      icon: 'design_services',
      title: 'Liquid Glassmorphism UI',
      description: 'Crafting visionary visual identities blending translucent glass cards, neon laser accents, and motion-driven user journeys.',
      metricLabel: 'RENDER EFFICIENCY',
      metricVal: '60 FPS',
    },
    {
      id: '03',
      icon: 'smart_toy',
      title: 'Algorithmic Intelligence',
      description: 'Integrating live telemetry canvas visualizations, neural background particle networks, and data analytics dashboards.',
      metricLabel: 'RESPONSE LATENCY',
      metricVal: '< 1.2ms',
    },
  ];

  const stats = [
    { label: 'DEPLOYED SYSTEMS', val: '150+' },
    { label: 'GLOBAL CLIENTS', val: '45+' },
    { label: 'AVERAGE LATENCY', val: '< 2.4ms' },
    { label: 'CLIENT SATISFACTION', val: '100%' },
  ];

  return (
    <>
      <Seo title="DesignBeen | About Our Ethos & Team" description={hero?.description || 'About DesignBeen agency, core engineering pillars, and leadership team.'} />

      {/* Hero Section */}
      <section className="section about-hero-section">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="about-hero-card">
              <SectionHeader
                badge={hero?.badge || 'OUR ETHOS & ARCHITECTURE'}
                title={hero?.title || 'Engineering Future Realities Through Liquid Interfaces & System Rigor'}
                description={hero?.description || 'DesignBeen is a multidisciplinary digital agency bridging high-performance backend engineering with fluid glassmorphism UI design. We build digital platforms that perform flawlessly.'}
                align="left"
              />

              {/* Stats Bar */}
              <div className="about-stats-grid">
                {stats.map((st) => (
                  <div key={st.label} className="about-stat-item">
                    <span className="stat-val">{st.val}</span>
                    <span className="stat-label">{st.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="section">
        <div className="page-container">
          <SectionHeader
            badge="Engineering Pillars"
            title="The Foundations of Our Craft"
            description="We adhere to strict architectural standards to ensure every platform we deliver is robust, secure, and visually stunning."
            align="center"
          />

          <div className="card-grid grid-3 about-pillars-grid">
            {corePillars.map((pillar, idx) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard className="about-pillar-card">
                  <div>
                    <div className="pillar-header">
                      <div className="pillar-icon">
                        <span className="material-symbols-outlined">{pillar.icon}</span>
                      </div>
                      <span className="pillar-id">PILLAR // {pillar.id}</span>
                    </div>

                    <h3 className="pillar-title">{pillar.title}</h3>
                    <p className="pillar-copy">{pillar.description}</p>
                  </div>

                  <div className="card-telemetry-bar">
                    <div className="telemetry-info">
                      <span className="telemetry-label">{pillar.metricLabel}</span>
                      <span className="telemetry-val">{pillar.metricVal}</span>
                    </div>
                    <div className="telemetry-progress-track">
                      <div className="telemetry-progress-fill" style={{ width: '92%' }} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Showcase Section */}
      <section className="section">
        <div className="page-container">
          <SectionHeader
            badge="Leadership & Specialists"
            title="The Minds Behind DesignBeen"
            description="Our multidisciplinary team of system architects, design leaders, and machine learning engineers."
            align="center"
          />

          {/* Department Filter Pills */}
          <div className="portfolio-filter-bar" style={{ marginBottom: '2.5rem' }}>
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                className={`filter-pill ${selectedDept === dept ? 'active' : ''}`}
                onClick={() => setSelectedDept(dept)}
              >
                {dept.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Team Members Grid */}
          <div className="card-grid grid-2 team-showcase-grid">
            {filteredTeam.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <GlassCard className="team-member-card">
                  <div className="team-card-inner">
                    <div className="team-avatar-container">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.name} className="team-avatar-img" />
                      ) : (
                        <div className="team-avatar-fallback">
                          {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="team-member-id">MEMBER // 0{member.id}</span>
                    </div>

                    <div className="team-info-container">
                      <div className="team-role-dept-row">
                        <span className="tech-pill">{member.department || 'Engineering'}</span>
                        <span className="live-dot-sm" />
                      </div>

                      <h3 className="team-member-name">{member.name}</h3>
                      <strong className="team-member-role">{member.role}</strong>
                      <p className="team-member-bio">{member.bio || 'Architecting next-generation digital interfaces and cloud systems.'}</p>

                      {member.skills ? (
                        <div className="team-skills-wrap">
                          {member.skills.split(',').map((skill, i) => (
                            <span key={i} className="skill-pill-sm">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="team-social-links">
                        {member.linkedin_url ? (
                          <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="social-icon-btn" title="LinkedIn">
                            <span className="material-symbols-outlined">work</span>
                          </a>
                        ) : null}
                        {member.github_url ? (
                          <a href={member.github_url} target="_blank" rel="noreferrer" className="social-icon-btn" title="GitHub">
                            <span className="material-symbols-outlined">code</span>
                          </a>
                        ) : null}
                        {member.twitter_url ? (
                          <a href={member.twitter_url} target="_blank" rel="noreferrer" className="social-icon-btn" title="Twitter / X">
                            <span className="material-symbols-outlined">tag</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <Methodology steps={methodology} />

      {/* CTA Section */}
      <section className="section">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="about-cta-card">
              <div className="about-cta-content">
                <span className="contact-badge">READY FOR DEPLOYMENT</span>
                <h2>Transform Your Platform Architecture</h2>
                <p>Partner with DesignBeen to create futuristic, high-converting digital products.</p>
                <Button as={Link} to="/contact" className="about-cta-btn">
                  <span>Start a Project</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </>
  );
}
