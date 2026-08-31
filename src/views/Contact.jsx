'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Seo from '../components/common/Seo.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import ContactForm from '../components/contact/ContactForm.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import { getHero, getSettings } from '../api/settingsApi.js';

export default function Contact() {
  const heroQuery = useQuery({ queryKey: ['hero', 'contact'], queryFn: () => getHero('contact') });
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const hero = heroQuery.data || {};
  const settings = settingsQuery.data || {};

  return (
    <section className="section contact-section">
      <Seo title="DesignBeen | Contact Us" description={hero?.description || settings.footer_description || 'Contact DesignBeen.'} />
      <div className="page-container">
        <SectionHeader
          badge={hero?.badge || 'Initiate Contact'}
          title={hero?.title || "Let's Build Something Visionary"}
          description={hero?.description || 'Have a breakthrough project or technical architectural inquiry? We respond within 2 hours during business schedules.'}
          align="center"
        />

        <div className="contact-layout-grid">
          {/* Left Column: Direct Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="contact-info-card">
              <div className="contact-info-header">
                <span className="contact-badge">DIRECT CHANNELS</span>
                <h3>Get In Touch</h3>
                <p>Reach out through any of our official channels or visit our global operations studio.</p>
              </div>

              <div className="contact-channel-list">
                {settings.email ? (
                  <a href={`mailto:${settings.email}`} className="channel-item">
                    <div className="channel-icon">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <div className="channel-text">
                      <span className="label">OFFICIAL EMAIL</span>
                      <span className="val">{settings.email}</span>
                    </div>
                  </a>
                ) : null}

                {settings.phone ? (
                  <a href={`tel:${settings.phone}`} className="channel-item">
                    <div className="channel-icon">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <div className="channel-text">
                      <span className="label">DIRECT LINE</span>
                      <span className="val">{settings.phone}</span>
                    </div>
                  </a>
                ) : null}

                {settings.address ? (
                  <div className="channel-item">
                    <div className="channel-icon">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div className="channel-text">
                      <span className="label">STUDIO LOCATION</span>
                      <span className="val">{settings.address}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Status & Operating Hours */}
              <div className="contact-status-card">
                <div className="status-header">
                  <span className="status-pulse-dot" />
                  <span className="status-title">ONLINE & READY FOR INQUIRIES</span>
                </div>
                <p className="status-copy">Response time typically under 2 hours during business hours (08:00 - 18:00 UTC).</p>
              </div>

              {/* Social Connections */}
              <div className="contact-social-section">
                <span className="social-section-title">CONNECT ON SOCIAL</span>
                <div className="social-pill-row">
                  {settings.instagram_url ? (
                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="social-pill">
                      Instagram
                    </a>
                  ) : null}
                  {settings.linkedin_url ? (
                    <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-pill">
                      LinkedIn
                    </a>
                  ) : null}
                  {settings.behance_url ? (
                    <a href={settings.behance_url} target="_blank" rel="noopener noreferrer" className="social-pill">
                      Behance
                    </a>
                  ) : null}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
