import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = '' 
}: AlertProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-green-50 border-l-secondary text-green-900',
    error: 'bg-red-50 border-l-accent-red text-red-900',
    warning: 'bg-yellow-50 border-l-accent-yellow text-yellow-900',
    info: 'bg-blue-50 border-l-primary text-blue-900'
  };

  const iconBg = {
    success: 'bg-secondary',
    error: 'bg-accent-red',
    warning: 'bg-accent-yellow',
    info: 'bg-primary'
  };

  return (
    <div className={`
      flex items-start gap-3 p-4 
      border-l-4 border-3 border-black shadow-brutal-sm
      ${styles[type]} ${className}
    `}>
      <div className={`
        p-2 rounded-full shrink-0 border-2 border-black
        ${iconBg[type]} ${type === 'warning' ? 'text-black' : 'text-white'}
      `}>
        {icons[type]}
      </div>
      <div className="flex-1">
        {title && (
          <h4 className="font-bold text-sm mb-1">{title}</h4>
        )}
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/10 rounded transition-brutal shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
