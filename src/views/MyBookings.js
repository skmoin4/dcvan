import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import FeedbackModal from '../components/booking/FeedbackModal';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackBooking, setFeedbackBooking] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.data);
    } catch {
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    setCancelling(true);
    try {
      await api.put(`/bookings/${id}/status`, { status: 'cancelled', cancellation_reason: 'Cancelled by customer' });
      toast.success('Booking cancelled.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
      setCancelId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">{bookings.length} total booking(s)</p>
        </div>
        <Link href="/book" className="btn-primary">+ New Booking</Link>
      </div>

      {bookings.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-700">No bookings yet</h2>
          <p className="text-gray-500 mt-2 mb-6">Schedule your first sewage cleaning service</p>
          <Link href="/book" className="btn-primary">Book Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-primary-700">{b.booking_number}</span>
                    <StatusBadge status={b.status} />
                    <span className="badge bg-gray-100 text-gray-600 capitalize">{b.service_type}</span>
                  </div>
                  <p className="text-gray-700 font-medium">{b.address}, {b.city} – {b.pincode}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <span>📅 {b.preferred_date} ({b.preferred_time_slot})</span>
                    {b.scheduled_date && <span>🗓 Scheduled: {b.scheduled_date}</span>}
                    {b.driver_name && <span>👷 Driver: {b.driver_name}</span>}
                    {b.van_reg && <span>🚛 Van: {b.van_reg}</span>}
                  </div>
                  {b.cancellation_reason && (
                    <p className="text-red-600 text-sm mt-2">Reason: {b.cancellation_reason}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {b.status === 'completed' && !b.rating && (
                    <button
                      className="btn-primary text-sm py-1.5"
                      onClick={() => setFeedbackBooking(b)}
                    >
                      ⭐ Review
                    </button>
                  )}
                  {['pending', 'verified'].includes(b.status) && (
                    <>
                      {cancelId === b.id ? (
                        <div className="flex gap-2">
                          <button
                            className="btn-danger text-sm py-1.5"
                            onClick={() => handleCancel(b.id)}
                            disabled={cancelling}
                          >
                            {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                          </button>
                          <button className="btn-secondary text-sm py-1.5" onClick={() => setCancelId(null)}>
                            Keep
                          </button>
                        </div>
                      ) : (
                        <button className="btn-secondary text-sm py-1.5 text-red-600" onClick={() => setCancelId(b.id)}>
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Booked on {new Date(b.created_at).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      )}

      {feedbackBooking && (
        <FeedbackModal
          booking={feedbackBooking}
          onClose={() => setFeedbackBooking(null)}
          onSuccess={() => { setFeedbackBooking(null); fetchBookings(); }}
        />
      )}
    </div>
  );
};

export default MyBookings;
