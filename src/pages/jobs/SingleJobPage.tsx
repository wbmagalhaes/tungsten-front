import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ServerCog,
  FlaskConical,
  Terminal,
  Clock,
  StopCircle,
  RotateCcw,
  Loader2,
  Dot,
} from 'lucide-react';
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
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import ProtectedComponent from '@components/ProtectedComponent';

import { useGetJob } from '@hooks/jobs/use-get-job';
import { useCancelJob } from '@hooks/jobs/use-cancel-job';
import { useRetryJob } from '@hooks/jobs/use-retry-job';
import type { JobKind, JobStatus } from '@services/jobs.service';

function formatTimestamp(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const TYPE_CONFIG: Record<
  JobKind,
  { icon: React.ReactNode; label: string; color: string }
> = {
  sandbox: {
    icon: <FlaskConical className='w-5 h-5' />,
    label: 'Sandbox',
    color: 'text-purple-400',
  },
};

const STATUS_BADGE: Record<JobStatus, React.ReactNode> = {
  queued: (
    <Badge variant='secondary'>
      <Clock className='w-3 h-3' />
      Queued
    </Badge>
  ),
  running: (
    <Badge variant='warning'>
      <Loader2 className='w-3 h-3 animate-spin' />
      Running
    </Badge>
  ),
  done: <Badge variant='success'>Done</Badge>,
  failed: <Badge variant='destructive'>Failed</Badge>,
  cancelled: <Badge variant='outline'>Cancelled</Badge>,
};

export default function SingleJobPage() {
  const { id = '' } = useParams();
  const { data: job, isLoading, error } = useGetJob(id);
  const cancelJob = useCancelJob();
  const retryJob = useRetryJob();

  if (isLoading) return <LoadingState message='Loading job…' />;
  if (error || !job) {
    return (
      <ErrorState
        title='Job not found'
        message={error?.message || 'Unable to load this job'}
      />
    );
  }

  const typeCfg = TYPE_CONFIG[job.kind] ?? {
    icon: <ServerCog className='w-5 h-5' />,
    label: job.kind,
    color: 'text-muted-foreground',
  };

  const isActive = job.status === 'queued' || job.status === 'running';
  const canRetry = job.status === 'failed' || job.status === 'cancelled';

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <ButtonLink
        to='/background-jobs'
        variant='link'
        className='p-0'
        size='sm'
      >
        <ArrowLeft className='w-4 h-4' />
        Back to jobs
      </ButtonLink>

      <Card>
        <CardHeader className='gap-3'>
          <CardIcon className={typeCfg.color}>{typeCfg.icon}</CardIcon>
          <div className='flex flex-col items-start gap-1'>
            <div className='flex items-center gap-2 flex-wrap'>
              <Badge variant='outline' className='text-xs'>
                {typeCfg.label}
              </Badge>
              {STATUS_BADGE[job.status]}
            </div>
            <span className='text-xs text-muted-foreground font-mono'>
              {job.id}
            </span>
          </div>
        </CardHeader>
      </Card>

      {job.kind === 'sandbox' && (
        <Card>
          <CardHeader>
            <CardIcon>
              <FlaskConical className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Script</CardTitle>
            <span className='ml-auto text-xs text-muted-foreground font-mono'>
              {job.payload.language}
            </span>
          </CardHeader>
          <CardContent>
            <pre className='text-sm font-mono whitespace-pre-wrap bg-muted/30 rounded-sm border border-border p-4 overflow-x-auto max-h-96'>
              {job.payload.code}
            </pre>
          </CardContent>
          {(isActive || canRetry) && (
            <CardFooter className='gap-2'>
              {isActive && (
                <ProtectedComponent requireScope='jobs:Cancel'>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => cancelJob.mutate(job.id)}
                    disabled={cancelJob.isPending}
                  >
                    {cancelJob.isPending ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <StopCircle className='w-4 h-4' />
                    )}
                    Cancel
                  </Button>
                </ProtectedComponent>
              )}
              {canRetry && (
                <ProtectedComponent requireScope='sandbox:Run'>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => retryJob.mutate(job.id)}
                    disabled={retryJob.isPending}
                  >
                    {retryJob.isPending ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <RotateCcw className='w-4 h-4' />
                    )}
                    Retry
                  </Button>
                </ProtectedComponent>
              )}
            </CardFooter>
          )}
        </Card>
      )}

      {job.result?.stdout && (
        <Card>
          <CardHeader>
            <CardIcon className='bg-success/10 text-success'>
              <Terminal className='w-5 h-5' />
            </CardIcon>
            <CardTitle>stdout</CardTitle>
            {job.result && (
              <span className='ml-auto text-xs text-muted-foreground font-mono'>
                exit {job.result.exit_code}
                {job.result.duration_ms != null && (
                  <>
                    {' '}
                    <Dot className='inline' />
                    {job.result.duration_ms < 1000
                      ? `${job.result.duration_ms}ms`
                      : `${(job.result.duration_ms / 1000).toFixed(2)}s`}
                  </>
                )}
              </span>
            )}
          </CardHeader>
          <CardContent>
            <pre className='text-sm font-mono whitespace-pre-wrap bg-success/5 rounded-sm border border-success/20 p-4 overflow-x-auto max-h-96'>
              {job.result.stdout}
            </pre>
          </CardContent>
        </Card>
      )}

      {job.result?.stderr && (
        <Card>
          <CardHeader>
            <CardIcon className='bg-warning/10 text-warning'>
              <Terminal className='w-5 h-5' />
            </CardIcon>
            <CardTitle>stderr</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className='text-sm font-mono whitespace-pre-wrap bg-warning/5 rounded-sm border border-warning/20 p-4 overflow-x-auto max-h-64'>
              {job.result.stderr}
            </pre>
          </CardContent>
        </Card>
      )}

      {job.error && (
        <Card>
          <CardHeader>
            <CardIcon className='bg-destructive/10 text-destructive'>
              <ServerCog className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className='text-sm font-mono whitespace-pre-wrap text-destructive bg-destructive/5 rounded-sm border border-destructive/20 p-4'>
              {job.error}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardIcon>
            <Clock className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Created</span>
            <span className='text-foreground font-mono text-xs'>
              {formatTimestamp(job.created_at)}
            </span>
          </div>
          {job.started_at && (
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Started</span>
              <span className='text-foreground font-mono text-xs'>
                {formatTimestamp(job.started_at)}
              </span>
            </div>
          )}
          {job.finished_at && (
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Finished</span>
              <span className='text-foreground font-mono text-xs'>
                {formatTimestamp(job.finished_at)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
