import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { MapPinIcon, ClockIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';

const editableStatuses = ['new', 'contacted', 'not_reachable', 'rescheduled', 'quoted', 'cancelled'];
const lockedStatuses = ['confirmed', 'assigned', 'completed'];
const allStatuses = ['new', 'contacted', 'not_reachable', 'rescheduled', 'quoted', 'confirmed', 'assigned', 'completed', 'cancelled'];

const emptyStatusForm = {
  status: '',
  notes: '',
  follow_up_at: '',
  quoted_amount: '',
};

const Modal = ({ children, onClose, wide }) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
    <div className={`w-full animate-fade-up rounded-2xl bg-white p-6 shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-lg'}`}>{children}</div>
  </div>
);

const AdminBookings = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState({ scheduled_at: '', estimated_amount: '', notes: '' });
  const [statusModal, setStatusModal] = useState({ enquiry: null, form: emptyStatusForm });
  const [timeline, setTimeline] = useState({ enquiry: null, logs: [] });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = () => {
    setLoading(true);
    return api.get('/enquiries').then((res) => setEnquiries(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openStatusModal = (enquiry, status) => {
    if (status === enquiry.status) return;
    setStatusModal({
      enquiry,
      form: {
        ...emptyStatusForm,
        status,
        quoted_amount: enquiry.quoted_amount || '',
      },
    });
  };

  const updateStatus = async (event) => {
    event.preventDefault();
    const { enquiry, form } = statusModal;
    if (!form.notes.trim()) {
      toast.error('Reason/call note is required.');
      return;
    }
    if (form.status === 'rescheduled' && !form.follow_up_at) {
      toast.error('Follow-up date/time is required for reschedule.');
      return;
    }
    if (form.status === 'quoted' && !form.quoted_amount) {
      toast.error('Quoted amount is required.');
      return;
    }

    const callStatus = form.status === 'not_reachable' ? 'not_received' : ['contacted', 'rescheduled', 'quoted'].includes(form.status) ? 'received' : enquiry.call_status;
    try {
      await api.patch(`/enquiries/${enquiry.id}`, {
        status: form.status,
        notes: form.notes,
        call_status: callStatus,
        follow_up_at: form.follow_up_at || null,
        quoted_amount: form.quoted_amount || null,
      });
      toast.success('Enquiry updated with reason.');
      setStatusModal({ enquiry: null, form: emptyStatusForm });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update enquiry.');
    }
  };

  const openTimeline = async (enquiry) => {
    const res = await api.get(`/enquiries/${enquiry.id}`);
    setTimeline({ enquiry, logs: res.data.data.activity_logs || [] });
  };

  const convert = async (event) => {
    event.preventDefault();
    try {
      await api.post('/bookings/convert', { ...booking, enquiry_id: selected.id });
      toast.success('Booking confirmed.');
      setSelected(null);
      setBooking({ scheduled_at: '', estimated_amount: '', notes: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking conversion failed.');
    }
  };

  const canConvert = (enquiry) => !enquiry.booking_exists && ['quoted', 'confirmed'].includes(enquiry.status);
  const isLocked = (enquiry) => enquiry.booking_exists || lockedStatuses.includes(enquiry.status);

  const filteredEnquiries = useMemo(() => {
    const term = search.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
      const matchesTerm = !term
        || enquiry.customer_name?.toLowerCase().includes(term)
        || enquiry.mobile_number?.toLowerCase().includes(term)
        || enquiry.enquiry_number?.toLowerCase().includes(term)
        || enquiry.location?.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [enquiries, search, statusFilter]);

  return (
    <main className="section py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">CRM</p>
          <h1 className="mt-1 text-3xl font-black text-navy-900">Enquiry Pipeline</h1>
          <p className="mt-2 text-slate-500">Every status change needs a reason. Converted enquiries are locked and move to booking/task flow.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input-field w-full pl-9 sm:w-64"
              placeholder="Search name, phone, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {allStatuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr><th>Enquiry</th><th>Customer</th><th>Location</th><th>Preferred</th><th>Status</th><th>Workflow</th></tr>
            </thead>
            <tbody>
              {loading && [1, 2, 3, 4].map((n) => (
                <tr key={n}><td colSpan={6}><div className="skeleton h-10 w-full" /></td></tr>
              ))}
              {!loading && filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="align-top">
                  <td className="font-bold text-navy-900">
                    {enquiry.enquiry_number}
                    <p className="mt-0.5 font-normal text-slate-400">{new Date(enquiry.created_at).toLocaleString()}</p>
                  </td>
                  <td><strong className="text-navy-900">{enquiry.customer_name}</strong><p className="text-slate-500">{enquiry.mobile_number}</p></td>
                  <td className="max-w-xs">
                    {enquiry.location}
                    {enquiry.location_lat && enquiry.location_lng && (
                      <a className="mt-1 flex items-center gap-1 text-xs font-bold text-navy-600 hover:text-flame-600" href={`https://www.google.com/maps/search/?api=1&query=${enquiry.location_lat},${enquiry.location_lng}`} target="_blank" rel="noreferrer">
                        <MapPinIcon className="h-3.5 w-3.5" /> Open Map
                      </a>
                    )}
                    <p className="mt-1 text-slate-500">{enquiry.problem_description}</p>
                  </td>
                  <td className="text-slate-600">{enquiry.preferred_datetime ? new Date(enquiry.preferred_datetime).toLocaleString() : 'Flexible'}</td>
                  <td><StatusBadge status={enquiry.status} /></td>
                  <td className="min-w-64">
                    {isLocked(enquiry) ? (
                      <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">Locked after booking conversion</div>
                    ) : (
                      <select className="input-field mb-2" value={enquiry.status} onChange={(e) => openStatusModal(enquiry, e.target.value)}>
                        {editableStatuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                      </select>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {canConvert(enquiry) && (
                        <button onClick={() => setSelected(enquiry)} className="btn-primary btn-sm">Convert</button>
                      )}
                      <button onClick={() => openTimeline(enquiry)} className="btn-outline btn-sm">Timeline</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !filteredEnquiries.length && (
                <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-400">{enquiries.length ? 'No enquiries match your search.' : 'No enquiries yet.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {statusModal.enquiry && (
        <Modal onClose={() => setStatusModal({ enquiry: null, form: emptyStatusForm })}>
          <form onSubmit={updateStatus}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-navy-900">Update Enquiry Status</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {statusModal.enquiry.enquiry_number} to <strong className="text-navy-900">{statusModal.form.status.replaceAll('_', ' ')}</strong>
                </p>
              </div>
              <button type="button" onClick={() => setStatusModal({ enquiry: null, form: emptyStatusForm })} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {statusModal.form.status === 'rescheduled' && (
              <>
                <label className="label mt-5">Follow-up date/time</label>
                <input required type="datetime-local" className="input-field" value={statusModal.form.follow_up_at} onChange={(e) => setStatusModal((current) => ({ ...current, form: { ...current.form, follow_up_at: e.target.value } }))} />
              </>
            )}

            {statusModal.form.status === 'quoted' && (
              <>
                <label className="label mt-5">Quoted amount</label>
                <input required type="number" min="0" className="input-field" value={statusModal.form.quoted_amount} onChange={(e) => setStatusModal((current) => ({ ...current, form: { ...current.form, quoted_amount: e.target.value } }))} />
              </>
            )}

            <label className="label mt-5">Reason / call note</label>
            <textarea
              required
              rows="4"
              className="input-field"
              placeholder="Example: customer requested tomorrow morning, call not received, quoted 2500 after discussion..."
              value={statusModal.form.notes}
              onChange={(e) => setStatusModal((current) => ({ ...current, form: { ...current.form, notes: e.target.value } }))}
            />
            <div className="mt-6 flex gap-3">
              <button className="btn-primary flex-1">Save</button>
              <button type="button" onClick={() => setStatusModal({ enquiry: null, form: emptyStatusForm })} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <form onSubmit={convert}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-navy-900">Confirm Booking</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.customer_name} &middot; {selected.mobile_number}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <label className="label mt-5">Scheduled date/time</label>
            <input required type="datetime-local" className="input-field" value={booking.scheduled_at} onChange={(e) => setBooking({ ...booking, scheduled_at: e.target.value })} />
            <label className="label mt-4">Estimated amount</label>
            <input required type="number" min="0" className="input-field" value={booking.estimated_amount} onChange={(e) => setBooking({ ...booking, estimated_amount: e.target.value })} />
            <label className="label mt-4">Booking note</label>
            <textarea required className="input-field" value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} />
            <div className="mt-6 flex gap-3">
              <button className="btn-primary flex-1">Confirm</button>
              <button type="button" onClick={() => setSelected(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {timeline.enquiry && (
        <Modal onClose={() => setTimeline({ enquiry: null, logs: [] })} wide>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-navy-900">Timeline</h2>
              <p className="text-sm text-slate-500">{timeline.enquiry.enquiry_number}</p>
            </div>
            <button onClick={() => setTimeline({ enquiry: null, logs: [] })} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5 max-h-[65vh] space-y-3 overflow-y-auto pr-1">
            {timeline.logs.map((log) => (
              <div key={log.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-navy-900">{log.action.replaceAll('_', ' ')}</strong>
                  <span className="flex items-center gap-1 text-xs text-slate-400"><ClockIcon className="h-3.5 w-3.5" /> {new Date(log.created_at).toLocaleString()}</span>
                </div>
                {(log.from_status || log.to_status) && <p className="mt-1 text-sm text-slate-600">{log.from_status || '-'} to {log.to_status || '-'}</p>}
                {log.notes && <p className="mt-2 text-sm text-slate-700">{log.notes}</p>}
                {log.created_by_name && <p className="mt-2 text-xs font-semibold text-slate-400">By {log.created_by_name}</p>}
              </div>
            ))}
            {!timeline.logs.length && <p className="text-sm text-slate-400">No timeline yet.</p>}
          </div>
        </Modal>
      )}
    </main>
  );
};

export default AdminBookings;
