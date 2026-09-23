import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AssignModal = ({ booking, onClose, onSuccess }) => {
  const [vans, setVans] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    van_id: '',
    driver_id: '',
    scheduled_date: booking.preferred_date || '',
    scheduled_time: '09:00',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/vans?status=available'),
      api.get('/users?role=driver'),
    ]).then(([vRes, dRes]) => {
      setVans(vRes.data.data);
      setDrivers(dRes.data.data);
    }).catch(() => toast.error('Failed to load vans/drivers.'))
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.van_id || !form.driver_id) { toast.error('Select van and driver.'); return; }
    setLoading(true);
    try {
      await api.post('/assignments', { booking_id: booking.id, ...form });
      toast.success('Assignment created successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign.');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">Assign Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mb-5 text-sm text-blue-800">
          <p className="font-semibold">{booking.booking_number}</p>
          <p className="text-blue-600">{booking.address}, {booking.city}</p>
          <p>Customer: {booking.customer_name} | {booking.service_type}</p>
        </div>

        {fetching ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Select Van *</label>
              <select
                className="input-field"
                value={form.van_id}
                onChange={e => set('van_id', e.target.value)}
              >
                <option value="">-- Choose Van --</option>
                {vans.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.registration_number} – {v.model} ({v.capacity_liters}L)
                  </option>
                ))}
              </select>
              {vans.length === 0 && <p className="text-red-500 text-xs mt-1">No available vans</p>}
            </div>

            <div>
              <label className="label">Select Driver *</label>
              <select
                className="input-field"
                value={form.driver_id}
                onChange={e => set('driver_id', e.target.value)}
              >
                <option value="">-- Choose Driver --</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} – {d.phone}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Scheduled Date *</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.scheduled_date}
                  onChange={e => set('scheduled_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="label">Scheduled Time *</label>
                <input
                  type="time"
                  className="input-field"
                  value={form.scheduled_time}
                  onChange={e => set('scheduled_time', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignModal;
