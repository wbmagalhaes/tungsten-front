import { useParams } from 'react-router-dom';
import { useState, useLayoutEffect, useRef, useCallback } from 'react';
import {
  Hash,
  Users,
  Send,
  Circle,
  Wifi,
  WifiOff,
  Loader2,
  Ban,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import { Avatar, AvatarImage, AvatarFallback } from '@components/base/avatar';
import PageHeader from '@components/PageHeader';
import { ErrorState } from '@components/ErrorState';
import { LoadingState } from '@components/LoadingState';
import ProtectedComponent from '@components/ProtectedComponent';

import { useGetRoom } from '@hooks/chat/use-get-room';
import {
  useChatSocket,
  type IncomingMessage,
  type ConnectionStatus,
  type ChatMember,
} from '@hooks/chat/use-chat-socket';
import { useAuthStore } from '@stores/useAuthStore';

interface LocalMessage {
  key: string;
  user_id: string;
  username: string;
  avatar: string | null;
  body: string;
  created_at: string;
}

type FeedItem =
  | { kind: 'msg'; key: string; data: LocalMessage }
  | { kind: 'sys'; key: string; text: string };

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function uid() {
  return Math.random().toString(36).slice(2);
}

function displayName(username: string, user_id: string): string {
  return username || `${user_id.slice(0, 8)}…`;
}

function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const map: Record<
    ConnectionStatus,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    connected: {
      label: 'Connected',
      color: 'text-success',
      icon: <Wifi className='w-3 h-3' />,
    },
    connecting: {
      label: 'Connecting…',
      color: 'text-warning',
      icon: <Loader2 className='w-3 h-3 animate-spin' />,
    },
    disconnected: {
      label: 'Disconnected',
      color: 'text-muted-foreground',
      icon: <WifiOff className='w-3 h-3' />,
    },
    error: {
      label: 'Error',
      color: 'text-destructive',
      icon: <WifiOff className='w-3 h-3' />,
    },
  };
  const { label, color, icon } = map[status];
  return (
    <span className={`flex items-center gap-1 text-xs ${color}`}>
      {icon}
      {label}
    </span>
  );
}

function MessageBubble({ msg, isOwn }: { msg: LocalMessage; isOwn: boolean }) {
  const name = displayName(msg.username, msg.user_id);
  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwn && (
        <Avatar size='sm'>
          <AvatarImage src={msg.avatar || undefined} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`flex-1 max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}
      >
        {!isOwn && (
          <span className='text-xs text-muted-foreground mb-1'>{name}</span>
        )}
        <div
          className={`px-4 py-2 rounded-sm ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
        >
          <p className='text-sm whitespace-pre-wrap'>{msg.body}</p>
        </div>
        <span className='text-xs text-muted-foreground mt-1'>
          {formatTimestamp(msg.created_at)}
        </span>
      </div>
    </div>
  );
}

function SystemEvent({ text }: { text: string }) {
  return (
    <div className='flex justify-center'>
      <span className='text-xs text-muted-foreground bg-muted/50 px-3 py-0.5 rounded-full'>
        {text}
      </span>
    </div>
  );
}

