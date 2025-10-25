import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getAllCategories } from '../http/categoriesApi';

export default function CategoriesModal({
  isOpen,
  onClose,
  categories,
  onSelectCategory,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className='fixed inset-0 bg-black/40 z-40'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className='fixed right-0 top-0 h-full w-75 bg-[var(--color-background-profile)] shadow-lg z-50 p-6 flex flex-col border border-[var(--color-border)]'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl text-white font-semibold'>Категорії</h2>
              <button
                onClick={onClose}
                className='text-gray-500 hover:text-white transition'
              >
                ✕
              </button>
            </div>

            <ul className='space-y-2 overflow-y-auto'>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li
                    key={cat.id || JSON.stringify(cat)}
                    onClick={() => {
                      onSelectCategory?.(cat);
                      onClose();
                    }}
                    className=' text-white p-4 bg-[#3c3c3c] border border-[var(--color-border)] rounded-lg cursor-pointer transition'
                  >
                    {cat.title ||
                      cat.name ||
                      (typeof cat === 'string' ? cat : '')}
                  </li>
                ))
              ) : (
                <p className='text-gray-500'>Немає категорій</p>
              )}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
