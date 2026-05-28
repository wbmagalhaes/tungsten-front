import { useMutation } from '@tanstack/react-query';
import { refreshToken as refreshService } from '@services/auth.service';

export const useRefreshToken = () =>
  useMutation({
    mutationFn: () => refreshService(),
  });
