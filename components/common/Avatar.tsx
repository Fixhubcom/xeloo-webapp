
import React from 'react';

interface AvatarProps {
  initials: string;
  bgColor: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ initials, bgColor, className = 'w-10 h-10' }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
