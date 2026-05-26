import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  Calendar, 
  ShoppingBag, 
  History,
  ChefHat,
  Truck,
  AlertTriangle
} from 'lucide-react';

export default function OrderHistory() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchOrderHistory();
    }
  }, [user]);

  const fetchOrderHistory = async () => {
    try {
      const response = await api.get(`/orders/customer/${user.id}`);
      setOrders(response.data || []);
    } catch (err) {
      console.error("Failed to query order history", err);
      setError("Unable to retrieve order history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to return beautiful visual status tags
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'CONFIRMED':
        return 'bg-teal-500/10 border-teal-500/30 text-teal-400';
      case 'PREPARING':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      case 'DELIVERED':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'PAYMENT_FAILED':
      case 'CANCELLED':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PLACED':
      case 'CONFIRMED':
        return <Clock size={14} className="animate-pulse" />;
      case 'PREPARING':
        return <ChefHat size={14} className="animate-bounce" />;
      case 'OUT_FOR_DELIVERY':
        return <Truck size={14} className="translate-x-0.5" />;
      case 'DELIVERED':
        return <CheckCircle2 size={14} />;
      case 'PAYMENT_FAILED':
      case 'CANCELLED':
        return <AlertTriangle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-10 bg-slate-800 rounded w-1/4"></div>
        <div className="h-48 bg-slate-800 rounded-3xl"></div>
        <div className="h-48 bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
          <History size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Order History</h1>
          <p className="text-slate-400 text-xs mt-0.5">Manage and track your previous delicious selections</p>
        </div>
      </div>

      {error && (
        <div className="glass-panel p-4 rounded-2xl border border-rose-500/15 bg-rose-500/5 text-center text-xs font-semibold text-rose-400">
          {error}
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border-slate-800 space-y-6">
          <span className="text-6xl block">🍽️</span>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Orders Found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              Looks like you haven't placed any food delivery orders yet. Explore our top kitchens to start your first meal checkout!
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-brand-500/10 transition-all active:scale-[0.98]"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        /* Orders list */
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="glass-panel rounded-3xl border-slate-800/80 hover:border-slate-700/60 transition-all p-6 md:p-8 space-y-6 shadow-md shadow-slate-950/20"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-800/60">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order Reference: #{order.id}</span>
                  <h3 className="text-lg font-black text-white leading-tight">{order.restaurantName}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {formatTimestamp(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-full border text-[11px] font-extrabold flex items-center gap-1.5 ${getStatusBadgeStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="uppercase tracking-wider">{order.status.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown list */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Items Summary</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items?.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-slate-950/30 border border-slate-900/60 rounded-xl p-3.5 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-slate-500">₹{item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      <p className="font-extrabold text-slate-300">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer details & Track button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-800/60">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={10} /> Destination Address
                  </span>
                  <p className="text-xs text-slate-300 line-clamp-1 max-w-md">{order.deliveryAddress}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Total Aggregate</p>
                    <p className="text-xl font-black text-brand-400">₹{order.totalAmount.toFixed(2)}</p>
                  </div>

                  {order.status !== 'PAYMENT_FAILED' && order.status !== 'CANCELLED' && (
                    <button 
                      onClick={() => navigate(`/order-tracking/${order.id}`)}
                      className={`px-4.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-[0.98] ${
                        order.status === 'DELIVERED' 
                          ? 'border border-slate-800 text-slate-300 hover:text-white bg-slate-950/40 hover:bg-slate-950/80' 
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10'
                      }`}
                    >
                      {order.status === 'DELIVERED' ? 'View Tracker' : 'Track Order'}
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
