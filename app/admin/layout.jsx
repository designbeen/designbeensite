import ProtectedRoute from '@/src/components/admin/ProtectedRoute';
import AdminLayout from '@/src/components/admin/AdminLayout';

export default function AdminRootLayout({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
