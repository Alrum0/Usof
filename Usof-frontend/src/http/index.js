import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const $host = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const $authHost = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const authinterceptor = async (config) => {
  console.log('🔵 Request interceptor called for:', config.url);
  const token = localStorage.getItem('accessToken');
  config.headers = config.headers || {};

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime;
      console.log(
        `⏰ Token expires in ${Math.floor(timeUntilExpiry / 60)} minutes`
      );

      // Якщо токен протухне менш ніж за 5 хвилин - оновлюємо його
      if (timeUntilExpiry < 300) {
        console.log('⚠️ Token expires soon, refreshing...');

        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          if (data?.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            config.headers['Authorization'] = `Bearer ${data.accessToken}`;
            config.headers['authorization'] = `Bearer ${data.accessToken}`;

            // Update Redux state
            try {
              const newDecoded = jwtDecode(data.accessToken);
              import('../store').then(({ store }) => {
                store.dispatch({
                  type: 'auth/login/fulfilled',
                  payload: {
                    user: {
                      id: newDecoded.id,
                      role: newDecoded.role,
                      email: newDecoded.email,
                      fullName: newDecoded.fullName || '',
                      login: newDecoded.login || '',
                      avatar: newDecoded.avatar || '',
                    },
                    accessToken: data.accessToken,
                  },
                });
              });
            } catch (e) {
              console.error('Error updating state after refresh:', e);
            }

            return config;
          }
        } catch (refreshError) {
          console.error('Preventive token refresh failed:', refreshError);
          // Якщо не вдалося оновити, продовжуємо зі старим токеном
          // Interceptor response обробить 401 якщо токен справді протух
        }
      }
    } catch (e) {
      console.error('Error checking token expiry:', e);
    }

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

    console.log('401 error detected, attempting token refresh...');

    if (!originalConfig) return Promise.reject(err);

    if (originalConfig._retry) {
      console.log('Already retried, giving up');
      return Promise.reject(err);
    }

    if (
      originalConfig.url &&
      originalConfig.url.includes('/api/auth/refresh')
    ) {
      // Refresh itself failed - clear state and redirect
      console.error('Refresh endpoint itself returned 401, logging out');
      localStorage.removeItem('accessToken');

      // Dispatch logout action
      import('../store').then(({ store }) => {
        store.dispatch({ type: 'auth/logout' });
      });

      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
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
        console.log('Calling refresh token endpoint...');
        const { data } = await $authHost.post('/api/auth/refresh', {});

        const newToken = data?.accessToken;

        if (!newToken) throw new Error('No access token returned from refresh');

        console.log('Token refreshed successfully');
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

        // Dispatch logout action
        import('../store').then(({ store }) => {
          store.dispatch({ type: 'auth/logout' });
        });

        // Redirect to login only if not already there
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login...');
          window.location.href = '/login';
        }
        reject(refreshError);
      } finally {
        window.__authRefresh.isRefreshing = false;
      }
    });
  }
);

export { $host, $authHost };
