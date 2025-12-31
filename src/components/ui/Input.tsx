import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  textarea?: boolean;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  textarea = false,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const baseStyles = 'w-full border-3 border-black p-3 font-medium text-base focus:outline-none focus:ring-4 focus:ring-accent-yellow/50 focus:border-primary transition-brutal shadow-brutal-sm';
  const errorStyles = error ? 'border-accent-red bg-red-50' : 'bg-white';
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={inputId} 
        className="block font-bold text-black uppercase tracking-wide mb-2 text-sm"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-800">
            {icon}
          </div>
        )}
        
        {textarea ? (
          <textarea 
            id={inputId} 
            className={`${baseStyles} ${errorStyles} ${icon ? 'pl-10' : ''} min-h-[120px] resize-none`} 
            {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>} 
          />
        ) : (
          <input 
            id={inputId} 
            className={`${baseStyles} ${errorStyles} ${icon ? 'pl-10' : ''}`} 
            {...props as React.InputHTMLAttributes<HTMLInputElement>} 
          />
        )}
      </div>

      {error && (
        <p className="mt-2 text-accent-red font-bold text-sm flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}