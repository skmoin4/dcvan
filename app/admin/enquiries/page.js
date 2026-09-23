'use client';

import PrivateRoute from '../../../src/components/common/PrivateRoute';
import AdminBookings from '../../../src/views/AdminBookings';

export default function Page() {
  return (
    <PrivateRoute roles={['admin', 'executive']}>
      <AdminBookings />
    </PrivateRoute>
  );
}
