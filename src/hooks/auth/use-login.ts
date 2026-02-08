import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginService } from '@services/auth.service';
import type { LoginRequest } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useLogin = () => {
  const qc = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const tokens = await loginService(body);
      setTokens(tokens.access, tokens.refresh);
      return tokens;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
    retry: 0,
  });
};
