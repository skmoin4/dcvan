import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  UsersIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';

const statCards = [
  ['total_enquiries', 'Total Enquiries', ClipboardDocumentListIcon, 'bg-navy-900'],
  ['todays_enquiries', 'Today', CalendarDaysIcon, 'bg-flame-500'],
  ['total_bookings', 'Bookings', BriefcaseIcon, 'bg-emerald-600'],
  ['conversion_rate', 'Conversion', ArrowTrendingUpIcon, 'bg-indigo-600', '%'],
  ['completed_jobs', 'Completed Jobs', CheckCircleIcon, 'bg-cyan-600'],
];

const quickLinks = [
  ['Enquiries', '/admin/enquiries', ClipboardDocumentListIcon, 'Follow up and convert leads'],
  ['Tasks', '/admin/tasks', ClipboardDocumentCheckIcon, 'Assign vans and drivers'],
  ['Fleet', '/admin/fleet', TruckIcon, 'Manage vans and drivers'],
  ['Users', '/admin/users', UsersIcon, 'Team access and roles'],
];

const DailyChart = ({ daily }) => {
  if (!daily?.length) return <p className="text-sm text-slate-400">No enquiry activity in the last 14 days.</p>;
  const max = Math.max(...daily.map((d) => d.enquiries), 1);
  return (
    <div className="flex h-40 items-end gap-1.5">
      {daily.map((d) => {
        const height = Math.max((d.enquiries / max) * 100, 4);
        const date = new Date(d.date);
        return (
          <div key={d.date} className="group relative flex flex-1 flex-col items-center justify-end">
            <span className="pointer-events-none absolute -top-7 hidden rounded-md bg-navy-900 px-2 py-1 text-[10px] font-bold text-white group-hover:block">
              {d.enquiries}
            </span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-navy-900 to-navy-600 transition-all duration-300 hover:from-flame-600 hover:to-flame-400"
              style={{ height: `${height}%` }}
            />
            <span className="mt-2 text-[10px] font-bold text-slate-400">{date.toLocaleDateString('en-IN', { day: 'numeric' })}</span>
          </div>
        );
      })}
    </div>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data.data)).finally(() => setLoading(false));
  }, []);

  const summary = data?.summary || {};
  const funnel = data?.funnel || [];
  const funnelMax = Math.max(...funnel.map((f) => f.count), 1);

  return (
    <main className="section py-8">
      <div className="mb-8">
        <p className="eyebrow">Overview</p>
        <h1 className="mt-1 text-3xl font-black text-navy-900">Operations Dashboard</h1>
        <p className="mt-2 text-slate-500">Enquiry funnel, conversion rate, bookings, and driver performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        {statCards.map(([key, label, Icon, color, suffix]) => (
          <div key={key} className="card-hover">
            <span className={`grid h-10 w-10 place-items-center rounded-xl text-white ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
            {loading ? (
              <div className="skeleton mt-2 h-8 w-16" />
            ) : (
              <p className="mt-1 text-3xl font-black text-navy-900">{summary[key] || 0}{suffix || ''}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(([label, href, Icon, text]) => (
          <Link key={href} href={href} className="group card-hover flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-navy-900 transition-colors group-hover:bg-flame-500 group-hover:text-white">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-black text-navy-900">{label}</p>
              <p className="truncate text-xs text-slate-500">{text}</p>
            </div>
            <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-flame-500" />
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <h2 className="font-black text-navy-900">Enquiries — last 14 days</h2>
          <div className="mt-5">
            {loading ? <div className="skeleton h-40 w-full" /> : <DailyChart daily={data?.daily} />}
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="font-black text-navy-900">Status Funnel</h2>
          <div className="mt-4 space-y-3">
            {loading && [1, 2, 3].map((n) => <div key={n} className="skeleton h-9 w-full" />)}
            {!loading && funnel.map((item) => (
              <div key={item.status}>
                <div className="mb-1 flex items-center justify-between">
                  <StatusBadge status={item.status} />
                  <strong className="text-sm text-navy-900">{item.count}</strong>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-navy-900" style={{ width: `${(item.count / funnelMax) * 100}%` }} />
                </div>
              </div>
            ))}
            {!loading && !funnel.length && <p className="text-sm text-slate-400">No data yet.</p>}
          </div>
        </section>
      </div>

      <div className="mt-6">
        <section className="panel p-5">
          <h2 className="font-black text-navy-900">Driver Performance</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="table-modern">
              <thead><tr><th>Driver</th><th>Status</th><th>Total Jobs</th><th>Completed</th><th>Completion Rate</th></tr></thead>
              <tbody>
                {loading && [1, 2, 3].map((n) => (
                  <tr key={n}><td colSpan={5}><div className="skeleton h-8 w-full" /></td></tr>
                ))}
                {!loading && (data?.drivers || []).map((driver) => {
                  const rate = driver.total_jobs ? Math.round((driver.completed_jobs / driver.total_jobs) * 100) : 0;
                  return (
                    <tr key={driver.id}>
                      <td className="font-bold text-navy-900">{driver.name}</td>
                      <td><StatusBadge status={driver.status} /></td>
                      <td>{driver.total_jobs}</td>
                      <td>{driver.completed_jobs || 0}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-500">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && !(data?.drivers || []).length && (
                  <tr><td colSpan={5} className="py-6 text-center text-sm text-slate-400">No drivers yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
