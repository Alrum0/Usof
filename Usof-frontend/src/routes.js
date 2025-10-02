import Admin from './pages/AdminPage';
import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import VerifyEmailPage from './pages/VerifyEmailPage';

import {
  ADMIN_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  LOGIN_ROUTE,
  MAIN_ROUTE,
  PROFILE_ROUTE,
  REGISTER_ROUTE,
  SEARCH_ROUTE,
  VERIFY_EMAIL_ROUTE,
} from './utils/consts';

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin,
  },
];

export const publicRoutes = [
  {
    path: MAIN_ROUTE,
    Component: MainPage,
  },
  {
    path: SEARCH_ROUTE,
    Component: SearchPage,
  },
  {
    path: LOGIN_ROUTE,
    Component: LoginPage,
  },
  {
    path: REGISTER_ROUTE,
    Component: RegisterPage,
  },
  {
    path: FORGOT_PASSWORD_ROUTE,
    Component: ForgotPasswordPage,
  },
  {
    path: PROFILE_ROUTE + '/:id',
    Component: ProfilePage,
  },
  {
    path: VERIFY_EMAIL_ROUTE,
    Component: VerifyEmailPage,
  },
];
