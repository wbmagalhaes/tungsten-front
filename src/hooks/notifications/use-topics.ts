import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  sendToTopic,
  listSendableTopics,
  listDiscoverableTopics,
} from '@services/notifications.service';

export const useTopics = () =>
  useQuery({ queryKey: ['topics'], queryFn: listTopics });

export const useSendableTopics = () =>
  useQuery({ queryKey: ['topics', 'sendable'], queryFn: listSendableTopics });

export const useCreateTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTopic,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['topics'] }),
  });
};

export const useUpdateTopic = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      name?: string;
      description?: string;
      discoverable?: boolean;
    }) => updateTopic(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['topics'] });
      qc.invalidateQueries({ queryKey: ['topics', id] });
    },
  });
};

export const useDiscoverableTopics = () =>
  useQuery({
    queryKey: ['topics', 'discoverable'],
    queryFn: listDiscoverableTopics,
  });

export const useDeleteTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTopic(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['topics'] }),
  });
};

export const useSendToTopic = (topicId: string) =>
  useMutation({
    mutationFn: (body: { subject: string; body: string }) =>
      sendToTopic(topicId, body),
  });
