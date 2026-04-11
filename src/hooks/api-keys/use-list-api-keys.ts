import { useQuery } from '@tanstack/react-query';
import { listApiKeys } from '@services/api-keys.service';

export const useListApiKeys = () => {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: listApiKeys,
  });
};
