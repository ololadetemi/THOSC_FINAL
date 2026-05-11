import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/api/doctor/appointments?status=scheduled').then(res => setAppointments(res.data.appointments || [])).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-primary-600">Welcome, Dr. {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Trinity Hospital & Orthopaedic Spine Centre</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <Link to="/doctor/patients" className="bg-primary-600 rounded-xl p-6 text-white hover:bg-primary-700 transition-all">
          <p className="text-primary-200 text-sm mb-1">All Patients</p>
          <p className="font-heading text-2xl font-bold">View Patients →</p>
        </Link>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-accent-500">
          <p className="text-gray-500 text-sm">Today's Appointments</p>
          <p className="font-heading text-3xl font-bold text-primary-600 mt-1">{appointments.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-primary-600">Upcoming Appointments</h2>
        </div>
        {appointments.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No upcoming appointments</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.map(a => (
              <div key={a._id} className="px-6 py-4 flex justify-between items-center hover:bg-surface">
                <div>
                  <p className="font-medium text-sm text-primary-600">{a.patient?.patientName}</p>
                  <p className="text-gray-500 text-xs">Card: {a.patient?.cardNumber} • {a.reason}</p>
                </div>
                <p className="text-accent-500 text-sm font-medium">{new Date(a.appointmentDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { api.get('/api/doctor/all-patients').then(res => setPatients(res.data)).catch(() => {}); }, []);

  const filtered = patients.filter(p =>
    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
    String(p.cardNumber).includes(search)
  );

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">All Patients</h1>
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or card number..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white" />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-gray-500 uppercase text-xs">
            <tr>{['Name', 'Card No.', 'Gender', 'Contact', 'Assigned Doctor', 'Action'].map(h =>
              <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(p => (
              <tr key={p._id} className="hover:bg-surface">
                <td className="px-6 py-4 font-medium text-primary-600">{p.patientName}</td>
                <td className="px-6 py-4 text-gray-500">{p.cardNumber}</td>
                <td className="px-6 py-4 capitalize">{p.gender}</td>
                <td className="px-6 py-4">{p.contact}</td>
                <td className="px-6 py-4">{p.assignedDoctor?.name || <span className="text-gray-400">Unassigned</span>}</td>
                <td className="px-6 py-4">
                  <Link to={`/doctor/patients/${p._id}`} className="text-accent-500 hover:underline text-xs font-medium">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export const PatientProfile = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [note, setNote] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/api/doctor/patient/${patientId}`).then(res => setPatient(res.data)).catch(() => {});
  }, [patientId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/doctor/add-note/${patientId}`, { note });
      setMessage('Note added successfully');
      setNote('');
      api.get(`/api/doctor/patient/${patientId}`).then(res => setPatient(res.data));
    } catch { setMessage('Error adding note'); }
  };

  // const generateAISummary = async (noteId, noteText) => {
  //   setAiLoading(true);
  //   try {
  //     const res = await fetch('https://api.anthropic.com/v1/messages', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         model: 'claude-sonnet-4-20250514',
  //         max_tokens: 1000,
  //         messages: [{ role: 'user', content: `You are a medical assistant. Based on the following consultation notes from an orthopedic and spine specialist hospital, generate a clean, concise clinical summary in 3-5 sentences suitable for a patient medical record. Notes: ${noteText}` }]
  //       })
  //     });
//   const res = await fetch('https://api.anthropic.com/v1/messages', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'x-api-key': 'YOUR_ANTHROPIC_API_KEY_HERE',
//     'anthropic-version': '2023-06-01',
//     'anthropic-dangerous-direct-browser-access': 'true'
//   },
//   body: JSON.stringify({
//     model: 'claude-sonnet-4-20250514',
//     max_tokens: 1000,
//     messages: [{
//       role: 'user',
//       content: `You are a medical assistant for an orthopedic and spine specialist hospital. Based on the following consultation notes, generate a clean, concise clinical summary in 3-5 sentences suitable for a patient medical record. Notes: ${noteText}`
//     }]
//   })
// });
//       const data = await res.json();
//       const summary = data.content?.[0]?.text || '';
//       await api.put(`/api/doctor/ai-summary/${patientId}/${noteId}`, { aiSummary: summary });
//       api.get(`/api/doctor/patient/${patientId}`).then(res => setPatient(res.data));
//     } catch { alert('Error generating summary'); }
//     setAiLoading(false);
//   };
  

  if (!patient) return <Layout><p className="text-gray-400">Loading patient...</p></Layout>;

  return (
    <Layout>
      <Link to="/doctor/patients" className="text-accent-500 text-sm hover:underline mb-4 inline-block">← Back to patients</Link>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary-600 mb-4">{patient.patientName}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            ['Card Number', patient.cardNumber],
            ['Gender', patient.gender],
            ['Contact', patient.contact],
            ['Assigned Doctor', patient.assignedDoctor?.name || 'Unassigned'],
            ['Next of Kin', patient.nextOfKinName],
            ['Next of Kin Contact', patient.nextOfKinContact],
            ['Address', patient.address],
            ['Registered', new Date(patient.createdAt).toLocaleDateString()]
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-gray-400 text-xs">{label}</p>
              <p className="font-medium text-primary-600 capitalize mt-0.5">{val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-heading font-semibold text-primary-600 mb-4">Add Consultation Note</h2>
        {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}
        <form onSubmit={handleAddNote}>
          <textarea value={note} onChange={e => setNote(e.target.value)} required rows={5}
            placeholder="Enter consultation notes, diagnosis, treatment plan..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none" />
          <button type="submit" className="mt-3 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
            Save Note
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-heading font-semibold text-primary-600 mb-4">Previous Notes ({patient.doctorsNotes?.length || 0})</h2>
        {patient.doctorsNotes?.length === 0 ? <p className="text-gray-400 text-sm">No notes yet</p> : (
          <div className="space-y-4">
            {[...patient.doctorsNotes].reverse().map(n => (
              <div key={n._id} className="border border-gray-100 rounded-xl p-4 hover:border-accent-200 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-gray-400">Dr. {n.doctorId?.name} • {new Date(n.date).toLocaleDateString()}</p>
                  <button onClick={() => generateAISummary(n._id, n.note)} disabled={aiLoading}
                    className="text-xs bg-accent-500 hover:bg-accent-600 text-white px-3 py-1 rounded-full font-medium disabled:opacity-60 transition-all">
                    {aiLoading ? 'Generating...' : '✨ AI Summary'}
                  </button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{n.note}</p>
                {n.aiSummary && (
                  <div className="mt-3 bg-surface border border-accent-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-accent-600 mb-1">AI Clinical Summary</p>
                    <p className="text-sm text-gray-700">{n.aiSummary}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
