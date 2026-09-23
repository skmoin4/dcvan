'use client';

import PrivateRoute from '../../../src/components/common/PrivateRoute';
import AdminUsers from '../../../src/views/AdminUsers';

export default function Page() {
  return (
    <PrivateRoute roles={['admin']}>
      <AdminUsers />
    </PrivateRoute>
  );
}
