import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-bold border-3 border-black transition-brutal active-brutal disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide';
  
  const variants = {
    primary: 'bg-primary text-white shadow-brutal hover:bg-primary-dark hover:shadow-brutal-lg',
    secondary: 'bg-secondary text-white shadow-brutal hover:bg-secondary-dark hover:shadow-brutal-lg',
    danger: 'bg-accent-orange text-white shadow-brutal hover:bg-red-600 hover:shadow-brutal-lg',
    outline: 'bg-white text-black shadow-brutal hover:bg-neutral-50 hover:shadow-brutal-lg',
    ghost: 'bg-transparent border-2 text-black hover:bg-black hover:text-white'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const width = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`} 
      disabled={isLoading || disabled} 
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}