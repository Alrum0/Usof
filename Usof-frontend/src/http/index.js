import axios from 'axios';

const $host = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const $authHost = axios.create({
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
        const { data } = await $authHost.post('/api/auth/refresh');
        const newToken = data.accessToken;

        localStorage.setItem('accessToken', newToken);

        $authHost.defaults.headers.common.authorization = `Bearer ${newToken}`;
        originalConfig.headers.authorization = `Bearer ${newToken}`;

        const decoded = jwtDecode(newToken);
        const newUser = {
          id: decoded.id,
          role: decoded.role,
          email: decoded.email,
          fullName: '',
          login: '',
          avatar: '',
        };

        import('../store').then(({ store }) => {
          store.dispatch({
            type: 'auth/login/fulfilled',
            payload: { user: newUser, accessToken: newToken },
          });
        });

        alert('Token refreshed successfully');
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
