import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';

import AdminDashboard from './pages/admin/Dashboard';
import StaffManagement from './pages/admin/StaffManagement';
import Payments from './pages/admin/Payments';

import { DoctorDashboard, PatientList, PatientProfile } from './pages/doctor/DoctorPages';
import { ReceptionistDashboard, RegisterPatient, ReceptionistAppointments } from './pages/receptionist/ReceptionistPages';
import { LabDashboard, UploadResult, PharmacistDashboard, DrugInventory } from './pages/lab/LabAndPharmacistPages';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Admin only pages */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><StaffManagement /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><Payments /></ProtectedRoute>} />

        {/* Doctor — admin can also access */}
        <Route path="/doctor" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><PatientList /></ProtectedRoute>} />
        <Route path="/doctor/patients/:patientId" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><PatientProfile /></ProtectedRoute>} />

        {/* Receptionist — admin can also access */}
        <Route path="/receptionist" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><ReceptionistDashboard /></ProtectedRoute>} />
        <Route path="/receptionist/register" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><RegisterPatient /></ProtectedRoute>} />
        <Route path="/receptionist/appointments" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><ReceptionistAppointments /></ProtectedRoute>} />

        {/* Lab — admin can also access */}
        <Route path="/lab" element={<ProtectedRoute allowedRoles={['admin', 'lab_technician']}><LabDashboard /></ProtectedRoute>} />
        <Route path="/lab/requests" element={<ProtectedRoute allowedRoles={['admin', 'lab_technician']}><LabDashboard /></ProtectedRoute>} />
        <Route path="/lab/results" element={<ProtectedRoute allowedRoles={['admin', 'lab_technician']}><UploadResult /></ProtectedRoute>} />

        {/* Pharmacist — admin can also access */}
        <Route path="/pharmacist" element={<ProtectedRoute allowedRoles={['admin', 'pharmacist']}><PharmacistDashboard /></ProtectedRoute>} />
        <Route path="/pharmacist/prescriptions" element={<ProtectedRoute allowedRoles={['admin', 'pharmacist']}><PharmacistDashboard /></ProtectedRoute>} />
        <Route path="/pharmacist/inventory" element={<ProtectedRoute allowedRoles={['admin', 'pharmacist']}><DrugInventory /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
