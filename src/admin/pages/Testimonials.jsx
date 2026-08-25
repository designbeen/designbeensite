import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { createAdminTestimonial, deleteAdminTestimonial, getAdminTestimonials, updateAdminTestimonial } from '../../api/adminApi.js';
import AdminField from '../../components/admin/AdminField.jsx';

const emptyForm = { client_name: '', role: '', company: '', testimonial: '', sort_order: '0', active: true };

export default function TestimonialsPage() {
  const queryClient = useQueryClient();
  const testimonialsQuery = useQuery({ queryKey: ['admin-testimonials'], queryFn: getAdminTestimonials });
  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const submitLabel = editingId ? 'Update testimonial' : 'Create testimonial';

  useEffect(() => {
    if (!editingId) setForm(emptyForm);
  }, [editingId]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, typeof value === 'boolean' ? String(value) : value));
      if (avatarFile) payload.append('avatar', avatarFile);
      return editingId ? updateAdminTestimonial({ id: editingId, formData: payload }) : createAdminTestimonial(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setEditingId(null);
      setAvatarFile(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminTestimonial,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  if (testimonialsQuery.isLoading) return <Loading label="Loading testimonials" />;
  if (testimonialsQuery.isError) return <ErrorState title="Testimonials unavailable" />;

  return (
    <div className="page-stack">
      <SectionHeader badge="Testimonials" title="Manage testimonials" description="Create or update social proof content." align="left" />
      <GlassCard className="service-card">
        <div className="form-grid">
          <AdminField label="Client name" htmlFor="testimonial-client"><input id="testimonial-client" className="input" placeholder="Client name" value={form.client_name} onChange={(event) => setForm({ ...form, client_name: event.target.value })} /></AdminField>
          <AdminField label="Role" htmlFor="testimonial-role"><input id="testimonial-role" className="input" placeholder="CTO" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} /></AdminField>
          <AdminField label="Company" htmlFor="testimonial-company"><input id="testimonial-company" className="input" placeholder="Company name" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} /></AdminField>
          <AdminField label="Testimonial" htmlFor="testimonial-copy"><textarea id="testimonial-copy" className="textarea" placeholder="Client testimonial" value={form.testimonial} onChange={(event) => setForm({ ...form, testimonial: event.target.value })} /></AdminField>
          <AdminField label="Sort order" htmlFor="testimonial-sort-order"><input id="testimonial-sort-order" className="input" type="number" placeholder="0" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} /></AdminField>
          <label className="helper-text"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Active</label>
          <AdminField label="Avatar image" htmlFor="testimonial-avatar"><input id="testimonial-avatar" className="input" type="file" accept="image/*" onChange={(event) => setAvatarFile(event.target.files?.[0] || null)} /></AdminField>
          <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : submitLabel}</Button>
        </div>
      </GlassCard>
      <GlassCard className="service-card" style={{ marginTop: '1rem' }}>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Company</th><th>Status</th><th /></tr></thead>
          <tbody>
            {testimonialsQuery.data?.map((item) => (
              <tr key={item.id}>
                <td>{item.client_name}</td>
                <td>{item.company}</td>
                <td>{item.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <div className="admin-table-actions">
                    <Button type="button" variant="secondary" onClick={() => { setEditingId(item.id); setForm({ client_name: item.client_name, role: item.role || '', company: item.company || '', testimonial: item.testimonial || '', sort_order: String(item.sort_order ?? 0), active: Boolean(item.active) }); }}>Edit</Button>
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
