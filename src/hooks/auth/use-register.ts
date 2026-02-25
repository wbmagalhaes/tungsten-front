import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register, type RegisterRequest } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useRegister = () => {
  const qc = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: async (body: RegisterRequest) => {
      const tokens = await register(body);
      setTokens(tokens.access, tokens.refresh);
      return tokens;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
    retry: 0,
  });
};
