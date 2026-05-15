import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQueue, type UpdateQueueRequest } from '@services/queues.service';

export const useUpdateQueue = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateQueueRequest) => updateQueue(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['queues'] });
      qc.invalidateQueries({ queryKey: ['queues', id] });
    },
  });
};
