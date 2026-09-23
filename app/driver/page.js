'use client';

import PrivateRoute from '../../src/components/common/PrivateRoute';
import DriverDashboard from '../../src/views/DriverDashboard';

export default function Page() {
  return (
    <PrivateRoute roles={['driver']}>
      <DriverDashboard />
    </PrivateRoute>
  );
}
