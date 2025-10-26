import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { passwordReset, confirmResetToken } from '../http/authAPI';
import { LOGIN_ROUTE } from '../utils/consts';

export default function ForgotPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showNotification('Будь ласка, введіть email');
      return;
    }

    setLoading(true);
    try {
      const response = await passwordReset(email);
      showNotification(
        'Посилання на скидання пароля відправлено на вашу email'
      );
      setEmailSent(true);
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Помилка при запиті скидання пароля'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      showNotification('Будь ласка, заповніть всі поля');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('Паролі не збігаються');
      return;
    }

    setLoading(true);
    try {
      const response = await confirmResetToken(
        token,
        newPassword,
        confirmPassword
      );
      showNotification('Пароль успішно змінено');
      navigate(LOGIN_ROUTE);
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Помилка при скиданні пароля'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='flex justify-center items-center h-screen'>
      <div className='bg-[var(--color-background-secondary)] p-10 rounded-xl flex flex-col gap-4 border border-[var(--color-border)] w-1/3'>
        <h2 className='text-white text-2xl font-semibold text-center'>
          {token ? 'Встановіть новий пароль' : 'Скинути пароль'}
        </h2>

        {!token ? (
          <>
            <p className='text-[var(--color-text)] text-center text-sm'>
              Введіть вашу email адресу, щоб отримати посилання на скидання
              пароля.
            </p>
            <form className='flex flex-col gap-4' onSubmit={handleRequestReset}>
              <input
                type='email'
                placeholder='Email'
                className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white bg-[var(--color-background-profile)]'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type='submit'
                disabled={loading}
                className='px-4 py-2 bg-white text-[var(--color-text)] rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50'
              >
                {loading ? 'Відправка...' : 'Відправити посилання'}
              </button>
            </form>
            {emailSent && (
              <p className='text-green-500 text-sm text-center'>
                Перевірте вашу email адресу для подальших інструкцій.
              </p>
            )}
          </>
        ) : (
          <>
            <p className='text-[var(--color-text)] text-center text-sm'>
              Введіть новий пароль для вашого облікового запису.
            </p>
            <form
              className='flex flex-col gap-4'
              onSubmit={handleResetPassword}
            >
              <input
                type='password'
                placeholder='Новий пароль'
                className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white bg-[var(--color-background-profile)]'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type='password'
                placeholder='Підтвердіть пароль'
                className='px-4 py-2 rounded-lg border border-[var(--color-border)] outline-none text-white bg-[var(--color-background-profile)]'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type='submit'
                disabled={loading}
                className='px-4 py-2 bg-white text-[var(--color-text)] rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50'
              >
                {loading ? 'Встановлення...' : 'Встановити новий пароль'}
              </button>
            </form>
          </>
        )}

        <div className='text-[var(--color-text)] text-center text-sm mt-2'>
          <a
            href={LOGIN_ROUTE}
            className='text-[#3869d6] hover:underline underline'
          >
            Повернутися до входу
          </a>
        </div>
      </div>
    </section>
  );
}
