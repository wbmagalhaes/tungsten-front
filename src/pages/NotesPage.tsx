import { useState } from 'react';
import {
  StickyNote,
  Plus,
  Trash2,
  Edit,
  Clock,
  PencilLine,
  Search,
  Loader2,
  FileText,
  Lightbulb,
  CheckCircle,
  Bookmark,
  Star,
  Flame,
  Pin,
  Target,
  Brain,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { TextField } from '@components/base/text-field';
import { Textarea } from '@components/base/text-area';
import PageHeader from '@components/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/base/dialog';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { ErrorState } from '@components/ErrorState';
import { LoadingState } from '@components/LoadingState';
import ProtectedComponent from '@components/ProtectedComponent';

import { useListNotes } from '@hooks/notes/use-list-notes';
import { useCreateNote } from '@hooks/notes/use-create-note';
import { useUpdateNote } from '@hooks/notes/use-update-note';
import { useDeleteNote } from '@hooks/notes/use-delete-note';
import type { Note } from '@services/notes.service';

const ICON_OPTIONS: { value: string; icon: LucideIcon }[] = [
  { value: 'file-text', icon: FileText },
  { value: 'lightbulb', icon: Lightbulb },
  { value: 'check-circle', icon: CheckCircle },
  { value: 'bookmark', icon: Bookmark },
  { value: 'star', icon: Star },
  { value: 'flame', icon: Flame },
  { value: 'pin', icon: Pin },
  { value: 'target', icon: Target },
  { value: 'brain', icon: Brain },
  { value: 'clipboard-list', icon: ClipboardList },
];

export function NoteIcon({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const Icon = ICON_OPTIONS.find((o) => o.value === value)?.icon ?? FileText;
  return <Icon className={className} />;
}

const COLOR_OPTIONS: { value: string; label: string; classes: string }[] = [
  {
    value: 'purple',
    label: 'Purple',
    classes: 'from-purple-600/20 border-purple-500/30',
  },
  {
    value: 'cyan',
    label: 'Cyan',
    classes: 'from-cyan-600/20 border-cyan-500/30',
  },
  {
    value: 'green',
    label: 'Green',
    classes: 'from-green-600/20 border-green-500/30',
  },
  {
    value: 'orange',
    label: 'Orange',
    classes: 'from-orange-600/20 border-orange-500/30',
  },
  {
    value: 'pink',
    label: 'Pink',
    classes: 'from-fuchsia-600/20 border-fuchsia-500/30',
  },
  {
    value: 'rose',
    label: 'Rose',
    classes: 'from-rose-600/20 border-rose-500/30',
  },
  {
    value: 'yellow',
    label: 'Yellow',
    classes: 'from-yellow-600/20 border-yellow-500/30',
  },
  { value: 'sky', label: 'Sky', classes: 'from-sky-600/20 border-sky-500/30' },
];

const COLOR_DOT: Record<string, string> = {
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  pink: 'bg-fuchsia-500',
  rose: 'bg-rose-500',
  yellow: 'bg-yellow-500',
  sky: 'bg-sky-500',
};

function colorClasses(color: string): string {
  return (
    COLOR_OPTIONS.find((c) => c.value === color)?.classes ??
    COLOR_OPTIONS[0].classes
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      {ICON_OPTIONS.map(({ value: v, icon: Icon }) => (
        <button
          key={v}
          type='button'
          onClick={() => onChange(v)}
          className={`w-8 h-8 flex items-center justify-center rounded-sm transition-colors hover:bg-muted ${
            value === v ? 'bg-primary/20 ring-1 ring-primary' : ''
          }`}
        >
          <Icon className='w-4 h-4' />
        </button>
      ))}
    </div>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      {COLOR_OPTIONS.map((c) => (
        <button
          key={c.value}
          type='button'
          title={c.label}
          onClick={() => onChange(c.value)}
          className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
            COLOR_DOT[c.value] ?? 'bg-muted'
          } ${value === c.value ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110' : ''}`}
        />
      ))}
    </div>
  );
}

interface NoteFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialTitle?: string;
  initialBody?: string;
  initialIcon?: string;
  initialColor?: string;
  onSubmit: (data: {
    title: string;
    body: string;
    icon: string;
    color: string;
  }) => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

function NoteFormDialog({
  open,
  onOpenChange,
  initialTitle = '',
  initialBody = '',
  initialIcon = 'file-text',
  initialColor = 'purple',
  onSubmit,
  isLoading,
  mode,
}: NoteFormDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [icon, setIcon] = useState(initialIcon);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), body, icon, color });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <StickyNote className='w-5 h-5 text-primary' />
            {mode === 'create' ? 'Create Note' : 'Edit Note'}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='text-sm text-muted-foreground mb-2 block'>
              Icon
            </label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
          <div>
            <label className='text-sm text-muted-foreground mb-2 block'>
              Color
            </label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
          <TextField
            label='Title'
            placeholder='Note title…'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
          <div>
            <label className='text-sm text-muted-foreground mb-2 block'>
              Content
            </label>
            <Textarea
              placeholder='Write your note here…'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className='min-h-32'
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || isLoading}>
            {isLoading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : mode === 'create' ? (
              <>
                <Plus className='w-4 h-4' />
                Create
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <Card
      className={`bg-linear-to-br ${colorClasses(note.color)} to-transparent border-2 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden`}
    >
      <div className='absolute inset-0 bg-linear-to-br from-transparent via-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />

      <CardHeader className='relative'>
        <div className='flex w-full items-center justify-between gap-2'>
          <div className='flex items-center gap-2 min-w-0'>
            <NoteIcon value={note.icon} className='w-4 h-4 shrink-0' />
            <CardTitle className='text-base truncate'>{note.title}</CardTitle>
          </div>
          <div
            className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0'
            onClick={(e) => e.stopPropagation()}
          >
            <ProtectedComponent requireScope='notes:edit'>
              <Button
                variant='ghost'
                size='icon-sm'
                onClick={() => onEdit(note)}
                className='hover:bg-primary/20'
              >
                <Edit className='w-3 h-3' />
              </Button>
            </ProtectedComponent>
            <ProtectedComponent requireScope='notes:delete'>
              <Button
                variant='destructive'
                size='icon-sm'
                onClick={() => onDelete(note)}
              >
                <Trash2 className='w-3 h-3' />
              </Button>
            </ProtectedComponent>
          </div>
        </div>
      </CardHeader>

      <CardContent className='relative'>
        <pre className='text-sm text-foreground/90 whitespace-pre-wrap font-sans line-clamp-6 mb-3'>
          {note.body}
        </pre>
        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <Clock className='w-3 h-3' />
          {formatTimestamp(note.updated_at)}
        </div>
      </CardContent>
    </Card>
  );
}

