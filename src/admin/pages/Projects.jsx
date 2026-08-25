import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { deleteAdminProject, getAdminProjects, toggleAdminProject } from '../../api/adminApi.js';

export default function ProjectsAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({ queryKey: ['admin-projects'], queryFn: getAdminProjects });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: toggleAdminProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  if (projectsQuery.isLoading) return <Loading label="Loading projects" />;
  if (projectsQuery.isError) return <ErrorState title="Projects unavailable" />;

  const rawProjects = projectsQuery.data || [];
  const filteredProjects = rawProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="page-stack">
      <SectionHeader badge="Portfolio Management" title="Manage Projects" description="Create, edit, feature, publish, or remove case studies." align="left" />

      {/* Toolbar & Search */}
      <div className="admin-toolbar-row">
        <Button as={Link} to="/admin/projects/new" className="quick-btn">
          <span className="material-symbols-outlined">add</span>
          <span>Create New Project</span>
        </Button>

        <div className="admin-search-wrap">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="input admin-search-input"
            placeholder="Search projects by title, client, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <GlassCard className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Case Tag</th>
              <th>Project Title</th>
              <th>Client</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>
                  <span className="system-id-badge">CASE // 0{project.id}</span>
                </td>
                <td>
                  <strong>{project.title}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{project.slug}</div>
                </td>
                <td>{project.client || 'Client Case'}</td>
                <td>{project.category_name || 'System Architecture'}</td>
                <td>
                  <button
                    type="button"
                    className={`status-toggle-btn ${project.featured ? 'active' : 'inactive'}`}
                    onClick={() => toggleFeaturedMutation.mutate(project.id)}
                    title="Click to toggle featured spotlight status"
                  >
                    <span className="status-dot" />
                    <span>{project.featured ? 'Featured Spotlight' : 'Standard'}</span>
                  </button>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <Button as={Link} to={`/admin/projects/${project.id}`} variant="secondary" className="action-btn-sm">
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit</span>
                      <span>Edit</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="action-btn-sm btn-danger"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete project "${project.title}"?`)) {
                          deleteMutation.mutate(project.id);
                        }
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete</span>
                    </Button>
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
