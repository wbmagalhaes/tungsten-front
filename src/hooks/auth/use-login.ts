import { useMutation } from '@tanstack/react-query';
import { login as loginService } from '@services/auth.service';
import type { LoginRequest } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const tokens = await loginService(body);
      setTokens(tokens.access, tokens.refresh);
      return tokens;
    },
  });
};
