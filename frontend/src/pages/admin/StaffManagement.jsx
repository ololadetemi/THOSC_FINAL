import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const EyeIcon = ({ show }) => show ? (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const roleLabels = {
  doctor: 'Doctor', receptionist: 'Receptionist',
  pharmacist: 'Pharmacist', lab_technician: 'Lab Technician', admin: 'Admin'
};

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'doctor', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchStaff = () => {
    api.get('/api/admin/get-users').then(res => setStaff(res.data)).catch(() => {});
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage(''); setError(''); setLoading(true);
    try {
      await api.post('/api/admin/create-user', form);
      setMessage(`✅ Account created for ${form.name}. Email: ${form.email} | Password: ${form.password}`);
      setForm({ name: '', email: '', role: 'doctor', password: '' });
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account. Please try again.');
    }
    setLoading(false);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this account? The staff member will no longer be able to log in.')) return;
    try {
      await api.put(`/api/admin/deactivate-user/${id}`);
      fetchStaff();
    } catch { alert('Error deactivating account'); }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Staff Management</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="font-heading font-semibold text-primary-600 mb-1">Create Staff Account</h2>
        <p className="text-gray-400 text-xs mb-5">Fill in the details below to create a login account for a new staff member.</p>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-5 text-sm">
            {message}
            <p className="mt-1 text-green-600 font-medium">Please share these credentials with the staff member securely.</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-5 text-sm">{error}</div>
        )}

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-600 mb-1">Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              placeholder="e.g. Dr. Adebayo Okafor"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-600 mb-1">Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
              placeholder="e.g. doctor@thosc.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-600 mb-1">Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="lab_technician">Lab Technician</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-600 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                <EyeIcon show={showPassword} />
              </button>
            </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-60">
              {loading ? 'Creating Account...' : 'Create Staff Account'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">All Staff ({staff.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-gray-500 uppercase text-xs">
              <tr>{['Name', 'Email', 'Role', 'Status', 'Action'].map(h =>
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No staff accounts yet</td></tr>
              ) : staff.map(s => (
                <tr key={s._id} className="hover:bg-surface">
                  <td className="px-6 py-4 font-medium text-primary-600">{s.name}</td>
                  <td className="px-6 py-4 text-gray-500">{s.email}</td>
                  <td className="px-6 py-4 capitalize">{roleLabels[s.role] || s.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {s.isActive && s.role !== 'admin' && (
                      <button onClick={() => handleDeactivate(s._id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium">
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default StaffManagement;
