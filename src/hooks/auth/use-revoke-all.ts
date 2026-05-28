import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { revokeAll as revokeAllService } from '@services/auth.service';
import { useAuthStore } from '@stores/useAuthStore';

export const useRevokeAll = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const clear = useAuthStore((state) => state.clear);

  return useMutation({
    mutationFn: async () => {
      await revokeAllService();
      clear();
      qc.clear();
      navigate('/login', { replace: true });
    },
  });
};
