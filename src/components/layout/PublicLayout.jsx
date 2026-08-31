'use client';

import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function PublicLayout({ children }) {
  return (
    <div className="site-shell">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
