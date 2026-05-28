import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  changePassword,
  login as loginService,
  type ChangePasswordRequest,
} from '@services/auth.service';
import { getProfile } from '@services/profile.service';
import { useAuthStore } from '@stores/useAuthStore';

export type ChangePasswordWithReauth = ChangePasswordRequest & {
  username: string;
  turnstile_token: string;
};

export const useChangePassword = () => {
  const qc = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (body: ChangePasswordWithReauth) => {
      const { username, turnstile_token, ...changeBody } = body;
      await changePassword(changeBody);
      await loginService({
        username,
        password: changeBody.new_password,
        token: turnstile_token,
      });
      const me = await getProfile();
      setUser(me);
      qc.setQueryData(['me'], me);
      return me;
    },
    retry: 0,
  });
};
