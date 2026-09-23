import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const AdminSettings = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then((res) => setWhatsappNumber(res.data.data.whatsapp_notify_number || ''))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.patch('/settings', { whatsapp_notify_number: whatsappNumber });
      toast.success('Settings saved.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="section py-8">
      <div className="mb-6">
        <p className="eyebrow">Configuration</p>
        <h1 className="mt-1 text-3xl font-black text-navy-900">Settings</h1>
        <p className="mt-2 text-slate-500">Manage where WhatsApp notifications for new enquiries are sent.</p>
      </div>

      <div className="panel max-w-lg p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-white">
            <Cog6ToothIcon className="h-5 w-5" />
          </span>
          <h2 className="font-black text-navy-900">WhatsApp Notifications</h2>
        </div>

        {loading ? (
          <div className="skeleton mt-5 h-10 w-full" />
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="whatsapp_notify_number">Admin WhatsApp number</label>
              <input
                required
                id="whatsapp_notify_number"
                className="input-field"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 919999999999"
              />
              <p className="mt-1 text-xs text-slate-400">Every new enquiry submitted on the website will be sent to this number via WhatsApp.</p>
            </div>
            <button disabled={saving} className="btn-primary w-fit">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default AdminSettings;
