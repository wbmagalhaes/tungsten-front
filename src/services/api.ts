import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', {
      url: err.config?.url,
      method: err.config?.method,
      data: err.config?.data,
      error: err.message,
    });

    return Promise.reject(err);
  }
);

export default api;
