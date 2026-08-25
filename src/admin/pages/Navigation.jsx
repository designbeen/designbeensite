import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { createAdminNavigationItem, deleteAdminNavigationItem, getAdminNavigation, updateAdminNavigationItem } from '../../api/adminApi.js';
import AdminField from '../../components/admin/AdminField.jsx';

const emptyForm = { label: '', url: '/', order_index: '0', visible: true, is_external: false };

export default function NavigationPage() {
  const queryClient = useQueryClient();
  const navigationQuery = useQuery({ queryKey: ['admin-navigation'], queryFn: getAdminNavigation });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const submitLabel = editingId ? 'Update item' : 'Create item';

  useEffect(() => {
    if (!editingId) setForm(emptyForm);
  }, [editingId]);

  const saveMutation = useMutation({
    mutationFn: async () => (editingId ? updateAdminNavigationItem({ id: editingId, payload: form }) : createAdminNavigationItem(form)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      await queryClient.invalidateQueries({ queryKey: ['navigation'] });
      setEditingId(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminNavigationItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-navigation'] });
      await queryClient.invalidateQueries({ queryKey: ['navigation'] });
    },
  });

  if (navigationQuery.isLoading) return <Loading label="Loading navigation" />;
  if (navigationQuery.isError) return <ErrorState title="Navigation unavailable" />;

  return (
    <div className="page-stack">
      <SectionHeader badge="Navigation" title="Manage navigation" description="Control labels, URLs, visibility, and ordering." align="left" />
      <GlassCard className="service-card">
        <div className="form-grid">
          <AdminField label="Menu label" htmlFor="navigation-label"><input id="navigation-label" className="input" placeholder="Services" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} /></AdminField>
          <AdminField label="URL" htmlFor="navigation-url"><input id="navigation-url" className="input" placeholder="/services" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} /></AdminField>
          <AdminField label="Order" htmlFor="navigation-order"><input id="navigation-order" className="input" type="number" placeholder="0" value={form.order_index} onChange={(event) => setForm({ ...form, order_index: event.target.value })} /></AdminField>
          <label className="helper-text"><input type="checkbox" checked={form.visible} onChange={(event) => setForm({ ...form, visible: event.target.checked })} /> Visible</label>
          <label className="helper-text"><input type="checkbox" checked={form.is_external} onChange={(event) => setForm({ ...form, is_external: event.target.checked })} /> External</label>
          <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : submitLabel}</Button>
        </div>
      </GlassCard>
      <GlassCard className="service-card" style={{ marginTop: '1rem' }}>
        <table className="admin-table">
          <thead><tr><th>Label</th><th>URL</th><th>Visible</th><th /></tr></thead>
          <tbody>
            {navigationQuery.data?.map((item) => (
              <tr key={item.id}>
                <td>{item.label}</td>
                <td>{item.url}</td>
                <td>{item.visible ? 'Yes' : 'No'}</td>
                <td>
                  <div className="admin-table-actions">
                    <Button type="button" variant="secondary" onClick={() => { setEditingId(item.id); setForm({ label: item.label, url: item.url, order_index: String(item.order_index ?? 0), visible: Boolean(item.visible), is_external: Boolean(item.is_external) }); }}>Edit</Button>
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
