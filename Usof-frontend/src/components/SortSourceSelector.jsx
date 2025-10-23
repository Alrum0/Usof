import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SortSourceSelector({
  isOpen,
  onClose,
  onSelect,
  selectedSort = 'date_desc',
}) {
  const [sort, setSort] = useState(selectedSort);

  useEffect(() => {
    setSort(selectedSort);
  }, [selectedSort]);

  const sorts = [
    { value: 'date_desc', label: 'Найновіші' },
    { value: 'date_asc', label: 'Старіші' },
    { value: 'likes_desc', label: 'Більше лайків' },
    { value: 'likes_asc', label: 'Менше лайків' },
  ];

  const handleSelectSort = (value) => {
    setSort(value);
  };

  const handleApply = () => {
    if (onSelect) onSelect(sort);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.12 }}
          className='absolute top-12 right-0 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl shadow-lg w-64 z-50 p-3'
        >
          <div className='text-xs text-[var(--color-text)] font-medium mb-2'>
            Сортування
          </div>
          <ul className='flex flex-col gap-1 mb-3'>
            {sorts.map((s) => (
              <li
                key={s.value}
                className={`px-3 py-2 rounded-lg cursor-pointer text-white hover:bg-[#2f2f2f] ${
                  sort === s.value
                    ? 'bg-[#2b2b2b] ring-1 ring-[var(--color-border)]'
                    : ''
                }`}
                onClick={() => handleSelectSort(s.value)}
              >
                {s.label}
              </li>
            ))}
          </ul>

          <div className='flex justify-end gap-2'>
            <button
              onClick={onClose}
              className='px-3 py-1 rounded-md text-[var(--color-text)] hover:bg-[#2f2f2f]'
            >
              Відмінити
            </button>
            <button
              onClick={handleApply}
              className='px-3 py-1 rounded-md bg-[var(--color-accent)] text-black font-medium'
            >
              Застосувати
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
