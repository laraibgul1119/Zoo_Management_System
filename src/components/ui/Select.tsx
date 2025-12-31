import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={selectId} 
        className="block font-bold text-black uppercase tracking-wide mb-2 text-sm"
      >
        {label}
      </label>
      <div className="relative">
        <select 
          id={selectId} 
          className={`
            w-full border-3 border-black p-3 font-medium text-base appearance-none bg-white
            focus:outline-none focus:ring-4 focus:ring-accent-yellow/50 focus:border-primary transition-brutal
            shadow-brutal-sm pr-10
            ${error ? 'border-accent-red bg-red-50' : ''}
          `} 
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
      {error && (
        <p className="mt-2 text-accent-red font-bold text-sm flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}