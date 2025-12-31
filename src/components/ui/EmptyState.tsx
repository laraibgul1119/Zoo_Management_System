import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4 border-4 border-black shadow-brutal">
        <Icon className="w-10 h-10 text-neutral-400" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2 uppercase tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-neutral-600 font-medium mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-primary text-white font-bold border-3 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-brutal uppercase tracking-wide"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
