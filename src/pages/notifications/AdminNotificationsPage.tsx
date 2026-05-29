import {
  AlertTriangle,
  RotateCcw,
  Ban,
  Loader2,
  Trash2,
  Send,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import PageHeader from '@components/PageHeader';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import {
  useFailedNotifications,
  useRetryNotification,
  useCancelNotification,
  useCleanupReport,
  useRunCleanup,
} from '@hooks/notifications/use-admin';

export default function AdminNotificationsPage() {
  const { data, isLoading, isError, refetch } = useFailedNotifications();
  const retry = useRetryNotification();
  const cancel = useCancelNotification();
  const { data: cleanup } = useCleanupReport();
  const runCleanup = useRunCleanup();

  if (isLoading) return <LoadingState message='Loading failed notifications…' />;
  if (isError)
    return (
      <ErrorState
        title='Failed to load'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  const items = data?.results ?? [];

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Notifications Admin'
        icon={<AlertTriangle className='w-5 h-5' />}
      />

      <Card>
        <CardHeader>
          <CardIcon>
            <Trash2 className='w-5 h-5' />
          </CardIcon>
          <div>
            <CardTitle>Cleanup</CardTitle>
            <CardDescription>
              Purge old notifications according to retention policy.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='text-sm space-y-1'>
          {cleanup ? (
            <>
              <div className='flex justify-between'>
                <span className='text-muted-fg'>Eligible</span>
                <span className='font-mono'>
                  {cleanup.deleted_count.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-fg'>Cutoff</span>
                <span className='font-mono text-xs'>
                  {new Date(cleanup.cutoff).toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <p className='text-muted-fg'>No report yet.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant='destructive'
            onClick={() => runCleanup.mutate()}
            disabled={runCleanup.isPending}
          >
            {runCleanup.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Trash2 className='w-4 h-4' />
            )}
            Run cleanup
          </Button>
        </CardFooter>
      </Card>

      <h2 className='text-sm font-semibold flex items-center gap-2'>
        <AlertTriangle className='w-4 h-4 text-destructive' />
        Failed ({items.length})
      </h2>

      {items.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <Send className='w-16 h-16 text-muted-fg mx-auto mb-4' />
            <p className='text-muted-fg'>No failed notifications.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {items.map((n) => (
            <Card key={n.id}>
              <CardHeader>
                <CardIcon className='bg-destructive/10 text-destructive'>
                  <AlertTriangle className='w-5 h-5' />
                </CardIcon>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='flex items-center gap-2 flex-wrap'>
                    <span className='truncate'>{n.subject}</span>
                    <Badge variant='destructive'>failed</Badge>
                  </CardTitle>
                  <div className='flex gap-3 mt-1 text-xs text-muted-fg font-mono'>
                    <span>topic {n.topic_id.slice(0, 8)}</span>
                    <span>recipient {n.recipient_id.slice(0, 8)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm whitespace-pre-wrap line-clamp-3'>
                  {n.body}
                </p>
              </CardContent>
              <CardFooter className='gap-2'>
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => retry.mutate(n.id)}
                  disabled={retry.isPending}
                >
                  <RotateCcw className='w-4 h-4' />
                  Retry
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => cancel.mutate(n.id)}
                  disabled={cancel.isPending}
                >
                  <Ban className='w-4 h-4' />
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
