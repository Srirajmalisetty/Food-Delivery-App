import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { clearCartLocal } from '../store/cartSlice';
import { ShoppingBag, LogOut, Utensils, User as UserIcon, Shield, Clock } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartLocal());
    navigate('/login');
  };

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
      <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-white">
        <span className="text-brand-500 bg-brand-500/10 p-2 rounded-xl">🍔</span>
        <span>Bite<span className="text-brand-500">Dash</span></span>
      </Link>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <Link to="/" className="flex items-center gap-1.5 hover:text-brand-400 text-slate-300 font-medium transition-colors">
              <Utensils size={18} />
              Browse
            </Link>

            {user?.role === 'CUSTOMER' && (
              <>
                <Link to="/orders" className="flex items-center gap-1.5 hover:text-brand-400 text-slate-300 font-medium transition-colors">
                  <Clock size={18} />
                  Orders
                </Link>

                <Link to="/cart" className="relative flex items-center gap-1.5 hover:text-brand-400 text-slate-300 font-medium transition-colors">
                  <ShoppingBag size={18} />
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2.5 -right-3 px-1.5 py-0.5 text-xs font-bold bg-brand-500 text-white rounded-full scale-90 animate-pulse">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user?.role === 'RESTAURANT_OWNER' && (
              <Link to="/admin" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors">
                <Shield size={18} />
                Dashboard
              </Link>
            )}

            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-100">{user?.name}</p>
                <p className="text-xs text-brand-400 font-medium tracking-wider">{user?.role}</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-brand-400 rounded-xl hover:bg-slate-800 transition-all"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-lg transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
