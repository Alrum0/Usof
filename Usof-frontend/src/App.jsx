import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import './index.css';
import Header from './components/Header';
import LoginButton from './components/LogginButton';
import NewPostButton from './components/NewPostButton';

export default function App() {
  return (
    <BrowserRouter>
      <div className='flex'>
        <Header />
        <main className='flex-1 ml-20'>
          <LoginButton />
          <NewPostButton />
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
}
