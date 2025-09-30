import { $host } from './index';

export const registration = async (
  fullName,
  login,
  email,
  password,
  confirmPassword
) => {
  const { data } = await $host.post('/auth/register', {
    fullName,
    login,
    email,
    password,
    confirmPassword,
    role: 'ADMIN',
  });
  return data;
};

export const login = async (email, password) => {
  const { data } = await $host.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', data.accessToken);
};
