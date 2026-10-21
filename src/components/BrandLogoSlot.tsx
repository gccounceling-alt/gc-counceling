import React from 'react';
import { Compass } from 'lucide-react';

interface BrandLogoSlotProps {
  customLogoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogoSlot: React.FC<BrandLogoSlotProps> = ({
  customLogoUrl,
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  // If an uploaded GCC logo URL is configured, render it directly
  if (customLogoUrl && customLogoUrl.trim().length > 0) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={customLogoUrl}
          alt="GCC – Global Career Counselling"
          className={
            size === 'sm' ? 'h-8 object-contain' : size === 'lg' ? 'h-14 object-contain' : 'h-10 object-contain'
          }
        />
        {showTagline && (
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-white text-sm sm:text-base">
              GCC
            </span>
            <span className="text-[10px] text-amber-400 font-medium tracking-wide">
              Global Career Counselling
            </span>
          </div>
        )}
      </div>
    );
  }

  // Official GCC Brand Emblem & Lettermark Slot
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-amber-500/40 shadow-sm flex-shrink-0 ${
          size === 'sm'
            ? 'w-8 h-8'
            : size === 'lg'
            ? 'w-12 h-12'
            : 'w-10 h-10'
        }`}
      >
        {/* Subtle gold emblem backdrop */}
        <div className="absolute inset-0 rounded-xl bg-amber-400/5" />
        <Compass
          className={`text-amber-400 ${
            size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
          }`}
        />
      </div>

      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight text-white leading-none ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base sm:text-lg'
            }`}
          >
            G<span className="text-amber-400">C</span>C
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 border-l border-zinc-700 pl-1.5">
            Global
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] font-medium text-amber-400/90 tracking-wide mt-0.5 leading-tight">
            Career Counselling
          </span>
        )}
      </div>
    </div>
  );
};
