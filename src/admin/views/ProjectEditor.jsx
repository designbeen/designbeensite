'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from '@/lib/router-compat';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { createAdminProject, getAdminProjects, updateAdminProject } from '../../api/adminApi.js';
import AdminField from '../../components/admin/AdminField.jsx';

const emptyForm = {
  title: '',
  slug: '',
  category_name: '',
  short_description: '',
  full_description: '',
  client: '',
  project_url: '',
  github_url: '',
  technologies: '',
  sort_order: '0',
  featured: true,
  published: true,
  publication_date: '',
};

export default function ProjectEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const projectsQuery = useQuery({ queryKey: ['admin-projects'], queryFn: getAdminProjects });
  const current = useMemo(() => projectsQuery.data?.find((item) => String(item.id) === String(id)), [projectsQuery.data, id]);
  const [form, setForm] = useState(emptyForm);
  const [coverImage, setCoverImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  React.useEffect(() => {
    if (current) {
      setForm({
        title: current.title || '',
        slug: current.slug || '',
        category_name: current.category_name || '',
        short_description: current.short_description || '',
        full_description: current.full_description || '',
        client: current.client || '',
        project_url: current.project_url || '',
        github_url: current.github_url || '',
        technologies: (current.technologies || []).map((item) => item.name).join(', '),
        sort_order: String(current.sort_order ?? 0),
        featured: Boolean(current.featured),
        published: Boolean(current.published),
        publication_date: current.publication_date || '',
      });
    }
  }, [current]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, typeof value === 'boolean' ? String(value) : value));
      if (coverImage) payload.append('coverImage', coverImage);
      galleryFiles.forEach((file) => payload.append('galleryImages', file));
      return isEditing ? updateAdminProject({ id, formData: payload }) : createAdminProject(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/admin/projects');
    },
  });

  if (projectsQuery.isLoading) return <Loading label="Loading project" />;
  if (projectsQuery.isError) return <ErrorState title="Project data unavailable" />;

  return (
    <div className="page-stack">
      <SectionHeader badge="Projects" title={isEditing ? 'Edit project' : 'New project'} description="Create or update a portfolio project." align="left" />
      <GlassCard className="service-card">
        <form className="form-grid" onSubmit={(event) => { event.preventDefault(); saveMutation.mutate(); }}>
          <AdminField label="Title" htmlFor="project-title"><input id="project-title" className="input" placeholder="Project title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></AdminField>
          <AdminField label="Slug" htmlFor="project-slug"><input id="project-slug" className="input" placeholder="project-slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></AdminField>
          <AdminField label="Category" htmlFor="project-category"><input id="project-category" className="input" placeholder="Category name" value={form.category_name} onChange={(event) => setForm({ ...form, category_name: event.target.value })} /></AdminField>
          <AdminField label="Client" htmlFor="project-client"><input id="project-client" className="input" placeholder="Client name" value={form.client} onChange={(event) => setForm({ ...form, client: event.target.value })} /></AdminField>
          <AdminField label="Project URL" htmlFor="project-url"><input id="project-url" className="input" placeholder="https://example.com" value={form.project_url} onChange={(event) => setForm({ ...form, project_url: event.target.value })} /></AdminField>
          <AdminField label="GitHub URL" htmlFor="project-github-url"><input id="project-github-url" className="input" placeholder="https://github.com/..." value={form.github_url} onChange={(event) => setForm({ ...form, github_url: event.target.value })} /></AdminField>
          <AdminField label="Technologies" htmlFor="project-technologies" hint="Separate multiple technologies with commas."><input id="project-technologies" className="input" placeholder="React, Node.js, MySQL" value={form.technologies} onChange={(event) => setForm({ ...form, technologies: event.target.value })} /></AdminField>
          <AdminField label="Short description" htmlFor="project-short-description"><input id="project-short-description" className="input" placeholder="One-line summary" value={form.short_description} onChange={(event) => setForm({ ...form, short_description: event.target.value })} /></AdminField>
          <AdminField label="Full description" htmlFor="project-full-description"><textarea id="project-full-description" className="textarea" placeholder="Detailed project description" value={form.full_description} onChange={(event) => setForm({ ...form, full_description: event.target.value })} /></AdminField>
          <AdminField label="Sort order" htmlFor="project-sort-order"><input id="project-sort-order" className="input" type="number" placeholder="0" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} /></AdminField>
          <AdminField label="Publication date" htmlFor="project-publication-date"><input id="project-publication-date" className="input" type="date" value={form.publication_date} onChange={(event) => setForm({ ...form, publication_date: event.target.value })} /></AdminField>
          <label className="helper-text"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured</label>
          <label className="helper-text"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Published</label>
          <AdminField label="Cover image" htmlFor="project-cover-image"><input id="project-cover-image" className="input" type="file" accept="image/*" onChange={(event) => setCoverImage(event.target.files?.[0] || null)} /></AdminField>
          <AdminField label="Gallery images" htmlFor="project-gallery-images"><input id="project-gallery-images" className="input" type="file" accept="image/*" multiple onChange={(event) => setGalleryFiles(Array.from(event.target.files || []))} /></AdminField>
          <div className="admin-toolbar">
            <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : 'Save project'}</Button>
            <Button as={Link} to="/admin/projects" variant="secondary">Cancel</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
