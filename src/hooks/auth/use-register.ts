import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register, type RegisterRequest } from '@services/auth.service';
import { getProfile } from '@services/profile.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useRegister = () => {
  const qc = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (body: RegisterRequest) => {
      await register(body);
      const me = await getProfile();
      setUser(me);
      qc.setQueryData(['me'], me);
      return me;
    },
    retry: 0,
  });
};
