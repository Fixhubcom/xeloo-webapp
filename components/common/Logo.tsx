
import React from 'react';

interface LogoProps {
  className?: string;
}

const XelooIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 512 512" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    role="img"
    aria-label="Xeloo Logo"
  >
    {/* Yellow Coin Background with Gradient */}
    <circle cx="256" cy="256" r="256" fill="#FDDA1A"/>
    <circle cx="256" cy="256" r="256" fill="url(#coin_shine)" fillOpacity="0.4"/>
    
    {/* Inner Rim */}
    <circle cx="256" cy="256" r="230" stroke="#EAB308" strokeWidth="10" strokeOpacity="0.5"/>

    {/* Money Bag Shadow */}
    <ellipse cx="270" cy="400" rx="120" ry="30" fill="#CA8A04" fillOpacity="0.4"/>

    {/* Money Bag Shape */}
    <path 
        d="M256 120C220 120 190 150 190 180C190 210 210 230 180 280C160 313 160 360 180 390C200 420 312 420 332 390C352 360 352 313 332 280C302 230 322 210 322 180C322 150 292 120 256 120Z" 
        fill="#041401"
    />
    
    {/* Bag Tie/Rope */}
    <path 
        d="M210 180L220 190H292L302 180" 
        stroke="#FDDA1A" 
        strokeWidth="12" 
        strokeLinecap="round"
    />
    
    {/* The 'X' Symbol */}
    <text 
        x="256" 
        y="330" 
        fontSize="140" 
        fontFamily="sans-serif" 
        fontWeight="900" 
        fill="#FDDA1A" 
        textAnchor="middle"
    >
        X
    </text>
    
    {/* Money Bag Highlights */}
    <path d="M290 140C290 140 270 130 250 130" stroke="white" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.2"/>
    <ellipse cx="220" cy="300" rx="20" ry="40" fill="white" fillOpacity="0.05" transform="rotate(-20 220 300)"/>

    <defs>
      <radialGradient id="coin_shine" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 150) rotate(45) scale(300)">
        <stop stopColor="white"/>
        <stop offset="1" stopColor="#EAB308" stopOpacity="0"/>
      </radialGradient>
    </defs>
  </svg>
);

const Logo: React.FC<LogoProps> = ({ className = 'text-3xl' }) => {
  // Determine icon size based on the text size class passed for responsiveness
  const isLarge = className.includes('text-4xl') || className.includes('text-5xl') || className.includes('text-6xl');
  const iconSizeClass = isLarge ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-8 h-8 sm:w-10 sm:h-10';

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none`}>
      <XelooIcon className={`${iconSizeClass} flex-shrink-0 shadow-sm rounded-full`} />
      {/* Used text-inherit to ensure logo matches the header color (white on landing, dark on light mode dashboard) */}
      <h1 className={`font-bold tracking-tight hidden sm:flex items-baseline ${className} text-inherit`}>
        <span>Xeloo</span>
        <span className="text-accent">.</span>
      </h1>
    </div>
  );
};

export default Logo;
