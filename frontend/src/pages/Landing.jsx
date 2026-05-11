import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const roles = [
  { id: 'admin',         label: 'Admin',          icon: '🛡️', description: 'Manage staff, payments & records' },
  { id: 'doctor',        label: 'Doctor',          icon: '🩺', description: 'View patients & write notes' },
  { id: 'receptionist',  label: 'Receptionist',    icon: '👤', description: 'Register patients & appointments' },
  { id: 'pharmacist',    label: 'Pharmacist',      icon: '💊', description: 'Prescriptions & drug inventory' },
  { id: 'lab_technician',label: 'Lab Technician',  icon: '🔬', description: 'Upload & manage results' }
];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // useEffect(() => {
  //   if (user) navigate(`/${user.role === 'lab_technician' ? 'lab' : user.role}`);
  // }, [user, navigate]);

  return (
    <div className="min-h-screen bg-primary-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-2 border-accent-500"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border border-accent-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white opacity-10"></div>
      </div>

      {/* Logo & Hospital Name */}
      <div className="relative z-10 text-center mb-12">
        {/* Logo — square with + cross matching website */}
        <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="4" width="8" height="32" rx="2" fill="#1B3A6B"/>
            <rect x="4" y="16" width="32" height="8" rx="2" fill="#1B3A6B"/>
          </svg>
        </div>
        <h1 className="text-white font-heading text-4xl font-bold mb-1">Trinity Hospital</h1>
        <p className="text-accent-300 tracking-widest uppercase text-sm font-light">Orthopaedic & Spine Centre</p>
        <div className="w-16 h-0.5 bg-accent-500 mx-auto mt-4 mb-4"></div>
        <p className="text-primary-200 text-sm">Hospital Management System</p>
      </div>

      {/* Role Cards */}
      <div className="relative z-10 w-full max-w-4xl">
        <p className="text-center text-primary-300 text-xs mb-6 uppercase tracking-widest">
          Select Your Role to Continue
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => navigate(`/login?role=${role.id}`)}
              className="role-card bg-white bg-opacity-10 hover:bg-accent-500 border border-white border-opacity-20 hover:border-accent-500 rounded-xl p-5 text-center group transition-all duration-300"
            >
              <div className="text-3xl mb-3">{role.icon}</div>
              <h3 className="text-white group-hover:text-white font-semibold text-sm font-heading">
                {role.label}
              </h3>
              <p className="text-primary-300 group-hover:text-blue-100 text-xs mt-1 leading-tight">
                {role.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center mt-12 space-y-1">
        <p className="text-primary-300 text-xs">ABC Transport Bus Stop, Old Ife Rd, Ibadan</p>
        <p className="text-primary-400 text-xs">0701 305 1302 · Mon–Fri: 8am–6pm · Sat: 9am–3pm · Emergency: 24/7</p>
      </div>
    </div>
  );
};

export default Landing;
