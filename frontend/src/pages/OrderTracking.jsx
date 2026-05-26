import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Clock, CheckCircle, Package, Truck, Smile, AlertTriangle, ArrowRight } from 'lucide-react';

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define tracking steps mapped in the order lifecycle
  const trackingSteps = [
    { status: 'PLACED', label: 'Order Placed', icon: Clock, description: 'Waiting for payment confirmation' },
    { status: 'CONFIRMED', label: 'Payment Confirmed', icon: CheckCircle, description: 'Order routed to kitchen' },
    { status: 'PREPARING', label: 'Preparing Meal', icon: Package, description: 'Chef is baking your dish' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck, description: 'Rider moving to destination' },
    { status: 'DELIVERED', label: 'Meal Delivered', icon: Smile, description: 'Bon appétit! Enjoy your food' }
  ];

  useEffect(() => {
    fetchOrder();
    
    // Set up continuous polling to capture async Kafka state transitions automatically
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      console.error("Failed to query order tracking coordinates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, null, {
        params: { status: 'DELIVERED' }
      });
      setOrder(response.data);
    } catch (err) {
      console.error("Failed to update status to DELIVERED", err);
    }
  };

  const getStepIndex = (currentStatus) => {
    if (currentStatus === 'PAYMENT_FAILED') return -1;
    if (currentStatus === 'CANCELLED') return -2;
    return trackingSteps.findIndex(step => step.status === currentStatus);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-10 bg-slate-800 rounded w-1/3"></div>
        <div className="h-64 bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-xl font-bold text-white">Order tracking target not found</p>
        <button onClick={() => navigate('/')} className="mt-4 text-brand-400 font-bold hover:underline">
          Return to browse panel
        </button>
      </div>
    );
  }

  const activeIndex = getStepIndex(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner tracking details summary */}
      <div className="glass-panel rounded-3xl p-8 border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Live Tracking Coordinates</span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">Order #{order.id}</h1>
          <p className="text-xs text-slate-400 mt-1">Restaurant: <span className="text-slate-200 font-bold">{order.restaurantName}</span></p>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Checkout Charged</p>
          <p className="text-2xl font-black text-brand-400">₹{order.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Exception screens: Fails and Cancellations */}
      {activeIndex === -1 && (
        <div className="glass-panel p-8 rounded-3xl border-rose-500/20 bg-rose-500/5 text-center space-y-4">
          <span className="text-5xl block">⚠️</span>
          <h3 className="text-xl font-black text-rose-400">Checkout Authorization Failed</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Your transaction payment was declined. Possible reasons: insufficient account funds, declined credentials, or invalid payment parameters.
          </p>
          <button onClick={() => navigate('/cart')} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all">
            Return to Cart
          </button>
        </div>
      )}

      {activeIndex === -2 && (
        <div className="glass-panel p-8 rounded-3xl border-slate-700 bg-slate-800/20 text-center space-y-4">
          <AlertTriangle size={48} className="text-slate-500 mx-auto" />
          <h3 className="text-xl font-black text-slate-400">Order Cancelled</h3>
          <p className="text-slate-500 text-sm">This order tracking record was cancelled by server triggers.</p>
        </div>
      )}

      {/* Standard progress timeline tracker */}
      {activeIndex >= 0 && (
        <div className="glass-panel rounded-3xl p-8 border-slate-800 space-y-8">
          <div className="relative pl-8 md:pl-0 md:grid md:grid-cols-5 md:gap-4 md:text-center">
            {/* Horizontal connection line for larger viewports */}
            <div className="absolute top-6 left-10 right-10 h-0.5 bg-slate-800 hidden md:block -z-10"></div>
            
            {trackingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < activeIndex || order.status === 'DELIVERED';
              const isActive = index === activeIndex && order.status !== 'DELIVERED';
              
              return (
                <div key={index} className="relative mb-8 md:mb-0 flex md:flex-col items-start md:items-center gap-4 md:gap-3">
                  {/* Circle milestone badge */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shadow-md ${
                    isCompleted 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-emerald-500/10' 
                      : isActive 
                        ? 'bg-brand-500 border-brand-500 text-white shadow-brand-500/20 scale-115' 
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <StepIcon size={20} />
                  </div>

                  {/* Metadata and labels panel */}
                  <div className="md:mt-2 text-left md:text-center space-y-1">
                    <h3 className={`font-bold text-sm leading-none ${
                      isActive ? 'text-brand-400 font-extrabold' : isCompleted ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-tight max-w-[140px] md:mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery details panel */}
      <div className="glass-panel rounded-3xl p-6 border-slate-800 space-y-4">
        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Destination Parameters</h3>
        <div className="text-slate-300 text-sm leading-relaxed p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80">
          <p className="font-semibold text-slate-400 text-xs uppercase mb-1">Target Address</p>
          <p className="text-slate-100">{order.deliveryAddress}</p>
        </div>

        {order.status !== 'DELIVERED' && order.status !== 'PAYMENT_FAILED' && order.status !== 'CANCELLED' && (
          <button 
            onClick={handleMarkAsDelivered}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white py-3 px-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all text-xs mt-2"
          >
            <CheckCircle size={16} />
            Confirm Food Delivered
          </button>
        )}
      </div>
    </div>
  );
}
