import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import {
  getAdminPartners,
  createAdminPartner,
  updateAdminPartner,
  toggleAdminPartner,
  deleteAdminPartner,
} from '../../api/adminApi.js';

export default function PartnersAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [partnerType, setPartnerType] = useState('ENTERPRISE CLIENT');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [logoFile, setLogoFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const queryClient = useQueryClient();

  const partnersQuery = useQuery({ queryKey: ['admin-partners'], queryFn: getAdminPartners });

  const createMutation = useMutation({
    mutationFn: createAdminPartner,
    onSuccess: async () => {
      setFormSuccess('Partner created successfully!');
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      await queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || err.message || 'Failed to create partner');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminPartner,
    onSuccess: async () => {
      setFormSuccess('Partner updated successfully!');
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      await queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || err.message || 'Failed to update partner');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleAdminPartner,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      await queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminPartner,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      await queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  function resetForm() {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setPartnerType('ENTERPRISE CLIENT');
    setWebsiteUrl('');
    setSortOrder(0);
    setLogoFile(null);
    setFormError('');
  }

  function handleEdit(partner) {
    setIsEditing(true);
    setEditingId(partner.id);
    setName(partner.name || '');
    setPartnerType(partner.partner_type || 'ENTERPRISE CLIENT');
    setWebsiteUrl(partner.website_url || '');
    setSortOrder(partner.sort_order || 0);
    setLogoFile(null);
    setFormError('');
    setFormSuccess('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim()) {
      setFormError('Partner company name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('partner_type', partnerType.trim());
    formData.append('website_url', websiteUrl.trim());
    formData.append('sort_order', sortOrder);
    if (logoFile) {
      formData.append('logoFile', logoFile);
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const defaultPartnersList = [
    { id: 1, name: 'Nexus Corp', partner_type: 'ENTERPRISE CLIENT', website_url: 'https://nexus.corp', sort_order: 1, active: 1 },
    { id: 2, name: 'Aura Labs', partner_type: 'DEFI PROTOCOL', website_url: 'https://aura.labs', sort_order: 2, active: 1 },
    { id: 3, name: 'Quantum Ledger', partner_type: 'WEB3 INFRASTRUCTURE', website_url: 'https://quantumledger.io', sort_order: 3, active: 1 },
    { id: 4, name: 'Vanguard Dynamics', partner_type: 'CLOUD ENGINEERING', website_url: 'https://vanguard.dynamics', sort_order: 4, active: 1 },
    { id: 5, name: 'Synapse AI', partner_type: 'NEURAL SYSTEMS', website_url: 'https://synapse.ai', sort_order: 5, active: 1 },
    { id: 6, name: 'Apex Financial', partner_type: 'INSTITUTIONAL PARTNER', website_url: 'https://apex.financial', sort_order: 6, active: 1 },
  ];

  const rawPartners = partnersQuery.data?.length ? partnersQuery.data : defaultPartnersList;
  const filteredPartners = rawPartners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.partner_type && p.partner_type.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="page-stack">
      <SectionHeader
        badge="Partner Management"
        title="Manage Brand Partners & Clients"
        description="Dedicated database management for home page logo marquee partners."
        align="left"
      />

      {/* Success/Error Alerts */}
      {formSuccess ? (
        <div className="status-pill-badge active" style={{ marginBottom: '1rem', padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}>
          ✔ {formSuccess}
        </div>
      ) : null}

      {formError ? (
        <div className="status-pill-badge btn-danger" style={{ marginBottom: '1rem', padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}>
          ⚠ {formError}
        </div>
      ) : null}

      {/* Editor Modal / Card */}
      {isEditing ? (
        <GlassCard className="admin-form-card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
          <div className="portfolio-grid-header">
            <h3>{editingId ? 'Edit Partner Company' : 'Add New Partner Company'}</h3>
            <Button type="button" variant="secondary" onClick={resetForm} className="action-btn-sm">
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="form-grid" style={{ marginTop: '1rem' }}>
            <div className="admin-field">
              <label className="admin-field-label">Company Name *</label>
              <input
                type="text"
                className="input"
                required
                placeholder="e.g. Nexus Corp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-field-label">Partner Type / Industry Tag</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. ENTERPRISE CLIENT, DEFI PROTOCOL"
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-field-label">Website URL</label>
              <input
                type="url"
                className="input"
                placeholder="e.g. https://nexus.corp"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-field-label">Sort Order</label>
              <input
                type="number"
                className="input"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>

            <div className="admin-field">
              <label className="admin-field-label">Company Logo File (Optional)</label>
              <input
                type="file"
                className="input"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </div>

            <div className="admin-actions-row" style={{ marginTop: '1rem' }}>
              <Button
                type="submit"
                className="quick-btn"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <span>
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingId
                    ? 'Save Changes'
                    : 'Create Partner'}
                </span>
              </Button>
            </div>
          </form>
        </GlassCard>
      ) : null}

      {/* Toolbar & Search */}
      <div className="admin-toolbar-row">
        {!isEditing ? (
          <Button type="button" onClick={() => { setIsEditing(true); setFormError(''); setFormSuccess(''); }} className="quick-btn">
            <span className="material-symbols-outlined">add</span>
            <span>Add New Partner</span>
          </Button>
        ) : <div />}

        <div className="admin-search-wrap">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="input admin-search-input"
            placeholder="Search partners by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <GlassCard className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Company Name</th>
              <th>Partner Type</th>
              <th>Website</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((partner) => (
              <tr key={partner.id}>
                <td>
                  <span className="system-id-badge">PARTNER // 0{partner.id}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        style={{ width: '2rem', height: '2rem', borderRadius: '0.4rem', objectFit: 'contain' }}
                      />
                    ) : (
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>domain</span>
                    )}
                    <strong>{partner.name}</strong>
                  </div>
                </td>
                <td>
                  <span className="tech-pill">{partner.partner_type || 'ENTERPRISE CLIENT'}</span>
                </td>
                <td>
                  {partner.website_url ? (
                    <a href={partner.website_url} target="_blank" rel="noreferrer" className="nav-back-link" style={{ fontSize: '0.78rem' }}>
                      <span>Visit</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>north_east</span>
                    </a>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>—</span>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className={`status-toggle-btn ${partner.active ? 'active' : 'inactive'}`}
                    onClick={() => toggleMutation.mutate(partner.id)}
                    title="Click to toggle active marquee status"
                  >
                    <span className="status-dot" />
                    <span>{partner.active ? 'Active' : 'Hidden'}</span>
                  </button>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <Button type="button" variant="secondary" className="action-btn-sm" onClick={() => handleEdit(partner)}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit</span>
                      <span>Edit</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="action-btn-sm btn-danger"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete partner "${partner.name}"?`)) {
                          deleteMutation.mutate(partner.id);
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
