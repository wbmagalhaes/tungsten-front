import { useState } from 'react';
import { StickyNote, Plus, Trash2, Edit, Clock } from 'lucide-react';
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

interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // TODO: Implement endpoint GET /api/notes
  const notes: Note[] = [
    {
      id: 1,
      title: 'Project Ideas',
      content:
        'Build a cyberpunk dashboard with React\nImplement real-time updates\nAdd neon effects',
      color: 'from-purple-600/20 border-purple-500/30',
      createdAt: '2024-01-15',
      updatedAt: '3 hours ago',
    },
    {
      id: 2,
      title: 'Meeting Notes',
      content: 'Discussed Q1 goals\nReview architecture\nPlan sprint timeline',
      color: 'from-cyan-600/20 border-cyan-500/30',
      createdAt: '2024-01-14',
      updatedAt: '1 day ago',
    },
    {
      id: 3,
      title: 'TODO',
      content:
        'Fix sidebar responsive\nUpdate user profile\nImplement dark mode toggle',
      color: 'from-green-600/20 border-green-500/30',
      createdAt: '2024-01-13',
      updatedAt: '2 days ago',
    },
    {
      id: 4,
      title: 'Code Snippets',
      content:
        'async function fetchData() {\n  const res = await fetch(url);\n  return res.json();\n}',
      color: 'from-orange-600/20 border-orange-500/30',
      createdAt: '2024-01-12',
      updatedAt: '3 days ago',
    },
    {
      id: 5,
      title: 'Design System',
      content: 'Colors: Purple #8e33e3, Cyan #00eaff\nFonts: Inter, Fira Code',
      color: 'from-fuchsia-600/20 border-fuchsia-500/30',
      createdAt: '2024-01-11',
      updatedAt: '4 days ago',
    },
  ];

  const handleCreateNote = () => {
    if (!newTitle.trim()) return;
    // TODO: Implement endpoint POST /api/notes
    console.log('Creating note:', { title: newTitle, content: newContent });
    setShowCreateDialog(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Notes'
        icon={<StickyNote className='w-5 h-5' />}
        action={
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className='w-4 h-4' />
            New Note
          </Button>
        }
      />

      {notes.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='p-12 text-center'>
            <StickyNote className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground mb-4'>
              No notes yet. Create your first note!
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className='w-4 h-4' />
              New Note
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <StickyNote className='w-5 h-5 text-primary' />
              Create New Note
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <TextField
              label='Title'
              placeholder='Note title...'
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div>
              <label className='text-sm text-muted-foreground mb-2 block'>
                Content
              </label>
              <Textarea
                placeholder='Write your note here...'
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className='min-h-32'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateNote}>
              <Plus className='w-4 h-4' />
              Create Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const handleDelete = () => {
    // TODO: Implement endpoint DELETE /api/notes/:id
    console.log('Deleting note:', note.id);
  };

  const handleEdit = () => {
    // TODO: Implement endpoint PATCH /api/notes/:id
    console.log('Editing note:', note.id);
  };

  return (
    <Card
      className={`bg-linear-to-br ${note.color} to-transparent border-2 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden`}
    >
      <div className='absolute inset-0 bg-linear-to-br from-transparent via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity' />

      <CardHeader className='relative'>
        <div className='flex w-full items-center justify-between gap-2'>
          <CardTitle className='text-base truncate'>{note.title}</CardTitle>
          <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
            <Button
              variant='ghost'
              size='icon-sm'
              onClick={handleEdit}
              className='hover:bg-primary/20'
            >
              <Edit className='w-3 h-3' />
            </Button>
            <Button variant='destructive' size='icon-sm' onClick={handleDelete}>
              <Trash2 className='w-3 h-3' />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='relative'>
        <pre className='text-sm text-foreground/90 whitespace-pre-wrap font-sans line-clamp-6 mb-3'>
          {note.content}
        </pre>
        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <Clock className='w-3 h-3' />
          {note.updatedAt}
        </div>
      </CardContent>
    </Card>
  );
}
