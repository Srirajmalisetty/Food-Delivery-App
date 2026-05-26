import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFail } from '../store/authSlice';
import api from '../services/api';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const response = await api.post('/auth/login', { email, password });
      dispatch(authSuccess(response.data));
      
      if (response.data.user.role === 'RESTAURANT_OWNER') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Please check credentials.';
      dispatch(authFail(msg));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Visual Neon Blur Background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="text-center mb-8">
          <span className="text-4xl bg-brand-500/10 p-4 rounded-3xl inline-block mb-4 shadow-inner">🔑</span>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-slate-400 mt-2 text-sm">Log in to order premium meals instantly</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Mail size={18} /></span>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Lock size={18} /></span>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Authenticating...' : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline font-semibold transition-all">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
