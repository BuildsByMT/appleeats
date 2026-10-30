import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Cuisines', icon: '🍽️' },
  { id: 'Burgers', name: 'Burgers', icon: '🍔' },
  { id: 'Pizza', name: 'Artisan Pizza', icon: '🍕' },
  { id: 'Fish & Chips', name: 'Fish & Chips', icon: '🐟' },
  { id: 'Grill', name: 'Grill & BBQ', icon: '🥩' },
  { id: 'Fried Chicken', name: 'Fried Chicken', icon: '🍗' },
  { id: 'Pasta', name: 'Italian / Pasta', icon: '🍝' },
  { id: 'Naga', name: 'Sylheti Naga', icon: '🌶️' },
  { id: 'Desserts', name: 'Desserts', icon: '🍰' },
  { id: 'Healthy', name: 'Bowls & Wraps', icon: '🥗' },
];

export default function CategoryCarousel({ selectedCategory, onSelectCategory }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative my-4 sm:my-6 group">
      
      {/* Scroll Left Button (Desktop only) */}
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Scroll left categories"
        className="hidden md:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-neutral-200 items-center justify-center text-neutral-700 hover:text-brand-700 hover:bg-neutral-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-brand-700 active:scale-90"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Categories Horizontal Carousel */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scroll-smooth no-scrollbar snap-x snap-mandatory px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        role="region"
        aria-label="Cuisine categories"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id || (selectedCategory === '' && cat.id === 'all');
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id === 'all' ? '' : cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border snap-start min-h-[44px] active:scale-95 cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-brand-50 border-brand-700 text-brand-900 shadow-xs ring-2 ring-brand-700/20'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <span className="text-base sm:text-lg leading-none" aria-hidden="true">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button (Desktop only) */}
      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Scroll right categories"
        className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-neutral-200 items-center justify-center text-neutral-700 hover:text-brand-700 hover:bg-neutral-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-brand-700 active:scale-90"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

    </div>
  );
}
