import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export const LabDashboard = () => {
  const [requests, setRequests] = useState([]);
  useEffect(() => { api.get('/api/labTechnician/pending-requests').then(res => setRequests(res.data.requests || [])).catch(() => {}); }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Lab Technician Dashboard</h1>
      <div className="bg-white rounded-xl shadow-sm border-l-4 border-accent-500 p-6 mb-8 inline-block min-w-48">
        <p className="text-gray-500 text-sm">Pending Requests</p>
        <p className="font-heading text-3xl font-bold text-primary-600 mt-1">{requests.length}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">Pending Lab Requests</h2>
        </div>
        {requests.length === 0 ? <p className="text-gray-400 text-sm p-6">No pending requests</p> : (
          <div className="divide-y divide-gray-100">
            {requests.map(r => (
              <div key={r._id} className="px-6 py-4 flex justify-between items-center hover:bg-surface">
                <div>
                  <p className="font-medium text-sm text-primary-600">{r.patient?.patientName} (Card #{r.patient?.cardNumber})</p>
                  <p className="text-gray-500 text-xs">Test: {r.testName} • Requested by Dr. {r.requestedBy?.name}</p>
                  {r.instructions && <p className="text-gray-400 text-xs mt-0.5">Note: {r.instructions}</p>}
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Pending</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const UploadResult = () => {
  const [form, setForm] = useState({ patientId: '', testName: '', testType: 'Lab', result: '', notes: '', labRequestId: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage(''); setError('');
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
    if (file) data.append('resultFile', file);
    try {
      await api.post('/api/labTechnician/add-result', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Result uploaded successfully');
      setForm({ patientId: '', testName: '', testType: 'Lab', result: '', notes: '', labRequestId: '' });
      setFile(null);
    } catch (err) { setError(err.response?.data?.message || 'Error uploading result'); }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white";
  const labelClass = "block text-sm font-medium text-primary-600 mb-1";

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Upload Lab Result</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Patient ID', key: 'patientId', placeholder: 'MongoDB Patient ID' },
            { label: 'Lab Request ID (Optional)', key: 'labRequestId', placeholder: 'Link to lab request' },
            { label: 'Test Name', key: 'testName', placeholder: 'e.g. Full Blood Count' }
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className={inputClass} />
            </div>
          ))}
          <div>
            <label className={labelClass}>Test Type</label>
            <select value={form.testType} onChange={e => setForm({ ...form, testType: e.target.value })} className={inputClass}>
              {['Lab', 'Radiology', 'Diagnostic', 'Other'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Result (Text)</label>
            <textarea value={form.result} onChange={e => setForm({ ...form, result: e.target.value })} rows={4}
              placeholder="Type result here..." className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
              placeholder="Additional notes..." className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Upload File (PDF or Image)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer" />
          </div>
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
            Upload Result
          </button>
        </form>
      </div>
    </Layout>
  );
};

export const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  useEffect(() => { api.get('/api/pharmacist/pending-prescriptions').then(res => setPrescriptions(res.data.prescriptions || [])).catch(() => {}); }, []);

  const dispense = async (id) => {
    try {
      await api.put(`/api/pharmacist/dispense/${id}`);
      setPrescriptions(p => p.filter(x => x._id !== id));
    } catch { alert('Error dispensing prescription'); }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Pharmacist Dashboard</h1>
      <div className="bg-white rounded-xl shadow-sm border-l-4 border-accent-500 p-6 mb-8 inline-block min-w-48">
        <p className="text-gray-500 text-sm">Pending Prescriptions</p>
        <p className="font-heading text-3xl font-bold text-primary-600 mt-1">{prescriptions.length}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">Pending Prescriptions</h2>
        </div>
        {prescriptions.length === 0 ? <p className="text-gray-400 text-sm p-6">No pending prescriptions</p> : (
          <div className="divide-y divide-gray-100">
            {prescriptions.map(p => (
              <div key={p._id} className="px-6 py-4 hover:bg-surface">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm text-primary-600">{p.patient?.patientName} (Card #{p.patient?.cardNumber})</p>
                    <p className="text-gray-500 text-xs">Prescribed by Dr. {p.prescribedBy?.name} • {new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => dispense(p._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
                    Mark Dispensed
                  </button>
                </div>
                <div className="space-y-1 mt-2">
                  {p.drugs.map((d, i) => (
                    <div key={i} className="bg-surface rounded-lg px-3 py-2 text-sm">
                      <span className="font-medium text-primary-600">{d.drugName}</span> — {d.dosage} for {d.duration}
                      {d.notes && <span className="text-gray-400"> ({d.notes})</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const DrugInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ drugName: '', quantityInStock: '', unit: '' });
  const [message, setMessage] = useState('');

  const fetchInventory = () => api.get('/api/pharmacist/inventory').then(res => setInventory(res.data.inventory || [])).catch(() => {});
  useEffect(() => { fetchInventory(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/pharmacist/add-drug', form);
      setMessage('Drug added to inventory');
      setForm({ drugName: '', quantityInStock: '', unit: '' });
      fetchInventory();
    } catch { setMessage('Error adding drug'); }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white";
  const labelClass = "block text-sm font-medium text-primary-600 mb-1";

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Drug Inventory</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 max-w-lg">
        <h2 className="font-heading font-semibold text-primary-600 mb-4">Add Drug</h2>
        {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}
        <form onSubmit={handleAdd} className="space-y-3">
          {[
            { label: 'Drug Name', key: 'drugName', placeholder: 'e.g. Ibuprofen 400mg' },
            { label: 'Quantity in Stock', key: 'quantityInStock', placeholder: '100' },
            { label: 'Unit', key: 'unit', placeholder: 'e.g. tablets, ml, vials' }
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required placeholder={placeholder} className={inputClass} />
            </div>
          ))}
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
            Add Drug
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">Inventory ({inventory.length} items)</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface text-gray-500 uppercase text-xs">
            <tr>{['Drug Name', 'Quantity', 'Unit', 'Last Updated'].map(h =>
              <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map(d => (
              <tr key={d._id} className="hover:bg-surface">
                <td className="px-6 py-4 font-medium text-primary-600">{d.drugName}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${d.quantityInStock < 10 ? 'text-red-600' : 'text-green-600'}`}>{d.quantityInStock}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{d.unit}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(d.lastUpdated).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
