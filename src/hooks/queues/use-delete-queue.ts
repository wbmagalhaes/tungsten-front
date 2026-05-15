import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQueue } from '@services/queues.service';

export const useDeleteQueue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQueue(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['queues'] }),
  });
};
