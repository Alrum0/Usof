const BASE_URL = import.meta.env.VITE_API_URL;

import { useNotification } from '../context/NotificationContext';

export default function UnfollowModel({
  isOpen,
  onClose,
  userData,
  handleUnfollow,
}) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50'>
      <div className='absolute inset-0 bg-black opacity-50' onClick={onClose} />

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-background-secondary)]  border border-[var(--color-border)] rounded-3xl px-5 flex-col justify-center w-80'>
        <div className='mt-6 flex justify-center'>
          <img
            src={`${BASE_URL}/${userData?.avatar}`}
            alt='avatar'
            className='h-16 w-16 rounded-full'
          />
        </div>
        <div className='mt-6 text-center'>
          <span className='text-white font-normal'>
            Не стежити за {userData?.login}?
          </span>
        </div>
        <div className='mt-6 flex justify-between -mx-5 border-t border-[var(--color-border)]'>
          <button
            className='flex-1 py-2 px-4 border-r border-[var(--color-border)] text-white cursor-pointer'
            onClick={onClose}
          >
            Скасувати
          </button>
          <button
            className='flex-1 py-4 px-4 text-red-500 font-semibold cursor-pointer'
            onClick={handleUnfollow}
          >
            Не стежити
          </button>
        </div>
      </div>
    </div>
  );
}
