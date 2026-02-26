import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRoom } from '@services/chat.service';

export const useDeleteRoom = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chat', 'rooms'] }),
    retry: 0,
  });
};
