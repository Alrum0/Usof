import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useNotification } from '../context/NotificationContext';
import { MAIN_ROUTE } from '../utils/consts';
import { login } from '../store/authSlice';

export default function LoginPage() {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(login({ email, password })).unwrap();
      if (response.status === 200) {
        navigate(MAIN_ROUTE);
      }
    } catch (err) {
      showNotification(err.response?.data?.message || err.message);
      console.error(err);
    }
  };

  return (
    <section className='flex justify-center items-center h-screen'>
      <div className='bg-[var(--color-background-secondary)] p-10 rounded-xl flex flex-col gap-4 border border-[var(--color-border)]'>
        <h2 className='text-white text-2xl font-semibold text-center'>
          Вхід у Usof
        </h2>
        <p className='text-white text-center'>
          Будь ласка, введіть свої облікові дані для входу.
        </p>
        <form className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Пароль'
            className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type='submit'
            className='px-4 py-2 bg-white text-[var(--color-text)] rounded-lg hover:opacity-80 transition-opacity'
            onClick={handleSubmit}
          >
            Увійти
          </button>
        </form>
      </div>
    </section>
  );
}
