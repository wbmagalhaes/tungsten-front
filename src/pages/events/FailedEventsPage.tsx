import { AlertTriangle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Badge } from '@components/base/badge';
import PageHeader from '@components/PageHeader';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { useFailedEvents } from '@hooks/events/use-failed-events';

export default function FailedEventsPage() {
  const { data, isLoading, isError, refetch } = useFailedEvents();

  if (isLoading) return <LoadingState message='Loading failed events…' />;
  if (isError)
    return (
      <ErrorState
        title='Failed to load events'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  const events = data?.results ?? [];

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Failed Events'
        icon={<AlertTriangle className='w-5 h-5' />}
      />

      {events.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <AlertTriangle className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>No failed events.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {events.map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <CardIcon className='bg-destructive/10 text-destructive'>
                  <AlertTriangle className='w-5 h-5' />
                </CardIcon>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='flex items-center gap-2 flex-wrap'>
                    <span className='font-mono text-sm'>{e.event_type}</span>
                    <Badge variant='destructive'>
                      {e.attempts} attempts
                    </Badge>
                  </CardTitle>
                  <span className='text-xs text-muted-foreground'>
                    Failed {new Date(e.failed_at).toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className='space-y-2'>
                <pre className='text-xs font-mono whitespace-pre-wrap text-destructive bg-destructive/5 border border-destructive/20 p-2 rounded-sm'>
                  {e.error}
                </pre>
                <pre className='text-xs font-mono whitespace-pre-wrap bg-muted/30 border border-border p-2 rounded-sm max-h-32 overflow-auto'>
                  {JSON.stringify(e.payload, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
