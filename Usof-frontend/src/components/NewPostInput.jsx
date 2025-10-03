import Logo from '../assets/Profile/Logo.jpg';
import { useState } from 'react';
import CreatePostModel from './CreatePostModel';

export default function NewPostInput() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CreatePostModel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <button
        className='w-full flex items-center gqp-3 text-left outline-none'
        onClick={() => setIsOpen(true)}
      >
        <img
          src={Logo}
          alt='logo profile'
          className='w-10 h-10 rounded-full flex-shrink-0'
        />
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Що нового?'
            className='bg-transparent w-full border-[var(--color-border)] flex-1 py-2 px-3 text-[#777777] outline-none cursor-text'
            readOnly
          />
        </div>
        <span className='text-white px-4 py-2 border border-[var(--color-border)] rounded-lg cursor-pointer flex-shrink-0 '>
          Опублікувати
        </span>
      </button>
      <hr className='border-[var(--color-border)] mt-4 -mx-8' />
    </>
  );
}
