import { useQuery } from '@tanstack/react-query';
import { profile as profileService } from '@services/profile.service';

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: profileService,
  });
};
