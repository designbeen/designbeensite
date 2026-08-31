'use client';

import React from 'react';
import { Link } from '@/lib/router-compat';
import Button from '../components/common/Button.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';

export default function NotFound() {
  return (
    <section className="section">
      <div className="page-container">
        <SectionHeader badge="404" title="Page not found" description="The requested route does not exist." />
        <Button as={Link} to="/">Return home</Button>
      </div>
    </section>
  );
}
