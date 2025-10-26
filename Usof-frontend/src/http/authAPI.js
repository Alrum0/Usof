import { $host } from './index';

export const registration = async (
  fullName,
  login,
  email,
  password,
  confirmPassword
) => {
  return await $host.post('/api/auth/register', {
    fullName,
    login,
    email,
    password,
    confirmPassword,
    // role: 'ADMIN',
  });
};
