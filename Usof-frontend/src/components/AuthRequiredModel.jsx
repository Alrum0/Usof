import Logov2 from '../assets/Icon/Logo.png';
import { REGISTER_ROUTE } from '../utils/consts';

export default function AuthRequiredModel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50'>
      <div className='absolute inset-0 bg-black opacity-50' onClick={onClose} />

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-notification)] px-16 pt-10 pb-16 rounded-lg'>
        <div className='text-center'>
          <img src={Logov2} alt='Usof Logo' className='w-12 h-12 mx-auto' />
          <h1 className='text-3xl font-bold text-white pt-6'>
            Зареєструйтесь, щоб <br />
            користуватись
          </h1>
          <p className='text-[#5a5a5a] pt-8'>
            Приєднуйся до Usof, щоб ділитися <br />
            ідеями, ставити питання, публікувати <br />
            думками тощо.
          </p>
        </div>
        <div className='text-center pt-12 relative'>
          <a
            href={REGISTER_ROUTE}
            className='px-16 py-6 border border-[var(--color-background-secondary)] rounded-lg text-white font-semibold'
          >
            Авторизуватись
          </a>
        </div>
      </div>
    </div>
  );
}
