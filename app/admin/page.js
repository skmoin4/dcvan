'use client';

import PrivateRoute from '../../src/components/common/PrivateRoute';
import AdminDashboard from '../../src/views/AdminDashboard';

export default function Page() {
  return (
    <PrivateRoute roles={['admin', 'executive']}>
      <AdminDashboard />
    </PrivateRoute>
  );
}
