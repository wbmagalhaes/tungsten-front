import { AlertTriangle, RotateCcw } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import PageHeader from '@components/PageHeader';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { useFailedExecutions } from '@hooks/jobs/use-failed-executions';
import { useRetryExecution } from '@hooks/jobs/use-retry-execution';
import { formatTimestamp, formatDuration } from './mappings';

export default function FailedExecutionsPage() {
  const { data, isLoading, isError, refetch } = useFailedExecutions();
  const retry = useRetryExecution();

  if (isLoading) return <LoadingState message='Loading failed executions…' />;
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
        title='Failed Executions'
        icon={<AlertTriangle className='w-5 h-5' />}
      />

      {items.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <AlertTriangle className='w-16 h-16 text-muted-fg mx-auto mb-4' />
            <p className='text-muted-fg'>No failed executions.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {items.map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <CardIcon className='bg-destructive/10 text-destructive'>
                  <AlertTriangle className='w-5 h-5' />
                </CardIcon>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='flex items-center gap-2 flex-wrap'>
                    <span className='font-mono text-sm truncate'>
                      {e.id.slice(0, 8)}
                    </span>
                    <Badge variant='destructive'>failed</Badge>
                    {e.exit_code != null && (
                      <Badge variant='outline' className='font-mono'>
                        exit {e.exit_code}
                      </Badge>
                    )}
                  </CardTitle>
                  <div className='flex gap-3 mt-1 text-xs text-muted-fg'>
                    <span className='font-mono'>
                      job {e.job_id.slice(0, 8)}
                    </span>
                    <span>started {formatTimestamp(e.started_at)}</span>
                    {e.duration_ms != null && (
                      <span>· {formatDuration(e.duration_ms)}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-2'>
                {e.error && (
                  <pre className='text-xs font-mono whitespace-pre-wrap text-destructive bg-destructive/5 border border-destructive/20 p-2 rounded-sm'>
                    {e.error}
                  </pre>
                )}
                {e.stderr && (
                  <pre className='text-xs font-mono whitespace-pre-wrap bg-warning/5 border border-warning/20 p-2 rounded-sm max-h-32 overflow-auto'>
                    {e.stderr}
                  </pre>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => retry.mutate(e.id)}
                  disabled={retry.isPending}
                >
                  <RotateCcw className='w-4 h-4' />
                  Retry
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
