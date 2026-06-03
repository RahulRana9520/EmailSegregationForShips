import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  color?: 'white' | 'yellow' | 'cyan' | 'pink' | 'purple' | 'green';
}

export const Card: React.FC<CardProps> = ({ children, title, className = '', color = 'white' }) => {
  const bgClasses = {
    white: 'bg-white',
    yellow: 'bg-color-neo-yellow',
    cyan: 'bg-color-neo-cyan',
    pink: 'bg-color-neo-pink',
    purple: 'bg-color-neo-purple',
    green: 'bg-color-neo-green',
  };

  return (
    <div className={`neo-card ${bgClasses[color]} ${className}`}>
      {title && (
        <div className="border-b-[3px] border-[#111] pb-2 mb-4">
          <h3 className="font-bold text-xl">{title}</h3>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
