import { useState } from 'react';
import { useSelector } from 'react-redux';

import PlusIcon from '../assets/Icon/plus-icon.svg?react';

import CreatePostModel from './CreatePostModel';

export default function NewPostButton() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuth = useSelector((state) => state.auth.isAuth);
  return (
    <>
      {isAuth && (
        <>
          <div className='fixed right-0 bottom-0'>
            <button
              onClick={() => setIsOpen(true)}
              className='absolute right-8 bottom-8 px-7 py-4 rounded-xl bg-[var(--color-background-secondary)] font-semibold border border-[var(--color-border)] hover:scale-110 transition-all duration-300 cursor-pointer'
            >
              <PlusIcon className='w-7 h-7 text-white transition-all duration-200 ' />
            </button>
          </div>
          <CreatePostModel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
      )}
    </>
  );
}
