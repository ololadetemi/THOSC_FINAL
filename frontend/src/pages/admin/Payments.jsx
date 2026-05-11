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
  const [form, setForm] = useState({
    patientId: '',
    cardNumber: '',
    amountExpected: '',
    amountPaid: '',
    method: 'cash',
    notes: ''
  });
  const [searchCard, setSearchCard] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchPayments = () => {
    api.get('/api/admin/payments').then(res => setPayments(res.data)).catch(() => {});
  };

  useEffect(() => { fetchPayments(); }, []);

  const searchPatient = async () => {
    setSearchError('');
    setFoundPatient(null);
    if (!searchCard) return;
    try {
      const res = await api.get(`/api/receptionist/search-patient?cardNumber=${searchCard}`);
      const p = res.data.patients[0];
      setFoundPatient(p);
      setForm(f => ({ ...f, patientId: p._id, cardNumber: p.cardNumber }));
    } catch {
      setSearchError('Patient not found. Please check the card number.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      await api.post('/api/admin/payment', form);
      setMessage('Payment recorded successfully');
      setForm({ patientId: '', cardNumber: '', amountExpected: '', amountPaid: '', method: 'cash', notes: '' });
      setFoundPatient(null);
      setSearchCard('');
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.message || 'Error recording payment');
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white";
  const labelClass = "block text-sm font-medium text-primary-600 mb-1";

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Payment Management</h1>

      {/* Record Payment Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="font-heading font-semibold text-primary-600 mb-1">Record Payment</h2>
        <p className="text-gray-400 text-xs mb-5">Search for the patient by card number first, then enter payment details</p>

        {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}

        {/* Patient Search */}
        <div className="mb-5">
          <label className={labelClass}>Search Patient by Card Number</label>
          <div className="flex gap-3">
            <input
              value={searchCard}
              onChange={e => setSearchCard(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchPatient()}
              placeholder="Enter hospital card number"
              className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <button
              type="button"
              onClick={searchPatient}
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              Search
            </button>
          </div>
          {searchError && <p className="text-red-500 text-xs mt-1">{searchError}</p>}
          {foundPatient && (
            <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm font-medium">✓ Patient found</p>
              <p className="text-green-600 text-xs mt-0.5">
                {foundPatient.patientName} • Card #{foundPatient.cardNumber} • {foundPatient.gender}
              </p>
            </div>
          )}
        </div>

        {/* Payment Details — only show after patient is found */}
        {foundPatient && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Amount Expected (₦)</label>
              <input
                value={form.amountExpected}
                onChange={e => setForm({ ...form, amountExpected: e.target.value })}
                required placeholder="0.00" type="number"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Amount Paid (₦)</label>
              <input
                value={form.amountPaid}
                onChange={e => setForm({ ...form, amountPaid: e.target.value })}
                required placeholder="0.00" type="number"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Payment Method</label>
              <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} className={inputClass}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Notes (Optional)</label>
              <input
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Patient will pay balance on Friday"
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <button type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
                Record Payment
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Payment Records Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">
            Payment Records
            <span className="ml-2 text-gray-400 font-normal text-sm">({payments.length})</span>
          </h2>
        </div>
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm">No payment records yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-gray-500 uppercase text-xs">
                <tr>
                  {['Patient', 'Card No.', 'Expected', 'Paid', 'Outstanding', 'Status', 'Method', 'Date'].map(h =>
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  )}
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
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">{p.method}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(p.date).toLocaleDateString()}</td>
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

export default Payments;
