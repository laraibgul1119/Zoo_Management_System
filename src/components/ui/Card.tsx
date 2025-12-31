import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'flat';
  hover?: boolean;
}

export function Card({
  children,
  className = '',
  title,
  action,
  variant = 'default',
  hover = false
}: CardProps) {
  const variants = {
    default: 'bg-white border-4 border-black shadow-brutal',
    elevated: 'bg-white border-4 border-black shadow-brutal-lg',
    flat: 'bg-white border-4 border-black'
  };
  
  const hoverEffect = hover ? 'hover:shadow-brutal-xl hover:-translate-y-1 transition-brutal cursor-pointer' : '';
  
  return (
    <div className={`${variants[variant]} ${hoverEffect} p-6 ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b-3 border-black">
          {title && (
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              {title}
            </h2>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}