import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Loading from '../common/Loading.jsx';
import ErrorState from '../common/ErrorState.jsx';
import { getAdminSession } from '../../api/adminApi.js';

export default function ProtectedRoute({ children }) {
  const sessionQuery = useQuery({ queryKey: ['admin-session'], queryFn: getAdminSession, retry: false });

  if (sessionQuery.isLoading) {
    return <Loading label="Checking admin session" />;
  }

  if (sessionQuery.isError) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!sessionQuery.data) {
    return <ErrorState title="Admin session unavailable" />;
  }

  return children;
}
