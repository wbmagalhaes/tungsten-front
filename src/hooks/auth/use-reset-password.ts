import { useMutation } from '@tanstack/react-query';
import {
  resetPassword,
  type ResetPasswordRequest,
} from '@services/auth.service';

export const useResetPassword = () =>
  useMutation({
    mutationFn: (body: ResetPasswordRequest) => resetPassword(body),
  });
