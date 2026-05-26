import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Star, MapPin, ChefHat, ArrowRight } from 'lucide-react';

export default function RestaurantBrowse() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async (searchVal = '') => {
    setLoading(true);
    try {
      const response = await api.get('/restaurants', {
        params: searchVal ? { search: searchVal } : {}
      });
      setRestaurants(response.data);
    } catch (err) {
      console.error("Failed to query restaurants catalog", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(searchTerm);
  };

  const getCuisineImage = (cuisine) => {
    const c = cuisine.toLowerCase();
    if (c.includes('pizza') || c.includes('italian')) return '/margherita_pizza.png';
    if (c.includes('burger')) return '/avocado_burger.png';
    if (c.includes('sushi') || c.includes('japanese')) return '/dragon_sushi.png';
    if (c.includes('chinese') || c.includes('asian')) return '/chinese_restaurant.png';
    if (c.includes('indian') || c.includes('tandoor') || c.includes('dakshin')) return '/indian_restaurant.png';
    if (c.includes('bbq') || c.includes('smokehouse') || c.includes('barbeque')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80';
    if (c.includes('chocolate') || c.includes('cocoa') || c.includes('sweet') || c.includes('dessert')) return 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80';
    return '/restaurant_cover.png';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Banner / Hero header section */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 mb-10 bg-slate-900 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="space-y-4 max-w-xl">
          <span className="px-3 py-1 text-xs font-bold bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/25 tracking-wider uppercase">Hot & Fast delivery</span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Find the Best Dishes, Delivered Instantly.</h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">Search your favorite cuisines from top-tier kitchens in town, backed by asynchronous tracking.</p>
        </div>
        <img 
          src="/restaurant_cover.png" 
          alt="Gourmet Table" 
          className="w-60 h-36 rounded-2xl object-cover border border-slate-700 shadow-xl hidden md:block hover:rotate-1 transition-transform"
        />
      </div>

      {/* Search Input bar */}
      <form onSubmit={handleSearch} className="mb-10 flex gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Search size={20} /></span>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by restaurant name or cuisine..."
            className="glass-input w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm"
          />
        </div>
        <button 
          type="submit"
          className="bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          Search
        </button>
      </form>

      {/* Restaurant catalog grids */}
      <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
        <ChefHat className="text-brand-500" />
        Explore Kitchens
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel h-64 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-3xl">
          <span className="text-5xl mb-4 block">🔍</span>
          <p className="text-slate-300 font-bold text-lg">No kitchens match your parameters</p>
          <p className="text-slate-500 text-sm mt-1">Try resetting search values or exploring other words.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.map((rest) => (
            <div 
              key={rest.id}
              onClick={() => navigate(`/restaurant/${rest.id}`)}
              className="glass-card rounded-3xl overflow-hidden cursor-pointer flex flex-col group"
            >
              {/* Card visual banner block */}
              <div className="h-44 bg-slate-800/80 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                {/* Visual design element representing foods */}
                <img 
                  src={getCuisineImage(rest.cuisine)} 
                  alt={rest.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 flex items-center gap-1 bg-darkbg-900/90 text-yellow-400 font-extrabold text-sm px-2.5 py-1 rounded-full border border-yellow-400/20 shadow-lg">
                  <Star size={14} className="fill-yellow-400" />
                  {rest.rating.toFixed(1)}
                </span>
              </div>

              {/* Contents block */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full uppercase tracking-wider">
                    {rest.cuisine}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">{rest.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <MapPin size={14} />
                    <span>{rest.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-semibold text-brand-400 group-hover:text-brand-300">
                  <span>View Menu Cards</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
