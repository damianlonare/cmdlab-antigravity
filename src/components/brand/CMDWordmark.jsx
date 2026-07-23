import React from 'react';

/**
 * CMD Lab Official Handwritten Tag Wordmark: "xCMDLABx"
 * Features multi-color letter tag colors matching Page 1, 3, 4 & 5 of the PDF:
 * x (Lime) C (Teal) M (Pink) D (Orange) L (Purple) A (Yellow) B (Lime) x (Lime)
 */
export const CMDWordmark = ({ size = "text-xl", className = "", monochrome = false }) => {
  if (monochrome) {
    return (
      <span className={`font-black tracking-tighter uppercase font-mono ${size} ${className} text-white`}>
        <span className="opacity-60 text-xs mr-0.5">x</span>
        <span>CMDLAB</span>
        <span className="opacity-60 text-xs ml-0.5">x</span>
      </span>
    );
  }

  return (
    <span className={`font-black tracking-tight uppercase select-none font-mono ${size} ${className} inline-flex items-center gap-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]`}>
      <span className="text-lime-400 font-sans text-[0.7em] font-bold tracking-widest leading-none transform -rotate-12 translate-y-[-1px]">x</span>
      <span className="text-cyan-400 font-extrabold transform hover:scale-110 transition-transform">C</span>
      <span className="text-pink-500 font-extrabold transform hover:scale-110 transition-transform">M</span>
      <span className="text-orange-500 font-extrabold transform hover:scale-110 transition-transform">D</span>
      <span className="text-purple-400 font-extrabold transform hover:scale-110 transition-transform">L</span>
      <span className="text-yellow-400 font-extrabold transform hover:scale-110 transition-transform">A</span>
      <span className="text-lime-400 font-extrabold transform hover:scale-110 transition-transform">B</span>
      <span className="text-lime-400 font-sans text-[0.7em] font-bold tracking-widest leading-none transform rotate-12 translate-y-[-1px]">x</span>
    </span>
  );
};
