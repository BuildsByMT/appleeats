import React, { useState } from 'react';
import { Star, Heart, Clock, Tag, Sparkles } from 'lucide-react';
import FHRSBadge from './FHRSBadge';
import { formatGBP } from '../utils/currency';

export default function RestaurantCard({ restaurant, onSelect }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Dynamic promo tags for the Stoke takeaways
  const promoTag = restaurant.id === 'rest-fish-lounge' 
    ? "50% off with EATS50"
    : restaurant.id === 'rest-go-grill'
    ? "Free Cheesecake over £30"
    : restaurant.id === 'rest-crispy-chicken'
    ? "30% off with TREATS"
    : "Free Delivery over £15";

  return (
    <div 
      onClick={() => onSelect(restaurant)}
      className="group bg-white rounded-card border border-neutral-200/90 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col active:scale-[0.99] focus-within:ring-2 focus-within:ring-brand-700"
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(restaurant);
        }
      }}
      aria-label={`${restaurant.name} takeaway in Stoke-on-Trent, ${restaurant.cuisineTypes.join(', ')}`}
    >
      {/* Cover Photo & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <img 
          src={restaurant.coverImageUrl} 
          alt={`${restaurant.name} storefront`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 min-w-[38px] min-h-[38px] rounded-full bg-white/95 backdrop-blur-md shadow-xs hover:bg-white text-neutral-700 hover:text-brand-700 transition-transform active:scale-90 z-10 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-700"
          title={isFavorite ? "Remove from favorites" : "Save to favorites"}
          aria-label={isFavorite ? `Remove ${restaurant.name} from favorites` : `Save ${restaurant.name} to favorites`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-brand-700 text-brand-700 scale-110' : ''}`} />
        </button>

        {/* Client-Owned Anchor Badge */}
        {restaurant.isClientOwned && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-700 text-white text-[11px] font-extrabold shadow-md tracking-wide flex items-center gap-1 z-10">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Apple Eats Choice</span>
          </div>
        )}

        {/* Promo Ribbon */}
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-neutral-900/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 z-10">
          <Tag className="w-3 h-3 text-amber-400" />
          <span>{promoTag}</span>
        </div>
      </div>

      {/* Takeaway Info Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Name & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-black text-neutral-900 text-base sm:text-lg group-hover:text-brand-700 transition-colors tracking-tight leading-snug">
              {restaurant.name}
            </h3>
            
            <div className="flex items-center gap-1 shrink-0 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-xs text-neutral-900">{restaurant.rating.toFixed(1)}</span>
              <span className="text-[10px] text-neutral-500 font-semibold">({restaurant.reviewCount})</span>
            </div>
          </div>

          {/* Cuisines Subtitle */}
          <p className="text-xs text-neutral-600 font-medium mb-3">
            {restaurant.cuisineTypes.join(' • ')}
          </p>

          {/* Official Food Hygiene Rating (FHRS) Badge */}
          <div className="mb-3">
            <FHRSBadge rating={restaurant.fhrsRating || 5} isOfficial />
          </div>
        </div>

        {/* Footer Row: Delivery ETA & Cost */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600 font-medium">
          <div className="flex items-center gap-1.5 text-neutral-800 font-semibold">
            <Clock className="w-3.5 h-3.5 text-brand-700" />
            <span>{restaurant.deliverySettings?.estimatedDeliveryTimeMinutes || '25-35'} mins</span>
          </div>

          <div>
            {restaurant.deliverySettings?.deliveryFee === 0 ? (
              <span className="text-emerald-700 font-extrabold">Free Delivery</span>
            ) : (
              <span>£{restaurant.deliverySettings?.deliveryFee ? Number(restaurant.deliverySettings.deliveryFee).toFixed(2) : '0.99'} delivery</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
