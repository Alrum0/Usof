import { LOGIN_ROUTE } from '../utils/consts';

export default function VerifyEmailPage() {
  return (
    <section className='h-screen flex justify-center items-center'>
      <div className='bg-[var(--color-background-secondary)] p-10 rounded-xl flex flex-col gap-4'>
        <h2 className='text-white text-2xl font-semibold text-center'>
          Check your email
        </h2>
        <p className='text-white text-center'>
          We have sent you an email to verify your email address.
        </p>
        <a
          href={LOGIN_ROUTE}
          className='px-4 py-2 hover:opacity-80 transition-opacity text-center bg-white text-[var(--color-text)] rounded-md mt-4 font-medium'
        >
          Go to Login
        </a>
      </div>
    </section>
  );
}
