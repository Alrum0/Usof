import AppRouter from './AppRouter';
import Header from './Header';
import LoginButton from './LogginButton';
import NewPostButton from './NewPostButton';

export default function LayoutWithHeader() {
  return (
    <div className='flex'>
      <Header />
      <main className='flex-1 ml-20'>
        <LoginButton />
        <NewPostButton />
        <AppRouter />
      </main>
    </div>
  );
}
