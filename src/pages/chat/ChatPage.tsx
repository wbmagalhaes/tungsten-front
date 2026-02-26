import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Hash,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { TextField } from '@components/base/text-field';
import PageHeader from '@components/PageHeader';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { ErrorState } from '@components/ErrorState';
import { LoadingState } from '@components/LoadingState';
import ProtectedComponent from '@components/ProtectedComponent';

import { useListRooms } from '@hooks/chat/use-list-rooms';
import { useCreateRoom } from '@hooks/chat/use-create-room';
import { useEditRoom } from '@hooks/chat/use-edit-room';
import { useDeleteRoom } from '@hooks/chat/use-delete-room';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/base/dialog';
import type { ChatRoom } from '@services/chat.service';
import { useAuthStore } from '@stores/useAuthStore';

interface RoomCardProps {
  room: ChatRoom;
  onEdit: (room: ChatRoom) => void;
  onDelete: (room: ChatRoom) => void;
  currentUserId: string;
  isSudo: boolean;
}

function RoomCard({
  room,
  onEdit,
  onDelete,
  currentUserId,
  isSudo,
}: RoomCardProps) {
  const navigate = useNavigate();
  const canManage = isSudo || room.owner_id === currentUserId;

  return (
    <Card
      className='cursor-pointer hover:border-primary/30 transition-all group'
      onClick={() => navigate(`/chat/${room.id}`)}
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Hash className='w-5 h-5 text-primary' />
            {mode === 'create' ? 'Create Room' : 'Edit Room'}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ChatPage() {
  const currentUserId = useAuthStore((s) => s.userId ?? '');
  const isSudo = useAuthStore((s) => s.isSudo);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: roomsData,
    isLoading: roomsLoading,
    isError: roomsError,
    refetch,
  } = useListRooms({
    search: search || undefined,
    page,
    page_size: 24,
  });

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
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const rooms = roomsData?.results ?? [];
  const total = roomsData?.count ?? 0;

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
            <Button
              className='underline p-0'
              variant='link'
              onClick={() => setCreateOpen(true)}
            >
              Create one?
            </Button>
          </ProtectedComponent>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
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
