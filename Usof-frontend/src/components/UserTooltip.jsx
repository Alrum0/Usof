const BASE_URL = import.meta.env.VITE_API_URL;
import { motion } from 'framer-motion';

export default function UserTooltip({
  userData,
  onMouseEnter,
  onMouseLeave,
  following,
  loading,
  onFollow,
  onOpenUnfollow,
  isVisible,
}) {
  // Додаємо перевірку на isVisible для анімації
  if (!isVisible) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className='bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-md shadow-lg p-4 w-[360px] absolute top-10 z-[60]'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='flex justify-between items-center px-3'>
        <div className='flex flex-col gap-0.5'>
          <h2 className='text-white text-xl font-medium'>
            {userData?.authorFullName}
          </h2>
          <h3 className='text-white text-[14px] font-normal'>
            {userData?.authorName}
          </h3>
        </div>
        <div className='relative w-18 h-18'>
          <img
            src={`${BASE_URL}/${userData?.authorAvatar}`}
            alt='logo profile'
            className='w-18 h-18 rounded-full object-cover'
          />
        </div>
      </div>
      <div className='-mt-1 px-3'>
        <span className='text-[var(--color-text)] text-[14px] font-normal'>
          686 читачів
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          following ? onOpenUnfollow() : onFollow();
        }}
        className={`text-x py-2 border border-[var(--color-border)] mt-2 rounded-lg w-full cursor-pointer 
    ${following ? 'text-white bg-transparent' : 'text-black bg-white'}
  `}
        disabled={loading}
      >
        {following ? 'Відстежується' : 'Follow'}
      </button>
    </motion.section>
  );
}
