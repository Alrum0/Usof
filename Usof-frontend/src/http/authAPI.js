import { $authHost, $host } from '.';

export const registration = async (email, password) => {
  const { data } = await $host.post('api/auth/registration', {
    email,
    password,
    role: 'ADMIN',
  });
  return data;
};

export const login = async (email, password) => {
  const { data } = await $host.post('api/auth/login', { email, password });
  localStorage.setItem('accessToken', data.accessToken);
};
