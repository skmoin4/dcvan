import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StarRating = ({ label, value, onChange }) => (
  <div>
    <label className="label">{label}</label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl transition-transform hover:scale-110 ${n <= value ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  </div>
);

const FeedbackModal = ({ booking, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    rating: 0,
    cleanliness_rating: 0,
    punctuality_rating: 0,
    professionalism_rating: 0,
    comments: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { toast.error('Please provide an overall rating.'); return; }
    setLoading(true);
    try {
      await api.post('/feedback', { booking_id: booking.id, ...form });
      toast.success('Thank you for your feedback!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Rate Your Experience</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Booking: <span className="font-mono font-semibold text-primary-600">{booking.booking_number}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <StarRating label="Overall Rating *" value={form.rating} onChange={v => set('rating', v)} />
          <StarRating label="Cleanliness" value={form.cleanliness_rating} onChange={v => set('cleanliness_rating', v)} />
          <StarRating label="Punctuality" value={form.punctuality_rating} onChange={v => set('punctuality_rating', v)} />
          <StarRating label="Professionalism" value={form.professionalism_rating} onChange={v => set('professionalism_rating', v)} />

          <div>
            <label className="label">Comments (Optional)</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              placeholder="Tell us about your experience..."
              value={form.comments}
              onChange={e => set('comments', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
