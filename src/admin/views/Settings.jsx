'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { getAdminSettings, updateAdminSettings } from '../../api/adminApi.js';
import AdminField from '../../components/admin/AdminField.jsx';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({ queryKey: ['admin-settings'], queryFn: getAdminSettings });
  const [form, setForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  useEffect(() => {
    if (settingsQuery.data) {
      setForm({ ...settingsQuery.data });
    }
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) payload.append(key, String(value));
      });
      if (logoFile) payload.append('logo', logoFile);
      if (faviconFile) payload.append('favicon', faviconFile);
      return updateAdminSettings(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      await queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  if (settingsQuery.isLoading) return <Loading label="Loading settings" />;
  if (settingsQuery.isError) return <ErrorState title="Settings unavailable" />;

  return (
    <div className="page-stack">
      <SectionHeader badge="Settings" title="Manage site settings" description="Branding and contact settings update the public site in one place." align="left" />
      <GlassCard className="service-card">
        <div className="form-grid">
          <AdminField label="Site name" htmlFor="settings-site-name"><input id="settings-site-name" className="input" placeholder="DesignBeen" value={form.site_name || ''} onChange={(event) => setForm({ ...form, site_name: event.target.value })} /></AdminField>
          <AdminField label="Tagline" htmlFor="settings-tagline"><input id="settings-tagline" className="input" placeholder="Engineering Future Realities" value={form.site_tagline || ''} onChange={(event) => setForm({ ...form, site_tagline: event.target.value })} /></AdminField>
          <AdminField label="Email" htmlFor="settings-email"><input id="settings-email" className="input" type="email" placeholder="hello@example.com" value={form.email || ''} onChange={(event) => setForm({ ...form, email: event.target.value })} /></AdminField>
          <AdminField label="Phone" htmlFor="settings-phone"><input id="settings-phone" className="input" placeholder="Phone number" value={form.phone || ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></AdminField>
          <AdminField label="Address" htmlFor="settings-address"><input id="settings-address" className="input" placeholder="Business address" value={form.address || ''} onChange={(event) => setForm({ ...form, address: event.target.value })} /></AdminField>
          <AdminField label="Primary color" htmlFor="settings-primary-color"><input id="settings-primary-color" className="input" placeholder="#4000c1" value={form.primary_color || ''} onChange={(event) => setForm({ ...form, primary_color: event.target.value })} /></AdminField>
          <AdminField label="Secondary color" htmlFor="settings-secondary-color"><input id="settings-secondary-color" className="input" placeholder="#00677f" value={form.secondary_color || ''} onChange={(event) => setForm({ ...form, secondary_color: event.target.value })} /></AdminField>
          <AdminField label="Accent color" htmlFor="settings-accent-color"><input id="settings-accent-color" className="input" placeholder="#00ccf9" value={form.accent_color || ''} onChange={(event) => setForm({ ...form, accent_color: event.target.value })} /></AdminField>
          <AdminField label="Footer description" htmlFor="settings-footer-description"><input id="settings-footer-description" className="input" placeholder="Footer description" value={form.footer_description || ''} onChange={(event) => setForm({ ...form, footer_description: event.target.value })} /></AdminField>
          <AdminField label="Copyright text" htmlFor="settings-copyright"><input id="settings-copyright" className="input" placeholder="Copyright text" value={form.copyright_text || ''} onChange={(event) => setForm({ ...form, copyright_text: event.target.value })} /></AdminField>
          <AdminField label="Primary CTA label" htmlFor="settings-primary-cta"><input id="settings-primary-cta" className="input" placeholder="Get Started" value={form.primary_cta_label || ''} onChange={(event) => setForm({ ...form, primary_cta_label: event.target.value })} /></AdminField>
          <AdminField label="Secondary CTA label" htmlFor="settings-secondary-cta"><input id="settings-secondary-cta" className="input" placeholder="View Work" value={form.secondary_cta_label || ''} onChange={(event) => setForm({ ...form, secondary_cta_label: event.target.value })} /></AdminField>
          <AdminField label="Instagram URL" htmlFor="settings-instagram"><input id="settings-instagram" className="input" placeholder="https://instagram.com/..." value={form.instagram_url || ''} onChange={(event) => setForm({ ...form, instagram_url: event.target.value })} /></AdminField>
          <AdminField label="LinkedIn URL" htmlFor="settings-linkedin"><input id="settings-linkedin" className="input" placeholder="https://linkedin.com/..." value={form.linkedin_url || ''} onChange={(event) => setForm({ ...form, linkedin_url: event.target.value })} /></AdminField>
          <AdminField label="Behance URL" htmlFor="settings-behance"><input id="settings-behance" className="input" placeholder="https://behance.net/..." value={form.behance_url || ''} onChange={(event) => setForm({ ...form, behance_url: event.target.value })} /></AdminField>
          <AdminField label="Theme preset" htmlFor="settings-theme"><input id="settings-theme" className="input" placeholder="designbeen or dark" value={form.theme_preset || ''} onChange={(event) => setForm({ ...form, theme_preset: event.target.value })} /></AdminField>
          <AdminField label="Logo image" htmlFor="settings-logo"><input id="settings-logo" className="input" type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] || null)} /></AdminField>
          <AdminField label="Favicon image" htmlFor="settings-favicon"><input id="settings-favicon" className="input" type="file" accept="image/*" onChange={(event) => setFaviconFile(event.target.files?.[0] || null)} /></AdminField>
          <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : 'Save settings'}</Button>
        </div>
      </GlassCard>
    </div>
  );
}
