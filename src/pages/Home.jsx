import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/common/Seo.jsx';
import Loading from '../components/common/Loading.jsx';
import Hero from '../components/home/Hero.jsx';
import Marquee from '../components/home/Marquee.jsx';
import Methodology from '../components/home/Methodology.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import ServiceCard from '../components/services/ServiceCard.jsx';
import ProjectCard from '../components/portfolio/ProjectCard.jsx';
import TestimonialCard from '../components/testimonials/TestimonialCard.jsx';
import TechnologyBadge from '../components/technologies/TechnologyBadge.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import { getSettings, getHero, getMethodology, getPartners } from '../api/settingsApi.js';
import { getServices } from '../api/servicesApi.js';
import { getProjects } from '../api/projectsApi.js';
import { getTestimonials } from '../api/testimonialsApi.js';
import { getTechnologies } from '../api/technologiesApi.js';

const defaultHero = {
  badge: 'Visionary Interfaces',
  title: 'Engineering',
  highlighted_text: 'Excellence in Design.',
  description: 'A premium high-tech agency crafting futuristic digital experiences with glassmorphism, motion, and conversion-focused storytelling.',
  primary_cta_label: 'Explore Our Work',
  primary_cta_url: '/portfolio',
  secondary_cta_label: 'Start a Project',
  secondary_cta_url: '/contact',
};

const defaultServices = [
  { id: 1, title: 'System Architecture', short_description: 'High-performance, scalable infrastructures designed for next-gen web applications.', icon: 'dns', slug: 'system-architecture', featured: 1 },
  { id: 2, title: 'UI/UX Design', short_description: 'Visionary interfaces blending fluid glassmorphism with highly intuitive, user-centric journeys.', icon: 'design_services', slug: 'ui-ux-design', featured: 1 },
  { id: 3, title: 'AI Solutions', short_description: 'Intelligent system integrations leveraging cutting-edge machine learning algorithms.', icon: 'smart_toy', slug: 'ai-solutions', featured: 1 },
];

const defaultProjects = [
  { id: 1, title: 'Nexus AI Dashboard', client: 'Nexus Corp', short_description: 'An intuitive, predictive analytics platform designed to simplify complex data architectures.', cover_image_url: '/assets/project-nexus.png', slug: 'nexus-ai-dashboard', featured: 1 },
  { id: 2, title: 'Aura DeFi Protocol', client: 'Aura Labs', short_description: 'A high-security decentralized finance interface that bridges institutional trust with Web3 transparency.', cover_image_url: '/assets/project-aura.png', slug: 'aura-defi-protocol', featured: 1 },
];

const defaultTestimonials = [
  { id: 1, client_name: 'Sarah Jenkins', role: 'CTO', company: 'Nexus Corp', testimonial: 'DesignBeen redefined our platform architecture. Their blend of aesthetic precision and backend scalability is unmatched in the industry.', avatar_url: '/assets/testimonial-sarah.png', active: 1 },
  { id: 2, client_name: 'Marcus Thorne', role: 'Lead Product', company: 'Aura.AI', testimonial: 'The visionary liquid interfaces they designed for our AI dashboard completely transformed our user engagement metrics overnight.', avatar_url: '/assets/testimonial-marcus.png', active: 1 },
  { id: 3, client_name: 'Elena Rostova', role: 'Founder', company: 'Quantum Ledger', testimonial: 'Their approach to Web3 integration was flawless. They built a seamless, intuitive layer over complex smart contract logic.', avatar_url: '/assets/testimonial-elena.png', active: 1 },
];

const defaultTechnologies = [
  { id: 1, name: 'TypeScript', icon: 'code', active: 1 },
  { id: 2, name: 'React.js', icon: 'api', active: 1 },
  { id: 3, name: 'Tailwind CSS', icon: 'view_quilt', active: 1 },
  { id: 4, name: 'Framer Motion', icon: 'motion_photos_on', active: 1 },
  { id: 5, name: 'Node.js', icon: 'terminal', active: 1 },
  { id: 6, name: 'Express.js', icon: 'deployed_code', active: 1 },
];

function HomeServicesSection({ servicesQuery, services }) {
  if (servicesQuery.isLoading && !services.length) return <Loading label="Loading services" />;
  const list = services.length ? services : defaultServices;
  const featured = list.filter((service) => service.featured !== 0).slice(0, 6);

  return (
    <div className="card-grid grid-3">
      {featured.map((service, index) => (
        <motion.div
          key={service.id || index}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <ServiceCard service={service} />
        </motion.div>
      ))}
    </div>
  );
}

