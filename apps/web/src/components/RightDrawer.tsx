import { ReactNode, useEffect } from 'react';

interface RightDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClassName?: string; // e.g., 'w-[360px]'
  side?: 'right' | 'left';
}

export function RightDrawer({
  open,
  onClose,
  title,
  children,
  widthClassName = 'w-[360px]',
  side = 'right',
}: RightDrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const sideClass = side === 'right' ? 'right-0' : 'left-0';
  const borderClass = side === 'right' ? 'border-l' : 'border-r';
  const enterTransform = side === 'right' ? 'translate-x-0' : '-translate-x-0';

  const handleOverlayKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClose();
    }
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 z-50'>
      <div
        className='absolute inset-0 bg-black/40 transition-opacity duration-300 opacity-100'
        onClick={onClose}
        role='button'
        tabIndex={0}
        aria-label='Close drawer'
        onKeyDown={handleOverlayKeyDown}
      />
      <aside
        className={`absolute ${sideClass} top-0 h-full bg-white dark:bg-gray-900 ${borderClass} border-gray-200 dark:border-gray-800 shadow-xl ${widthClassName} flex flex-col transform-gpu transition-transform duration-300 ${enterTransform}`}
      >
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800'>
          <h3 className='font-semibold'>{title}</h3>
          <button
            type='button'
            onClick={onClose}
            className='text-2xl leading-none px-2 hover:opacity-70'
            aria-label='Close drawer'
          >
            ×
          </button>
        </div>
        <div className='flex-1 overflow-y-auto p-5'>{children}</div>
      </aside>
    </div>
  );
}
