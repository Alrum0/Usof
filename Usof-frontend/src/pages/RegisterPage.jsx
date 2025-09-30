import { use, useState } from 'react';
import { registration } from '../http/authAPI';
import { useNotification } from '../context/NotificationContext';

export default function RegisterPage() {
  const { showNotification } = useNotification();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(fullName, login, email, password, confirmPassword);

      const response = await registration(
        fullName,
        login,
        email,
        password,
        confirmPassword
      );
      showNotification(response.message);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message);
    }
  };

  return (
    <section
      className=' h-screen bg-cover'
      // style={{ backgroundImage: `url('/bg/bg.png')` }}
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
        </div>
      </div>
    </section>
  );
}
