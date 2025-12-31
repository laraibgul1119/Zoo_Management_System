import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md'
}: BadgeProps) {
  const variants = {
    success: 'bg-secondary text-white',
    warning: 'bg-accent-yellow text-black',
    danger: 'bg-accent-red text-white',
    neutral: 'bg-neutral-200 text-black',
    info: 'bg-primary text-white'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  return (
    <span className={`
      inline-flex items-center 
      border-2 border-black font-bold uppercase tracking-wide
      shadow-brutal-sm
      ${variants[variant]}
      ${sizes[size]}
    `}>
      {children}
    </span>
  );
}