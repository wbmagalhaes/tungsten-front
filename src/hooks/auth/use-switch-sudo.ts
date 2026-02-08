import { useMutation } from '@tanstack/react-query';
import { switchSudo as switchSudoService } from '@services/auth.service';
import type { TokenPair } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useSwitchSudo = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation<TokenPair, unknown>({
    mutationFn: async () => {
      const tokens = await switchSudoService();
      setAccessToken(tokens.access);
      return tokens;
    },
  });
};
