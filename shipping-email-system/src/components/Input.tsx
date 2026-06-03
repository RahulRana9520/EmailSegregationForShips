import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="font-bold">{label}</label>}
      <input
        className="neo-border neo-shadow px-4 py-2 focus:outline-none focus:ring-0 focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all bg-white"
        {...props}
      />
    </div>
  );
};
