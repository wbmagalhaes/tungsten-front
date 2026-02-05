import { useMutation } from '@tanstack/react-query';
import { refreshToken as refreshService } from '@services/auth.service';
import type { RefreshRequest } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useRefreshToken = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: async (body: RefreshRequest) => {
      const tokens = await refreshService(body);
      setTokens(tokens.access, tokens.refresh);
      return tokens;
    },
  });
};
