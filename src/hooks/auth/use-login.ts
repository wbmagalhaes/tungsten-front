import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginService } from '@services/auth.service';
import type { LoginRequest } from '@services/auth.service';
import { getProfile } from '@services/profile.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useLogin = () => {
  const qc = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      await loginService(body);
      qc.clear();
      const me = await getProfile();
      setUser(me);
      qc.setQueryData(['me'], me);
      return me;
    },
    retry: 0,
  });
};