export default function ChatRoomPage() {
  const { id: roomId = '' } = useParams();
  const currentUserId = useAuthStore((s) => s.userId ?? '');

  const { data: room, isLoading, error } = useGetRoom(roomId);

  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [activeUsers, setActiveUsers] = useState<ChatMember[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const pushMsg = useCallback((msg: LocalMessage) => {
    setFeed((f) => [...f, { kind: 'msg', key: msg.key, data: msg }]);
  }, []);

  const pushSys = useCallback((text: string) => {
    setFeed((f) => [...f, { kind: 'sys', key: uid(), text }]);
  }, []);

  const onSocketMessage = useCallback(
    (msg: IncomingMessage) => {
      switch (msg.type) {
        case 'history_start':
        case 'history_end':
        case 'ping':
          break;
        case 'talk':
          pushMsg({
            key: uid(),
            user_id: msg.user_id,
            username: msg.username,
            avatar: msg.avatar,
            body: msg.body,
            created_at: msg.created_at,
          });
          break;
        case 'members':
          setActiveUsers(msg.members);
          break;
        case 'join':
          setActiveUsers((u) => {
            if (u.find((x) => x.user_id === msg.user_id)) return u;
            return [
              ...u,
              {
                user_id: msg.user_id,
                username: msg.username,
                avatar: msg.avatar,
              },
            ];
          });
          pushSys(`${displayName(msg.username, msg.user_id)} joined`);
          break;
        case 'leave':
          setActiveUsers((u) => u.filter((x) => x.user_id !== msg.user_id));
          setFeed((f) => {
            const name = activeUsers.find((x) => x.user_id === msg.user_id);
            return [
              ...f,
              {
                kind: 'sys',
                key: uid(),
                text: `${name ? displayName(name.username, msg.user_id) : msg.user_id.slice(0, 8) + '…'} left`,
              },
            ];
          });
          break;
      }
    },
    [pushMsg, pushSys, activeUsers],
  );

  const { status, sendMessage, sendPing } = useChatSocket({
    roomId,
    onMessage: onSocketMessage,
  });

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feed]);

  useLayoutEffect(() => {
    if (status !== 'connected') return;
    const t = setInterval(sendPing, 30_000);
    return () => clearInterval(t);
  }, [status, sendPing]);

  const handleSend = () => {
    if (!msgInput.trim() || status !== 'connected') return;
    sendMessage(msgInput.trim());
    setMsgInput('');
  };

  if (isLoading) return <LoadingState message='Loading room…' />;
  if (error || !room) {
    return (
      <ErrorState
        title='Room not found'
        message={error?.message || 'Unable to load this chat room'}
      />
    );
  }

  return (
    <div className='space-y-4'>
      <PageHeader
        title={`#${room.title}`}
        icon={<Hash className='w-5 h-5' />}
        action={
          <div className='flex items-center gap-3'>
            <ConnectionBadge status={status} />
            <ButtonLink to='/chat' variant='outline'>
              Back to Rooms
            </ButtonLink>
          </div>
        }
      />

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-12rem)]'>
        <Card className='lg:col-span-3 flex flex-col overflow-hidden'>
          <CardContent className='flex-1 overflow-y-auto p-4 space-y-4'>
            {feed.length === 0 && status === 'connected' && (
              <div className='text-center py-8 text-muted-foreground text-sm'>
                No messages yet. Say something!
              </div>
            )}
            {status === 'connecting' && feed.length === 0 && (
              <LoadingState message='Connecting…' />
            )}
            {status === 'error' && (
              <ErrorState
                title='Connection lost'
                message='Could not connect to the chat server.'
              />
            )}
            {feed.map((item) =>
              item.kind === 'sys' ? (
                <SystemEvent key={item.key} text={item.text} />
              ) : (
                <MessageBubble
                  key={item.key}
                  msg={item.data}
                  isOwn={item.data.user_id === currentUserId}
                />
              ),
            )}
            <div ref={bottomRef} />
          </CardContent>

          <div className='p-4 border-t border-border'>
            <ProtectedComponent
              requireScope='chat-rooms:Join'
              fallback={
                <p className='text-sm text-muted-foreground text-center py-2'>
                  You don't have permission to send messages.
                </p>
              }
            >
              <div className='flex gap-2'>
                <TextField
                  placeholder={
                    status === 'connected'
                      ? 'Type a message…'
                      : 'Waiting for connection…'
                  }
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className='flex-1'
                  disabled={status !== 'connected'}
                />
                <Button
                  onClick={handleSend}
                  disabled={!msgInput.trim() || status !== 'connected'}
                >
                  <Send className='w-4 h-4' />
                </Button>
              </div>
            </ProtectedComponent>
          </div>
        </Card>

        <Card className='flex flex-col overflow-hidden'>
          <CardHeader>
            <CardIcon>
              <Users className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Online</CardTitle>
            <Badge variant='secondary'>{activeUsers.length}</Badge>
          </CardHeader>
          <CardContent className='flex-1 overflow-y-auto space-y-1'>
            {activeUsers.length === 0 ? (
              <p className='text-xs text-muted-foreground text-center py-4'>
                Nobody here yet
              </p>
            ) : (
              activeUsers.map((u) => {
                const name = displayName(u.username, u.user_id);
                return (
                  <div
                    key={u.user_id}
                    className='flex items-center gap-3 p-2 rounded-sm hover:bg-muted/30 transition-colors group'
                  >
                    <div className='relative shrink-0'>
                      <Avatar size='sm'>
                        <AvatarImage src={u.avatar || undefined} alt={name} />
                        <AvatarFallback>
                          {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Circle className='w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 fill-success text-success' />
                    </div>
                    <span className='text-sm text-foreground truncate'>
                      {name}
                    </span>
                    <ProtectedComponent
                      requireScope='chat-rooms:Moderate'
                      fallback={null}
                    >
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive shrink-0'
                        title='Ban user (coming soon)'
                        disabled
                      >
                        <Ban className='w-3 h-3' />
                      </Button>
                    </ProtectedComponent>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
