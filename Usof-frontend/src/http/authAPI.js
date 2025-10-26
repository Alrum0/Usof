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

export const passwordReset = async (email) => {
  return await $host.post('/api/auth/password-reset', { email });
};

export const confirmResetToken = async (
  token,
  newPassword,
  confirmPassword
) => {
  return await $host.post(`/api/auth/password-reset/${token}`, {
    newPassword,
    confirmPassword,
  });
};
