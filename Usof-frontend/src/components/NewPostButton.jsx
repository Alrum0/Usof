import PlusIcon from '../assets/Icon/plus-icon.svg?react';

export default function NewPostButton() {
  const isAuth = false;
  return (
    <>
      {!isAuth && (
        <div className='fixed right-0 bottom-0'>
          <button className='absolute right-8 bottom-8 px-7 py-4 rounded-xl bg-[var(--color-background-secondary)] font-semibold border border-[#313131] hover:scale-110 transition-all duration-300 cursor-pointer'>
            <PlusIcon className='w-7 h-7 text-white transition-all duration-200 ' />
          </button>
        </div>
      )}
    </>
  );
}
