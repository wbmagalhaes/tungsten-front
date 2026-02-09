import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '@services/profile.service';

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};
