import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Save, StickyNote, Trash2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@components/base/card';
import { Button, ButtonLink } from '@components/base/button';
import { TextField } from '@components/base/text-field';
import { Textarea } from '@components/base/text-area';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import ProtectedComponent from '@components/ProtectedComponent';

import { useGetNote } from '@hooks/notes/use-get-note';
import { useUpdateNote } from '@hooks/notes/use-update-note';
import { useDeleteNote } from '@hooks/notes/use-delete-note';
import { colorClasses } from './mappings';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';
import { NoteIcon } from './NoteIcon';

export default function SingleNotePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const { data: note, isLoading, error } = useGetNote(id);
  const updateNote = useUpdateNote(id);
  const deleteNote = useDeleteNote();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [icon, setIcon] = useState('file-text');
  const [color, setColor] = useState('purple');
  const [initialized, setInitialized] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) return <LoadingState message='Loading note…' />;
  if (error || !note) {
    return (
      <ErrorState
        title='Error loading note'
        message={error?.message || 'Unable to fetch note'}
      />
    );
  }

  if (!initialized) {
    setTitle(note.title);
    setBody(note.body ?? '');
    setIcon(note.icon ?? 'file-text');
    setColor(note.color ?? 'purple');
    setInitialized(true);
  }

  const handleSave = () => {
    updateNote.mutate({ title, body, icon, color });
  };

  const handleDelete = () => {
    deleteNote.mutate(id, { onSuccess: () => navigate('/notes') });
  };

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <ButtonLink to='/notes' variant='link' className='p-0' size='sm'>
        <ArrowLeft className='w-4 h-4' />
        Back to notes
      </ButtonLink>

      <Card
        className={`bg-linear-to-br ${colorClasses(color)} to-transparent border-2`}
      >
        <CardHeader className='gap-3'>
          <CardIcon className='bg-transparent'>
            <div className='w-10 h-10 flex items-center justify-center'>
              <NoteIcon value={icon} className='w-6 h-6' />
            </div>
          </CardIcon>
          <div className='flex flex-col items-start gap-1'>
            <CardTitle>{title || 'Untitled'}</CardTitle>
            <CardDescription>Note</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardIcon>
            <StickyNote className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Edit Note</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
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
          />
          <div>
            <label className='text-sm text-muted-foreground mb-2 block'>
              Content
            </label>
            <Textarea
              placeholder='Write your note here…'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className='min-h-48'
            />
          </div>
          <ProtectedComponent requireScope='notes:Edit'>
            <Button
              className='w-full'
              onClick={handleSave}
              disabled={!title.trim() || updateNote.isPending}
            >
              <Save className='w-4 h-4' />
              {updateNote.isPending ? 'Saving…' : 'Save Note'}
            </Button>
          </ProtectedComponent>
        </CardContent>
      </Card>

      <ProtectedComponent requireScope='notes:Delete'>
        <Card className='border-destructive/50'>
          <CardHeader>
            <CardIcon className='bg-destructive/10 text-destructive'>
              <Trash2 className='w-5 h-5' />
            </CardIcon>
            <div>
              <CardTitle>Delete Note</CardTitle>
              <CardDescription>
                Permanently remove this note. This action cannot be undone.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant='destructive'
              onClick={() => setDeleteOpen(true)}
              disabled={deleteNote.isPending}
            >
              <Trash2 className='w-4 h-4' />
              Delete Note
            </Button>
          </CardContent>
        </Card>
      </ProtectedComponent>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete note'
        description={`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
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
