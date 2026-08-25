import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import themeModule from './theme/index.js';
import { getSettings } from './api/settingsApi.js';
import PublicLayout from './components/layout/PublicLayout.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import ServiceDetails from './pages/ServiceDetails.jsx';
import Portfolio from './pages/Portfolio.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './admin/pages/Login.jsx';
import AdminDashboard from './admin/pages/Dashboard.jsx';
import AdminServices from './admin/pages/Services.jsx';
import AdminServiceEditor from './admin/pages/ServiceEditor.jsx';
import AdminProjects from './admin/pages/Projects.jsx';
import AdminProjectEditor from './admin/pages/ProjectEditor.jsx';
import AdminTestimonials from './admin/pages/Testimonials.jsx';
import AdminTechnologies from './admin/pages/Technologies.jsx';
import AdminPartners from './admin/pages/Partners.jsx';
import AdminTeam from './admin/pages/Team.jsx';
import AdminNavigation from './admin/pages/Navigation.jsx';
import AdminSettings from './admin/pages/Settings.jsx';
import AdminContactMessages from './admin/pages/ContactMessages.jsx';

const { defaultTheme, toCssVariables } = themeModule;

function applyThemeVariables(theme, settings) {
  const variables = { ...toCssVariables(theme) };

  if (settings?.primary_color) variables['--color-primary'] = settings.primary_color;
  if (settings?.primary_hover_color) variables['--color-primary-hover'] = settings.primary_hover_color;
  if (settings?.secondary_color) variables['--color-secondary'] = settings.secondary_color;
  if (settings?.accent_color) variables['--color-accent'] = settings.accent_color;
  if (settings?.background_color) variables['--color-background'] = settings.background_color;
  if (settings?.surface_color) variables['--color-surface'] = settings.surface_color;
  if (settings?.text_color) variables['--color-text'] = settings.text_color;
  if (settings?.theme_preset === 'dark') {
    variables['--color-background'] = '#080812';
    variables['--color-surface'] = 'rgba(17, 24, 39, 0.62)';
    variables['--color-text'] = '#f8fafc';
  }

  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

function applyFavicon(settings) {
  const fallback = '/assets/favicon.svg';
  const href = settings?.favicon_url || fallback;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = href;
}

export default function App() {
  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: getSettings });

  useEffect(() => {
    applyThemeVariables(defaultTheme, settingsQuery.data);
    document.documentElement.dataset.theme = settingsQuery.data?.theme_preset || 'designbeen';
    applyFavicon(settingsQuery.data);
  }, [settingsQuery.data]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetails />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/:slug" element={<ProjectDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="services/new" element={<AdminServiceEditor />} />
        <Route path="services/:id" element={<AdminServiceEditor />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/new" element={<AdminProjectEditor />} />
        <Route path="projects/:id" element={<AdminProjectEditor />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="technologies" element={<AdminTechnologies />} />
        <Route path="partners" element={<AdminPartners />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="navigation" element={<AdminNavigation />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="contact-messages" element={<AdminContactMessages />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
