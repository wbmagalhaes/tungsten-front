import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQueue, type CreateQueueRequest } from '@services/queues.service';

export const useCreateQueue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateQueueRequest) => createQueue(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['queues'] }),
  });
};
