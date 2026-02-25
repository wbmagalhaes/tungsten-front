import { useState } from 'react';
import {
  ServerCog,
  Loader2,
  CheckCircle,
  XCircle,
  StopCircle,
  FlaskConical,
  Clock,
  RotateCcw,
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
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import PageHeader from '@components/PageHeader';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import ProtectedComponent from '@components/ProtectedComponent';

import { useListJobs } from '@hooks/jobs/use-list-jobs';
import { useCancelJob } from '@hooks/jobs/use-cancel-job';
import { useRetryJob } from '@hooks/jobs/use-retry-job';
import type { Job, JobKind, JobStatus } from '@services/jobs.service';

function formatTimestamp(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

const STATUS_CONFIG: Record<JobStatus, { badge: React.ReactNode }> = {
  queued: {
    badge: (
      <Badge variant='secondary'>
        <Clock className='w-3 h-3' />
        Queued
      </Badge>
    ),
  },
  running: {
    badge: (
      <Badge variant='warning'>
        <Loader2 className='w-3 h-3 animate-spin' />
        Running
      </Badge>
    ),
  },
  done: {
    badge: (
      <Badge variant='success'>
        <CheckCircle className='w-3 h-3' />
        Done
      </Badge>
    ),
  },
  failed: {
    badge: (
      <Badge variant='destructive'>
        <XCircle className='w-3 h-3' />
        Failed
      </Badge>
    ),
  },
  cancelled: {
    badge: <Badge variant='outline'>Cancelled</Badge>,
  },
};

function JobCard({ job }: { job: Job }) {
  const cancelJob = useCancelJob();
  const retryJob = useRetryJob();

  const typeCfg = TYPE_CONFIG[job.kind] ?? {
    icon: <ServerCog className='w-5 h-5' />,
    label: job.kind,
    color: 'text-muted-foreground',
  };
  const statusCfg = STATUS_CONFIG[job.status];

  const isActive = job.status === 'queued' || job.status === 'running';
  const canRetry = job.status === 'failed' || job.status === 'cancelled';

  const summary = (() => {
    if (job.kind === 'sandbox') {
      const firstLine = job.payload.code?.split('\n')[0]?.slice(0, 72) ?? '';
      return firstLine || 'Python script';
    }
    return null;
  })();

  return (
    <Card className='hover:border-primary/30 transition-all'>
      <CardHeader>
        <CardIcon className={typeCfg.color}>{typeCfg.icon}</CardIcon>
        <div className='flex-1 min-w-0'>
          <CardTitle className='mb-1 font-mono text-sm truncate'>
            {summary ?? job.id.slice(0, 8)}
          </CardTitle>
          <Badge variant='outline' className='text-xs'>
            {typeCfg.label}
          </Badge>
        </div>
        {statusCfg.badge}
      </CardHeader>

      <CardContent className='space-y-3'>
        {job.kind === 'sandbox' && job.result?.stderr && (
          <div className='p-3 bg-warning/5 rounded-sm border border-warning/20'>
            <div className='text-xs font-medium text-warning mb-1'>stderr</div>
            <pre className='text-xs font-mono whitespace-pre-wrap line-clamp-3'>
              {job.result.stderr}
            </pre>
          </div>
        )}

        {job.error && (
          <div className='p-3 bg-destructive/5 rounded-sm border border-destructive/20'>
            <div className='text-xs font-medium text-destructive mb-1'>
              Error
            </div>
            <pre className='text-xs text-destructive font-mono whitespace-pre-wrap line-clamp-3'>
              {job.error}
            </pre>
          </div>
        )}

        {job.kind === 'sandbox' && job.result && (
          <p className='text-xs text-muted-foreground font-mono'>
            exit {job.result.exit_code}
            <Dot />
            {job.result.duration_ms < 1000
              ? `${job.result.duration_ms}ms`
              : `${(job.result.duration_ms / 1000).toFixed(2)}s`}
          </p>
        )}

        <div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <Clock className='w-3 h-3' />
            {formatTimestamp(job.created_at)}
          </span>
          {job.started_at && (
            <span className='flex items-center'>
              <Dot />
              Started {formatTimestamp(job.started_at)}
            </span>
          )}
          {job.finished_at && (
            <span className='flex items-center'>
              <Dot /> Finished {formatTimestamp(job.finished_at)}
            </span>
          )}
        </div>
      </CardContent>

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
    </Card>
  );
}

export default function BackgroundJobsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useListJobs({
    page,
    page_size: 50,
  });

  const jobs = data?.results ?? [];
  const total = data?.count ?? 0;

  const activeJobs = jobs.filter(
    (j) => j.status === 'queued' || j.status === 'running',
  );
  const finishedJobs = jobs.filter(
    (j) =>
      j.status === 'done' || j.status === 'failed' || j.status === 'cancelled',
  );

  if (isLoading) return <LoadingState message='Loading jobs…' />;
  if (isError)
    return (
      <ErrorState
        title='Failed to load jobs'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Background Jobs'
        icon={<ServerCog className='w-5 h-5' />}
      />

      {jobs.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <ServerCog className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>No background jobs yet.</p>
          </CardContent>
        </Card>
      )}

      {activeJobs.length > 0 && (
        <section className='space-y-3'>
          <h2 className='text-sm font-semibold text-foreground flex items-center gap-2'>
            <Loader2 className='w-4 h-4 text-primary animate-spin' />
            Active ({activeJobs.length})
          </h2>
          <div className='space-y-3'>
            {activeJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {finishedJobs.length > 0 && (
        <section className='space-y-3'>
          <h2 className='text-sm font-semibold text-foreground flex items-center gap-2'>
            <CheckCircle className='w-4 h-4 text-success' />
            Finished ({finishedJobs.length})
          </h2>
          <div className='space-y-3'>
            {finishedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {total > 50 && (
        <div className='flex justify-center gap-2 pt-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className='text-sm text-muted-foreground self-center'>
            Page {page}
          </span>
          <Button
            variant='outline'
            size='sm'
            disabled={page * 50 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
