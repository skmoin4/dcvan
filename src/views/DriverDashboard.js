import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { PhoneIcon, MapPinIcon, TruckIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [photos, setPhotos] = useState({});

  const load = () => api.get('/tasks').then((res) => setTasks(res.data.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const readFilesAsDataUrls = (files) => Promise.all(
    Array.from(files).slice(0, 5).map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ data_url: reader.result, caption: file.name });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))
  );

  const handlePhotos = async (taskId, files) => {
    const oversized = Array.from(files).find((file) => file.size > 1500000);
    if (oversized) {
      toast.error('Each photo must be below 1.5 MB.');
      return;
    }
    const dataUrls = await readFilesAsDataUrls(files);
    setPhotos((current) => ({ ...current, [taskId]: dataUrls }));
  };

  const updateTask = async (task, status) => {
    const completionPhotos = photos[task.id] || [];
    if (status === 'completed' && completionPhotos.length === 0) {
      toast.error('Upload at least one completion photo.');
      return;
    }
    try {
      await api.patch(`/tasks/${task.id}`, {
        status,
        completion_notes: status === 'completed' ? notes[task.id] || 'Completed by driver' : undefined,
        driver_notes: status !== 'completed' ? notes[task.id] || undefined : undefined,
        completion_photos: status === 'completed' ? completionPhotos : undefined,
      });
      toast.success('Job updated.');
      setPhotos((current) => ({ ...current, [task.id]: [] }));
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update job.');
    }
  };

  const counts = {
    assigned: tasks.filter((task) => task.status === 'assigned').length,
    in_progress: tasks.filter((task) => task.status === 'in_progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="eyebrow">My jobs</p>
        <h1 className="mt-1 text-3xl font-black text-navy-900">Welcome, {user?.name}</h1>
        <p className="mt-2 text-slate-500">Update your assigned sewage cleaning jobs here.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          ['Assigned', counts.assigned, 'text-navy-900'],
          ['In Progress', counts.in_progress, 'text-flame-600'],
          ['Completed', counts.completed, 'text-emerald-600'],
        ].map(([label, value, color]) => (
          <div key={label} className="card text-center">
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {loading && [1, 2].map((n) => <div key={n} className="skeleton h-40 w-full" />)}
        {!loading && tasks.map((task) => (
          <article key={task.id} className="card">
            <div className="flex flex-col justify-between gap-5 md:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <strong className="text-navy-900">{task.task_number}</strong>
                  <StatusBadge status={task.status} />
                </div>
                <h2 className="mt-3 text-xl font-black text-navy-900">{task.customer_name}</h2>
                <a className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800" href={`tel:${task.mobile_number}`}>
                  <PhoneIcon className="h-4 w-4" /> {task.mobile_number}
                </a>
                <p className="mt-3 flex items-start gap-1.5 text-slate-700"><MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /> {task.service_location}</p>
                {task.service_lat && task.service_lng && (
                  <a className="mt-2 inline-flex text-sm font-bold text-navy-600 hover:text-flame-600" href={`https://www.google.com/maps/search/?api=1&query=${task.service_lat},${task.service_lng}`} target="_blank" rel="noreferrer">
                    Open in Google Maps
                  </a>
                )}
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><TruckIcon className="h-4 w-4" /> {task.registration_number} &middot; {task.model}</p>
                <p className="text-sm text-slate-500">Scheduled: {new Date(task.scheduled_at).toLocaleString()}</p>
              </div>
              <div className="w-full md:w-72">
                <textarea
                  className="input-field min-h-24 resize-none"
                  placeholder="Job notes"
                  value={notes[task.id] || ''}
                  onChange={(event) => setNotes((current) => ({ ...current, [task.id]: event.target.value }))}
                />
                {task.status === 'in_progress' && (
                  <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-3">
                    <label className="label mb-2">Completion photos</label>
                    <input
                      className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => handlePhotos(task.id, event.target.files)}
                    />
                    <p className="mt-2 text-xs text-slate-500">Upload up to 5 photos, 1.5 MB each.</p>
                    {!!photos[task.id]?.length && <p className="mt-2 text-xs font-bold text-emerald-700">{photos[task.id].length} photo selected</p>}
                  </div>
                )}
                {!!task.photos?.length && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {task.photos.map((photo) => (
                      <img key={photo.id} src={photo.photo_data} alt={photo.caption || 'Completion'} className="aspect-square rounded-lg object-cover" />
                    ))}
                  </div>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {task.status === 'assigned' && <button onClick={() => updateTask(task, 'in_progress')} className="btn-primary btn-sm">Start</button>}
                  {task.status === 'in_progress' && <button onClick={() => updateTask(task, 'completed')} className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Complete</button>}
                  <button onClick={() => updateTask(task, task.status)} className="btn-outline btn-sm">Save Notes</button>
                </div>
              </div>
            </div>
          </article>
        ))}
        {!loading && !tasks.length && (
          <div className="card py-14 text-center text-slate-400">No jobs assigned yet.</div>
        )}
      </div>
    </main>
  );
};

export default DriverDashboard;
