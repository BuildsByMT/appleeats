import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function FHRSBadge({
  rating = 5,
  inspectionDate = '14 October 2024',
  localAuthority = 'Stoke-on-Trent City Council',
  fhrsUrl = 'https://ratings.food.gov.uk',
  variant = 'compact' // 'compact' | 'full'
}) {
  const ratingDescriptors = {
    5: 'VERY GOOD',
    4: 'GOOD',
    3: 'SATISFACTORY',
    2: 'IMPROVEMENT NECESSARY',
    1: 'MAJOR IMPROVEMENT REQUIRED',
    0: 'URGENT IMPROVEMENT REQUIRED'
  };

  const descriptor = ratingDescriptors[rating] || 'VERY GOOD';

  if (variant === 'compact') {
    return (
      <a
        href={fhrsUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`UK Food Standards Agency Hygiene Rating: ${rating}/5 (${descriptor}) - Inspected by ${localAuthority}`}
        aria-label={`UK Food Standards Agency Hygiene Rating ${rating} out of 5 (${descriptor})`}
        className="inline-flex items-center gap-1.5 bg-[#1B5E20] hover:bg-[#144718] text-white px-2 py-0.5 rounded-md text-[11px] font-black tracking-tight transition-all shadow-2xs group focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:outline-none"
      >
        <span className="bg-black/40 px-1 py-0.2 rounded text-[9px] uppercase font-bold tracking-widest text-[#A5D6A7]">
          FHRS
        </span>
        <span>{rating}/5 {descriptor}</span>
        <ExternalLink aria-hidden="true" className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
      </a>
    );
  }

  return (
    <div className="bg-[#E8F5E9] border border-[#81C784] rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-neutral-800">
      <div className="flex items-center gap-3">
        {/* FSA Green Rating Dial */}
        <div className="w-14 h-14 bg-[#1B5E20] rounded-xl flex flex-col items-center justify-center text-white shrink-0 shadow-sm border border-emerald-700">
          <span className="text-[9px] font-black tracking-widest text-[#A5D6A7] uppercase leading-none">FOOD HYGIENE</span>
          <span className="text-2xl font-black leading-none mt-0.5">{rating}</span>
          <span className="text-[8px] font-bold text-white/80">OUT OF 5</span>
        </div>
        
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[#1B5E20] uppercase tracking-wider">
              FOOD STANDARDS AGENCY SCHEME: {descriptor}
            </span>
          </div>
          <div className="text-[11px] text-neutral-700 mt-0.5 font-medium">
            Inspected: <strong className="text-neutral-900">{inspectionDate}</strong> • Authority: {localAuthority}
          </div>
        </div>
      </div>

      <a
        href={fhrsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Verify Food Standards Agency hygiene rating at ratings.food.gov.uk (opens in new tab)`}
        className="inline-flex items-center gap-1 text-xs font-bold text-[#1B5E20] hover:text-[#0D3811] underline underline-offset-2 shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-sm"
      >
        <span>Verify at ratings.food.gov.uk</span>
        <ExternalLink aria-hidden="true" className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
