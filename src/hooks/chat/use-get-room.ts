import { getRoom } from '@services/chat.service';
import { useQuery } from '@tanstack/react-query';

export const useGetRoom = (id: string, { enabled = true } = {}) => {
  return useQuery({
    queryKey: ['rooms', id],
    queryFn: () => getRoom(id),
    enabled: !!id && enabled,
  });
};
