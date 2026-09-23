import React from 'react';

const styles = {
  new: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
  contacted: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  not_reachable: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  rescheduled: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200',
  quoted: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200',
  confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  assigned: 'bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200',
  in_progress: 'bg-flame-50 text-flame-700 ring-1 ring-inset ring-flame-200',
  completed: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200',
  cancelled: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  available: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  in_service: 'bg-flame-50 text-flame-700 ring-1 ring-inset ring-flame-200',
  on_job: 'bg-flame-50 text-flame-700 ring-1 ring-inset ring-flame-200',
  maintenance: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  inactive: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
};

const dotStyles = {
  new: 'bg-sky-500', contacted: 'bg-blue-500', not_reachable: 'bg-amber-500', rescheduled: 'bg-violet-500',
  quoted: 'bg-indigo-500', confirmed: 'bg-emerald-500', assigned: 'bg-cyan-500', in_progress: 'bg-flame-500',
  completed: 'bg-green-500', cancelled: 'bg-red-500', available: 'bg-emerald-500', in_service: 'bg-flame-500',
  on_job: 'bg-flame-500', maintenance: 'bg-amber-500', inactive: 'bg-slate-400',
};

const label = (value) => String(value || '').replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const StatusBadge = ({ status }) => (
  <span className={`badge gap-1.5 ${styles[status] || 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status] || 'bg-slate-400'}`} />
    {label(status)}
  </span>
);

export default StatusBadge;
