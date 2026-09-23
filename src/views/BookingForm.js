import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import toast from 'react-hot-toast';

const SERVICE_TYPES = [
  { value: 'residential', label: 'Residential', desc: 'Houses & apartments', icon: '🏠' },
  { value: 'commercial', label: 'Commercial', desc: 'Offices & shops', icon: '🏢' },
  { value: 'industrial', label: 'Industrial', desc: 'Factories & warehouses', icon: '🏭' },
  { value: 'emergency', label: 'Emergency', desc: '24/7 urgent service', icon: '🚨' },
];

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning', time: '6:00 AM – 12:00 PM' },
  { value: 'afternoon', label: 'Afternoon', time: '12:00 PM – 5:00 PM' },
  { value: 'evening', label: 'Evening', time: '5:00 PM – 9:00 PM' },
];

const BookingForm = () => {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    service_type: 'residential',
    address: '',
    city: '',
    pincode: '',
    preferred_date: '',
    preferred_time_slot: 'morning',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    if (!form.preferred_date) e.preferred_date = 'Please select a date';
    else if (form.preferred_date < today) e.preferred_date = 'Date cannot be in the past';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post('/bookings', form);
      toast.success(`Booking ${res.data.data.booking_number} created successfully!`);
      router.push('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Book Sewage Cleaning</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to schedule your service</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Type */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Service Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SERVICE_TYPES.map(s => (
              <button
                type="button"
                key={s.value}
                onClick={() => set('service_type', s.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.service_type === s.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-medium text-sm">{s.label}</div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Location Details</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Full Address *</label>
              <textarea
                rows={3}
                className={`input-field resize-none text-gray-900 ${errors.address ? 'border-red-500' : ''}`}
                placeholder="House/Flat No, Street, Landmark"
                value={form.address}
                onChange={e => set('address', e.target.value)}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City *</label>
                <input
                  type="text"
                  className={`input-field text-gray-900 ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="Nagpur"
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="label">Pincode *</label>
                <input
                  type="text"
                  maxLength={6}
                  className={`input-field text-gray-900 ${errors.pincode ? 'border-red-500' : ''}`}
                  placeholder="440001"
                  value={form.pincode}
                  onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))}
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferred Schedule</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Preferred Date *</label>
              <input
                type="date"
                min={today}
                className={`input-field text-gray-900 ${errors.preferred_date ? 'border-red-500' : ''}`}
                value={form.preferred_date}
                onChange={e => set('preferred_date', e.target.value)}
              />
              {errors.preferred_date && <p className="text-red-500 text-xs mt-1">{errors.preferred_date}</p>}
            </div>

            <div>
              <label className="label">Preferred Time Slot</label>
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map(t => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => set('preferred_time_slot', t.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      form.preferred_time_slot === t.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{t.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{t.time}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h2>
          <div>
            <label className="label">Problem Description (Optional)</label>
            <textarea
              rows={4}
              className="input-field resize-none text-gray-900"
              placeholder="Describe the issue (e.g., blocked drain, overflow, regular cleaning...)"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary px-8" disabled={loading}>
            {loading ? (
              <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Booking...</>
            ) : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
