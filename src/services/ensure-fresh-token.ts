import Cookies from 'js-cookie';
import { useAuthStore } from '@stores/useAuthStore';
import { refreshToken as refreshTokenRequest } from './auth.service';

let inflight: Promise<string | null> | null = null;

export const ensureFreshToken = async (): Promise<string | null> => {
  if (inflight) return inflight;

  inflight = (async () => {
    const refresh = Cookies.get('refresh');
    if (!refresh) return Cookies.get('access') ?? null;

    try {
      const tokens = await refreshTokenRequest({ token: refresh });
      useAuthStore.getState().setTokens(tokens.access, tokens.refresh);
      return tokens.access;
    } catch {
      return Cookies.get('access') ?? null;
    }
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
};
