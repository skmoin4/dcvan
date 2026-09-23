'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import LocationPicker from './LocationPicker';

const initialForm = {
  customer_name: '',
  mobile_number: '',
  location: '',
  location_source: 'manual',
  location_lat: null,
  location_lng: null,
  problem_description: '',
  preferred_datetime: '',
  website: '',
};

const EnquiryForm = ({ compact = false }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleLocationSelect = (location) => {
    if (location) {
      setForm((prev) => ({
        ...prev,
        location: location.address,
        location_source: location.source || 'manual',
        location_lat: location.lat,
        location_lng: location.lng,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      location: '',
      location_source: 'manual',
      location_lat: null,
      location_lng: null,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post('/enquiries/public', form);
      toast.success('Enquiry received. Team will call shortly.');
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={compact ? '' : 'rounded-2xl bg-white p-5 shadow-lift sm:p-6'}>
      <input type="text" name="website" value={form.website} onChange={update} className="hidden" tabIndex="-1" autoComplete="off" />
      {!compact && (
        <div className="mb-4">
          <p className="eyebrow">Request a callback</p>
          <h3 className="mt-1 text-xl font-black text-navy-900">Get a free service estimate</h3>
        </div>
      )}
      <div className="space-y-5">
        <div>
          <label className="label" htmlFor="customer_name">Your name</label>
          <input required id="customer_name" className="input-field" name="customer_name" value={form.customer_name} onChange={update} placeholder="e.g. Ramesh Kumar" />
        </div>

        <div>
          <label className="label" htmlFor="mobile_number">Mobile number</label>
          <input
            required
            id="mobile_number"
            className="input-field"
            name="mobile_number"
            value={form.mobile_number}
            onChange={update}
            placeholder="10-digit mobile number"
            pattern="[6-9][0-9]{9}"
            maxLength={10}
          />
        </div>

        <div>
          <label className="label">Service location</label>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={
              form.location ? { address: form.location, lat: form.location_lat, lng: form.location_lng } : null
            }
            placeholder="Click on map to select service location"
            height={compact ? '260px' : '280px'}
            showCoordinates={!compact}
          />
          <input type="hidden" name="location" value={form.location} />
        </div>

        <div>
          <label className="label" htmlFor="problem_description">Describe the issue (optional)</label>
          <textarea
            id="problem_description"
            className="input-field min-h-20 resize-none"
            name="problem_description"
            value={form.problem_description}
            onChange={update}
            placeholder="Drainage blockage, septic tank cleaning, overflow, industrial waste, etc."
          />
        </div>

        <div>
          <label className="label" htmlFor="preferred_datetime">Preferred date &amp; time (optional)</label>
          <input id="preferred_datetime" className="input-field" type="datetime-local" name="preferred_datetime" value={form.preferred_datetime} onChange={update} />
        </div>

        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Submitting...' : 'Request Cleaning Service'}
          {!loading && <ArrowRightIcon className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
};

export default EnquiryForm;
