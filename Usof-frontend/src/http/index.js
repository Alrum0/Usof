import axios from 'axios';

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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
        const data = await $authHost.post('api/auth/refresh');
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
