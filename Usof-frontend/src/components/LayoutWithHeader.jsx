import AppRouter from './AppRouter';
import Header from './Header';
import LoginButton from './LogginButton';
import NewPostButton from './NewPostButton';

export default function LayoutWithHeader() {
  return (
    <div className='flex flex-col md:flex-row'>
      <Header />
      <main className='flex-1 md:ml-20 mb-20 md:mb-0'>
        <LoginButton />
        <NewPostButton />
        <AppRouter />
      </main>
    </div>
  );
}
