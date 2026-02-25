import { useMutation } from '@tanstack/react-query';
import {
  forceSetPassword,
  type ForceSetPasswordRequest,
} from '@services/auth.service';

export const useForceSetPassword = (userId: string) =>
  useMutation({
    mutationFn: (body: ForceSetPasswordRequest) =>
      forceSetPassword(userId, body),
  });
