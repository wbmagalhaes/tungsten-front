import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@stores/useAuthStore';
import { refreshToken as refreshTokenRequest } from './auth.service';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.tungsten.rocks';

const api = axios.create({
  baseURL: new URL(baseURL).toString(),
  headers: {
    'Content-Type': 'application/json',
  },
});

const publicRoutes = ['/ping', '/auth/token', '/auth/refresh'];

let refreshingPromise: Promise<string> | null = null;
let redirectingToLogin = false;

function redirectToLogin() {
  if (redirectingToLogin) return;
  const path = window.location.pathname;
  if (path.startsWith('/login') || path.startsWith('/logout')) return;
  redirectingToLogin = true;
  useAuthStore.getState().clearTokens();
  const redirectTo = `/login?cb_url=${encodeURIComponent(
    path + window.location.search,
  )}`;
  window.location.replace(redirectTo);
}

api.interceptors.request.use((config) => {
  if (!config.url) return config;

  const isPublic = publicRoutes.some((route) => config.url?.endsWith(route));
  if (!isPublic) {
    const accessToken = Cookies.get('access');
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (
    err: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } },
  ) => {
    console.error('[API ERROR]', {
      url: err.config?.url,
      method: err.config?.method,
      data: err.config?.data,
      error: err.message,
      status: err.status,
      retry: err.config?._retry,
    });

    const originalRequest = err.config;

    if (err.response?.status === 401 && originalRequest) {
      if (originalRequest.url?.endsWith('/auth/refresh')) {
        redirectToLogin();
        return Promise.reject(err);
      }

      if (originalRequest._retry) {
        redirectToLogin();
        return Promise.reject(err);
      }

      originalRequest._retry = true;

      const refreshToken = Cookies.get('refresh');
      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(err);
      }

      try {
        if (!refreshingPromise) {
          refreshingPromise = refreshTokenRequest({ token: refreshToken })
            .then((tokens) => {
              if (!tokens?.access || !tokens?.refresh) {
                throw new Error('Invalid refresh response');
              }
              useAuthStore.getState().setTokens(tokens.access, tokens.refresh);
              return tokens.access;
            })
            .finally(() => {
              refreshingPromise = null;
            });
        }

        const accessToken = await refreshingPromise;

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshErr) {
        redirectToLogin();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
