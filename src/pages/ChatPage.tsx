import { useState, useLayoutEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Users,
  Send,
  Circle,
  Hash,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Search,
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
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import { Avatar, AvatarImage, AvatarFallback } from '@components/base/avatar';
import PageHeader from '@components/PageHeader';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { ErrorState } from '@components/ErrorState';
import { LoadingState } from '@components/LoadingState';
import ProtectedComponent from '@components/ProtectedComponent';

import { useListRooms } from '@hooks/chat/use-list-rooms';
import { useCreateRoom } from '@hooks/chat/use-create-rooms';
import { useEditRoom } from '@hooks/chat/use-edit-rooms';
import { useDeleteRoom } from '@hooks/chat/use-delete-rooms';
import {
  useChatSocket,
  type IncomingMessage,
  type ConnectionStatus,
  type ChatMember,
} from '@hooks/chat/use-chat-socket';
import type { ChatRoom } from '@services/chat.service';
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

interface RoomCardProps {
  room: ChatRoom;
  onSelect: (id: string) => void;
  onEdit: (room: ChatRoom) => void;
  onDelete: (room: ChatRoom) => void;
  currentUserId: string;
  isSudo: boolean;
}

function RoomCard({
  room,
  onSelect,
  onEdit,
  onDelete,
  currentUserId,
  isSudo,
}: RoomCardProps) {
  const canManage = isSudo || room.owner_id === currentUserId;

  return (
    <Card
      className='cursor-pointer hover:border-primary/30 transition-all group'
      onClick={() => onSelect(room.id)}
    >
      <CardHeader>
        <CardIcon>
          <Hash className='w-5 h-5' />
        </CardIcon>
        <CardTitle className='truncate'>{room.title}</CardTitle>
        {canManage && (
          <div
            className='ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'
            onClick={(e) => e.stopPropagation()}
          >
            <ProtectedComponent requireScope='chat-rooms:Edit'>
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7'
                onClick={() => onEdit(room)}
              >
                <Pencil className='w-3.5 h-3.5' />
              </Button>
            </ProtectedComponent>
            <ProtectedComponent requireScope='chat-rooms:Delete'>
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 text-destructive hover:text-destructive'
                onClick={() => onDelete(room)}
              >
                <Trash2 className='w-3.5 h-3.5' />
              </Button>
            </ProtectedComponent>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className='text-xs text-muted-foreground flex items-center gap-1 mt-1'>
          <Clock className='w-3 h-3' />
          {new Date(room.updated_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MessageBubble({ msg, isOwn }: { msg: LocalMessage; isOwn: boolean }) {
  const name = displayName(msg.username, msg.user_id);
  const avatarSrc =
    msg.avatar ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user_id}`;

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwn && (
        <Avatar size='sm'>
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
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

interface RoomFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialTitle?: string;
  onSubmit: (title: string) => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

function RoomFormDialog({
  open,
  onOpenChange,
  initialTitle = '',
  onSubmit,
  isLoading,
  mode,
}: RoomFormDialogProps) {
  const [title, setTitle] = useState(initialTitle);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
      <Card className='w-full max-w-md mx-4'>
        <CardHeader>
          <CardIcon>
            <Hash className='w-5 h-5' />
          </CardIcon>
          <CardTitle>
            {mode === 'create' ? 'Create Room' : 'Edit Room'}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <TextField
            label='Room title'
            placeholder='e.g. general'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && title.trim() && onSubmit(title.trim())
            }
            autoFocus
          />
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit(title.trim())}
              disabled={!title.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : mode === 'create' ? (
                'Create'
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ChatViewProps {
  roomId: string;
  roomTitle: string;
  currentUserId: string;
  onBack: () => void;
}

function ChatView({ roomId, roomTitle, currentUserId, onBack }: ChatViewProps) {
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

  return (
    <>
      <PageHeader
        title={`#${roomTitle}`}
        icon={<Hash className='w-5 h-5' />}
        action={
          <div className='flex items-center gap-3'>
            <ConnectionBadge status={status} />
            <Button variant='outline' onClick={onBack}>
              Back to Rooms
            </Button>
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
                const avatarSrc =
                  u.avatar ??
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.user_id}`;
                return (
                  <div
                    key={u.user_id}
                    className='flex items-center gap-3 p-2 rounded-sm hover:bg-muted/30 transition-colors group'
                  >
                    <div className='relative shrink-0'>
                      <Avatar size='sm'>
                        <AvatarImage src={avatarSrc} alt={name} />
                        <AvatarFallback>
                          {name[0]?.toUpperCase()}
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
    </>
  );
}

export default function ChatPage() {
  const currentUserId = useAuthStore((s) => s.userId ?? '');
  const isSudo = useAuthStore((s) => s.isSudo);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const {
    data: roomsData,
    isLoading: roomsLoading,
    isError: roomsError,
    refetch,
  } = useListRooms({ search: search || undefined, page, page_size: 24 });

  const createRoom = useCreateRoom();
  const deleteRoom = useDeleteRoom();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ChatRoom | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChatRoom | null>(null);

  const editRoom = useEditRoom(editTarget?.id ?? '');

  const handleCreate = (title: string) => {
    createRoom.mutate({ title }, { onSuccess: () => setCreateOpen(false) });
  };

  const handleEdit = (title: string) => {
    if (!editTarget) return;
    editRoom.mutate({ title }, { onSuccess: () => setEditTarget(null) });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteRoom.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        if (selectedRoomId === deleteTarget.id) setSelectedRoomId(null);
      },
    });
  };

  const rooms = roomsData?.results ?? [];
  const total = roomsData?.count ?? 0;
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;

  if (selectedRoomId && selectedRoom) {
    return (
      <div className='space-y-4'>
        <ChatView
          key={selectedRoomId}
          roomId={selectedRoomId}
          roomTitle={selectedRoom.title}
          currentUserId={currentUserId}
          onBack={() => setSelectedRoomId(null)}
        />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Chat'
        icon={<MessageSquare className='w-5 h-5' />}
        action={
          <ProtectedComponent requireScope='chat-rooms:Create'>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className='w-4 h-4 mr-2' />
              New Room
            </Button>
          </ProtectedComponent>
        }
      />

      <div className='relative max-w-sm'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
        <TextField
          placeholder='Search rooms…'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className='pl-9'
        />
      </div>

      {roomsLoading && <LoadingState message='Loading rooms…' />}
      {roomsError && (
        <ErrorState
          title='Failed to load rooms'
          message='Could not reach the server.'
          onRetry={refetch}
        />
      )}

      {!roomsLoading && !roomsError && rooms.length === 0 && (
        <div className='text-center py-16 text-muted-foreground'>
          No rooms found.{' '}
          <ProtectedComponent requireScope='chat-rooms:Create' fallback={null}>
            <button className='underline' onClick={() => setCreateOpen(true)}>
              Create one?
            </button>
          </ProtectedComponent>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onSelect={setSelectedRoomId}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
            currentUserId={currentUserId}
            isSudo={isSudo}
          />
        ))}
      </div>

      {total > 24 && (
        <div className='flex justify-center gap-2 pt-4'>
          <Button
            variant='outline'
            size='sm'
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className='text-sm text-muted-foreground self-center'>
            Page {page}
          </span>
          <Button
            variant='outline'
            size='sm'
            disabled={page * 24 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <RoomFormDialog
        key='create'
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode='create'
        onSubmit={handleCreate}
        isLoading={createRoom.isPending}
      />
      <RoomFormDialog
        key={editTarget?.id ?? 'edit'}
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        mode='edit'
        initialTitle={editTarget?.title}
        onSubmit={handleEdit}
        isLoading={editRoom.isPending}
      />
      <ConfirmationDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title='Delete room'
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        icon={<Trash2 className='w-5 h-5 text-destructive' />}
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={handleDelete}
        isLoading={deleteRoom.isPending}
        loadingText='Deleting…'
      />
    </div>
  );
}
