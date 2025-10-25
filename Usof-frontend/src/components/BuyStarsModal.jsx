import { motion, AnimatePresence } from 'framer-motion';
import Star from '../assets/Icon/stars2.png';
import { useState } from 'react';
import { giveStarToUser } from '../http/userApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';

export default function BuyStarsModal({ isOpen, onClose }) {
  const [selectedStars, setSelectedStars] = useState(null);
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const userId = useSelector((state) => state.auth.user?.id);

  if (!isOpen) return null;

  const handleBuyStars = async () => {
    if (!selectedStars) {
      showNotification('Будь ласка, виберіть кількість зірок ⭐');
      return;
    }

    try {
      setIsLoading(true);
      const response = await giveStarToUser(selectedStars);
      showNotification(response?.data?.message || 'Зірки успішно придбані!');
      onClose();
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Сталася помилка. Спробуйте ще раз.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const starPacks = [
    { count: 250, price: '199,00₴' },
    { count: 500, price: '389,00₴' },
    { count: 1000, price: '779,00₴' },
    { count: 2500, price: '1 929,00₴' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className='bg-[var(--color-notification)] px-6 pt-10 pb-6 rounded-lg flex flex-col items-center shadow-lg border border-[var(--color-border)] w-[90%] sm:w-[60%] md:w-[40%]'
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex flex-col gap-4 items-center'>
            <img src={Star} alt='Stars' className='w-24 h-24 mx-auto' />
            <span className='text-[#dfdfdf] text-xs font-medium text-center'>
              Виберіть, скільки зірок ви хочете придбати.
            </span>
          </div>

          <ul className='mt-6 w-full'>
            {starPacks.map(({ count, price }) => (
              <li
                key={count}
                className={`flex justify-between px-6 py-2 rounded-lg cursor-pointer transition mt-4
                  ${
                    selectedStars === count
                      ? 'bg-[#3c3c3c] border border-yellow-400'
                      : 'bg-[#282828] hover:bg-[#333333]'
                  }`}
                onClick={() => setSelectedStars(count)}
              >
                <span className='text-sm text-white'>{count} зірок</span>
                <span className='text-sm text-[#9e9e9e]'>{price}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleBuyStars}
            disabled={isLoading}
            className={`mt-6 px-8 py-2 rounded-md text-black font-semibold bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Зачекайте...' : 'Придбати'}
          </button>

          <p className='text-[13px] text-[#818181] text-nowrap text-center mt-4'>
            Продовжуючи та купуючи зірки, ви погоджуєтеся з <br />
            <span className='text-[#3869d6] cursor-pointer hover:underline'>
              Умовами
            </span>
            .
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
