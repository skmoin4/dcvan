import React from 'react';
import Link from 'next/link';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const Unauthorized = () => (
  <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
    <div className="text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
        <ShieldExclamationIcon className="h-9 w-9" />
      </span>
      <h1 className="mt-5 text-3xl font-black text-navy-900">Access Denied</h1>
      <p className="mt-2 text-slate-500">You don&apos;t have permission to view this page.</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">Go Home</Link>
    </div>
  </div>
);

export default Unauthorized;
