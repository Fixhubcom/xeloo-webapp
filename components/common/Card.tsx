import React from 'react';

// FIX: Extend CardProps to include standard HTML div attributes. This allows passing props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-primary-light border border-gray-200 dark:border-primary rounded-lg shadow-lg p-6 ${className}`}
      // FIX: Spread the rest of the props onto the div element to allow passing standard div attributes.
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;