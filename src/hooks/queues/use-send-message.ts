import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage, type SendMessageRequest } from '@services/queues.service';

export const useSendMessage = (queueId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: SendMessageRequest) => sendMessage(queueId, req),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['queues', queueId, 'messages'] }),
  });
};
