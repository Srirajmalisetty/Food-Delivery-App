import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../store/cartSlice';
import api from '../services/api';
import { ArrowLeft, Star, ShoppingBag, Plus, PlusCircle, Check, Coffee, Soup, Flame, Sparkles, Utensils } from 'lucide-react';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedItemMap, setAddedItemMap] = useState({}); // visual notification map
  const { user } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (err) {
      console.error("Failed to query restaurant detail limits", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Outbound REST target at api-gateway Cart endpoints backed by Redis
      const response = await api.post(`/cart/${user.id}/items`, {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      }, {
        params: {
          restaurantId: restaurant.id,
          restaurantName: restaurant.name
        }
      });

      // Bind Redis outcomes directly to local Redux Toolkit store states
      dispatch(setCart(response.data));

      // Trigger temporary visual checkmark indicator
      setAddedItemMap(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedItemMap(prev => ({ ...prev, [item.id]: false }));
      }, 1500);

    } catch (err) {
      console.error("Failed to append item to Redis cart registry", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="glass-panel h-48 rounded-3xl"></div>
        <div className="space-y-4">
          <div className="h-8 bg-slate-800 rounded w-1/4"></div>
          <div className="h-32 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-xl font-bold text-white">Restaurant profile not found</p>
        <button onClick={() => navigate('/')} className="mt-4 text-brand-400 flex items-center gap-2 mx-auto">
          <ArrowLeft size={16} /> Return to browse panel
        </button>
      </div>
    );
  }

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

  const getItemImage = (name, category) => {
    const n = name.toLowerCase();
    
    // Local custom high-resolution assets
    if (n.includes('pepperoni')) return '/pepperoni_pizza.png';
    if (n.includes('margherita')) return '/margherita_pizza.png';
    if (n.includes('knots') || n.includes('twist')) return '/garlic_knots.png';
    if (n.includes('burger') || n.includes('stack')) return '/avocado_burger.png';
    if (n.includes('truffle fries')) return '/truffle_fries.png';
    if (n.includes('hazelnut shake')) return '/chocolate_shake.png';
    if (n.includes('dragon roll')) return '/dragon_sushi.png';
    if (n.includes('roasted edamame')) return '/garlic_edamame.png';
    if (n.includes('butter chicken')) return '/butter_chicken.png';
    if (n.includes('garlic naan')) return '/garlic_naan.png';
    if (n.includes('paneer tikka skewers')) return '/paneer_tikka.png';
    if (n.includes('masala dosa')) return '/ghee_dosa.png';
    if (n.includes('idli sambar')) return '/steamed_idli.png';
    if (n.includes('chow mein')) return '/chow_mein.png';
    
    // Premium direct CDN image hotlinks for the remaining distinct dishes
    if (n.includes('caprese') || n.includes('salad')) return 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=80';
    if (n.includes('tiramisu')) return 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80';
    if (n.includes('popper')) return 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80';
    if (n.includes('onion ring')) return 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=400&q=80';
    if (n.includes('tempura')) return 'https://images.unsplash.com/photo-1615361965043-1580d2737bc0?auto=format&fit=crop&w=400&q=80';
    if (n.includes('mochi')) return 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=80';
    if (n.includes('miso')) return 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=400&q=80';
    if (n.includes('dal makhani')) return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80';
    if (n.includes('shahi tukda')) return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80';
    if (n.includes('vada')) return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80';
    if (n.includes('parotta')) return 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=400&q=80';
    if (n.includes('spring roll')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80';
    if (n.includes('fried rice')) return 'https://images.unsplash.com/photo-1603133872878-685f57732a12?auto=format&fit=crop&w=400&q=80';
    
    // New American BBQ Smokehouse items
    if (n.includes('brisket')) return 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=400&q=80';
    if (n.includes('hickory') || n.includes('ribs')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80';
    if (n.includes('macaroni') || n.includes('mac')) return 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=400&q=80';
    if (n.includes('fried chicken')) return 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=400&q=80';
    if (n.includes('cornbread')) return 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80';

    // New Chinese items
    if (n.includes('dumpling')) return 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80';
    if (n.includes('sweet sour') || n.includes('sweet and sour')) return 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80';

    // New Chocolates & Sweet items
    if (n.includes('truffles')) return 'https://images.unsplash.com/photo-1548907040-4d42b52125e0?auto=format&fit=crop&w=400&q=80';
    if (n.includes('chocolate bar')) return 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&q=80';
    if (n.includes('lava cake')) return 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80';
    if (n.includes('brownie')) return 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=400&q=80';
    if (n.includes('pralines')) return 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=400&q=80';
    
    return null;
  };

  const getPlaceholderGradient = (name) => {
    const n = name.toLowerCase();
    if (n.includes('salad') || n.includes('green') || n.includes('mochi')) return 'from-emerald-500 to-teal-400';
    if (n.includes('soup') || n.includes('miso') || n.includes('dal')) return 'from-amber-600 to-orange-400';
    if (n.includes('tiramisu') || n.includes('shahi') || n.includes('tukda')) return 'from-yellow-500 to-amber-500';
    if (n.includes('popper') || n.includes('spicy')) return 'from-rose-500 to-red-500';
    if (n.includes('ring') || n.includes('spring') || n.includes('vada')) return 'from-orange-500 to-yellow-500';
    return 'from-brand-500 to-pink-500';
  };

  const getPlaceholderIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('salad') || n.includes('green') || n.includes('mochi')) {
      return <Sparkles size={22} className="text-emerald-400" />;
    }
    if (n.includes('soup') || n.includes('miso') || n.includes('dal')) {
      return <Soup size={22} className="text-amber-400" />;
    }
    if (n.includes('tiramisu') || n.includes('shahi') || n.includes('tukda')) {
      return <Coffee size={22} className="text-yellow-400" />;
    }
    if (n.includes('popper') || n.includes('spicy')) {
      return <Flame size={22} className="text-rose-400" />;
    }
    if (n.includes('ring') || n.includes('spring') || n.includes('vada') || n.includes('parotta') || n.includes('rice')) {
      return <Sparkles size={22} className="text-orange-400" />;
    }
    return <Utensils size={22} className="text-brand-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back nav element */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-semibold"
      >
        <ArrowLeft size={16} />
        Back to restaurants list
      </button>

      {/* Hero header block */}
      <div className="glass-panel rounded-3xl p-8 mb-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-slate-800">
        <div className="space-y-4 max-w-xl">
          <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full uppercase tracking-wider">
            {restaurant.cuisine}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">{restaurant.name}</h1>
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <span className="flex items-center gap-1 text-yellow-400 font-extrabold">
              <Star size={16} className="fill-yellow-400" />
              {restaurant.rating.toFixed(1)}
            </span>
            <span>•</span>
            <span>{restaurant.address}</span>
            <span>•</span>
            <span>{restaurant.phone}</span>
          </div>
        </div>
        <img 
          src={getCuisineImage(restaurant.cuisine)} 
          alt={restaurant.name} 
          className="w-24 h-24 rounded-2xl object-cover border border-slate-700 shadow-md hidden md:block shrink-0"
        />
      </div>

      {/* Menu list header */}
      <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
        <ShoppingBag className="text-brand-500" />
        Menu Selections
      </h2>

      {restaurant.menu.length === 0 ? (
        <div className="glass-panel text-center py-12 rounded-3xl">
          <p className="text-slate-400 font-bold">No dishes registered under this restaurant profile</p>
          {user?.role === 'RESTAURANT_OWNER' && (
            <p className="text-slate-500 text-sm mt-1">Visit owner dashboard panel to add custom selections.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {restaurant.menu.map((item) => (
            <div 
              key={item.id}
              className={`glass-panel rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all border-slate-800/60 ${
                !item.available ? 'opacity-50' : 'hover:border-slate-700'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4 flex-1">
                {getItemImage(item.name, item.category) ? (
                  <img 
                    src={getItemImage(item.name, item.category)} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-xl object-cover border border-slate-800 shadow-md shrink-0 hidden sm:block hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 hidden sm:flex border border-slate-800 shadow-md relative overflow-hidden bg-slate-950 group">
                    {/* Animated glowing HSL gradient element */}
                    <div className={`absolute -inset-1 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300 bg-gradient-to-r ${getPlaceholderGradient(item.name)}`}></div>
                    {/* Glowing orb element */}
                    <div className={`absolute top-0 right-0 w-8 h-8 rounded-full blur-xl opacity-35 bg-gradient-to-r ${getPlaceholderGradient(item.name)}`}></div>
                    {/* Centered food-adjacent glowing Lucide Icon */}
                    <div className="relative text-slate-400 z-10 flex flex-col items-center justify-center">
                      {getPlaceholderIcon(item.name)}
                      <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-1">Gourmet</span>
                    </div>
                  </div>
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-white leading-snug">{item.name}</h3>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-400 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-xl">{item.description}</p>
                  <p className="text-brand-400 font-extrabold text-sm">₹{item.price.toFixed(2)}</p>
                </div>
              </div>

              {user?.role === 'CUSTOMER' && (
                <button 
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.available}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.97] shrink-0 ${
                    !item.available
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : addedItemMap[item.id]
                        ? 'bg-emerald-500 text-white shadow-emerald-500/10'
                        : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/10'
                  }`}
                >
                  {addedItemMap[item.id] ? (
                    <>
                      <Check size={16} />
                      Added!
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add to Cart
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
