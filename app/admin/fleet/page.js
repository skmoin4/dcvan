'use client';

import PrivateRoute from '../../../src/components/common/PrivateRoute';
import AdminVans from '../../../src/views/AdminVans';

export default function Page() {
  return (
    <PrivateRoute roles={['admin', 'executive']}>
      <AdminVans />
    </PrivateRoute>
  );
}
