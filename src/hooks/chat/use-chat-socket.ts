import { useEffect, useRef, useState, useCallback } from 'react';
import Cookies from 'js-cookie';

export interface TalkMessage {
  type: 'talk';
  user_id: string;
  username: string;
  avatar: string | null;
  body: string;
  created_at: string;
}

export interface JoinMessage {
  type: 'join';
  user_id: string;
  username: string;
  avatar: string | null;
}

export interface LeaveMessage {
  type: 'leave';
  user_id: string;
}

export interface MembersMessage {
  type: 'members';
  members: ChatMember[];
}

export interface PingMessage {
  type: 'ping';
  user_id: string;
}

export interface HistoryStartMessage {
  type: 'history_start';
}

export interface HistoryEndMessage {
  type: 'history_end';
}

export interface ChatMember {
  user_id: string;
  username: string;
  avatar: string | null;
}

export type IncomingMessage =
  | TalkMessage
  | JoinMessage
  | LeaveMessage
  | MembersMessage
  | PingMessage
  | HistoryStartMessage
  | HistoryEndMessage;

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface UseChatSocketOptions {
  roomId: string | null;
  onMessage?: (msg: IncomingMessage) => void;
}

export interface UseChatSocketReturn {
  status: ConnectionStatus;
  sendMessage: (body: string) => void;
  sendPing: () => void;
}

const WS_BASE = import.meta.env.VITE_WS_BASE_URL ?? 'wss://api.tungsten.rocks';
const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

export const useChatSocket = ({
  roomId,
  onMessage,
}: UseChatSocketOptions): UseChatSocketReturn => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!roomId) return;

    const token = Cookies.get('access');
    if (!token) return;

    let destroyed = false;

    const tryConnect = () => {
      if (destroyed) return;

      setStatus('connecting');

      const url = `${WS_BASE}/ws/chat/join/${roomId}?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (destroyed) {
          ws.close();
          return;
        }
        setStatus('connected');
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const msg: IncomingMessage = JSON.parse(event.data as string);
          onMessageRef.current?.(msg);
        } catch {
          // ignore malformed frames
        }
      };

      ws.onerror = () => {
        if (!destroyed) setStatus('error');
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (destroyed) return;

        setStatus('disconnected');

        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1;
          reconnectTimerRef.current = setTimeout(
            tryConnect,
            RECONNECT_DELAY_MS,
          );
        }
      };
    };

    tryConnect();

    return () => {
      destroyed = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
      wsRef.current = null;
      reconnectAttempts.current = 0;
      setStatus('disconnected');
    };
  }, [roomId]);

  const sendMessage = useCallback((body: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'talk', body }));
    }
  }, []);

  const sendPing = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'ping' }));
    }
  }, []);

  return { status, sendMessage, sendPing };
};
