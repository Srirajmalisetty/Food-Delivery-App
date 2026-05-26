import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCart, clearCartLocal } from '../store/cartSlice';
import api from '../services/api';
import { ShoppingBag, ArrowRight, Trash2, MapPin, CreditCard, Trash, Sparkles, Check, CheckCircle2, Ticket, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [address, setAddress] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Payment and Coupon states
  const [isPaymentMode, setIsPaymentMode] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Active BiteDash Coupons
  const availableCoupons = [
    { code: 'BITE50', description: 'Flat ₹50 OFF on orders above ₹150', type: 'flat', value: 50, minOrder: 150 },
    { code: 'SUPERFOOD', description: 'Save ₹100 on orders above ₹300', type: 'flat', value: 100, minOrder: 300 },
    { code: 'WELCOME20', description: 'Get 20% OFF on your entire meal', type: 'percent', value: 0.2, minOrder: 0 },
    { code: 'BITE1000', description: 'Flat ₹300 OFF on orders above ₹1000!', type: 'flat', value: 300, minOrder: 1000 },
    { code: 'FEAST30', description: '30% OFF on orders above ₹900 (Up to ₹350)', type: 'percent', value: 0.3, minOrder: 900 }
  ];

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await api.get(`/cart/${user.id}`);
      dispatch(setCart(response.data));
    } catch (err) {
      console.error("Failed to query Redis shopping basket state", err);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await api.delete(`/cart/${user.id}`);
      dispatch(setCart(response.data));
      setIsPaymentMode(false);
      setAppliedCoupon(null);
      setCouponSuccess('');
    } catch (err) {
      console.error("Failed to clear shopping basket cache", err);
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Delivery address is mandatory');
      return;
    }
    setError('');
    setIsPaymentMode(true);
  };

  const applyCoupon = (coupon) => {
    setCouponError('');
    setCouponSuccess('');

    if (cart.totalAmount < coupon.minOrder) {
      setCouponError(`Min order value of ₹${coupon.minOrder} required for ${coupon.code}`);
      return;
    }

    setAppliedCoupon(coupon);
    let savings = 0;
    if (coupon.type === 'flat') {
      savings = coupon.value;
    } else {
      savings = Math.round(cart.totalAmount * coupon.value);
    }

    setCouponSuccess(`Coupon ${coupon.code} applied! Saved ₹${savings.toFixed(2)}`);
  };

  const handleCustomCouponSubmit = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const matchedCoupon = availableCoupons.find(c => c.code === code);
    if (matchedCoupon) {
      applyCoupon(matchedCoupon);
      setCouponInput('');
    } else {
      setCouponSuccess('');
      setCouponError('Invalid coupon code. Try BITE50, SUPERFOOD, WELCOME20, BITE1000 or FEAST30.');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  // Compute final amounts
  const itemsTotal = cart.totalAmount || 0;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'flat') {
      discountAmount = appliedCoupon.value;
    } else {
      discountAmount = Math.round(itemsTotal * appliedCoupon.value);
    }
  }
  const finalTotal = Math.max(0, itemsTotal - discountAmount);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setError('');

    try {
      // Trigger API Gateway order placement pipeline (backed by PostgreSQL + Kafka)
      const response = await api.post('/orders/checkout', {
        customerId: user.id,
        deliveryAddress: address,
        discount: discountAmount // Pass coupon savings to the backend!
      });

      // Clear local Redux cart allocations
      dispatch(clearCartLocal());

      // Redirect client to live tracking timeline
      navigate(`/order-tracking/${response.data.id}`);

    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-4 block">🛒</span>
        <h2 className="text-2xl font-black text-white">Your Cart is Empty</h2>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">Add mouthwatering food selections from top-tier kitchens before starting your checkout request.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold transition-all inline-block shadow-lg shadow-brand-500/10"
        >
          Explore restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Items list block */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="text-brand-500" />
            {isPaymentMode ? 'Payment & Checkout' : 'Shopping Cart'}
          </h1>
          {!isPaymentMode && (
            <button 
              onClick={handleClearCart}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline transition-all"
            >
              <Trash size={14} /> Clear Items
            </button>
          )}
        </div>

        {/* STEP 1: Shopping Cart Items List */}
        {!isPaymentMode ? (
          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-400 pl-1 uppercase tracking-wider">
              Selected from: <span className="text-white font-bold">{cart.restaurantName}</span>
            </p>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div 
                  key={item.menuItemId}
                  className="glass-panel rounded-2xl p-6 flex items-center justify-between gap-6 border-slate-800/60"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <p className="text-slate-400 text-xs">
                      ₹{item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-brand-400 font-extrabold text-sm">
                    ₹{item.subTotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* STEP 2: Interactive Payment Dashboard & Coupons */
          <div className="space-y-6">
            {/* Payment Options Selection */}
            <div className="glass-panel rounded-3xl p-6 border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <CreditCard size={16} className="text-brand-400" /> Select Payment Method
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Cash on Delivery Selection card */}
                <div className="border-2 border-emerald-500/80 bg-emerald-500/5 rounded-2xl p-5 relative cursor-pointer flex items-center justify-between transition-all shadow-md shadow-emerald-500/5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">Cash on Delivery (COD)</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Pay in cash or UPI at your doorstep upon delivery</p>
                    </div>
                  </div>
                  <CheckCircle2 size={20} className="text-emerald-400 fill-emerald-500/10 shrink-0" />
                </div>

                {/* Card / UPI disabled message */}
                <div className="border border-slate-800/60 bg-slate-950/40 rounded-2xl p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-slate-500 flex items-center justify-center">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-400 text-sm">Credit/Debit Card & Net Banking</h4>
                      <p className="text-[10px] text-slate-500">Temporarily offline for scheduled updates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupons & Promo Codes Center */}
            <div className="glass-panel rounded-3xl p-6 border-slate-800 space-y-6">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Ticket size={16} className="text-brand-400" /> BiteDash Coupon Center
              </h3>

              {/* Coupon Input Form */}
              <form onSubmit={handleCustomCouponSubmit} className="flex gap-3">
                <input 
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="ENTER PROMO CODE (e.g. BITE50)"
                  className="glass-input flex-1 px-4 py-2.5 rounded-xl text-xs uppercase"
                  disabled={appliedCoupon !== null}
                />
                <button 
                  type="submit"
                  disabled={appliedCoupon !== null || !couponInput.trim()}
                  className="bg-brand-500 hover:bg-brand-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Apply
                </button>
              </form>

              {/* Coupon Alerts */}
              {couponError && (
                <p className="text-rose-400 text-xs font-semibold bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
                  {couponError}
                </p>
              )}

              {couponSuccess && (
                <div className="flex items-center justify-between bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 transition-all">
                  <p className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <Sparkles size={14} className="animate-spin text-emerald-400" />
                    {couponSuccess}
                  </p>
                  <button 
                    onClick={removeCoupon} 
                    className="text-[10px] font-extrabold text-rose-400 hover:text-rose-300 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Available Coupons list */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-0.5">Recommended Coupons</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableCoupons.map((coupon) => {
                    const isSelected = appliedCoupon?.code === coupon.code;
                    return (
                      <div 
                        key={coupon.code}
                        onClick={() => !isSelected && applyCoupon(coupon)}
                        className={`border rounded-xl p-3.5 text-left transition-all ${
                          isSelected 
                            ? 'border-emerald-500/60 bg-emerald-500/5 cursor-default'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 cursor-pointer hover:bg-slate-950/80'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                            isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                          }`}>
                            {coupon.code}
                          </span>
                          {isSelected && <Check size={12} className="text-emerald-400" />}
                        </div>
                        <p className="text-xs font-bold text-white mt-2">{coupon.description}</p>
                        <p className="text-[9px] text-slate-500 mt-1">Min. Order: ₹{coupon.minOrder}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Back to cart view */}
            <button 
              onClick={() => setIsPaymentMode(false)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors pl-1 font-semibold"
            >
              <ArrowLeft size={14} /> Back to order items
            </button>
          </div>
        )}
      </div>

      {/* Checkout and details sidebar summary */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white">Summary</h2>

        <div className="glass-panel rounded-3xl p-6 space-y-6 border-slate-800">
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Items Total</span>
              <span>₹{itemsTotal.toFixed(2)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-400 text-sm font-semibold">
                <span className="flex items-center gap-1"><Ticket size={12} /> Coupon ({appliedCoupon.code})</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400 text-sm">
              <span>Delivery Fee</span>
              <span className="text-emerald-400 font-medium">FREE</span>
            </div>
          </div>

          <div className="flex justify-between text-white font-bold text-lg">
            <span>Aggregate</span>
            <span className="text-brand-400 font-black">₹{finalTotal.toFixed(2)}</span>
          </div>

          {error && (
            <p className="text-rose-400 text-xs font-medium bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
              {error}
            </p>
          )}

          {/* Form flow */}
          {!isPaymentMode ? (
            /* Address entering form */
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <MapPin size={12} className="text-brand-400" /> Destination Address
                </label>
                <textarea 
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Apartment 4B, Cityville..."
                  className="glass-input w-full p-4 rounded-2xl text-xs resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all text-sm mt-4"
              >
                <CreditCard size={18} />
                Proceed to Payment
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* Final placement form */
            <div className="space-y-4">
              {/* Short summary address display */}
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <MapPin size={10} className="text-brand-400" /> Shipping to
                </span>
                <p className="text-slate-300 line-clamp-2 leading-relaxed">{address}</p>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all text-sm mt-4"
              >
                {checkoutLoading ? 'Processing Checkout...' : (
                  <>
                    <CheckCircle2 size={18} />
                    Confirm & Place Order
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
