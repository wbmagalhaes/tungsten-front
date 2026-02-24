import { useQuery } from '@tanstack/react-query';
import { listRooms, type ListRoomsParams } from '@services/chat.service';

export const useListRooms = (params?: ListRoomsParams) => {
  return useQuery({
    queryKey: ['chat', 'rooms', params],
    queryFn: () => listRooms(params),
  });
};
