import { useMutation } from '@tanstack/react-query';
import {
  changePassword,
  type ChangePasswordRequest,
} from '@services/auth.service';

export const useChangePassword = () =>
  useMutation({
    mutationFn: (body: ChangePasswordRequest) => changePassword(body),
  });
