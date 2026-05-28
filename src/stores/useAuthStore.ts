import { create } from 'zustand';
import type { Me } from '@models/user';

export type AuthStatus = 'unknown' | 'authed' | 'anon';

interface AuthState {
  status: AuthStatus;
  user: Me | null;

  isAuthenticated: boolean;
  isSudo: boolean;
  canSudo: boolean;
  userId: string | null;
  userScope: string[] | null;

  setUser: (user: Me) => void;
  setAnon: () => void;
  clear: () => void;
  setSudoExpired: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'unknown',
  user: null,

  isAuthenticated: false,
  isSudo: false,
  canSudo: false,
  userId: null,
  userScope: null,

  setUser: (user) =>
    set({
      status: 'authed',
      user,
      isAuthenticated: true,
      isSudo: user.sudo_active,
      canSudo: user.is_sudoer,
      userId: user.id,
      userScope: user.effective_scopes,
    }),

  setAnon: () =>
    set({
      status: 'anon',
      user: null,
      isAuthenticated: false,
      isSudo: false,
      canSudo: false,
      userId: null,
      userScope: null,
    }),

  clear: () =>
    set({
      status: 'anon',
      user: null,
      isAuthenticated: false,
      isSudo: false,
      canSudo: false,
      userId: null,
      userScope: null,
    }),

  setSudoExpired: () =>
    set((state) =>
      state.user
        ? {
            isSudo: false,
            user: {
              ...state.user,
              sudo_active: false,
              effective_scopes: state.user.effective_scopes.filter(
                (s) => s !== 'sudo',
              ),
            },
            userScope: state.userScope?.filter((s) => s !== 'sudo') ?? null,
          }
        : state,
    ),
}));
