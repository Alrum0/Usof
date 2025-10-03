import Logo from '../assets/Profile/Logo.jpg';
import ChevronRight from '../assets/Icon/chevron-right.svg?react';

import CustomSelect from './CustomSelect';
import CustomInput from './CustomInput';

export default function CreatePostModel({ isOpen, onClose }) {
  if (!isOpen) return null;

  const categories = [
    { value: 'tech', label: 'Технології' },
    { value: 'science', label: 'Наука' },
    { value: 'art', label: 'Мистецтво' },
  ];

  const handleCategorySelect = (selectedOption) => {
    alert(`Ви обрали категорію: ${selectedOption.label}`);
  };

  return (
    <section className=' ml-20 fixed inset-0 z-50'>
      <div className='absolute inset-0 bg-black opacity-50' onClick={onClose} />

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-background-profile)] rounded-lg border border-[var(--color-border)] w-[48%] px-8 py-4 flex flex-col'>
        <div className='flex gap-44 items-center'>
          <button
            onClick={onClose}
            className='text-white text-base cursor-pointer'
          >
            Скасувати
          </button>
          <h2 className='text-white text-base font-bold'>Новий ланцюжок</h2>
        </div>

        <hr className='border-[var(--color-border)] my-4 -mx-8' />

        <div className='flex'>
          <img
            src={Logo}
            alt='logo профілю'
            className='w-10 h-10 rounded-full flex-shrink-0'
          />
          <div className='flex items-center gap-1'>
            <span className='text-white text-base font-normal ml-4 flex-shrink-0'>
              staviyskiiandrii
            </span>
            <ChevronRight className='w-4 h-4 text-white flex-shrink-0' />
            <CustomSelect
              options={categories}
              onSelect={handleCategorySelect}
            />
          </div>
        </div>
        <div className='ml-10'>
          <CustomInput placeholder='Що нового?' />
        </div>
      </div>
    </section>
  );
}
