import Logo from '../assets/Profile/Logo.jpg';

import NewPostInput from '../components/NewPostInput';

export default function ProfilePage() {
  return (
    <section className='flex justify-center items-center flex-col'>
      <div className='mt-10'>
        <h1 className='text-xl font-bold text-white'>Profile</h1>
      </div>
      <div className='mt-6 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-2xl p-8 w-1/2'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-0.5'>
            <h2 className='text-white text-2xl font-medium'>Andrii</h2>
            <h3 className='text-white text-[14px] font-normal'>
              staviyskiiandrii
            </h3>
          </div>
          <div>
            <img
              src={Logo}
              alt='logo profile'
              className='w-22 h-22 rounded-full'
            />
          </div>
        </div>

        <div className='mt-2'>
          <button className='text-[var(--color-text)] text-[14px] font-normal hover:underline cursor-pointer'>
            252 followers
          </button>
        </div>
        <div className='mt-6'>
          <button className='text-white text-x py-2 border border-[var(--color-border)] rounded-lg w-full cursor-pointer'>
            Edit Profile
          </button>
        </div>
        <div className='mt-6 -mx-8 grid grid-cols-4 place-items-center text-[var(--color-text)] text-xl font-normal'>
          <button className='border-b w-full border-[var(--color-border)] text-center pb-4 focus:border-white focus:text-white'>
            Ланцюжки
          </button>
          <button className='border-b w-full border-[var(--color-border)] text-center pb-4 focus:border-white focus:text-white'>
            Відповіді
          </button>
          <button className='border-b w-full border-[var(--color-border)] text-center pb-4 focus:border-white focus:text-white'>
            Медіафайли
          </button>
          <button className='border-b w-full border-[var(--color-border)] text-center pb-4 focus:border-white focus:text-white'>
            Репости
          </button>
        </div>
        <div className='mt-4'>
          <NewPostInput />
        </div>
      </div>
    </section>
  );
}
