import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { XMarkIcon, PhotoIcon, MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';

const AdminAssignments = () => {
  const [tasks, setTasks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ booking_id: '', driver_id: '', van_id: '', scheduled_at: '', driver_notes: '' });
  const [statusModal, setStatusModal] = useState({ isOpen: false, task: null, newStatus: '', notes: '' });
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tasks;
    return tasks.filter((task) =>
      task.task_number?.toLowerCase().includes(term)
      || task.customer_name?.toLowerCase().includes(term)
      || task.driver_name?.toLowerCase().includes(term)
      || task.registration_number?.toLowerCase().includes(term)
    );
  }, [tasks, search]);

  const load = async () => {
    setLoading(true);
    const [taskRes, bookingRes, driverRes, vanRes] = await Promise.all([
      api.get('/tasks'), api.get('/bookings'), api.get('/drivers'), api.get('/vans'),
    ]);
    setTasks(taskRes.data.data);
    setBookings(bookingRes.data.data.filter((booking) => !booking.task_id && booking.status !== 'completed'));
    setDrivers(driverRes.data.data);
    setVans(vanRes.data.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const assign = async (event) => {
    event.preventDefault();
    await api.post('/tasks', form);
    toast.success('Task assigned.');
    setForm({ booking_id: '', driver_id: '', van_id: '', scheduled_at: '', driver_notes: '' });
    load();
  };

  const openStatusModal = (task, newStatus) => {
    if (newStatus === task.status) return;
    setStatusModal({ isOpen: true, task, newStatus, notes: '' });
  };

  const confirmStatusUpdate = async () => {
    const { task, newStatus, notes } = statusModal;
    const updateData = { status: newStatus };
    if (newStatus === 'completed' && notes) updateData.completion_notes = notes;
    if (newStatus === 'cancelled' && notes) updateData.completion_notes = notes;

    await api.patch(`/tasks/${task.id}`, updateData);
    toast.success('Task updated.');
    setStatusModal({ isOpen: false, task: null, newStatus: '', notes: '' });
    load();
  };

  const updateTask = (task, status) => openStatusModal(task, status);

  return (
    <main className="section py-8">
      <div className="mb-6">
        <p className="eyebrow">Dispatch</p>
        <h1 className="mt-1 text-3xl font-black text-navy-900">Task Assignment</h1>
        <p className="mt-2 text-slate-500">Assign a van and driver to a confirmed booking, then track job status.</p>
      </div>

      <form onSubmit={assign} className="panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <PlusCircleIcon className="h-5 w-5 text-flame-500" />
          <h2 className="font-black text-navy-900">Assign New Task</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          <div>
            <label className="label">Booking</label>
            <select required className="input-field" value={form.booking_id} onChange={(e) => setForm({ ...form, booking_id: e.target.value })}>
              <option value="">Select booking</option>
              {bookings.map((booking) => <option key={booking.id} value={booking.id}>{booking.booking_number} - {booking.customer_name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Driver</label>
            <select required className="input-field" value={form.driver_id} onChange={(e) => setForm({ ...form, driver_id: e.target.value })}>
              <option value="">Select driver</option>
              {drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name} ({driver.status})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Van</label>
            <select required className="input-field" value={form.van_id} onChange={(e) => setForm({ ...form, van_id: e.target.value })}>
              <option value="">Select van</option>
              {vans.map((van) => <option key={van.id} value={van.id}>{van.registration_number} ({van.status})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Scheduled at</label>
            <input required type="datetime-local" className="input-field" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} />
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full">Assign</button>
          </div>
        </div>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-black text-navy-900">All Tasks</h2>
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field w-full pl-9 sm:w-64"
            placeholder="Search task, customer, driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="panel mt-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead><tr><th>Task</th><th>Customer</th><th>Driver</th><th>Van</th><th>Scheduled</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {loading && [1, 2, 3].map((n) => (
                <tr key={n}><td colSpan={7}><div className="skeleton h-10 w-full" /></td></tr>
              ))}
              {!loading && filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="font-bold text-navy-900">{task.task_number}</td>
                  <td>
                    <span className="text-slate-700">{task.customer_name}</span><p className="text-slate-400">{task.service_location}</p>
                    {!!task.photos?.length && <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700"><PhotoIcon className="h-3.5 w-3.5" /> {task.photos.length} completion photo(s)</p>}
                  </td>
                  <td className="text-slate-600">{task.driver_name}</td>
                  <td className="text-slate-600">{task.registration_number}</td>
                  <td className="text-slate-600">{new Date(task.scheduled_at).toLocaleString()}</td>
                  <td><StatusBadge status={task.status} /></td>
                  <td>
                    <select
                      className="input-field"
                      value={task.status}
                      onChange={(e) => updateTask(task, e.target.value)}
                    >
                      {['assigned', 'in_progress', 'completed', 'cancelled'].map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {!loading && !filteredTasks.length && (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-400">{tasks.length ? 'No tasks match your search.' : 'No tasks yet.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!!tasks.filter((task) => task.photos?.length).length && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.filter((task) => task.photos?.length).map((task) => (
            <section key={`photos-${task.id}`} className="card">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-black text-navy-900">{task.task_number}</h2>
                  <p className="text-sm text-slate-500">{task.customer_name}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {task.photos.map((photo) => (
                  <a key={photo.id} href={photo.photo_data} target="_blank" rel="noreferrer">
                    <img src={photo.photo_data} alt={photo.caption || 'Completion'} className="aspect-square rounded-lg object-cover" />
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {statusModal.isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-fade-up rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-black text-navy-900">Update Task Status</h2>
              <button onClick={() => setStatusModal({ isOpen: false, task: null, newStatus: '', notes: '' })} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {statusModal.task?.task_number} - Change to: <strong className="text-navy-900">{statusModal.newStatus.replaceAll('_', ' ')}</strong>
            </p>

            {(statusModal.newStatus === 'completed' || statusModal.newStatus === 'cancelled') && (
              <>
                <label className="label mt-5">Notes/Comments</label>
                <textarea
                  className="input-field"
                  rows="4"
                  placeholder={statusModal.newStatus === 'completed' ? 'Add completion notes...' : 'Add cancellation reason...'}
                  value={statusModal.notes}
                  onChange={(e) => setStatusModal({ ...statusModal, notes: e.target.value })}
                />
              </>
            )}

            <div className="mt-6 flex gap-3">
              <button onClick={confirmStatusUpdate} className="btn-primary flex-1">Confirm</button>
              <button type="button" onClick={() => setStatusModal({ isOpen: false, task: null, newStatus: '', notes: '' })} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminAssignments;