function HomeProjectsSection({ projectsQuery, projects }) {
  if (projectsQuery.isLoading && !projects.length) return <Loading label="Loading projects" />;
  const list = projects.length ? projects : defaultProjects;
  const featured = list.filter((project) => project.featured !== 0).slice(0, 2);

  return (
    <div className="card-grid grid-2">
      {featured.map((project, index) => (
        <motion.div
          key={project.id || index}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: index * 0.12, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}

function HomeTestimonialsSection({ testimonialsQuery, testimonials }) {
  if (testimonialsQuery.isLoading && !testimonials.length) return <Loading label="Loading testimonials" />;
  const list = testimonials.length ? testimonials : defaultTestimonials;
  const active = list.filter((item) => item.active !== 0).slice(0, 3);

  return (
    <div className="card-grid grid-3">
      {active.map((testimonial, index) => (
        <motion.div
          key={testimonial.id || index}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <TestimonialCard testimonial={testimonial} />
        </motion.div>
      ))}
    </div>
  );
}

function HomeTechnologiesSection({ technologiesQuery, technologies }) {
  if (technologiesQuery.isLoading && !technologies.length) return <Loading label="Loading technologies" />;
  const list = technologies.length ? technologies : defaultTechnologies;
  const active = list.filter((item) => item.active !== 0).slice(0, 6);

  return (
    <div className="card-grid grid-3">
      {active.map((technology, index) => (
        <motion.div
          key={technology.id || index}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <TechnologyBadge technology={technology} />
        </motion.div>
      ))}
    </div>
  );
}

function HomeHeroSection({ heroQuery, hero, settings }) {
  const activeHero = hero || defaultHero;
  return <Hero hero={activeHero} settings={settings} />;
}

export default function Home() {
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const heroQuery = useQuery({ queryKey: ['hero', 'home'], queryFn: () => getHero('home') });
  const servicesQuery = useQuery({ queryKey: ['services'], queryFn: getServices });
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const testimonialsQuery = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials });
  const technologiesQuery = useQuery({ queryKey: ['technologies'], queryFn: getTechnologies });
  const methodologyQuery = useQuery({ queryKey: ['methodology'], queryFn: getMethodology });
  const partnersQuery = useQuery({ queryKey: ['partners'], queryFn: getPartners });

  const settings = settingsQuery.data || {};
  const hero = heroQuery.data || defaultHero;
  const services = servicesQuery.data?.length ? servicesQuery.data : defaultServices;
  const projects = projectsQuery.data?.length ? projectsQuery.data : defaultProjects;
  const testimonials = testimonialsQuery.data?.length ? testimonialsQuery.data : defaultTestimonials;
  const technologies = technologiesQuery.data?.length ? technologiesQuery.data : defaultTechnologies;
  const methodology = methodologyQuery.data || [];
  const partners = partnersQuery.data || [];

  return (
    <>
      <Seo title={`${settings.site_name || 'DesignBeen'} | Home`} description={hero?.description || settings.footer_description || 'DesignBeen agency website.'} />
      <HomeHeroSection heroQuery={heroQuery} hero={hero} settings={settings} />
      <Marquee partners={partners} />

      <section className="section">
        <div className="page-container">
          <SectionHeader badge="Core Competencies" title="Architectural Solutions" description="Dynamic service blocks driven by the backend, preserving the same glassmorphism language as the supplied UI." />
          <HomeServicesSection servicesQuery={servicesQuery} services={services} />
        </div>
      </section>

      <Methodology steps={methodology} />

      <section className="section">
        <div className="page-container">
          <SectionHeader badge="Portfolio" title="Selected work" description="The portfolio is loaded from MySQL and can be expanded without changing the frontend structure." />
          <HomeProjectsSection projectsQuery={projectsQuery} projects={projects} />
          <motion.div
            style={{ marginTop: '1.25rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button as={Link} to="/portfolio">View all projects</Button>
          </motion.div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="page-container">
          <SectionHeader badge="Testimonials" title="Client testimonies" description="Social proof from the database, not hardcoded into the React tree." />
          <HomeTestimonialsSection testimonialsQuery={testimonialsQuery} testimonials={testimonials} />
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <SectionHeader badge="Technologies" title="Powered by next-gen technologies" description="A flexible technology strip that can be managed from the admin panel." />
          <HomeTechnologiesSection technologiesQuery={technologiesQuery} technologies={technologies} />
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <GlassCard className="service-card" style={{ textAlign: 'center' }}>
              <SectionHeader badge="Contact" title="Ready to build the future?" description="The contact form stores messages in MySQL and can be managed from the admin dashboard." />
              <Button as={Link} to="/contact">Start a project</Button>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </>
  );
}
