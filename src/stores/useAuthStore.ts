import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export interface AccessClaims {
  sub: string;
  scope: string[];
  exp: number;
  nbf: number;
  iss: string;
  aud: string;
  jti: string;
}

interface AuthState {
  accessClaims: AccessClaims | null;

  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;

  isAuthenticated: boolean;
  userId: string | null;
  userScope: string[] | null;
  isSudo: boolean;
}

export const useAuthStore = create<AuthState>((set) => {
  const accessToken = Cookies.get('access') || null;
  const accessClaims = decodeToken(accessToken);

  return {
    accessClaims,

    isAuthenticated: !!accessClaims,
    userId: accessClaims?.sub || null,
    userScope: accessClaims?.scope || null,
    isSudo: accessClaims?.scope?.includes('sudo') || false,

    setTokens: (access, refresh) => {
      Cookies.set('access', access, { sameSite: 'strict' });
      Cookies.set('refresh', refresh, { sameSite: 'strict' });
      const claims = decodeToken(access);

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

function decodeToken(token: string | null): AccessClaims | null {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode<AccessClaims>(token);
  } catch {
    console.warn('invalid access token in cookie');
  }

  return null;
}
