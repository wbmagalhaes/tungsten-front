import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listTopicPermissions,
  createTopicPermission,
  deleteTopicPermission,
  type TopicPermission,
} from '@services/notifications.service';

export const useTopicPermissions = (topicId: string) =>
  useQuery({
    queryKey: ['topics', topicId, 'permissions'],
    queryFn: () => listTopicPermissions(topicId),
    enabled: !!topicId,
  });

export const useCreateTopicPermission = (topicId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TopicPermission) =>
      createTopicPermission(topicId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['topics', topicId, 'permissions'] }),
  });
};

export const useDeleteTopicPermission = (topicId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      permission,
    }: {
      userId: string;
      permission: string;
    }) => deleteTopicPermission(topicId, userId, permission),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['topics', topicId, 'permissions'] }),
  });
};
