import { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Play,
  StopCircle,
  RotateCcw,
  Code,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  FilePlusCorner,
  Terminal,
  ChevronDown,
  ChevronUp,
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
import { Textarea } from '@components/base/text-area';
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
import ProtectedComponent from '@components/ProtectedComponent';

import { useListJobs } from '@hooks/jobs/use-list-jobs';
import { useRunSandbox } from '@hooks/jobs/use-run-sandbox';
import { useCancelJob } from '@hooks/jobs/use-cancel-job';
import { useRetryJob } from '@hooks/jobs/use-retry-job';
import type { Job, SandboxResult } from '@services/jobs.service';

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

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

const STATUS_CONFIG = {
  queued: {
    badge: (
      <Badge variant='secondary'>
        <Clock className='w-3 h-3' />
        Queued
      </Badge>
    ),
    icon: <Clock className='w-5 h-5 text-muted-foreground' />,
  },
  running: {
    badge: (
      <Badge variant='warning'>
        <Loader2 className='w-3 h-3 animate-spin' />
        Running
      </Badge>
    ),
    icon: <Loader2 className='w-5 h-5 text-warning animate-spin' />,
  },
  done: {
    badge: (
      <Badge variant='success'>
        <CheckCircle className='w-3 h-3' />
        Done
      </Badge>
    ),
    icon: <CheckCircle className='w-5 h-5 text-success' />,
  },
  failed: {
    badge: (
      <Badge variant='destructive'>
        <XCircle className='w-3 h-3' />
        Failed
      </Badge>
    ),
    icon: <XCircle className='w-5 h-5 text-destructive' />,
  },
  cancelled: {
    badge: <Badge variant='outline'>Cancelled</Badge>,
    icon: <StopCircle className='w-5 h-5 text-muted-foreground' />,
  },
} as const;

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function CreateDialog({ open, onOpenChange }: CreateDialogProps) {
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const runSandbox = useRunSandbox();

  const handleSubmit = () => {
    if (!code.trim()) return;
    runSandbox.mutate(
      { language: 'python', code, stdin: stdin || undefined },
      {
        onSuccess: () => {
          onOpenChange(false);
          setCode('');
          setStdin('');
          setShowStdin(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FlaskConical className='w-5 h-5 text-primary' />
            New Sandbox
          </DialogTitle>
          <DialogDescription>
            Write Python code to run in an isolated environment.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='text-sm text-muted-foreground mb-2 block'>
              Python Script
            </label>
            <Textarea
              placeholder={'print("Hello, world!")'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className='min-h-64 font-mono text-sm'
              autoFocus
            />
          </div>

          <div>
            <button
              type='button'
              onClick={() => setShowStdin((v) => !v)}
              className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <Terminal className='w-4 h-4' />
              stdin (optional)
              {showStdin ? (
                <ChevronUp className='w-3 h-3' />
              ) : (
                <ChevronDown className='w-3 h-3' />
              )}
            </button>
            {showStdin && (
              <Textarea
                placeholder='Input fed to the script via stdin…'
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                className='mt-2 min-h-20 font-mono text-sm'
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={runSandbox.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!code.trim() || runSandbox.isPending}
          >
            {runSandbox.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Play className='w-4 h-4' />
            )}
            Run
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SandboxCard({ job }: { job: Job }) {
  const cancelJob = useCancelJob();
  const retryJob = useRetryJob();

  const cfg = STATUS_CONFIG[job.status];
  const result = job.result as SandboxResult | null;

  return (
    <Card className='hover:border-primary/30 transition-all'>
      <CardHeader>
        <CardIcon>{cfg.icon}</CardIcon>
        <div className='flex-1 min-w-0'>
          <CardTitle className='font-mono text-sm truncate'>
            {job.payload.code.split('\n')[0].slice(0, 48) || 'Empty script'}
          </CardTitle>
        </div>
        {cfg.badge}
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className='p-3 bg-muted/30 rounded-sm border border-border'>
          <div className='flex items-center gap-2 mb-2'>
            <Code className='w-4 h-4 text-primary' />
            <span className='text-xs font-medium text-foreground'>Script</span>
            <span className='ml-auto text-xs text-muted-foreground font-mono'>
              {job.payload.language}
            </span>
          </div>
          <pre className='text-xs text-muted-foreground font-mono line-clamp-4 whitespace-pre-wrap'>
            {job.payload.code}
          </pre>
        </div>

        {result?.stdout && (
          <div className='p-3 bg-success/5 rounded-sm border border-success/20'>
            <div className='text-xs font-medium text-success mb-1'>stdout</div>
            <pre className='text-xs text-foreground font-mono whitespace-pre-wrap max-h-40 overflow-y-auto'>
              {result.stdout}
            </pre>
          </div>
        )}

        {result?.stderr && (
          <div className='p-3 bg-warning/5 rounded-sm border border-warning/20'>
            <div className='text-xs font-medium text-warning mb-1'>stderr</div>
            <pre className='text-xs text-foreground font-mono whitespace-pre-wrap max-h-32 overflow-y-auto'>
              {result.stderr}
            </pre>
          </div>
        )}

        {job.error && (
          <div className='p-3 bg-destructive/5 rounded-sm border border-destructive/20'>
            <div className='text-xs font-medium text-destructive mb-1'>
              Error
            </div>
            <pre className='text-xs text-destructive font-mono whitespace-pre-wrap'>
              {job.error}
            </pre>
          </div>
        )}

        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <Clock className='w-3 h-3' />
            {formatTimestamp(job.created_at)}
          </span>
          {result && (
            <span className='font-mono'>
              exit {result.exit_code} <Dot />
              {formatDuration(result.duration_ms)}
            </span>
          )}
          {job.payload.stdin && (
            <span className='flex items-center gap-1'>
              <Terminal className='w-3 h-3' />
              stdin
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className='gap-2'>
        {(job.status === 'queued' || job.status === 'running') && (
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

        {(job.status === 'failed' || job.status === 'cancelled') && (
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

export default function SandboxPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useListJobs({
    kind: 'sandbox',
    page,
    page_size: 24,
  });

  const jobs = data?.results ?? [];
  const total = data?.count ?? 0;

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Sandbox'
        icon={<FlaskConical className='w-5 h-5' />}
        action={
          <ProtectedComponent requireScope='sandbox:Run'>
            <Button onClick={() => setCreateOpen(true)} size='icon'>
              <FilePlusCorner className='w-4 h-4' />
            </Button>
          </ProtectedComponent>
        }
      />

      {isLoading && <LoadingState message='Loading jobs…' />}
      {isError && (
        <ErrorState
          title='Failed to load jobs'
          message='Could not reach the server.'
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && jobs.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <FlaskConical className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground mb-4'>
              No sandboxes yet. Run your first script!
            </p>
            <ProtectedComponent requireScope='sandbox:Run'>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className='w-4 h-4' />
                New Sandbox
              </Button>
            </ProtectedComponent>
          </CardContent>
        </Card>
      )}

      {jobs.length > 0 && (
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
          {jobs.map((job) => (
            <SandboxCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {total > 24 && (
        <div className='flex justify-center gap-2 pt-4'>
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
            disabled={page * 24 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <CreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
