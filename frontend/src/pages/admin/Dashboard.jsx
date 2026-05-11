import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const StatCard = ({ label, value, borderColor }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${borderColor}`}>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-3xl font-bold text-primary-600 mt-1 font-heading">{value ?? '—'}</p>
  </div>
);

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/api/admin/dashboard').then(res => setSummary(res.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-primary-600">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Trinity Hospital & Orthopaedic Spine Centre — Ibadan</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Patients"        value={summary?.totalPatients}     borderColor="border-primary-600" />
        <StatCard label="Today's Appointments"  value={summary?.todayAppointments} borderColor="border-accent-500" />
        <StatCard label="Pending Payments"      value={summary?.pendingPayments}   borderColor="border-red-400" />
        <StatCard label="Paid Today"            value={summary?.paidToday}         borderColor="border-green-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Staff Management', desc: 'Create and manage staff accounts',  path: '/admin/staff',        icon: '👥' },
          { label: 'Payments',         desc: 'Record and view patient payments',  path: '/admin/payments',     icon: '💳' },
          { label: 'Appointments',     desc: 'View all hospital appointments',    path: '/admin/appointments', icon: '📅' }
        ].map((item) => (
          <Link key={item.path} to={item.path}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 group">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-heading font-semibold text-primary-600 group-hover:text-accent-500">{item.label}</h3>
            <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
