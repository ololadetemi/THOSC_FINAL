import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/api/doctor/appointments?status=scheduled')
      .then(res => setAppointments(res.data.appointments || []))
      .catch(() => {});
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
                <p className="text-accent-500 text-sm font-medium">
                  {new Date(a.appointmentDate).toLocaleDateString()}
                </p>
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

  useEffect(() => {
    api.get('/api/doctor/all-patients').then(res => setPatients(res.data)).catch(() => {});
  }, []);

  const filtered = patients.filter(p =>
    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
    String(p.cardNumber).includes(search)
  );

  return (
    <Layout>
      <h1 className="text-2xl font-heading font-bold text-primary-600 mb-6">All Patients</h1>
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or card number..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white" />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-gray-500 uppercase text-xs">
            <tr>
              {['Name', 'Card No.', 'Gender', 'Contact', 'Assigned Doctor', 'Action'].map(h =>
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              )}
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
                  <Link to={`/doctor/patients/${p._id}`} className="text-accent-500 hover:underline text-xs font-medium">
                    View →
                  </Link>
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

  // Note state
  const [note, setNote] = useState('');
  const [noteMessage, setNoteMessage] = useState('');

  // Lab request state
  const [labForm, setLabForm] = useState({ testName: '', instructions: '' });
  const [labMessage, setLabMessage] = useState('');

  // Prescription state
  const [drugs, setDrugs] = useState([{ drugName: '', dosage: '', duration: '', notes: '' }]);
  const [prescMessage, setPrescMessage] = useState('');

  // Follow-up state
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpReason, setFollowUpReason] = useState('');
  const [followUpMessage, setFollowUpMessage] = useState('');

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white";
  const labelClass = "block text-sm font-medium text-primary-600 mb-1";

  const refreshPatient = () => {
    api.get(`/api/doctor/patient/${patientId}`).then(res => setPatient(res.data)).catch(() => {});
  };

  useEffect(() => { refreshPatient(); }, [patientId]);

  // Add consultation note
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/doctor/add-note/${patientId}`, { note });
      setNoteMessage('✅ Note added successfully');
      setNote('');
      refreshPatient();
    } catch { setNoteMessage('❌ Error adding note'); }
  };

  // Request lab test
  const handleLabRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/doctor/request-lab', { patientId, ...labForm });
      setLabMessage('✅ Lab test requested successfully');
      setLabForm({ testName: '', instructions: '' });
    } catch { setLabMessage('❌ Error requesting lab test'); }
  };

  // Add drug row
  const addDrug = () => setDrugs([...drugs, { drugName: '', dosage: '', duration: '', notes: '' }]);

  // Remove drug row
  const removeDrug = (index) => setDrugs(drugs.filter((_, i) => i !== index));

  // Update drug field
  const updateDrug = (index, field, value) => {
    const updated = [...drugs];
    updated[index][field] = value;
    setDrugs(updated);
  };

  // Write prescription
  const handlePrescription = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/doctor/prescription', { patientId, drugs });
      setPrescMessage('✅ Prescription written successfully');
      setDrugs([{ drugName: '', dosage: '', duration: '', notes: '' }]);
    } catch { setPrescMessage('❌ Error writing prescription'); }
  };

  // Schedule follow-up
  const handleFollowUp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/doctor/follow-up', {
        patientId,
        appointmentDate: followUpDate,
        reason: followUpReason || 'Follow-up'
      });
      setFollowUpMessage('✅ Follow-up appointment scheduled successfully');
      setFollowUpDate('');
      setFollowUpReason('');
    } catch { setFollowUpMessage('❌ Error scheduling follow-up'); }
  };

  if (!patient) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading patient...</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <Link to="/doctor/patients" className="text-accent-500 text-sm hover:underline mb-4 inline-block">
        ← Back to patients
      </Link>

      {/* Patient Info */}
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

      {/* Consultation Note */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-heading font-semibold text-primary-600 mb-1">Add Consultation Note</h2>
        <p className="text-gray-400 text-xs mb-4">Document your findings, diagnosis and treatment plan</p>
        {noteMessage && (
          <div className={`rounded-lg p-3 mb-4 text-sm ${noteMessage.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
            {noteMessage}
          </div>
        )}
        <form onSubmit={handleAddNote}>
          <textarea value={note} onChange={e => setNote(e.target.value)} required rows={6}
            placeholder="Enter consultation notes, examination findings, diagnosis, treatment plan..."
            className={`${inputClass} resize-none`} />
          <button type="submit"
            className="mt-3 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
            Save Note
          </button>
        </form>
      </div>

      {/* Request Lab Test */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-heading font-semibold text-primary-600 mb-1">Request Lab Test</h2>
        <p className="text-gray-400 text-xs mb-4">Lab technician will be notified of this request</p>
        {labMessage && (
          <div className={`rounded-lg p-3 mb-4 text-sm ${labMessage.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
            {labMessage}
          </div>
        )}
        <form onSubmit={handleLabRequest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Test Name</label>
            <input value={labForm.testName} onChange={e => setLabForm({ ...labForm, testName: e.target.value })}
              required placeholder="e.g. MRI Lumbar Spine, Full Blood Count, ESR"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Instructions (Optional)</label>
            <input value={labForm.instructions} onChange={e => setLabForm({ ...labForm, instructions: e.target.value })}
              placeholder="Any special instructions for the lab technician"
              className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <button type="submit"
              className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
              Send Lab Request
            </button>
          </div>
        </form>
      </div>

      {/* Write Prescription */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-heading font-semibold text-primary-600 mb-1">Write Prescription</h2>
        <p className="text-gray-400 text-xs mb-4">Pharmacist will see this and dispense accordingly</p>
        {prescMessage && (
          <div className={`rounded-lg p-3 mb-4 text-sm ${prescMessage.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
            {prescMessage}
          </div>
        )}
        <form onSubmit={handlePrescription} className="space-y-3">
          {drugs.map((drug, index) => (
            <div key={index} className="bg-surface rounded-xl p-4 relative">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>Drug Name</label>
                  <input value={drug.drugName} onChange={e => updateDrug(index, 'drugName', e.target.value)}
                    required placeholder="e.g. Ibuprofen 400mg" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Dosage</label>
                  <input value={drug.dosage} onChange={e => updateDrug(index, 'dosage', e.target.value)}
                    required placeholder="e.g. 1 tablet 3x daily" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Duration</label>
                  <input value={drug.duration} onChange={e => updateDrug(index, 'duration', e.target.value)}
                    required placeholder="e.g. 7 days" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Notes</label>
                  <input value={drug.notes} onChange={e => updateDrug(index, 'notes', e.target.value)}
                    placeholder="e.g. Take with food" className={inputClass} />
                </div>
              </div>
              {drugs.length > 1 && (
                <button type="button" onClick={() => removeDrug(index)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xs font-medium">
                  Remove
                </button>
              )}
            </div>
          ))}
          <div className="flex gap-3 flex-wrap">
            <button type="button" onClick={addDrug}
              className="border border-accent-500 text-accent-500 hover:bg-accent-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-all">
              + Add Another Drug
            </button>
            <button type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
              Submit Prescription
            </button>
          </div>
        </form>
      </div>

      {/* Schedule Follow-up */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-heading font-semibold text-primary-600 mb-1">Schedule Follow-up</h2>
        <p className="text-gray-400 text-xs mb-4">Book a follow-up appointment for this patient</p>
        {followUpMessage && (
          <div className={`rounded-lg p-3 mb-4 text-sm ${followUpMessage.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
            {followUpMessage}
          </div>
        )}
        <form onSubmit={handleFollowUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Follow-up Date & Time</label>
            <input type="datetime-local" value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Reason</label>
            <input value={followUpReason} onChange={e => setFollowUpReason(e.target.value)}
              placeholder="e.g. Review MRI results, Wound check" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <button type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
              Schedule Follow-up
            </button>
          </div>
        </form>
      </div>

      {/* Previous Notes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-heading font-semibold text-primary-600 mb-4">
          Previous Notes ({patient.doctorsNotes?.length || 0})
        </h2>
        {!patient.doctorsNotes || patient.doctorsNotes.length === 0 ? (
          <p className="text-gray-400 text-sm">No notes yet for this patient</p>
        ) : (
          <div className="space-y-4">
            {[...patient.doctorsNotes].reverse().map(n => (
              <div key={n._id} className="border border-gray-100 rounded-xl p-4 hover:border-accent-200 transition-all">
                <p className="text-xs text-gray-400 mb-2">
                  Dr. {n.doctorId?.name} • {new Date(n.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{n.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
