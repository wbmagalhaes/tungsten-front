import { useState } from 'react';
import { ShieldAlert, Plus, Loader2 } from 'lucide-react';
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
  DialogDescription,
  DialogFooter,
} from '@components/base/dialog';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import {
  useSystemTopics,
  useCreateSystemTopic,
} from '@hooks/notifications/use-system-topics';

export default function SystemTopicsPage() {
  const { data, isLoading, isError, refetch } = useSystemTopics();
  const create = useCreateSystemTopic();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const topics = data?.results ?? [];

  const trimmedName = name.trim();
  const nameError =
    trimmedName && !trimmedName.toLowerCase().startsWith('system:')
      ? 'System topic names must start with "system:".'
      : null;

  const handleCreate = () => {
    if (!trimmedName || nameError) return;
    create.mutate(
      { name: trimmedName, description: description || undefined },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          setOpen(false);
        },
      },
    );
  };

  if (isLoading) return <LoadingState message='Loading system topics…' />;
  if (isError)
    return (
      <ErrorState
        title='Failed to load'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  return (
    <div className='space-y-4'>
      <PageHeader
        title='System Topics'
        icon={<ShieldAlert className='w-5 h-5' />}
        action={
          <Button size='icon' onClick={() => setOpen(true)}>
            <Plus className='w-4 h-4' />
          </Button>
        }
      />

      {topics.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <ShieldAlert className='w-16 h-16 text-muted-fg mx-auto mb-4' />
            <p className='text-muted-fg'>No system topics yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {topics.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardIcon>
                  <ShieldAlert className='w-5 h-5' />
                </CardIcon>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='flex items-center gap-2 flex-wrap'>
                    {t.name}
                    <Badge variant='secondary'>system</Badge>
                    {t.discoverable && (
                      <Badge variant='outline'>discoverable</Badge>
                    )}
                  </CardTitle>
                  {t.description && (
                    <p className='text-sm text-muted-fg mt-1'>
                      {t.description}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardFooter>
                <ButtonLink
                  to={`/topics/${t.id}`}
                  variant='secondary'
                  size='sm'
                  className='mr-auto'
                >
                  Open
                </ButtonLink>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New System Topic</DialogTitle>
            <DialogDescription>
              System topics are managed by the platform and survive normal
              cleanup.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <TextField
              label='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError ?? undefined}
              description='Must start with "system:"'
              placeholder='system:my-topic'
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
              disabled={!trimmedName || !!nameError || create.isPending}
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
