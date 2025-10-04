import Logo from '../assets/Profile/Logo.jpg';
import ChevronRight from '../assets/Icon/chevron-right.svg?react';
import PlusIcon from '../assets/Icon/plus-icon.svg?react';
import ImageIcon from '../assets/Icon/image-icon.svg?react';

import { useState } from 'react';

import CustomSelect from './CustomSelect';
import CustomInput from './CustomInput';

export default function CreatePostModel({ isOpen, onClose }) {
  const [image, setImage] = useState([]);
  const [category, setCategory] = useState(null);

  if (!isOpen) return null;

  const categories = [
    { value: 'tech', label: 'Технології' },
    { value: 'science', label: 'Наука' },
    { value: 'art', label: 'Мистецтво' },
  ];

  const handleCategorySelect = (selectedOption) => {
    alert(`Ви обрали категорію: ${selectedOption.label}`);
    setCategory(selectedOption.label);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImage((prev) => [...prev, ...newImages]);
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

        {image.length > 0 && (
          <div
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'transparent',
            }}
            className={`flex gap-3 ml-12 overflow-x-auto scrollbar-thin scrollbar-gray-600 ${
              image.length === 1 ? 'justify-center' : ''
            }`}
          >
            {image.map((img, index) => (
              <div
                key={index}
                className={`relative flex-shrink-0 ${
                  image.length === 1 ? 'max-w-full' : ''
                }`}
              >
                <img
                  src={img.preview}
                  alt={`preview-${index}`}
                  className={`object-cover rounded-md border border-[var(--color-border)] transition-all duration-500 mb-1 ${
                    image.length === 1
                      ? 'max-h-[320px] max-w-full w-auto'
                      : ' h-[160px]'
                  }`}
                />

                <button
                  onClick={() =>
                    setImage((prev) => prev.filter((_, i) => i !== index))
                  }
                  className='absolute top-1 right-1'
                >
                  <PlusIcon className='w-6 h-6 text-white rotate-45' />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={`ml-13 ${image.length > 0 ? 'mt-2' : 'mt-0.5'}`}>
          <input
            id='fileUpload'
            type='file'
            multiple
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
          />
          <label htmlFor='fileUpload' className='cursor-pointer'>
            <ImageIcon className='w-5.5 h-5.5' />
          </label>
        </div>

        <div className='flex justify-between mt-8 items-center'>
          <span className='text-[var(--color-text)]'>
            Будь-хто може відповідати й цитувати
          </span>
          {categories.length > 0 && (
            <button className='bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg font-semibold border border-[var(--color-border)]'>
              Опублікувати
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
