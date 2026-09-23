'use client';

import PrivateRoute from '../../../src/components/common/PrivateRoute';
import AdminAssignments from '../../../src/views/AdminAssignments';

export default function Page() {
  return (
    <PrivateRoute roles={['admin', 'executive']}>
      <AdminAssignments />
    </PrivateRoute>
  );
}
