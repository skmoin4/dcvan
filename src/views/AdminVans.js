import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { TruckIcon, UserGroupIcon, PlusIcon, XMarkIcon, PhoneIcon, IdentificationIcon, CheckBadgeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

const vanStatuses = ['available', 'assigned', 'maintenance', 'inactive'];
const emptyVanForm = { registration_number: '', model: '', capacity_liters: '', notes: '' };
const emptyDriverForm = { name: '', phone: '', email: '', password: '', license_number: '' };

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
    <div className="w-full max-w-md animate-fade-up rounded-2xl bg-white p-6 shadow-2xl">{children}</div>
  </div>
);

const StatPill = ({ label, value, color }) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5">
    <span className={`h-2 w-2 rounded-full ${color}`} />
    <span className="text-lg font-black text-navy-900">{value}</span>
    <span className="text-xs font-bold text-slate-500">{label}</span>
  </div>
);

const AdminVans = () => {
  const { user } = useAuth();
  const [vans, setVans] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverForm, setDriverForm] = useState(emptyDriverForm);
  const [vanForm, setVanForm] = useState(emptyVanForm);
  const [vanModalOpen, setVanModalOpen] = useState(false);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [creatingVan, setCreatingVan] = useState(false);
  const [creatingDriver, setCreatingDriver] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/vans'), api.get('/drivers')]).then(([vanRes, driverRes]) => {
      setVans(vanRes.data.data);
      setDrivers(driverRes.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const vanStats = useMemo(() => ({
    total: vans.length,
    available: vans.filter((v) => v.status === 'available').length,
    maintenance: vans.filter((v) => v.status === 'maintenance').length,
  }), [vans]);

  const driverStats = useMemo(() => ({
    total: drivers.length,
    available: drivers.filter((d) => d.status === 'available').length,
  }), [drivers]);

  const createDriver = async (event) => {
    event.preventDefault();
    setCreatingDriver(true);
    try {
      await api.post('/drivers', driverForm);
      toast.success('Driver account created.');
      setDriverForm(emptyDriverForm);
      setDriverModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create driver.');
    } finally {
      setCreatingDriver(false);
    }
  };

  const createVan = async (event) => {
    event.preventDefault();
    setCreatingVan(true);
    try {
      await api.post('/vans', vanForm);
      toast.success('Van added to fleet.');
      setVanForm(emptyVanForm);
      setVanModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add van.');
    } finally {
      setCreatingVan(false);
    }
  };

  const updateVanStatus = async (van, status) => {
    if (status === van.status) return;
    try {
      await api.patch(`/vans/${van.id}`, { status });
      toast.success('Van status updated.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update van.');
    }
  };

  return (
    <main className="section py-8">
      <div className="mb-6">
        <p className="eyebrow">Fleet</p>
        <h1 className="mt-1 text-3xl font-black text-navy-900">Fleet &amp; Drivers</h1>
        <p className="mt-2 text-slate-500">Manage vans and driver accounts used for job assignment.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900 text-white"><TruckIcon className="h-5 w-5" /></span>
              <h2 className="font-black text-navy-900">Vans</h2>
            </div>
            {user?.role === 'admin' && (
              <button onClick={() => setVanModalOpen(true)} className="btn-primary btn-sm">
                <PlusIcon className="h-4 w-4" /> Add Van
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatPill label="Total" value={vanStats.total} color="bg-navy-900" />
            <StatPill label="Available" value={vanStats.available} color="bg-emerald-500" />
            <StatPill label="Maintenance" value={vanStats.maintenance} color="bg-amber-500" />
          </div>

          <div className="mt-4 space-y-2.5">
            {loading && [1, 2, 3].map((n) => <div key={n} className="skeleton h-16 w-full" />)}
            {!loading && vans.map((van) => (
              <div key={van.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:border-slate-200 hover:bg-slate-50/60">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-navy-700">
                    <TruckIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <strong className="text-navy-900">{van.registration_number}</strong>
                    <p className="text-sm text-slate-500">{van.model} &middot; {van.capacity_liters} L</p>
                  </div>
                </div>
                {user?.role === 'admin' ? (
                  <select className="input-field w-auto shrink-0" value={van.status} onChange={(e) => updateVanStatus(van, e.target.value)}>
                    {vanStatuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                  </select>
                ) : <StatusBadge status={van.status} />}
              </div>
            ))}
            {!loading && !vans.length && (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                No vans added yet.
              </div>
            )}
          </div>
        </section>

        <section className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900 text-white"><UserGroupIcon className="h-5 w-5" /></span>
              <h2 className="font-black text-navy-900">Drivers</h2>
            </div>
            {user?.role === 'admin' && (
              <button onClick={() => setDriverModalOpen(true)} className="btn-primary btn-sm">
                <PlusIcon className="h-4 w-4" /> Add Driver
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatPill label="Total" value={driverStats.total} color="bg-navy-900" />
            <StatPill label="Available" value={driverStats.available} color="bg-emerald-500" />
          </div>

          <div className="mt-4 space-y-2.5">
            {loading && [1, 2, 3].map((n) => <div key={n} className="skeleton h-16 w-full" />)}
            {!loading && drivers.map((driver) => (
              <div key={driver.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:border-slate-200 hover:bg-slate-50/60">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-black text-white">
                    {driver.name?.slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <strong className="text-navy-900">{driver.name}</strong>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><PhoneIcon className="h-3 w-3" /> {driver.phone}</span>
                      <span className="inline-flex items-center gap-1"><IdentificationIcon className="h-3 w-3" /> {driver.license_number || 'No license'}</span>
                    </p>
                  </div>
                </div>
                <StatusBadge status={driver.status} />
              </div>
            ))}
            {!loading && !drivers.length && (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                No drivers added yet.
              </div>
            )}
          </div>
        </section>
      </div>

      {vanModalOpen && (
        <Modal onClose={() => setVanModalOpen(false)}>
          <form onSubmit={createVan}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-white"><WrenchScrewdriverIcon className="h-5 w-5" /></span>
                <h2 className="text-xl font-black text-navy-900">Add Van</h2>
              </div>
              <button type="button" onClick={() => setVanModalOpen(false)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <div>
                <label className="label">Registration number</label>
                <input required className="input-field" value={vanForm.registration_number} onChange={(e) => setVanForm({ ...vanForm, registration_number: e.target.value })} />
              </div>
              <div>
                <label className="label">Model</label>
                <input required className="input-field" value={vanForm.model} onChange={(e) => setVanForm({ ...vanForm, model: e.target.value })} />
              </div>
              <div>
                <label className="label">Capacity (liters)</label>
                <input type="number" min="0" className="input-field" value={vanForm.capacity_liters} onChange={(e) => setVanForm({ ...vanForm, capacity_liters: e.target.value })} />
              </div>
              <div>
                <label className="label">Notes</label>
                <input className="input-field" value={vanForm.notes} onChange={(e) => setVanForm({ ...vanForm, notes: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button disabled={creatingVan} className="btn-primary flex-1">{creatingVan ? 'Adding...' : 'Add Van'}</button>
              <button type="button" onClick={() => setVanModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {driverModalOpen && (
        <Modal onClose={() => setDriverModalOpen(false)}>
          <form onSubmit={createDriver}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-white"><CheckBadgeIcon className="h-5 w-5" /></span>
                <h2 className="text-xl font-black text-navy-900">Create Driver Account</h2>
              </div>
              <button type="button" onClick={() => setDriverModalOpen(false)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <div>
                <label className="label">Driver name</label>
                <input required className="input-field" value={driverForm.name} onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input required className="input-field" value={driverForm.phone} onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="label">Login email</label>
                <input required type="email" className="input-field" value={driverForm.email} onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Login password</label>
                <input required type="password" className="input-field" value={driverForm.password} onChange={(e) => setDriverForm({ ...driverForm, password: e.target.value })} />
              </div>
              <div>
                <label className="label">License number</label>
                <input className="input-field" value={driverForm.license_number} onChange={(e) => setDriverForm({ ...driverForm, license_number: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button disabled={creatingDriver} className="btn-primary flex-1">{creatingDriver ? 'Creating...' : 'Create Account'}</button>
              <button type="button" onClick={() => setDriverModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
};

export default AdminVans;
