import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@services/profile.service';

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getProfile,
  });
};
