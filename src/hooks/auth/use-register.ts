import { useMutation } from '@tanstack/react-query';
import { register, type RegisterRequest } from '@services/auth.service';

export const useRegister = () =>
  useMutation({
    mutationFn: (body: RegisterRequest) => register(body),
  });
