import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LockClosedIcon, ShieldCheckIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const highlights = [
  [ShieldCheckIcon, 'Secure role-based access for admins, executives, and drivers'],
  [ClockIcon, 'Live enquiry, booking, and task tracking in real time'],
  [TruckIcon, 'Fleet and driver assignment from a single dashboard'],
];

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const fromPath = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('from') || '';
  }, []);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back.');
      router.replace(fromPath || (user.role === 'driver' ? '/driver' : '/admin'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:32px_32px] opacity-40" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 animate-float rounded-full bg-flame-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-96 w-96 rounded-full bg-navy-500/30 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Image
            className="h-14 w-auto shrink-0 self-start rounded-lg bg-white px-2 py-1.5"
            src="/brand-assets/logo.png"
            alt="Swaraj Infra Services"
            width={112}
            height={112}
          />
          <div>
            <p className="eyebrow text-flame-400">Operations console</p>
            <h1 className="mt-3 max-w-md text-4xl font-black leading-tight text-white">
              Run drainage, septic, and industrial cleaning operations from one place.
            </h1>
            <div className="mt-10 space-y-4">
              {highlights.map(([Icon, text]) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-flame-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-1.5 text-sm font-semibold text-blue-100/80">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-blue-100/40">&copy; 2026 Swaraj Infra Services</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm">
          <Image
            className="mb-8 h-12 w-auto lg:hidden"
            src="/brand-assets/logo.png"
            alt="Swaraj Infra Services"
            width={112}
            height={112}
          />
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-900 text-white shadow-lift">
            <LockClosedIcon className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-navy-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-500">For admin and operations executives only. Customers submit enquiries without login.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                className="input-field"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input-field"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button disabled={loading} className="btn-secondary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
