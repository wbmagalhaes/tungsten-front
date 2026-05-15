import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listSubscriptions,
  subscribeTopic,
  unsubscribeTopic,
} from '@services/notifications.service';

export const useTopicSubscriptions = (topicId: string) =>
  useQuery({
    queryKey: ['topics', topicId, 'subscriptions'],
    queryFn: () => listSubscriptions(topicId),
    enabled: !!topicId,
  });

export const useSubscribeTopic = (topicId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recipientId: string) => subscribeTopic(topicId, recipientId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['topics', topicId, 'subscriptions'] }),
  });
};

export const useUnsubscribeTopic = (topicId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recipientId: string) => unsubscribeTopic(topicId, recipientId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['topics', topicId, 'subscriptions'] }),
  });
};
