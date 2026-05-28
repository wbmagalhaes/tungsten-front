import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutService } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useLogout = () => {
  const qc = useQueryClient();
  const clear = useAuthStore((state) => state.clear);

  return useMutation({
    mutationFn: async () => {
      try {
        await logoutService();
      } catch {
        // ignore network/401 - we're logging out anyway
      }
      clear();
      qc.clear();
    },
  });
};
