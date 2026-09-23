import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, XMarkIcon, PencilSquareIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';

const emptyCreateForm = { name: '', email: '', phone: '', password: '', role: 'executive' };

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
    <div className="w-full max-w-md animate-fade-up rounded-2xl bg-white p-6 shadow-2xl">{children}</div>
  </div>
);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editUser, setEditUser] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const load = () => {
    setLoading(true);
    return api.get('/users').then((res) => setUsers(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submitCreate = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      await api.post('/users', createForm);
      toast.success('User created.');
      setCreateForm(emptyCreateForm);
      setCreateOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create user.');
    } finally {
      setCreating(false);
    }
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    setSavingEdit(true);
    try {
      await api.patch(`/users/${editUser.id}`, {
        role: editUser.role,
        is_active: editUser.is_active ? 1 : 0,
      });
      toast.success('User updated.');
      setEditUser(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update user.');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <main className="section py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Team</p>
          <h1 className="mt-1 text-3xl font-black text-navy-900">Admin Users</h1>
          <p className="mt-2 text-slate-500">Everyone with access to the operations console.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary w-fit">
          <PlusIcon className="h-4 w-4" /> Create User
        </button>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {loading && [1, 2, 3].map((n) => (
                <tr key={n}><td colSpan={6}><div className="skeleton h-8 w-full" /></td></tr>
              ))}
              {!loading && users.map((user) => (
                <tr key={user.id}>
                  <td className="flex items-center gap-3 font-bold text-navy-900">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-black text-white">
                      {user.name?.slice(0, 1).toUpperCase()}
                    </span>
                    {user.name}
                  </td>
                  <td className="text-slate-600">{user.email}</td>
                  <td className="text-slate-600">{user.phone || '—'}</td>
                  <td className="capitalize text-slate-600">{user.role}</td>
                  <td><StatusBadge status={user.is_active ? 'available' : 'inactive'} /></td>
                  <td>
                    <button onClick={() => setEditUser({ ...user })} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-navy-900">
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && !users.length && (
                <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <Modal onClose={() => setCreateOpen(false)}>
          <form onSubmit={submitCreate}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-white"><UserGroupIcon className="h-5 w-5" /></span>
                <h2 className="text-xl font-black text-navy-900">Create User</h2>
              </div>
              <button type="button" onClick={() => setCreateOpen(false)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className="label">Full name</label>
                <input required className="input-field" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Email</label>
                <input required type="email" className="input-field" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input-field" value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="label">Password</label>
                <input required type="password" minLength={8} className="input-field" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input-field" value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}>
                  <option value="executive">Executive</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button disabled={creating} className="btn-primary flex-1">{creating ? 'Creating...' : 'Create User'}</button>
              <button type="button" onClick={() => setCreateOpen(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {editUser && (
        <Modal onClose={() => setEditUser(null)}>
          <form onSubmit={submitEdit}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-navy-900">Edit User</h2>
                <p className="mt-1 text-sm text-slate-500">{editUser.name} &middot; {editUser.email}</p>
              </div>
              <button type="button" onClick={() => setEditUser(null)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className="label">Role</label>
                <select className="input-field" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                  <option value="executive">Executive</option>
                  <option value="admin">Admin</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input-field" value={editUser.is_active ? '1' : '0'} onChange={(e) => setEditUser({ ...editUser, is_active: e.target.value === '1' })}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button disabled={savingEdit} className="btn-primary flex-1">{savingEdit ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" onClick={() => setEditUser(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
};

export default AdminUsers;
