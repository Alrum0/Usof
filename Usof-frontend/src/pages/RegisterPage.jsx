import { useState } from 'react';
import { registration } from '../http/authAPI';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

import { LOGIN_ROUTE, VERIFY_EMAIL_ROUTE } from '../utils/consts';

export default function RegisterPage() {
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await registration(
        fullName,
        login,
        email,
        password,
        confirmPassword
      );

      if (response.status === 200) {
        navigate(VERIFY_EMAIL_ROUTE);
      }
    } catch (err) {
      showNotification(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='flex justify-center items-center min-h-screen py-8'>
      <div className='bg-[var(--color-background-secondary)] p-10 rounded-xl flex flex-col gap-4 border border-[var(--color-border)] w-full max-w-1/3 mx-4'>
        <div className='text-center mb-2'>
          <h2 className='text-white text-2xl font-semibold mb-2'>
            Реєстрація в Usof
          </h2>
          <p className='text-[var(--color-text)] text-sm'>
            Створіть обліковий запис, щоб приєднатися до спільноти
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-[var(--color-text)] text-sm font-medium'>
              Повне імʼя
            </label>
            <input
              type='text'
              placeholder='Введіть ваше повне імʼя'
              className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white bg-transparent focus:border-[#3869d6] transition-colors'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-[var(--color-text)] text-sm font-medium'>
              Email
            </label>
            <input
              type='email'
              placeholder='Введіть ваш email'
              className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white bg-transparent focus:border-[#3869d6] transition-colors'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-[var(--color-text)] text-sm font-medium'>
              Імʼя користувача
            </label>
            <input
              type='text'
              placeholder='Оберіть унікальне імʼя користувача'
              className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white bg-transparent focus:border-[#3869d6] transition-colors'
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-[var(--color-text)] text-sm font-medium'>
              Пароль
            </label>
            <input
              type='password'
              placeholder='Створіть надійний пароль'
              className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white bg-transparent focus:border-[#3869d6] transition-colors'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-[var(--color-text)] text-sm font-medium'>
              Підтвердження паролю
            </label>
            <input
              type='password'
              placeholder='Повторіть пароль'
              className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white bg-transparent focus:border-[#3869d6] transition-colors'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 bg-white text-[var(--color-text)] rounded-lg hover:opacity-80 transition-opacity mt-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Реєстрація...' : 'Зареєструватись'}
          </button>
        </form>

        <div className='relative'>
          <hr className='border-[var(--color-border)]' />
          <span className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-[var(--color-background-secondary)] px-2 text-[var(--color-text)] text-sm'>
            або
          </span>
        </div>

        <div className='text-[var(--color-text)] text-center'>
          <span>Вже маєте акаунт? </span>
          <a
            href={LOGIN_ROUTE}
            className='hover:underline text-[#3869d6] text-sm underline'
          >
            Увійти
          </a>
        </div>
      </div>
    </section>
  );
}
