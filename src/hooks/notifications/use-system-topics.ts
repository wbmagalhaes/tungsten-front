import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listSystemTopics,
  createSystemTopic,
} from '@services/notifications.service';

export const useSystemTopics = () =>
  useQuery({
    queryKey: ['topics', 'system'],
    queryFn: listSystemTopics,
  });

export const useCreateSystemTopic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSystemTopic,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['topics', 'system'] });
      qc.invalidateQueries({ queryKey: ['topics'] });
    },
  });
};
