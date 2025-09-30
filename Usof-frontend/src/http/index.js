import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const $host = axios.create({
  //baseURL: import.meta.env.VITE_API_URL,
  baseURL: 'http://localhost:3000/api',
});

const $authHost = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

const authinterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem(
    'accessToken'
  )}`;
  return config;
};

// let showNotificationCallback = null;
// export const setNotificationCallback = (callback) => {
//   showNotificationCallback = callback;
// };

// const setupresponseInterceptor = (instance) => {
//   instance.interceptors.response.use(
//     (response) => {
//       if (response.data.message && showNotificationCallback) {
//         showNotificationCallback(response.data.message);
//       }
//       return response;
//     },
//     (error) => {
//       if (error.response?.data?.message && showNotificationCallback) {
//         showNotificationCallback(error.response.data.message);
//       }
//       return Promise.reject(error);
//     }
//   );
// };

// setupresponseInterceptor($host);
// setupresponseInterceptor($authHost);

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
