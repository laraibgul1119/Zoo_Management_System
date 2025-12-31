import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-secondary text-white',
    error: 'bg-accent-red text-white',
    warning: 'bg-accent-yellow text-black',
    info: 'bg-primary text-white'
  };

  return (
    <div className={`
      fixed bottom-6 right-6 z-50
      flex items-center gap-3 p-4 pr-12
      border-3 border-black shadow-brutal-lg
      ${styles[type]}
      animate-in slide-in-from-bottom-5 duration-300
      min-w-[300px] max-w-md
    `}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="font-bold text-sm flex-1">{message}</p>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 hover:bg-black/20 rounded transition-brutal"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
