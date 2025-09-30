import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { NotificationProvider } from './context/NotificationContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import {
  FORGOT_PASSWORD_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
} from './utils/consts';
import LayoutWithHeader from './components/LayoutWithHeader';

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<LayoutWithHeader />} />

          <Route path={LOGIN_ROUTE} element={<LoginPage />} />
          <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
          <Route
            path={FORGOT_PASSWORD_ROUTE}
            element={<ForgotPasswordPage />}
          />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
