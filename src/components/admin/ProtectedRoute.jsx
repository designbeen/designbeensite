'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Loading from '../common/Loading.jsx';
import ErrorState from '../common/ErrorState.jsx';
import { getAdminSession } from '../../api/adminApi.js';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const sessionQuery = useQuery({ queryKey: ['admin-session'], queryFn: getAdminSession, retry: false });

  useEffect(() => {
    if (sessionQuery.isError) {
      router.replace('/admin/login');
    }
  }, [sessionQuery.isError, router]);

  if (sessionQuery.isLoading) {
    return <Loading label="Checking admin session" />;
  }

  if (sessionQuery.isError) {
    return <Loading label="Redirecting to login..." />;
  }

  if (!sessionQuery.data) {
    return <ErrorState title="Admin session unavailable" />;
  }

  return children;
}
