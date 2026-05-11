import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const roleLabels = {
  admin: 'Admin', doctor: 'Doctor', receptionist: 'Receptionist',
  pharmacist: 'Pharmacist', lab_technician: 'Lab Technician'
};

const roleDashboards = {
  admin: '/admin', doctor: '/doctor', receptionist: '/receptionist',
  pharmacist: '/pharmacist', lab_technician: '/lab'
};

const EyeIcon = ({ show }) => show ? (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      if (user.role !== role) {
        setError(`This login is for ${roleLabels[role]}. Your account is registered as ${roleLabels[user.role]}.`);
        setLoading(false);
        return;
      }
      login(user, token);
      navigate(roleDashboards[user.role]);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary-600 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-2 border-accent-500"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border border-accent-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="16" y="4" width="8" height="32" rx="2" fill="#1B3A6B"/>
                <rect x="4" y="16" width="32" height="8" rx="2" fill="#1B3A6B"/>
              </svg>
            </div>
          </Link>
          <h1 className="text-white font-heading text-2xl font-bold">Trinity Hospital</h1>
          <p className="text-accent-300 text-xs tracking-widest uppercase mt-1">Orthopaedic & Spine Centre</p>
          <div className="w-12 h-0.5 bg-accent-500 mx-auto mt-3 mb-2"></div>
          <p className="text-primary-200 text-sm">{roleLabels[role]} Login</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary-600 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-600 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors">
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-accent-500 text-sm hover:underline">← Back to role selection</Link>
          </div>
        </div>

        <p className="text-center text-primary-400 text-xs mt-6">
          ABC Transport Bus Stop, Old Ife Rd, Ibadan · 0701 305 1302
        </p>
      </div>
    </div>
  );
};

export default Login;
