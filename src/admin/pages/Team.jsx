import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import {
  getAdminTeam,
  createAdminTeamMember,
  updateAdminTeamMember,
  toggleAdminTeamMember,
  deleteAdminTeamMember,
  getAdminTeamDepartments,
  createAdminTeamDepartment,
  deleteAdminTeamDepartment,
} from '../../api/adminApi.js';

export default function TeamAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeptManager, setShowDeptManager] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [skills, setSkills] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [avatarFile, setAvatarFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Department manager state
  const [newDeptName, setNewDeptName] = useState('');

  const queryClient = useQueryClient();

  const teamQuery = useQuery({ queryKey: ['admin-team'], queryFn: getAdminTeam });
  const deptQuery = useQuery({ queryKey: ['admin-team-departments'], queryFn: getAdminTeamDepartments });

  const createMutation = useMutation({
    mutationFn: createAdminTeamMember,
    onSuccess: async () => {
      setFormSuccess('Team member created successfully!');
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ['admin-team'] });
      await queryClient.invalidateQueries({ queryKey: ['team'] });
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || err.message || 'Failed to create member');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminTeamMember,
    onSuccess: async () => {
      setFormSuccess('Team member updated successfully!');
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ['admin-team'] });
      await queryClient.invalidateQueries({ queryKey: ['team'] });
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || err.message || 'Failed to update member');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleAdminTeamMember,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-team'] });
      await queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminTeamMember,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-team'] });
      await queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });

  const createDeptMutation = useMutation({
    mutationFn: createAdminTeamDepartment,
    onSuccess: async () => {
      setNewDeptName('');
      await queryClient.invalidateQueries({ queryKey: ['admin-team-departments'] });
      await queryClient.invalidateQueries({ queryKey: ['team-departments'] });
    },
  });

  const deleteDeptMutation = useMutation({
    mutationFn: deleteAdminTeamDepartment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-team-departments'] });
      await queryClient.invalidateQueries({ queryKey: ['team-departments'] });
    },
  });

  function resetForm() {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setRole('');
    setDepartment('Engineering');
    setBio('');
    setLinkedinUrl('');
    setGithubUrl('');
    setTwitterUrl('');
    setSkills('');
    setSortOrder(0);
    setAvatarFile(null);
    setFormError('');
  }

  function handleEdit(member) {
    setIsEditing(true);
    setEditingId(member.id);
    setName(member.name || '');
    setRole(member.role || '');
    setDepartment(member.department || 'Engineering');
    setBio(member.bio || '');
    setLinkedinUrl(member.linkedin_url || '');
    setGithubUrl(member.github_url || '');
    setTwitterUrl(member.twitter_url || '');
    setSkills(member.skills || '');
    setSortOrder(member.sort_order || 0);
    setAvatarFile(null);
    setFormError('');
    setFormSuccess('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim()) {
      setFormError('Member name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('role', role.trim());
    formData.append('department', department.trim());
    formData.append('bio', bio.trim());
    formData.append('linkedin_url', linkedinUrl.trim());
    formData.append('github_url', githubUrl.trim());
    formData.append('twitter_url', twitterUrl.trim());
    formData.append('skills', skills.trim());
    formData.append('sort_order', sortOrder);
    if (avatarFile) {
      formData.append('avatarFile', avatarFile);
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  function handleAddDepartment(e) {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    createDeptMutation.mutate({ name: newDeptName.trim() });
  }

  const defaultDepts = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'AI & Research' },
    { id: 4, name: 'Product Strategy' },
    { id: 5, name: 'Leadership' },
  ];

  const fetchedDepts = deptQuery.data?.length ? deptQuery.data : defaultDepts;

  const defaultTeamList = [
    { id: 1, name: 'Alexander Vance', role: 'Chief Technology Officer', department: 'Engineering', active: 1, avatar_url: '/assets/testimonial-sarah.png' },
    { id: 2, name: 'Elena Rostova', role: 'Chief Design Officer', department: 'Design', active: 1, avatar_url: '/assets/testimonial-elena.png' },
    { id: 3, name: 'Dr. Marcus Thorne', role: 'Head of AI & Intelligence', department: 'AI & Research', active: 1, avatar_url: '/assets/testimonial-marcus.png' },
    { id: 4, name: 'Sophia Chen', role: 'Principal Systems Engineer', department: 'Engineering', active: 1, avatar_url: null },
  ];

  const rawTeam = teamQuery.data?.length ? teamQuery.data : defaultTeamList;
  const filteredTeam = rawTeam.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.role && m.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.department && m.department.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="page-stack">
      <SectionHeader
        badge="Team Management"
        title="Manage Team Members & Departments"
        description="Add, edit, or toggle display status of agency engineers, designers, and dynamic departments."
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

      {/* Department Manager Drawer */}
      {showDeptManager ? (
        <GlassCard style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div className="portfolio-grid-header" style={{ marginBottom: '1rem' }}>
            <h4>Dynamic Department Management</h4>
            <Button type="button" variant="secondary" className="action-btn-sm" onClick={() => setShowDeptManager(false)}>
              Close
            </Button>
          </div>

          <form onSubmit={handleAddDepartment} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              className="input"
              placeholder="New department name (e.g. Cyber Security)..."
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              style={{ maxWidth: '350px' }}
            />
            <Button type="submit" className="quick-btn" disabled={createDeptMutation.isPending}>
              <span>{createDeptMutation.isPending ? 'Adding...' : '+ Add Department'}</span>
            </Button>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {fetchedDepts.map((d) => (
              <span key={d.id || d.name} className="tech-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem' }}>
                <span>{d.name}</span>
                {d.id ? (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                    onClick={() => {
                      if (window.confirm(`Delete department "${d.name}"?`)) {
                        deleteDeptMutation.mutate(d.id);
                      }
                    }}
                    title="Delete Department"
                  >
                    ✕
                  </button>
                ) : null}
              </span>
            ))}
          </div>
        </GlassCard>
      ) : null}

      {/* Editor Modal / Card */}
      {isEditing ? (
        <GlassCard className="admin-form-card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
          <div className="portfolio-grid-header">
            <h3>{editingId ? 'Edit Team Member' : 'Add New Team Member'}</h3>
            <Button type="button" variant="secondary" onClick={resetForm} className="action-btn-sm">
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="form-grid" style={{ marginTop: '1rem' }}>
            <div className="admin-field">
              <label className="admin-field-label">Full Name *</label>
              <input
                type="text"
                className="input"
                required
                placeholder="e.g. Alexander Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-field-label">Role / Title *</label>
              <input
                type="text"
                className="input"
                required
                placeholder="e.g. Chief Technology Officer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="admin-field-label" style={{ marginBottom: 0 }}>Department</label>
                <button
                  type="button"
                  onClick={() => setShowDeptManager(!showDeptManager)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  {showDeptManager ? 'Close Manager' : '+ Manage Departments'}
                </button>
              </div>
              <select
                className="input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {fetchedDepts.map((d) => (
                  <option key={d.id || d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label className="admin-field-label">Skills / Core Tags</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Rust, Node.js, Distributed Systems"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-field-label">Bio / Overview</label>
              <textarea
                className="input"
                rows={3}
                placeholder="Short bio describing expertise and focus..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-field-label">LinkedIn URL</label>
              <input
                type="url"
                className="input"
                placeholder="https://linkedin.com/in/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-field-label">GitHub URL</label>
              <input
                type="url"
                className="input"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label className="admin-field-label">Twitter / X URL</label>
              <input
                type="url"
                className="input"
                placeholder="https://twitter.com/..."
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
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
              <label className="admin-field-label">Avatar Image File (Optional)</label>
              <input
                type="file"
                className="input"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </div>

            <div className="admin-actions-row" style={{ marginTop: '1rem', gridColumn: '1 / -1' }}>
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
                    : 'Create Member'}
                </span>
              </Button>
            </div>
          </form>
        </GlassCard>
      ) : null}

      {/* Toolbar & Search */}
      <div className="admin-toolbar-row">
        {!isEditing ? (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button type="button" onClick={() => { setIsEditing(true); setFormError(''); setFormSuccess(''); }} className="quick-btn">
              <span className="material-symbols-outlined">person_add</span>
              <span>Add Team Member</span>
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowDeptManager(!showDeptManager)} className="action-btn-sm" style={{ padding: '0.65rem 1.1rem' }}>
              <span className="material-symbols-outlined">category</span>
              <span>{showDeptManager ? 'Hide Departments' : 'Manage Departments'}</span>
            </Button>
          </div>
        ) : <div />}

        <div className="admin-search-wrap">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="input admin-search-input"
            placeholder="Search by name, title, or department..."
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
              <th>Member</th>
              <th>Role & Department</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeam.map((member) => (
              <tr key={member.id}>
                <td>
                  <span className="system-id-badge">MEMBER // 0{member.id}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        style={{ width: '2.4rem', height: '2.4rem', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,212,255,0.3)' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '2.4rem',
                          height: '2.4rem',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(64,0,193,0.2))',
                          display: 'grid',
                          placeItems: 'center',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <strong>{member.name}</strong>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{member.role}</span>
                    <span className="tech-pill" style={{ width: 'fit-content' }}>{member.department || 'Engineering'}</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    {member.skills || '—'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className={`status-toggle-btn ${member.active ? 'active' : 'inactive'}`}
                    onClick={() => toggleMutation.mutate(member.id)}
                    title="Click to toggle member active status"
                  >
                    <span className="status-dot" />
                    <span>{member.active ? 'Active' : 'Hidden'}</span>
                  </button>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <Button type="button" variant="secondary" className="action-btn-sm" onClick={() => handleEdit(member)}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit</span>
                      <span>Edit</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="action-btn-sm btn-danger"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove team member "${member.name}"?`)) {
                          deleteMutation.mutate(member.id);
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
