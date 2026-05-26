import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFail } from '../store/authSlice';
import api from '../services/api';
import { User as UserIcon, Mail, Lock, Phone, ArrowRight, AlertCircle, Shield } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const response = await api.post('/auth/register', { name, email, password, phone, role });
      dispatch(authSuccess(response.data));
      
      if (response.data.user.role === 'RESTAURANT_OWNER') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      dispatch(authFail(msg));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-8">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="text-center mb-8">
          <span className="text-4xl bg-brand-500/10 p-4 rounded-3xl inline-block mb-4">🚀</span>
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="text-slate-400 mt-2 text-sm">Join BiteDash to access premium local kitchens</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><UserIcon size={18} /></span>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Mail size={18} /></span>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Lock size={18} /></span>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Phone size={18} /></span>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">I want to:</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-3 rounded-2xl font-bold text-sm border flex flex-col items-center justify-center gap-1 transition-all ${
                  role === 'CUSTOMER' 
                    ? 'border-brand-500 bg-brand-500/10 text-white' 
                    : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <span>🍽️</span>
                Order Food
              </button>
              <button 
                type="button"
                onClick={() => setRole('RESTAURANT_OWNER')}
                className={`py-3 rounded-2xl font-bold text-sm border flex flex-col items-center justify-center gap-1 transition-all ${
                  role === 'RESTAURANT_OWNER' 
                    ? 'border-blue-500 bg-blue-500/10 text-white' 
                    : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <Shield size={16} />
                Manage Kitchen
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white py-3 px-4 rounded-2xl font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all mt-4"
          >
            {loading ? 'Registering...' : (
              <>
                Register Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:underline font-semibold transition-all">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
