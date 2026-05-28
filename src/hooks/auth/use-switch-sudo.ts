import { useMutation, useQueryClient } from '@tanstack/react-query';
import { switchSudo as switchSudoService } from '@services/auth.service';
import type { SudoRequest } from '@services/auth.service';
import { getProfile } from '@services/profile.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useSwitchSudo = () => {
  const qc = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (body: SudoRequest) => {
      await switchSudoService(body);
      const me = await getProfile();
      setUser(me);
      qc.setQueryData(['me'], me);
      return me;
    },
  });
};
