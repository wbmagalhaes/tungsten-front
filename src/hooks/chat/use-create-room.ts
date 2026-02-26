import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoom, type CreateRoomRequest } from '@services/chat.service';

export const useCreateRoom = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateRoomRequest) => createRoom(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chat', 'rooms'] }),
    retry: 0,
  });
};
