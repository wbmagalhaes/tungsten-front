import { useQuery } from '@tanstack/react-query';
import {
  listApiKeys,
  type ListApiKeysParams,
} from '@services/api-keys.service';

export const useListApiKeys = (params?: ListApiKeysParams) => {
  return useQuery({
    queryKey: ['api-keys', params],
    queryFn: () => listApiKeys(params),
  });
};
