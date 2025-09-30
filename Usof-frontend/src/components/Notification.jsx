import PlusIcon from '../assets/Icon/plus-icon.svg?react';
import { useEffect, useState } from 'react';

export default function Notification({ message, isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed right-8 top-8 z-50 
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className='bg-[var(--color-background-secondary)] text-white border border-[var(--color-border)] p-4 rounded-xl shadow-lg relative min-w-[300px]'>
        <button
          onClick={onClose}
          className='absolute top-1/2 right-4 transform -translate-y-1/2 focus:outline-none hover:opacity-70 transition-opacity'
        >
          <PlusIcon
            className='w-4 h-4 text-white'
            style={{ rotate: '45deg' }}
          />
        </button>
        <div className='pr-6'>{message}</div>
      </div>
    </div>
  );
}
