import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listInbox } from '@services/notifications.service';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.tungsten.rocks';

const MAX_BACKOFF_MS = 30_000;

export const useInboxStream = (
  options: { enabled?: boolean; topicId?: string } = {},
) => {
  const { enabled = true, topicId } = options;
  const qc = useQueryClient();
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    let destroyed = false;
    let attempts = 0;
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const seenIds = seenIdsRef.current;

    const primeBaseline = async () => {
      try {
        const page = await listInbox();
        (page.results ?? []).forEach((it) => seenIds.add(it.id));
      } catch {
        // ignore — diff will just toast everything that comes in
      }
    };

    const invalidate = async (event: Event) => {
      if (import.meta.env.DEV) {
        const me = event as MessageEvent;
        console.debug('[inbox-stream] event', me.type, me.data);
      }
      try {
        const page = await listInbox();
        qc.setQueryData(['inbox'], page);
        qc.invalidateQueries({ queryKey: ['inbox', 'unread'] });

        for (const it of page.results ?? []) {
          if (seenIds.has(it.id)) continue;
          seenIds.add(it.id);
          toast.info(it.subject || 'New notification', {
            description: it.body,
          });
        }
      } catch {
        qc.invalidateQueries({ queryKey: ['inbox'] });
      }
    };

    const connect = async () => {
      if (destroyed) return;

      const path = topicId
        ? `/api/notifications/inbox/stream/${topicId}`
        : `/api/notifications/inbox/stream`;
      const url = `${baseURL}${path}`;
      es = new EventSource(url, { withCredentials: true });

      es.onopen = () => {
        attempts = 0;
      };
      es.onmessage = invalidate;
      [
        'notification',
        'inbox',
        'inbox_item',
        'message',
        'item',
        'new',
        'update',
      ].forEach((name) => es?.addEventListener(name, invalidate));
      es.onerror = () => {
        es?.close();
        es = null;
        scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      if (destroyed) return;
      attempts += 1;
      const delay = Math.min(MAX_BACKOFF_MS, 1000 * 2 ** Math.min(attempts, 5));
      reconnectTimer = setTimeout(connect, delay);
    };

    primeBaseline().then(() => {
      if (!destroyed) connect();
    });

    return () => {
      destroyed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      es?.close();
    };
  }, [enabled, qc, topicId]);
};
