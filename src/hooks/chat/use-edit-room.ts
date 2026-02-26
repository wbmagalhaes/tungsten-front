import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editRoom, type EditRoomRequest } from '@services/chat.service';

export const useEditRoom = (roomId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: EditRoomRequest) => editRoom(roomId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chat', 'rooms'] });
      qc.invalidateQueries({ queryKey: ['chat', 'rooms', roomId] });
    },
    retry: 0,
  });
};
