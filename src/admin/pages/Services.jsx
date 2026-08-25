import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { deleteAdminService, getAdminServices, toggleAdminService } from '../../api/adminApi.js';

export default function ServicesAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const servicesQuery = useQuery({ queryKey: ['admin-services'], queryFn: getAdminServices });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      await queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleAdminService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      await queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  if (servicesQuery.isLoading) return <Loading label="Loading services" />;
  if (servicesQuery.isError) return <ErrorState title="Services unavailable" />;

  const rawServices = servicesQuery.data || [];
  const filteredServices = rawServices.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.category_name && s.category_name.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="page-stack">
      <SectionHeader badge="Services Management" title="Manage Capabilities" description="Create, edit, feature, toggle active status, or remove services." align="left" />

      {/* Admin Toolbar & Search */}
      <div className="admin-toolbar-row">
        <Button as={Link} to="/admin/services/new" className="quick-btn">
          <span className="material-symbols-outlined">add</span>
          <span>Create New Service</span>
        </Button>

        <div className="admin-search-wrap">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="input admin-search-input"
            placeholder="Search services by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <GlassCard className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>System ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td>
                  <span className="system-id-badge">SYS // 0{service.id}</span>
                </td>
                <td>
                  <strong>{service.title}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{service.slug}</div>
                </td>
                <td>{service.category_name || 'System Architecture'}</td>
                <td>
                  <button
                    type="button"
                    className={`status-toggle-btn ${service.active ? 'active' : 'inactive'}`}
                    onClick={() => toggleMutation.mutate(service.id)}
                    title="Click to toggle active status"
                  >
                    <span className="status-dot" />
                    <span>{service.active ? 'Active' : 'Inactive'}</span>
                  </button>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <Button as={Link} to={`/admin/services/${service.id}`} variant="secondary" className="action-btn-sm">
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit</span>
                      <span>Edit</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="action-btn-sm btn-danger"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete service "${service.title}"?`)) {
                          deleteMutation.mutate(service.id);
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
