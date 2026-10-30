import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Plus, 
  Check, 
  Heart, 
  Phone, 
  MapPin, 
  Info, 
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import FHRSBadge from './FHRSBadge';
import { formatGBP } from '../utils/currency';
import { NATASHAS_LAW_14_ALLERGENS } from '../utils/ukLocalization';

export default function RestaurantDetail({ 
  restaurant, 
  onBack, 
  onAddItem, 
  onCustomizeItem,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart
}) {
  const [selectedCatId, setSelectedCatId] = useState(restaurant.categories[0]?.id || '');
  const [isFavorite, setIsFavorite] = useState(false);
  const [allergenFilter, setAllergenFilter] = useState('all'); 
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  const activeCategory = restaurant.categories.find(c => c.id === selectedCatId) || restaurant.categories[0];

  // Filter items by selected allergen avoidance
  const filteredItems = (activeCategory?.items || []).filter(item => {
    if (allergenFilter === 'all') return true;
    if (allergenFilter === 'gluten-free') {
      return !item.allergens?.some(a => a.toLowerCase().includes('gluten') || a.toLowerCase().includes('wheat'));
    }
    if (allergenFilter === 'dairy-free') {
      return !item.allergens?.some(a => a.toLowerCase().includes('milk') || a.toLowerCase().includes('dairy') || a.toLowerCase().includes('cheese'));
    }
    if (allergenFilter === 'nut-free') {
      return !item.allergens?.some(a => a.toLowerCase().includes('nut') || a.toLowerCase().includes('peanut'));
    }
    if (allergenFilter === 'halal') {
      return item.isHalal !== false;
    }
    return true;
  });

  const handleItemClick = (item) => {
    if (item.isCustomizable) {
      onCustomizeItem(item);
    } else {
      onAddItem(item);
      setAddedAnimationId(item.id);
      setTimeout(() => setAddedAnimationId(null), 800);
    }
  };

  return (
    <div className="pb-28 pt-2">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between py-3 mb-2">
        <button 
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-800 hover:text-brand-700 transition-colors bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-2xs active:scale-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Takeaways</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 min-w-[44px] min-h-[44px] rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-brand-700 transition-colors shadow-2xs active:scale-90 flex items-center justify-center"
            title={isFavorite ? "Remove favorite" : "Favorite takeaway"}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-brand-700 text-brand-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Restaurant Hero Showcase (Screenshot 4 & 5 fidelity) */}
      <div className="relative rounded-3xl overflow-hidden shadow-card mb-6 border border-neutral-200/90 bg-neutral-900">
        <div className="aspect-[21/9] sm:aspect-[21/7] w-full overflow-hidden opacity-90">
          <img 
            src={restaurant.coverImageUrl} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>

        {/* Floating Metadata Card */}
        <div className="sm:absolute sm:left-6 sm:bottom-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:shadow-modal border border-neutral-100 sm:max-w-lg m-3 sm:m-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-tight">
                {restaurant.name}
              </h1>
              <p className="text-xs text-neutral-600 font-medium mt-0.5">
                {restaurant.cuisineTypes.join(' • ')} • Stoke-on-Trent
              </p>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-black bg-brand-50 text-brand-950 px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-700 font-medium py-2 border-y border-neutral-100 my-2">
            <span className="flex items-center gap-1 font-bold text-neutral-900">
              <Clock className="w-3.5 h-3.5 text-brand-700" />
              <span>{restaurant.deliverySettings.estimatedDeliveryMins}</span>
            </span>
            <span>•</span>
            <span className={restaurant.deliverySettings.isFreeDelivery ? "text-emerald-700 font-bold" : ""}>
              {restaurant.deliverySettings.isFreeDelivery ? "Free Delivery" : `${formatGBP(restaurant.deliverySettings.deliveryFee)} Delivery`}
            </span>
            <span>•</span>
            <span>Min. {formatGBP(restaurant.deliverySettings.minOrderDelivery)}</span>
          </div>

          {/* Stoke Address, Landline & Food Standards Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-neutral-600 pt-0.5">
            <div className="flex items-center gap-1 truncate max-w-xs">
              <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span className="truncate">{restaurant.address?.street}, {restaurant.address?.town} ({restaurant.address?.postcode})</span>
            </div>

            <FHRSBadge 
              rating={restaurant.fhrsRating || 5} 
              fhrsUrl={restaurant.fhrsUrl} 
              inspectionDate={restaurant.fhrsInspectionDate}
              compact 
            />
          </div>
        </div>
      </div>

      {/* Natasha's Law Allergen Advisory Banner */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-center gap-2 max-w-2xl">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>UK Natasha's Law Food Safety Notice:</strong> Ingredients and allergens for all 14 statutory allergens are verified for every dish. For severe allergies, call the kitchen hotline: <strong className="text-amber-900">01782 698710</strong>.
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setAllergenFilter('all')}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-colors min-h-[32px] ${allergenFilter === 'all' ? 'bg-brand-900 text-white' : 'bg-white text-neutral-700 border border-amber-200 hover:bg-amber-100'}`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => setAllergenFilter('gluten-free')}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-colors min-h-[32px] ${allergenFilter === 'gluten-free' ? 'bg-brand-900 text-white' : 'bg-white text-neutral-700 border border-amber-200 hover:bg-amber-100'}`}
          >
            Gluten-Free
          </button>
          <button
            type="button"
            onClick={() => setAllergenFilter('dairy-free')}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-colors min-h-[32px] ${allergenFilter === 'dairy-free' ? 'bg-brand-900 text-white' : 'bg-white text-neutral-700 border border-amber-200 hover:bg-amber-100'}`}
          >
            Dairy-Free
          </button>
          <button
            type="button"
            onClick={() => setAllergenFilter('nut-free')}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-colors min-h-[32px] ${allergenFilter === 'nut-free' ? 'bg-brand-900 text-white' : 'bg-white text-neutral-700 border border-amber-200 hover:bg-amber-100'}`}
          >
            Nut-Free
          </button>
        </div>
      </div>

      {/* Mobile Sticky Horizontal Categories Bar (Updated top offset to prevent header collision) */}
      <div className="md:hidden sticky top-[116px] sm:top-20 z-20 bg-white/95 backdrop-blur-md py-2.5 border-b border-neutral-200 -mx-4 px-4 mb-4 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xs">
        {restaurant.categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all min-h-[36px] ${
              selectedCatId === cat.id 
                ? 'bg-brand-700 text-white shadow-xs' 
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {cat.name} ({cat.items.length})
          </button>
        ))}
      </div>

      {/* Menu Layout: Category Sidebar (Desktop) + Dish Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
        {/* Left Sticky Sidebar Categories (Desktop) */}
        <div className="hidden md:block md:col-span-1">
          <div className="sticky top-28 bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Menu Sections
            </div>
            {restaurant.categories.map(cat => {
              const isSelected = cat.id === selectedCatId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all min-h-[40px] ${
                    isSelected 
                      ? 'bg-brand-50 text-brand-950 border-r-4 border-brand-700 shadow-2xs' 
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-xs opacity-70 ml-1">({cat.items.length})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Menu Dish Grid */}
        <div className="md:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                {activeCategory?.name}
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                {filteredItems.length} fresh recipes available
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {filteredItems.map(item => {
              const isJustAdded = addedAnimationId === item.id;
              return (
                <div 
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemClick(item);
                    }
                  }}
                  className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-card hover:shadow-card-hover transition-all flex gap-3.5 sm:gap-4 relative overflow-hidden group cursor-pointer active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  {/* Best Seller Tag */}
                  {item.isBestSeller && (
                    <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded bg-brand-700 text-white text-[10px] font-black uppercase tracking-wide shadow-xs">
                      Best Seller
                    </div>
                  )}

                  {/* Dish Photo */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-100 shrink-0 relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base leading-snug mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 mb-2 leading-relaxed font-normal">
                        {item.description}
                      </p>

                      {/* PPDS vs Made to Order badge */}
                      {item.foodPrepType === 'prepacked-ppds' && (
                        <div className="mb-2 space-y-1.5">
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                            <span>PPDS (Natasha's Law Pre-Packed)</span>
                          </div>

                          {/* Full Ingredients List with Allergen Highlighting */}
                          {item.ingredients && (
                            <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] leading-relaxed text-neutral-800">
                              <strong className="text-neutral-900 font-extrabold block mb-0.5">Ingredients (QUID):</strong>
                              <span>{item.ingredients}</span>
                            </div>
                          )}

                          {/* Precautionary Allergen Labeling (PAL) */}
                          {item.mayContain && item.mayContain.length > 0 && (
                            <div className="text-[10px] text-neutral-500 font-medium">
                              <strong className="text-neutral-700">May also contain:</strong> {item.mayContain.join(', ')}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Natasha's Law Allergens Tag List */}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.allergens.map((alg, aIdx) => (
                            <span key={aIdx} className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">
                              {alg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="font-black text-sm sm:text-base text-neutral-900">
                          {formatGBP(item.price)}
                        </span>
                        {item.isCustomizable && (
                          <span className="block text-[10px] text-brand-700 font-bold">
                            Customizable
                          </span>
                        )}
                      </div>

                      {/* Add or Customize Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item);
                        }}
                        className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-all shadow-xs active:scale-90 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : item.isCustomizable 
                            ? 'bg-brand-700 text-white hover:bg-brand-800' 
                            : 'bg-brand-50 hover:bg-brand-700 text-brand-700 hover:text-white'
                        }`}
                        title={item.isCustomizable ? "Build & Customize Meal" : "Add to Order"}
                        aria-label={`Add ${item.name} to order`}
                      >
                        {isJustAdded ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Cart Review Bar (Visible across mobile and desktop with slide-up motion) */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] sm:w-auto sm:min-w-[420px] max-w-lg animate-in slide-in-from-bottom duration-300">
          <button
            type="button"
            onClick={onOpenCart}
            className="w-full py-3.5 px-5 bg-brand-700 hover:bg-brand-800 text-white rounded-full font-black text-sm flex items-center justify-between shadow-xl active:scale-98 min-h-[50px] border border-brand-600 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white text-brand-700 flex items-center justify-center text-xs font-black shadow-xs">
                {cartCount}
              </span>
              <span className="font-extrabold tracking-tight">View Basket</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base">{formatGBP(cartTotal)}</span>
              <span className="text-white/80 text-xs">Review Order →</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
