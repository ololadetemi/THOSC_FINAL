import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export const ReceptionistDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    api.get(`/api/receptionist/appointments?date=${today}`).then(res => setAppointments(res.data.appointments || [])).catch(() => {});
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Receptionist Dashboard</h1>
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary-600">
          <p className="text-gray-500 text-sm">Today's Appointments</p>
          <p className="font-heading text-3xl font-bold text-primary-600 mt-1">{appointments.length}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">Today's Appointments</h2>
        </div>
        {appointments.length === 0 ? <p className="text-gray-400 text-sm p-6">No appointments today</p> : (
          <div className="divide-y divide-gray-100">
            {appointments.map(a => (
              <div key={a._id} className="px-6 py-4 flex justify-between items-center hover:bg-surface">
                <div>
                  <p className="font-medium text-sm text-primary-600">{a.patient?.patientName}</p>
                  <p className="text-gray-500 text-xs">Dr. {a.doctor?.name} • {a.reason}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-600">{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const RegisterPatient = () => {
  const [form, setForm] = useState({ patientName: '', cardNumber: '', dateOfBirth: '', gender: 'female', contact: '', address: '', nextOfKinName: '', nextOfKinContact: '' });
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/doctor/list').then(res => setDoctors(res.data))
    .catch(() =>{});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage(''); setError('');
    try {
      const res = await api.post('/api/receptionist/create-patient', form);
      if (doctorId) await api.put('/api/receptionist/assign-doctor', { patientId: res.data.patient._id, doctorId });
      setMessage(`Patient ${form.patientName} registered successfully with Card #${form.cardNumber}`);
      setForm({ patientName: '', cardNumber: '', dateOfBirth: '', gender: 'female', contact: '', address: '', nextOfKinName: '', nextOfKinContact: '' });
      setDoctorId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering patient');
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white";
  const labelClass = "block text-sm font-medium text-primary-600 mb-1";

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Register New Patient</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {[
            { label: 'Full Name', key: 'patientName', type: 'text', placeholder: 'Patient full name' },
            { label: 'Card Number', key: 'cardNumber', type: 'number', placeholder: 'Hospital card number' },
            { label: 'Date of Birth', key: 'dateOfBirth', type: 'date', placeholder: '' },
            { label: 'Phone Number', key: 'contact', type: 'tel', placeholder: '080xxxxxxxx' },
            { label: 'Next of Kin Name', key: 'nextOfKinName', type: 'text', placeholder: 'Next of kin full name' },
            { label: 'Next of Kin Phone', key: 'nextOfKinContact', type: 'tel', placeholder: '080xxxxxxxx' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                required placeholder={placeholder} className={inputClass} />
            </div>
          ))}
          <div className="col-span-2">
            <label className={labelClass}>Address</label>
            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              required placeholder="Patient address" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={inputClass}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Assign Doctor (Optional)</label>
            <select value={doctorId} onChange={e => setDoctorId(e.target.value)} className={inputClass}>
              <option value="">Select a doctor</option>
              {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export const ReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', appointmentDate: '', reason: '' });
  const [searchCard, setSearchCard] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/api/receptionist/appointments').then(res => setAppointments(res.data.appointments || [])).catch(() => {});
    // api.get('/api/admin/get-users').then(res => setDoctors(res.data.filter(u => u.role === 'doctor'))).catch(() => {});
    api.get('/api/doctor/list').then(res => setDoctors(res.data)).catch(() => {});
  }, []);

  const searchPatient = async () => {
    try {
      const res = await api.get(`/api/receptionist/search-patient?cardNumber=${searchCard}`);
      const p = res.data.patients[0];
      setFoundPatient(p);
      setForm(f => ({ ...f, patientId: p._id }));
    } catch { setFoundPatient(null); alert('Patient not found'); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/receptionist/create-appointment', form);
      setMessage('Appointment booked successfully');
      api.get('/api/receptionist/appointments').then(res => setAppointments(res.data.appointments || []));
    } catch (err) { setMessage(err.response?.data?.message || 'Error booking appointment'); }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white";
  const labelClass = "block text-sm font-medium text-primary-600 mb-1";

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">Appointments</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 max-w-2xl">
        <h2 className="font-heading font-semibold text-primary-600 mb-4">Book Appointment</h2>
        {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}
        <div className="flex gap-3 mb-4">
          <input value={searchCard} onChange={e => setSearchCard(e.target.value)} placeholder="Enter patient card number"
            className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
          <button onClick={searchPatient} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm transition-all">Search</button>
        </div>
        {foundPatient && <p className="text-green-700 text-sm mb-4 bg-green-50 p-3 rounded-lg">✓ Found: {foundPatient.patientName}</p>}
        <form onSubmit={handleBook} className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Doctor</label>
            <select value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })} required className={inputClass}>
              <option value="">Select doctor</option>
              {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Date & Time</label>
            <input type="datetime-local" value={form.appointmentDate} onChange={e => setForm({ ...form, appointmentDate: e.target.value })} required className={inputClass} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Reason</label>
            <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Reason for visit" className={inputClass} />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={!form.patientId}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 transition-all">
              Book Appointment
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">All Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-gray-500 uppercase text-xs">
              <tr>{['Patient', 'Doctor', 'Date', 'Reason', 'Status'].map(h =>
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map(a => (
                <tr key={a._id} className="hover:bg-surface">
                  <td className="px-6 py-4 font-medium text-primary-600">{a.patient?.patientName}</td>
                  <td className="px-6 py-4">{a.doctor?.name}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(a.appointmentDate).toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">{a.reason}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs bg-accent-100 text-accent-600">{a.status}</span>
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
