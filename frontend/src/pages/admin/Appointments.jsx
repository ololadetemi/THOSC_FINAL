import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const statusColors = {
  scheduled: 'bg-accent-100 text-accent-600',
  completed:  'bg-green-100 text-green-700',
  missed:     'bg-red-100 text-red-700',
  cancelled:  'bg-gray-100 text-gray-600'
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAppointments = (status) => {
    setLoading(true);
    const query = status && status !== 'all' ? `?status=${status}` : '';
    api.get(`/api/admin/appointments${query}`)
      .then(res => { setAppointments(res.data.appointments || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments('all'); }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary-600">All Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all hospital appointments</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'scheduled', 'completed', 'missed', 'cancelled'].map(status => (
          <button key={status} onClick={() => { setFilter(status); fetchAppointments(status); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-500 hover:bg-surface border border-gray-200'
            }`}>
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">
            {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
            <span className="ml-2 text-gray-400 font-normal text-sm">({appointments.length})</span>
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm p-6">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-gray-500 uppercase text-xs">
                <tr>{['Patient', 'Card No.', 'Doctor', 'Date & Time', 'Reason', 'Booked By', 'Status'].map(h =>
                  <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map(a => (
                  <tr key={a._id} className="hover:bg-surface">
                    <td className="px-6 py-4 font-medium text-primary-600">{a.patient?.patientName || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{a.patient?.cardNumber || '—'}</td>
                    <td className="px-6 py-4">{a.doctor?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{a.reason || 'Follow-up'}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{a.bookedBy?.role?.replace('_', ' ') || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[a.status] || 'bg-gray-100 text-gray-600'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminAppointments;
