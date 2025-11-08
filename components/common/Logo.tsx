
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'text-3xl' }) => {
  return (
    <h1 className={`font-bold ${className}`}>
      <span className="text-white">Xeloo</span>
      <span className="text-accent">.</span>
    </h1>
  );
};

export default Logo;