export default function NotesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: notesData,
    isLoading,
    isError,
    refetch,
  } = useListNotes({
    search: search || undefined,
    page,
    page_size: 24,
  });

  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const updateNote = useUpdateNote(editTarget?.id ?? '');

  const handleCreate = (data: {
    title: string;
    body: string;
    icon: string;
    color: string;
  }) => {
    createNote.mutate(data, { onSuccess: () => setCreateOpen(false) });
  };

  const handleEdit = (data: {
    title: string;
    body: string;
    icon: string;
    color: string;
  }) => {
    if (!editTarget) return;
    updateNote.mutate(data, { onSuccess: () => setEditTarget(null) });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteNote.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const notes = notesData?.results ?? [];
  const total = notesData?.count ?? 0;

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Notes'
        icon={<StickyNote className='w-5 h-5' />}
        action={
          <ProtectedComponent requireScope='notes:create'>
            <Button onClick={() => setCreateOpen(true)} size='icon'>
              <PencilLine className='w-4 h-4' />
            </Button>
          </ProtectedComponent>
        }
      />

      <div className='relative max-w-sm'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
        <TextField
          placeholder='Search notes…'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className='pl-9'
        />
      </div>

      {isLoading && <LoadingState message='Loading notes…' />}
      {isError && (
        <ErrorState
          title='Failed to load notes'
          message='Could not reach the server.'
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && notes.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <StickyNote className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground mb-4'>
              No notes yet. Create your first note!
            </p>
            <ProtectedComponent requireScope='notes:create'>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className='w-4 h-4' />
                New Note
              </Button>
            </ProtectedComponent>
          </CardContent>
        </Card>
      )}

      {notes.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

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

      <NoteFormDialog
        key='create'
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode='create'
        onSubmit={handleCreate}
        isLoading={createNote.isPending}
      />
      <NoteFormDialog
        key={editTarget?.id ?? 'edit'}
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        mode='edit'
        initialTitle={editTarget?.title}
        initialBody={editTarget?.body}
        initialIcon={editTarget?.icon}
        initialColor={editTarget?.color}
        onSubmit={handleEdit}
        isLoading={updateNote.isPending}
      />
      <ConfirmationDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title='Delete note'
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        icon={<Trash2 className='w-5 h-5 text-destructive' />}
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={handleDelete}
        isLoading={deleteNote.isPending}
        loadingText='Deleting…'
      />
    </div>
  );
}
