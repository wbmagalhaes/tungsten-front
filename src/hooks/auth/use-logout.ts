import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutService } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useLogout = () => {
  const qc = useQueryClient();
  const clearTokens = useAuthStore((state) => state.clearTokens);

  return useMutation({
    mutationFn: async () => {
      const res = await logoutService();
      clearTokens();
      return res;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  });
};
