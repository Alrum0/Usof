import axios from 'axios';

const $host = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: 'http://localhost:3000/api',
});

const $authHost = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const authinterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem(
    'accessToken'
  )}`;
  return config;
};

$authHost.interceptors.request.use(authinterceptor);
$authHost.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const data = await $authHost.post('/auth/refresh');
        $authHost.defaults.headers.common.authorization = `Bearer ${data.accessToken}`;
        originalConfig.headers.authorization = `Bearer ${data.accessToken}`;
        return $authHost(originalConfig);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export { $host, $authHost };
