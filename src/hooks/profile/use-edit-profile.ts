import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '@services/profile.service';

export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
