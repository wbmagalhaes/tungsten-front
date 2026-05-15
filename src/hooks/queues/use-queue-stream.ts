import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ensureFreshToken } from '@services/ensure-fresh-token';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.tungsten.rocks';

const MAX_BACKOFF_MS = 30_000;

export const useQueueStream = (queueId: string, enabled = true) => {
  const qc = useQueryClient();

  useEffect(() => {
    if (!enabled || !queueId) return;

    let destroyed = false;
    let attempts = 0;
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ['queues', queueId, 'messages'] });
    };

    const connect = async () => {
      if (destroyed) return;
      const token = await ensureFreshToken();
      if (destroyed) return;
      if (!token) {
        scheduleReconnect();
        return;
      }

      const url = `${baseURL}/api/queues/${queueId}/stream?token=${encodeURIComponent(token)}`;
      es = new EventSource(url);

      es.onopen = () => {
        attempts = 0;
      };
      es.onmessage = invalidate;
      es.addEventListener('message', invalidate);
      es.onerror = () => {
        es?.close();
        es = null;
        scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      if (destroyed) return;
      attempts += 1;
      const delay = Math.min(
        MAX_BACKOFF_MS,
        1000 * 2 ** Math.min(attempts, 5),
      );
      reconnectTimer = setTimeout(connect, delay);
    };

    connect();

    return () => {
      destroyed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      es?.close();
    };
  }, [enabled, queueId, qc]);
};
