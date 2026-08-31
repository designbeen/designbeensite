'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/src/components/admin/ProtectedRoute';
import AdminLayout from '@/src/components/admin/AdminLayout';

export default function AdminRootLayout({ children }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
