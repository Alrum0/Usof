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
    <section
      className=' h-screen bg-cover'
      // style={{ backgroundImage: `url('/bg/bg4.png')` }}
    >
      <div className='flex justify-center items-center h-full'>
        <div className='flex flex-col gap-4 p-10'>
          <h2 className='text-white text-2xl font-semibold text-center'>
            Реєстрація в Usof
          </h2>
          <form action='post' className='flex flex-col gap-4 w-80'>
            <input
              type='text'
              placeholder='Full Name'
              className='bg-[var(--color-background-secondary)] px-5 py-3 text-white focus:border focus:border-[var(--color-border)] rounded-xl outline-0'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Email'
              className='bg-[var(--color-background-secondary)] px-5 py-3 text-white focus:border focus:border-[var(--color-border)] rounded-xl outline-0'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='text'
              placeholder='Username'
              className='bg-[var(--color-background-secondary)] px-5 py-3 text-white focus:border focus:border-[var(--color-border)] rounded-xl outline-0'
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              type='password'
              placeholder='Password'
              className='bg-[var(--color-background-secondary)] px-5 py-3 text-white focus:border focus:border-[var(--color-border)] rounded-xl outline-0'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type='password'
              placeholder='Confirm Password'
              className='bg-[var(--color-background-secondary)] px-5 py-3 text-white focus:border focus:border-[var(--color-border)] rounded-xl outline-0'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </form>
          <button
            className='bg-white px-5 py-3 text-[var(--color-text)] focus:border border-[var(--color-border)] rounded-xl outline-0 cursor-pointer'
            onClick={handleSubmit}
          >
            Зареєструватись
          </button>
          <div className='relative'>
            <hr className='text-white mt-2 relative ' />
            <span className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white'>
              або
            </span>
          </div>
          <div className='text-white text-center mt-2'>
            <a href={LOGIN_ROUTE}>Увійти</a>
          </div>
        </div>
      </div>
    </section>
  );
}
