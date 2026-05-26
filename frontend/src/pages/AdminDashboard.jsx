import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { Shield, Plus, Utensils, Check, ToggleLeft, ToggleRight, Info } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState('');
  const [activeMenu, setActiveMenu] = useState([]);
  
  // Menu item form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchOwnerRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestId) {
      fetchRestaurantMenu(selectedRestId);
    }
  }, [selectedRestId]);

  const fetchOwnerRestaurants = async () => {
    try {
      // In enterprise environments, this lists owner-owned restaurants
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
      if (response.data.length > 0) {
        setSelectedRestId(response.data[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to query owner restaurants list", err);
    }
  };

  const fetchRestaurantMenu = async (restId) => {
    try {
      const response = await api.get(`/restaurants/${restId}`);
      setActiveMenu(response.data.menu || []);
    } catch (err) {
      console.error("Failed to query catalog menu list", err);
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    if (!selectedRestId || !name || !price) return;

    setLoading(true);
    setMsg('');

    try {
      // Call Restaurant Service endpoint to append dishes
      const response = await api.post(`/restaurants/${selectedRestId}/menu`, {
        name,
        description,
        price: parseFloat(price),
        category,
        available: true
      });

      setMsg('Dish added successfully!');
      
      // Clear forms
      setName('');
      setDescription('');
      setPrice('');

      // Refresh menus lists
      fetchRestaurantMenu(selectedRestId);

    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to register dish item.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (itemId, currentAvailability) => {
    try {
      // Outbound REST target at Restaurant Service to toggle item availability
      const response = await api.put(`/menu-items/${itemId}/availability`, null, {
        params: { available: !currentAvailability }
      });

      // Update local state list
      setActiveMenu(prev => prev.map(item => 
        item.id === itemId ? { ...item, available: response.data.available } : item
      ));

    } catch (err) {
      console.error("Failed to shift dish availability state", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Sidebar form inputs */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Shield className="text-brand-500" />
          Kitchen Portal
        </h2>

        <div className="glass-panel rounded-3xl p-6 border-slate-800 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">Kitchen Target</label>
            <select 
              value={selectedRestId} 
              onChange={(e) => setSelectedRestId(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs"
            >
              {restaurants.map(rest => (
                <option key={rest.id} value={rest.id} className="bg-darkbg-800 text-white">{rest.name}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleCreateMenuItem} className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-200">Register New Dish</h3>

            {msg && (
              <p className="text-emerald-400 text-xs font-medium bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                {msg}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Dish Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Margherita Pizza"
                className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Description</label>
              <textarea 
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe flavors and ingredients..."
                className="glass-input w-full p-4 rounded-2xl text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="299"
                  className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs"
                >
                  <option value="Starter" className="bg-darkbg-800">Starter</option>
                  <option value="Main Course" className="bg-darkbg-800">Main Course</option>
                  <option value="Dessert" className="bg-darkbg-800">Dessert</option>
                  <option value="Beverage" className="bg-darkbg-800">Beverage</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 transition-all text-xs"
            >
              <Plus size={16} />
              {loading ? 'Registering...' : 'Add Dish to Catalog'}
            </button>
          </form>
        </div>
      </div>

      {/* active catalog menus dashboard */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Utensils className="text-brand-500" />
          Active Menu Registry
        </h2>

        {activeMenu.length === 0 ? (
          <div className="glass-panel text-center py-16 rounded-3xl">
            <span className="text-4xl block mb-2">🍽️</span>
            <p className="text-slate-400 font-bold">No active dish registers found</p>
            <p className="text-slate-500 text-xs mt-1">Use the sidebar panel to catalog items immediately.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeMenu.map((item) => (
              <div 
                key={item.id}
                className="glass-panel rounded-2xl p-6 flex items-center justify-between gap-6 border-slate-800/60"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-400 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{item.description}</p>
                  <p className="text-brand-400 font-extrabold text-xs">₹{item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    item.available ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {item.available ? 'Available' : 'Sold Out'}
                  </span>
                  
                  <button 
                    onClick={() => handleToggleAvailability(item.id, item.available)}
                    className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
                    title="Toggle Availability"
                  >
                    {item.available ? (
                      <ToggleRight size={32} className="text-emerald-400" />
                    ) : (
                      <ToggleLeft size={32} className="text-slate-600" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
