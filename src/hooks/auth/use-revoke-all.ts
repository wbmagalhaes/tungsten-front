import { useMutation } from '@tanstack/react-query';
import { revokeAll as revokeAllService } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useRevokeAll = () => {
  const clearTokens = useAuthStore((state) => state.clearTokens);

  return useMutation({
    mutationFn: async () => {
      const res = await revokeAllService();
      clearTokens();
      return res;
    },
  });
};
