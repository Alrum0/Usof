import { motion, AnimatePresence } from 'framer-motion';
import Star from '../assets/Icon/stars2.png';
import { useState, useEffect } from 'react';
import { getUserStars } from '../http/userApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';

import BuyStarsModal from './BuyStarsModal';

export default function StarsModal({ isOpen, onClose }) {
  const [isBuyStarsModalOpen, setIsBuyStarsModalOpen] = useState(false);
  const [starsBalance, setStarsBalance] = useState(0);
  const { showNotification } = useNotification();

  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    const fetchStarsBalance = async () => {
      try {
        const response = await getUserStars(userId);
        setStarsBalance(response.data.stars_balance);
      } catch (error) {
        showNotification(
          error.response?.data?.message ||
            'Не вдалося завантажити баланс зірок.'
        );
      }
    };

    if (isOpen && userId) {
      fetchStarsBalance();
    }
  }, [userId, isOpen, showNotification]);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-notification)] px-6 pt-10 pb-10 rounded-lg flex flex-col items-center shadow-lg'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex gap-2'>
              <img src={Star} alt='Stars' className='w-8 h-8' />
              <span className='text-[#dfdfdf] text-3xl font-semibold'>
                {starsBalance}
              </span>
            </div>
            <span className='text-[var(--color-text)] text-sm mt-2'>
              ваш баланс
            </span>
            <button
              className='bg-[#007aff] text-white px-16 py-3 text-sm mt-6 rounded-xl cursor-pointer'
              onClick={() => setIsBuyStarsModalOpen(true)}
            >
              Купити більше зірок
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      <BuyStarsModal
        isOpen={isBuyStarsModalOpen}
        onClose={() => setIsBuyStarsModalOpen(false)}
      />
    </>
  );
}
