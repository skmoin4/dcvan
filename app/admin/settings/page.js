'use client';

import PrivateRoute from '../../../src/components/common/PrivateRoute';
import AdminSettings from '../../../src/views/AdminSettings';

export default function Page() {
  return (
    <PrivateRoute roles={['admin']}>
      <AdminSettings />
    </PrivateRoute>
  );
}
