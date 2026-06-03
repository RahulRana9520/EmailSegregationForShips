import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-bold transition-all neo-border neo-shadow inline-block cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none';
  
  const variantClasses = {
    primary: 'bg-color-neo-yellow text-foreground hover:bg-yellow-300',
    secondary: 'bg-white text-foreground hover:bg-gray-100',
    danger: 'bg-color-neo-pink text-foreground hover:bg-pink-400',
    success: 'bg-color-neo-green text-foreground hover:bg-green-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
