import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

const statusColors = {
  paid: 'bg-green-100 text-green-700',
  'part-payment': 'bg-yellow-100 text-yellow-700',
  owing: 'bg-red-100 text-red-700'
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ patientId: '', cardNumber: '', amountExpected: '', amountPaid: '', method: 'cash', notes: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/admin/payments').then(res => setPayments(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage(''); setError('');
    try {
      await api.post('/api/admin/payment', form);
      setMessage('Payment recorded successfully');
      setForm({ patientId: '', cardNumber: '', amountExpected: '', amountPaid: '', method: 'cash', notes: '' });
      api.get('/api/admin/payments').then(res => setPayments(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Error recording payment');
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Payment Management</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="font-heading font-semibold text-primary-600 mb-4">Record Payment</h2>
        {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {[
            { label: 'Patient ID', key: 'patientId', placeholder: 'MongoDB Patient ID' },
            { label: 'Card Number', key: 'cardNumber', placeholder: 'Hospital card number' },
            { label: 'Amount Expected (₦)', key: 'amountExpected', placeholder: '0.00' },
            { label: 'Amount Paid (₦)', key: 'amountPaid', placeholder: '0.00' }
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-primary-600 mb-1">{label}</label>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-primary-600 mb-1">Payment Method</label>
            <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-600 mb-1">Notes</label>
            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
              Record Payment
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">Payment Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-gray-500 uppercase text-xs">
              <tr>{['Patient', 'Card No.', 'Expected', 'Paid', 'Outstanding', 'Status', 'Method', 'Date'].map(h =>
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map(p => (
                <tr key={p._id} className="hover:bg-surface">
                  <td className="px-4 py-3 font-medium text-primary-600">{p.patient?.patientName}</td>
                  <td className="px-4 py-3 text-gray-500">{p.cardNumber}</td>
                  <td className="px-4 py-3">₦{p.amountExpected?.toLocaleString()}</td>
                  <td className="px-4 py-3">₦{p.amountPaid?.toLocaleString()}</td>
                  <td className="px-4 py-3">₦{p.outstandingAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td className="px-4 py-3 capitalize">{p.method}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
