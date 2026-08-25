import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { createAdminTechnology, deleteAdminTechnology, getAdminTechnologies, updateAdminTechnology } from '../../api/adminApi.js';
import AdminField from '../../components/admin/AdminField.jsx';

const emptyForm = { name: '', slug: '', icon: 'deployed_code', website_url: '', sort_order: '0', active: true };

export default function TechnologiesPage() {
  const queryClient = useQueryClient();
  const technologiesQuery = useQuery({ queryKey: ['admin-technologies'], queryFn: getAdminTechnologies });
  const [form, setForm] = useState(emptyForm);
  const [iconFile, setIconFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!editingId) setForm(emptyForm);
  }, [editingId]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, typeof value === 'boolean' ? String(value) : value));
      if (iconFile) payload.append('iconFile', iconFile);
      return editingId ? updateAdminTechnology({ id: editingId, formData: payload }) : createAdminTechnology(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-technologies'] });
      await queryClient.invalidateQueries({ queryKey: ['technologies'] });
      setEditingId(null);
      setIconFile(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminTechnology,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-technologies'] });
      await queryClient.invalidateQueries({ queryKey: ['technologies'] });
    },
  });

  const submitLabel = editingId ? 'Update technology' : 'Create technology';

  if (technologiesQuery.isLoading) return <Loading label="Loading technologies" />;
  if (technologiesQuery.isError) return <ErrorState title="Technologies unavailable" />;

  return (
    <div className="page-stack">
      <SectionHeader badge="Technologies" title="Manage technologies" description="Create or update technology badges." align="left" />
      <GlassCard className="service-card">
        <div className="form-grid">
          <AdminField label="Technology name" htmlFor="technology-name"><input id="technology-name" className="input" placeholder="React.js" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></AdminField>
          <AdminField label="Slug" htmlFor="technology-slug"><input id="technology-slug" className="input" placeholder="react-js" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></AdminField>
          <AdminField label="Icon" htmlFor="technology-icon"><input id="technology-icon" className="input" placeholder="Material icon or image path" value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} /></AdminField>
          <AdminField label="Website URL" htmlFor="technology-website"><input id="technology-website" className="input" placeholder="https://react.dev" value={form.website_url} onChange={(event) => setForm({ ...form, website_url: event.target.value })} /></AdminField>
          <AdminField label="Sort order" htmlFor="technology-sort-order"><input id="technology-sort-order" className="input" type="number" placeholder="0" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} /></AdminField>
          <label className="helper-text"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Active</label>
          <AdminField label="Icon image" htmlFor="technology-icon-file"><input id="technology-icon-file" className="input" type="file" accept="image/*" onChange={(event) => setIconFile(event.target.files?.[0] || null)} /></AdminField>
          <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : submitLabel}</Button>
        </div>
      </GlassCard>
      <GlassCard className="service-card" style={{ marginTop: '1rem' }}>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Status</th><th /></tr></thead>
          <tbody>
            {technologiesQuery.data?.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <div className="admin-table-actions">
                    <Button type="button" variant="secondary" onClick={() => { setEditingId(item.id); setForm({ name: item.name, slug: item.slug, icon: item.icon || 'deployed_code', website_url: item.website_url || '', sort_order: String(item.sort_order ?? 0), active: Boolean(item.active) }); }}>Edit</Button>
                    <Button type="button" variant="secondary" onClick={() => deleteMutation.mutate(item.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
