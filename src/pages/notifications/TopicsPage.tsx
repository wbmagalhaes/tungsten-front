import { useState } from 'react';
import { Megaphone, Plus, Loader2, Trash2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
} from '@components/base/card';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import PageHeader from '@components/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/base/dialog';
import ProtectedComponent from '@components/ProtectedComponent';
import {
  useTopics,
  useCreateTopic,
  useDeleteTopic,
} from '@hooks/notifications/use-topics';
import { isSystemTopic } from '@services/notifications.service';
import { useAuthStore } from '@stores/useAuthStore';

export default function TopicsPage() {
  return (
    <div className='space-y-4'>
      <PageHeader title='Topics' icon={<Megaphone className='w-5 h-5' />} />
      <TopicsSection />
    </div>
  );
}

export function TopicsSection() {
  const { isSudo } = useAuthStore();
  const { data, isLoading } = useTopics();
  const create = useCreateTopic();
  const del = useDeleteTopic();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const topics = data?.results ?? [];

  const nameError = name.trim().toLowerCase().startsWith('system:')
    ? 'Names starting with "system:" are reserved.'
    : null;

  const handleCreate = () => {
    if (!name.trim() || nameError) return;
    create.mutate(
      { name, description },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          setOpen(false);
        },
      },
    );
  };

  return (
    <div className='space-y-4'>
      <ProtectedComponent requireScope='was:topic:Create'>
        <div className='flex justify-end'>
          <Button onClick={() => setOpen(true)} size='sm'>
            <Plus className='w-4 h-4' />
            New Topic
          </Button>
        </div>
      </ProtectedComponent>

      {isLoading && <p className='text-sm text-muted-foreground'>Loading…</p>}

      <div className='space-y-3'>
        {topics.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardIcon>
                <Megaphone className='w-5 h-5' />
              </CardIcon>
              <div className='flex-1 min-w-0'>
                <CardTitle className='flex items-center gap-2'>
                  {t.name}
                  {isSystemTopic(t) && (
                    <Badge variant='secondary'>system</Badge>
                  )}
                  {t.discoverable && (
                    <Badge variant='outline'>discoverable</Badge>
                  )}
                </CardTitle>
                {t.description && (
                  <CardContent className='p-0 mt-1 text-sm text-muted-foreground'>
                    {t.description}
                  </CardContent>
                )}
              </div>
            </CardHeader>
            <CardFooter className='gap-2'>
              <ButtonLink
                to={`/topics/${t.id}`}
                variant='secondary'
                size='sm'
                className='mr-auto'
              >
                Open
              </ButtonLink>
              {(!isSystemTopic(t) || isSudo) && (
                <ProtectedComponent requireScope='was:topic:Delete'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-destructive'
                    onClick={() => del.mutate(t.id)}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </ProtectedComponent>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Topic</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <TextField
              label='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError ?? undefined}
              required
            />
            <TextField
              label='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!name.trim() || !!nameError || create.isPending}
            >
              {create.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Plus className='w-4 h-4' />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
