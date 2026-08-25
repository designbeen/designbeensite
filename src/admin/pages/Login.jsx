import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api/adminApi.js';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import Button from '../../components/common/Button.jsx';
import AdminField from '../../components/admin/AdminField.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: 'admin@designbeen.local', password: '' });
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: () => navigate('/admin'),
  });

  return (
    <section className="section">
      <div className="page-container" style={{ maxWidth: '560px' }}>
        <div className="glass-card service-card">
          <SectionHeader badge="Admin" title="Sign in" description="Use the seeded admin account to manage the DesignBeen content." />
          <form className="form-grid" onSubmit={(event) => { event.preventDefault(); mutation.mutate(form); }}>
            <AdminField label="Email address" htmlFor="admin-email">
              <input id="admin-email" className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="admin@example.com" required />
            </AdminField>
            <AdminField label="Password" htmlFor="admin-password">
              <input id="admin-password" className="input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter password" required />
            </AdminField>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Signing in...' : 'Sign in'}</Button>
            {mutation.isError ? <p className="hero-note">Login failed. Check your credentials.</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}
