import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className={`
        ${sizes[size]}
        border-black border-t-transparent
        rounded-full animate-spin
      `} />
      {text && (
        <p className="font-bold text-neutral-800 uppercase tracking-wide text-sm">
          {text}
        </p>
      )}
    </div>
  );
}
