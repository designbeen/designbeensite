'use client';

import React from 'react';
import { useParams, Link } from '@/lib/router-compat';
import { useQuery } from '@tanstack/react-query';
import Seo from '../components/common/Seo.jsx';
import Loading from '../components/common/Loading.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import { getServiceBySlug } from '../api/servicesApi.js';

export default function ServiceDetails() {
  const { slug } = useParams();
  const serviceQuery = useQuery({ queryKey: ['service', slug], queryFn: () => getServiceBySlug(slug) });
  const service = serviceQuery.data;

  if (serviceQuery.isLoading) return <Loading label="Loading service" />;
  if (serviceQuery.isError) return <ErrorState title="Service unavailable" />;
  if (!service) return <EmptyState title="Service not found" />;

  return (
    <section className="section">
      <div className="page-container detail-layout">
        <Seo title={`DesignBeen | ${service.title}`} description={service.full_description || service.short_description} canonical={`/services/${service.slug}`} />
        <div className="detail-body">
          <div className="hero-kicker">{service.category_name || 'Service'}</div>
          <h1 className="detail-heading">{service.title}</h1>
          <p className="detail-description">{service.full_description || service.short_description}</p>
          <div className="hero-actions">
            <Button as={Link} to="/contact">Discuss this service</Button>
            <Button as={Link} to="/services" variant="secondary">Back to services</Button>
          </div>
        </div>
        <GlassCard className="detail-image">
          <img
            src={service.image_url || '/service-placeholder.jpg'}
            alt={service.image_alt || service.title}
            onError={(event) => {
              event.currentTarget.src = '/service-placeholder.jpg';
            }}
          />
        </GlassCard>
      </div>
    </section>
  );
}
