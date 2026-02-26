import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  FlaskConical,
  Code,
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
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import ProtectedComponent from '@components/ProtectedComponent';

import { useGetJob } from '@hooks/jobs/use-get-job';
import { useCancelJob } from '@hooks/jobs/use-cancel-job';
import { useRetryJob } from '@hooks/jobs/use-retry-job';
import type { SandboxResult } from '@services/jobs.service';
import { STATUS_CONFIG } from './mappings';

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

export default function SingleRunnerPage() {
  const { id = '' } = useParams();
  const { data: job, isLoading, error } = useGetJob(id);
  const cancelJob = useCancelJob();
  const retryJob = useRetryJob();

  if (isLoading) return <LoadingState message='Loading run…' />;
  if (error || !job) {
    return (
      <ErrorState
        title='Run not found'
        message={error?.message || 'Unable to load this sandbox run'}
      />
    );
  }

  const cfg = STATUS_CONFIG[job.status];
  const result = job.result as SandboxResult | null;

  const isActive = job.status === 'queued' || job.status === 'running';
  const canRetry = job.status === 'failed' || job.status === 'cancelled';

  return (
    <div className='space-y-4 max-w-4xl mx-auto'>
      <ButtonLink to='/sandbox' variant='link' className='p-0' size='sm'>
        <ArrowLeft className='w-4 h-4' />
        Back to sandbox
      </ButtonLink>

      <Card>
        <CardHeader className='gap-3'>
          <CardIcon>{cfg.icon}</CardIcon>
          <div className='flex flex-col items-start gap-1'>
            <div className='flex items-center gap-2'>
              <span className='font-mono text-sm text-foreground'>
                {job.payload.code.split('\n')[0].slice(0, 64) || 'Empty script'}
              </span>
              {cfg.badge}
            </div>
            <span className='text-xs text-muted-foreground'>
              {job.payload.language} • {formatTimestamp(job.created_at)}
            </span>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardIcon>
            <Code className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Script</CardTitle>
          <span className='ml-auto text-xs text-muted-foreground font-mono'>
            {job.payload.language}
          </span>
        </CardHeader>
        <CardContent>
          <pre className='text-sm font-mono whitespace-pre-wrap bg-muted/30 rounded-sm border border-border p-4 overflow-x-auto'>
            {job.payload.code}
          </pre>
        </CardContent>
        {isActive && (
          <CardFooter>
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
                Cancel Run
              </Button>
            </ProtectedComponent>
          </CardFooter>
        )}
        {canRetry && (
          <CardFooter>
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
          </CardFooter>
        )}
      </Card>

      {job.payload.stdin && (
        <Card>
          <CardHeader>
            <CardIcon>
              <Terminal className='w-5 h-5' />
            </CardIcon>
            <CardTitle>stdin</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className='text-sm font-mono whitespace-pre-wrap bg-muted/30 rounded-sm border border-border p-4'>
              {job.payload.stdin}
            </pre>
          </CardContent>
        </Card>
      )}

      {result?.stdout && (
        <Card>
          <CardHeader>
            <CardIcon className='bg-success/10 text-success'>
              <Terminal className='w-5 h-5' />
            </CardIcon>
            <CardTitle>stdout</CardTitle>
            {result && (
              <span className='ml-auto text-xs text-muted-foreground font-mono'>
                exit {result.exit_code} <Dot className='inline' />
                {result.duration_ms < 1000
                  ? `${result.duration_ms}ms`
                  : `${(result.duration_ms / 1000).toFixed(2)}s`}
              </span>
            )}
          </CardHeader>
          <CardContent>
            <pre className='text-sm font-mono whitespace-pre-wrap bg-success/5 rounded-sm border border-success/20 p-4 overflow-x-auto max-h-96'>
              {result.stdout}
            </pre>
          </CardContent>
        </Card>
      )}

      {result?.stderr && (
        <Card>
          <CardHeader>
            <CardIcon className='bg-warning/10 text-warning'>
              <Terminal className='w-5 h-5' />
            </CardIcon>
            <CardTitle>stderr</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className='text-sm font-mono whitespace-pre-wrap bg-warning/5 rounded-sm border border-warning/20 p-4 overflow-x-auto max-h-64'>
              {result.stderr}
            </pre>
          </CardContent>
        </Card>
      )}

      {job.error && (
        <Card>
          <CardHeader>
            <CardIcon className='bg-destructive/10 text-destructive'>
              <FlaskConical className='w-5 h-5' />
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
