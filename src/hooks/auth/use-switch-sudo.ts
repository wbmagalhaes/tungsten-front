import { useMutation } from '@tanstack/react-query';
import { switchSudo as switchSudoService } from '@services/auth.service';
import type { SudoRequest } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useSwitchSudo = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: async (body: SudoRequest) => {
      const tokens = await switchSudoService(body);
      setAccessToken(tokens.access);
      return tokens;
    },
  });
};
