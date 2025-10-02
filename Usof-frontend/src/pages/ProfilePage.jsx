import Logo from '../assets/Profile/Logo.jpg';

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
          <button
            className='w-full flex items-center gqp-3 text-left outline-none'
            onClick={() => alert('This feature is not implemented yet.')}
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
        </div>
      </div>
    </section>
  );
}
