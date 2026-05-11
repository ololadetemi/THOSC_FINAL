import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
  admin: [
    { label: 'Dashboard',        path: '/admin' },
    { label: 'Staff Management', path: '/admin/staff' },
    { label: 'Payments',         path: '/admin/payments' },
    { label: 'Appointments',     path: '/admin/appointments' },
    { label: 'All Patients',     path: '/doctor/patients' },
    { label: 'Register Patient', path: '/receptionist/register' },
    { label: 'Book Appointment', path: '/receptionist/appointments' },
    { label: 'Lab Requests',     path: '/lab/requests' },
    { label: 'Upload Result',    path: '/lab/results' },
    { label: 'Prescriptions',    path: '/pharmacist/prescriptions' },
    { label: 'Drug Inventory',   path: '/pharmacist/inventory' },
  ],
  doctor: [
    { label: 'Dashboard',    path: '/doctor' },
    { label: 'All Patients', path: '/doctor/patients' },
    { label: 'Appointments', path: '/doctor/appointments' },
  ],
  receptionist: [
    { label: 'Dashboard',        path: '/receptionist' },
    { label: 'Register Patient', path: '/receptionist/register' },
    { label: 'Appointments',     path: '/receptionist/appointments' },
  ],
  lab_technician: [
    { label: 'Dashboard',       path: '/lab' },
    { label: 'Pending Requests',path: '/lab/requests' },
    { label: 'Upload Result',   path: '/lab/results' },
  ],
  pharmacist: [
    { label: 'Dashboard',     path: '/pharmacist' },
    { label: 'Prescriptions', path: '/pharmacist/prescriptions' },
    { label: 'Drug Inventory',path: '/pharmacist/inventory' },
  ],
};

const adminSections = {
  'Staff Management': 'Admin',
  'All Patients':     'Hospital',
  'Lab Requests':     'Lab & Pharmacy',
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="w-64 min-h-screen bg-primary-600 flex flex-col">

      {/* Logo — click to go back to landing */}
      <button
  onClick={() => { logout(); navigate('/'); }}
  className="p-5 border-b border-white border-opacity-10 group flex items-center gap-3 hover:bg-white hover:bg-opacity-5 transition-all w-full text-left"
  title="Back to role selection">
        {/* Cross logo matching website */}
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow group-hover:shadow-md transition-all">
          <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="4" width="8" height="32" rx="2" fill="#1B3A6B"/>
            <rect x="4" y="16" width="32" height="8" rx="2" fill="#1B3A6B"/>
          </svg>
        </div>
        <div>
          <h2 className="text-white font-heading font-semibold text-sm leading-tight">Trinity Hospital</h2>
          <p className="text-accent-300 text-xs mt-0.5">Orthopaedic & Spine</p>
          <p className="text-primary-400 text-xs mt-0.5 group-hover:text-primary-300 transition-all">← Role selection</p>
        </div>
      </button>

      {/* Logged In User */}
      <div className="px-5 py-4 border-b border-white border-opacity-10">
        <p className="text-white font-medium text-sm">{user?.name}</p>
        <p className="text-primary-300 text-xs capitalize mt-0.5">{user?.role?.replace('_', ' ')}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const sectionLabel = adminSections[item.label];
          return (
            <div key={item.path}>
              {user?.role === 'admin' && sectionLabel && (
                <p className="text-primary-400 text-xs uppercase tracking-widest px-3 pt-4 pb-1.5">{sectionLabel}</p>
              )}
              <NavLink to={item.path} end={item.path.split('/').length === 2}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-accent-500 text-white font-semibold'
                      : 'text-primary-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`
                }>
                {item.label}
              </NavLink>
            </div>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-white border-opacity-10">
        <button onClick={handleLogout}
          className="w-full px-3 py-2.5 rounded-lg text-sm text-primary-200 hover:bg-red-600 hover:text-white transition-all text-left">
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
