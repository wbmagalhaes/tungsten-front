import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listInbox,
  getInboxUnreadCount,
  markInboxRead,
  markAllInboxRead,
} from '@services/notifications.service';

export { useInboxStream } from './use-inbox-stream';

export const useInbox = () =>
  useQuery({
    queryKey: ['inbox'],
    queryFn: listInbox,
  });

export const useInboxUnreadCount = () =>
  useQuery({
    queryKey: ['inbox', 'unread'],
    queryFn: getInboxUnreadCount,
  });

export const useMarkInboxRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markInboxRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });
};

export const useMarkAllInboxRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllInboxRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });
};
