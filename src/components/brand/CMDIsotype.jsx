import React from 'react';

/**
 * CMD Lab Official Isotype Symbol: "C + // + # + Ganchos"
 * Recreated with exact geometry from the official brand identity guide.
 */
export const CMDIsotype = ({ className = "w-8 h-8", color = "currentColor", glow = false }) => {
  return (
    <svg 
      viewBox="0 0 160 90" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]' : ''}`}
    >
      {/* 
        Official CMD Isotype shape:
        Left: Rounded C-hook capsule loop.
        Right: Parallel slashes crossed by horizontal bars (# sharp/hash element).
      */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="
          M 42 16 
          C 24 16 10 30 10 45 
          C 10 60 24 74 42 74 
          L 70 74 
          L 65 60 
          L 42 60 
          C 33 60 25 53 25 45 
          C 25 37 33 30 42 30 
          L 80 30 
          L 85 16 
          Z
          
          M 90 16 
          L 150 16 
          L 145 30 
          L 98 30 
          L 91 50 
          L 140 50 
          L 135 64 
          L 86 64 
          L 79 84 
          L 65 84 
          L 72 64 
          L 60 64 
          L 55 50 
          L 67 50 
          L 74 30 
          L 62 30 
          L 57 16 
          L 69 16 
          L 76 16 
          Z

          M 103 16 
          L 140 16 
          L 135 30 
          L 98 30 
          Z

          M 91 50 
          L 130 50 
          L 125 64 
          L 86 64 
          Z
        "
        fill={color} 
      />
      
      {/* Precision Geometric Cuts based on C + // + # + Ganchos */}
      <path
        d="
          M 42 16
          H 145
          L 140 30
          H 42
          C 33.7 30 26 36.7 26 45
          C 26 53.3 33.7 60 42 60
          H 65
          L 60 74
          H 42
          C 25.4 74 10 59.8 10 45
          C 10 30.2 25.4 16 42 16
          Z
        "
        fill={color}
      />
      
      {/* Tilted parallel slash bars (#) */}
      <path
        d="
          M 85 10 L 63 80 H 77 L 99 10 H 85 Z
          M 112 10 L 90 80 H 104 L 126 10 H 112 Z
          M 48 30 H 150 V 44 H 44 Z
          M 40 54 H 142 V 68 H 36 Z
        "
        fill={color}
        style={{ mixBlendMode: 'destination-out' }}
      />
      
      {/* Solid Composite Isotype Path */}
      <g fill={color}>
        {/* Outer C Curve */}
        <path d="M 40 14 C 23.4 14 10 27.4 10 44 C 10 60.6 23.4 74 40 74 H 65 L 61.5 62 H 40 C 30 62 22 54 22 44 C 22 34 30 26 40 26 H 75 L 78.5 14 H 40 Z" />
        {/* Top Horizontal Bar */}
        <path d="M 60 14 H 146 L 142.5 26 H 76.5 Z" />
        {/* Bottom Horizontal Bar */}
        <path d="M 50 48 H 136 L 132.5 60 H 46.5 Z" />
        {/* Slanted Slash Left */}
        <path d="M 84 14 L 64 74 H 76 L 96 14 H 84 Z" />
        {/* Slanted Slash Right */}
        <path d="M 110 14 L 90 74 H 102 L 122 14 H 110 Z" />
      </g>
    </svg>
  );
};
