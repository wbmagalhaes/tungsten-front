import { useMutation } from '@tanstack/react-query';
import {
  recoverPassword,
  type RecoverPasswordRequest,
} from '@services/auth.service';

export const useRecoverPassword = () =>
  useMutation({
    mutationFn: (body: RecoverPasswordRequest) => recoverPassword(body),
  });
