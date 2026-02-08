import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export interface RefreshClaims {
  sub: string;
  exp: number;
  nbf: number;
  iss: string;
  aud: string;
  jti: string;
}

export interface AccessClaims extends RefreshClaims {
  scope: string[];
}

interface AuthState {
  accessClaims: AccessClaims | null;

  setTokens: (access: string, refresh: string) => void;
  setAccessToken: (access: string) => void;
  clearTokens: () => void;

  isAuthenticated: boolean;
  userId: string | null;
  userScope: string[] | null;
  isSudo: boolean;
}

export const useAuthStore = create<AuthState>((set) => {
  const accessToken = Cookies.get('access') || null;
  const accessClaims = decodeToken<AccessClaims>(accessToken);

  const refreshToken = Cookies.get('refresh') || null;
  const refreshIsValid = isTokenValid(refreshToken);

  return {
    accessClaims,

    isAuthenticated: refreshIsValid,
    userId: accessClaims?.sub || null,
    userScope: accessClaims?.scope || null,
    isSudo: accessClaims?.scope?.includes('sudo') || false,

    setTokens: (access, refresh) => {
      const refreshClaims = decodeToken<RefreshClaims>(refresh);

      const expires = refreshClaims
        ? (refreshClaims.exp - Date.now() / 1000) / 86400
        : undefined;

      Cookies.set('refresh', refresh, {
        sameSite: 'strict',
        expires: expires,
      });

      const claims = decodeToken<AccessClaims>(access);
      Cookies.set('access', access, { sameSite: 'strict' });

      set({
        accessClaims: claims,
        isAuthenticated: !!claims,
        userId: claims?.sub || null,
        userScope: claims?.scope || null,
        isSudo: claims?.scope?.includes('sudo') || false,
      });
    },

    setAccessToken: (access) => {
      const claims = decodeToken<AccessClaims>(access);
      Cookies.set('access', access, { sameSite: 'strict' });

      set({
        accessClaims: claims,
        isAuthenticated: !!claims,
        userId: claims?.sub || null,
        userScope: claims?.scope || null,
        isSudo: claims?.scope?.includes('sudo') || false,
      });
    },

    clearTokens: () => {
      Cookies.remove('access');
      Cookies.remove('refresh');

      set({
        accessClaims: null,
        isAuthenticated: false,
        userId: null,
        userScope: null,
        isSudo: false,
      });
    },
  };
});

function decodeToken<T extends AccessClaims | RefreshClaims>(
  token: string | null,
): T | null {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode<T>(token);
  } catch {
    console.warn('invalid token in cookie');
  }

  return null;
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const decoded = decodeToken<RefreshClaims>(token);
  if (!decoded) return false;
  return decoded.exp * 1000 > Date.now();
}
