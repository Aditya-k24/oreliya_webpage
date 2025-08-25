import { useEffect } from 'react';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export function Toaster({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => onRemove(toasts[0].id), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toasts, onRemove]);

  return (
    <div className='fixed top-6 right-6 z-50 space-y-2'>
      {toasts.map(t => {
        let bgClass = 'bg-[#BFA16A]';
        if (t.type === 'success') bgClass = 'bg-green-600';
        else if (t.type === 'error') bgClass = 'bg-red-600';
        return (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow-lg text-white font-medium transition-all ${bgClass}`}
          >
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
