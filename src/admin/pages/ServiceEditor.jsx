import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { createAdminService, getAdminServices, updateAdminService } from '../../api/adminApi.js';
import AdminField from '../../components/admin/AdminField.jsx';

const emptyForm = {
  title: '',
  slug: '',
  category_name: '',
  short_description: '',
  full_description: '',
  icon: 'design_services',
  sort_order: '0',
  featured: true,
  active: true,
};

export default function ServiceEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const servicesQuery = useQuery({ queryKey: ['admin-services'], queryFn: getAdminServices });
  const current = useMemo(() => servicesQuery.data?.find((item) => String(item.id) === String(id)), [servicesQuery.data, id]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);

  React.useEffect(() => {
    if (current) {
      setForm({
        title: current.title || '',
        slug: current.slug || '',
        category_name: current.category_name || '',
        short_description: current.short_description || '',
        full_description: current.full_description || '',
        icon: current.icon || 'design_services',
        sort_order: String(current.sort_order ?? 0),
        featured: Boolean(current.featured),
        active: Boolean(current.active),
      });
    }
  }, [current]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, typeof value === 'boolean' ? String(value) : value));
      if (imageFile) payload.append('image', imageFile);
      return isEditing ? updateAdminService({ id, formData: payload }) : createAdminService(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      await queryClient.invalidateQueries({ queryKey: ['services'] });
      navigate('/admin/services');
    },
  });

  if (servicesQuery.isLoading) return <Loading label="Loading service" />;
  if (servicesQuery.isError) return <ErrorState title="Service data unavailable" />;

  return (
    <div className="page-stack">
      <SectionHeader badge="Services" title={isEditing ? 'Edit service' : 'New service'} description="Create or update a service using the same visual content system used on the public site." align="left" />
      <GlassCard className="service-card">
        <form className="form-grid" onSubmit={(event) => { event.preventDefault(); saveMutation.mutate(); }}>
          <AdminField label="Title" htmlFor="service-title"><input id="service-title" className="input" placeholder="Service title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></AdminField>
          <AdminField label="Slug" htmlFor="service-slug"><input id="service-slug" className="input" placeholder="service-slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></AdminField>
          <AdminField label="Category" htmlFor="service-category"><input id="service-category" className="input" placeholder="Category name" value={form.category_name} onChange={(event) => setForm({ ...form, category_name: event.target.value })} /></AdminField>
          <AdminField label="Icon" htmlFor="service-icon"><input id="service-icon" className="input" placeholder="Material icon name" value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} /></AdminField>
          <AdminField label="Short description" htmlFor="service-short-description"><input id="service-short-description" className="input" placeholder="One-line summary" value={form.short_description} onChange={(event) => setForm({ ...form, short_description: event.target.value })} /></AdminField>
          <AdminField label="Full description" htmlFor="service-full-description"><textarea id="service-full-description" className="textarea" placeholder="Detailed service description" value={form.full_description} onChange={(event) => setForm({ ...form, full_description: event.target.value })} /></AdminField>
          <AdminField label="Sort order" htmlFor="service-sort-order"><input id="service-sort-order" className="input" type="number" placeholder="0" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} /></AdminField>
          <label className="helper-text"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured</label>
          <label className="helper-text"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Active</label>
          <AdminField label="Service image" htmlFor="service-image" hint="JPG, PNG, WebP up to the configured upload limit."><input id="service-image" className="input" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} /></AdminField>
          <div className="admin-toolbar">
            <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : 'Save service'}</Button>
            <Button as={Link} to="/admin/services" variant="secondary">Cancel</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
