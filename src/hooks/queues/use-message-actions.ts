import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ackMessage,
  nackMessage,
  setMessageVisibility,
  receiveMessages,
  type ReceiveParams,
} from '@services/queues.service';

export const useAckMessage = (queueId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (receiptHandle: string) => ackMessage(queueId, receiptHandle),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['queues', queueId, 'messages'] }),
  });
};

export const useNackMessage = (queueId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (receiptHandle: string) => nackMessage(queueId, receiptHandle),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['queues', queueId, 'messages'] }),
  });
};

export const useSetMessageVisibility = (queueId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      receiptHandle,
      visibilityTimeout,
    }: {
      receiptHandle: string;
      visibilityTimeout: number;
    }) => setMessageVisibility(queueId, receiptHandle, visibilityTimeout),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['queues', queueId, 'messages'] }),
  });
};

export const useReceiveMessages = (queueId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params?: ReceiveParams) => receiveMessages(queueId, params),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['queues', queueId, 'messages'] }),
  });
};
