import { useState } from 'react';
import { Container, Plus, Loader2, Trash2, HardDrive } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@components/base/card';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/base/select';
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

import { useListBuckets } from '@hooks/buckets/use-list-buckets';
import { useCreateBucket } from '@hooks/buckets/use-create-bucket';
import { useDeleteBucket } from '@hooks/buckets/use-delete-bucket';
import { EventRouteSelector } from '@components/EventRouteSelector';
import {
  BUCKET_VISIBILITY_LABELS,
  type BucketVisibility,
} from '@services/buckets.service';

function CreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const create = useCreateBucket();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultVisibility, setDefaultVisibility] =
    useState<BucketVisibility>(0);
  const [archiveAfter, setArchiveAfter] = useState('');
  const [deleteAfter, setDeleteAfter] = useState('');
  const [eventTopics, setEventTopics] = useState<string[]>([]);
  const [eventQueues, setEventQueues] = useState<string[]>([]);

  const reset = () => {
    setName('');
    setDescription('');
    setDefaultVisibility(0);
    setArchiveAfter('');
    setDeleteAfter('');
    setEventTopics([]);
    setEventQueues([]);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const parseDays = (v: string) => {
      if (!v) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };
    create.mutate(
      {
        name,
        description: description || undefined,
        default_visibility: defaultVisibility,
        archive_after_days: parseDays(archiveAfter),
        delete_after_days: parseDays(deleteAfter),
        event_topics: eventTopics,
        event_queues: eventQueues,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>New Bucket</DialogTitle>
          <DialogDescription>
            A bucket groups files with shared grants.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <TextField
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>
            <label className='text-sm font-medium block mb-1'>
              Default visibility
            </label>
            <Select
              value={String(defaultVisibility)}
              onValueChange={(v) =>
                v && setDefaultVisibility(Number(v) as BucketVisibility)
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>0 — private</SelectItem>
                <SelectItem value='1'>1 — public</SelectItem>
                <SelectItem value='2'>2 — unlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TextField
            label='Archive after days (empty = never)'
            type='number'
            value={archiveAfter}
            onChange={(e) => setArchiveAfter(e.target.value)}
          />
          <TextField
            label='Delete after days (empty = never)'
            type='number'
            value={deleteAfter}
            onChange={(e) => setDeleteAfter(e.target.value)}
          />
          <EventRouteSelector
            topics={eventTopics}
            queues={eventQueues}
            onTopicsChange={setEventTopics}
            onQueuesChange={setEventQueues}
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

export default function MediaPage() {
  const { data, isLoading, isError, refetch } = useListBuckets({
    page_size: 50,
  });
  const deleteBucket = useDeleteBucket();
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (isLoading) return <LoadingState message='Loading buckets…' />;
  if (isError)
    return (
      <ErrorState
        title='Failed to load buckets'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  const buckets = data?.results ?? [];

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Media'
        icon={<HardDrive className='w-5 h-5' />}
        action={
          <ProtectedComponent requireScope='wss:bucket:Create'>
            <Button onClick={() => setCreateOpen(true)} size='icon'>
              <Plus className='w-4 h-4' />
            </Button>
          </ProtectedComponent>
        }
      />

      {buckets.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <Container className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>No buckets yet.</p>
          </CardContent>
        </Card>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {buckets.map((b) => (
          <Card key={b.id} className='hover:shadow-xl transition-shadow'>
            <CardHeader>
              <CardIcon>
                <Container className='w-5 h-5' />
              </CardIcon>
              <div className='flex-1 min-w-0'>
                <CardTitle className='truncate'>{b.name}</CardTitle>
                {b.description && (
                  <CardDescription className='truncate'>
                    {b.description}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent className='flex gap-2 flex-wrap'>
              <Badge variant='outline' className='text-xs'>
                default visibility: {BUCKET_VISIBILITY_LABELS[b.default_visibility]}
              </Badge>
              {b.archive_after_days != null && (
                <Badge variant='outline' className='text-xs'>
                  archive {b.archive_after_days}d
                </Badge>
              )}
              {b.delete_after_days != null && (
                <Badge variant='outline' className='text-xs'>
                  delete {b.delete_after_days}d
                </Badge>
              )}
            </CardContent>
            <CardFooter className='gap-2'>
              <ButtonLink
                to={`/media/${b.id}`}
                variant='secondary'
                size='sm'
                className='mr-auto'
              >
                Open
              </ButtonLink>
              <ProtectedComponent requireScope='wss:bucket:Delete'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive'
                  onClick={() => setConfirmDelete(b.id)}
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
        title='Delete Bucket'
        description='Files inside may become unreachable. This cannot be undone.'
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={() =>
          confirmDelete &&
          deleteBucket.mutate(confirmDelete, {
            onSuccess: () => setConfirmDelete(null),
          })
        }
        isLoading={deleteBucket.isPending}
        loadingText='Deleting...'
      />
    </div>
  );
}
