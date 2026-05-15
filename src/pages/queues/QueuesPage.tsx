import { useState } from 'react';
import { Layers, Plus, Loader2, Trash2 } from 'lucide-react';
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
  DialogDescription,
} from '@components/base/dialog';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import ProtectedComponent from '@components/ProtectedComponent';

import { useListQueues } from '@hooks/queues/use-list-queues';
import { useCreateQueue } from '@hooks/queues/use-create-queue';
import { useDeleteQueue } from '@hooks/queues/use-delete-queue';

function CreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const create = useCreateQueue();
  const [name, setName] = useState('');
  const [visibilityTimeout, setVisibilityTimeout] = useState(30);

  const handleSubmit = () => {
    if (!name.trim()) return;
    create.mutate(
      { name, visibility_timeout: visibilityTimeout },
      {
        onSuccess: () => {
          setName('');
          setVisibilityTimeout(30);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Queue</DialogTitle>
          <DialogDescription>Create an SQS-like queue.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <TextField
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label='Visibility timeout (seconds)'
            type='number'
            value={visibilityTimeout}
            onChange={(e) => setVisibilityTimeout(Number(e.target.value) || 30)}
          />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || create.isPending}
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
  );
}

export default function QueuesPage() {
  const { data, isLoading, isError, refetch } = useListQueues({ page_size: 50 });
  const deleteQueue = useDeleteQueue();
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (isLoading) return <LoadingState message='Loading queues…' />;
  if (isError)
    return (
      <ErrorState
        title='Failed to load queues'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  const queues = data?.results ?? [];

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Queues'
        icon={<Layers className='w-5 h-5' />}
        action={
          <ProtectedComponent requireScope='wqs:queue:Create'>
            <Button onClick={() => setCreateOpen(true)} size='icon'>
              <Plus className='w-4 h-4' />
            </Button>
          </ProtectedComponent>
        }
      />

      {queues.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <Layers className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>No queues yet.</p>
          </CardContent>
        </Card>
      )}

      <div className='space-y-3'>
        {queues.map((q) => (
          <Card key={q.id}>
            <CardHeader>
              <CardIcon>
                <Layers className='w-5 h-5' />
              </CardIcon>
              <div className='flex-1 min-w-0'>
                <CardTitle className='truncate'>{q.name}</CardTitle>
                <div className='flex gap-2 mt-1 flex-wrap text-xs'>
                  <Badge variant='outline'>
                    vt {q.visibility_timeout}s
                  </Badge>
                  <Badge variant='outline'>
                    max-recv {q.max_receive_count}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardFooter className='gap-2'>
              <ButtonLink
                to={`/queues/${q.id}`}
                variant='secondary'
                size='sm'
                className='mr-auto'
              >
                Open
              </ButtonLink>
              <ProtectedComponent requireScope='wqs:queue:Delete'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive'
                  onClick={() => setConfirmDelete(q.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </ProtectedComponent>
            </CardFooter>
          </Card>
        ))}
      </div>

      <CreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmationDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title='Delete Queue'
        description='All messages will be lost.'
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={() =>
          confirmDelete &&
          deleteQueue.mutate(confirmDelete, {
            onSuccess: () => setConfirmDelete(null),
          })
        }
        isLoading={deleteQueue.isPending}
        loadingText='Deleting...'
      />
    </div>
  );
}
