import React from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative'>
        <button
          type='button'
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl'
        >
          &times;
        </button>
        {title && (
          <h2 className='text-xl font-semibold mb-4 text-[#1E240A]'>{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
