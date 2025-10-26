import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const $host = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const $authHost = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const authinterceptor = (config) => {
  const token = localStorage.getItem('accessToken');
  config.headers = config.headers || {};

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['authorization'] = `Bearer ${token}`;
  }

  return config;
};

$authHost.interceptors.request.use(authinterceptor);
$authHost.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (err.response?.status !== 401) return Promise.reject(err);

    if (!originalConfig) return Promise.reject(err);

    if (originalConfig._retry) return Promise.reject(err);

    if (
      originalConfig.url &&
      originalConfig.url.includes('/api/auth/refresh')
    ) {
      window.location.href = '/login';
      return Promise.reject(err);
    }

    originalConfig._retry = true;

    if (!window.__authRefresh) {
      window.__authRefresh = { isRefreshing: false, failedQueue: [] };
    }

    const processQueue = (error, token = null) => {
      window.__authRefresh.failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(token);
      });
      window.__authRefresh.failedQueue = [];
    };

    if (window.__authRefresh.isRefreshing) {
      return new Promise((resolve, reject) => {
        window.__authRefresh.failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalConfig.headers = originalConfig.headers || {};
          originalConfig.headers.authorization = `Bearer ${token}`;
          return $authHost(originalConfig);
        })
        .catch((e) => Promise.reject(e));
    }

    window.__authRefresh.isRefreshing = true;

    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await $authHost.post('/api/auth/refresh', {});

        const newToken = data?.accessToken;

        if (!newToken) throw new Error('No access token returned from refresh');

        localStorage.setItem('accessToken', newToken);
        $authHost.defaults.headers.common.authorization = `Bearer ${newToken}`;

        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers.authorization = `Bearer ${newToken}`;

        try {
          const decoded = jwtDecode(newToken);
          import('../store').then(({ store }) => {
            store.dispatch({
              type: 'auth/login/fulfilled',
              payload: {
                user: {
                  id: decoded.id,
                  role: decoded.role,
                  email: decoded.email,
                  fullName: decoded.fullName || '',
                  login: decoded.login || '',
                  avatar: decoded.avatar || '',
                },
                accessToken: newToken,
              },
            });
          });
        } catch (e) {
          console.error('Error decoding token:', e);
        }

        processQueue(null, newToken);
        resolve($authHost(originalConfig));
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        reject(refreshError);
      } finally {
        window.__authRefresh.isRefreshing = false;
      }
    });
  }
);

export { $host, $authHost };
