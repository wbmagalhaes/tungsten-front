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

export const useAuthStore = create<AuthState>((set, get) => {
  const accessToken = Cookies.get('access') || null;
  const accessClaims = decodeToken(accessToken);

  return {
    accessClaims,

    get isAuthenticated() {
      return !!get().accessClaims;
    },

    get userId() {
      return get().accessClaims?.sub || null;
    },

    get userScope() {
      return get().accessClaims?.scope || null;
    },

    get isSudo() {
      const scope = get().accessClaims?.scope || [];
      return scope.includes('sudo');
    },

    setTokens: (access, refresh) => {
      Cookies.set('access', access, { sameSite: 'strict' });
      Cookies.set('refresh', refresh, { sameSite: 'strict' });

      const claims = decodeToken(access);
      set({ accessClaims: claims });
    },

    clearTokens: () => {
      Cookies.remove('access');
      Cookies.remove('refresh');
      set({ accessClaims: null });
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
