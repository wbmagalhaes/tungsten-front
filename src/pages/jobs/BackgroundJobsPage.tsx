import { useState } from 'react';
import {
  ServerCog,
  Plus,
  Loader2,
  Code,
  Trash2,
  Hash,
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
import { TextField } from '@components/base/text-field';
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
import { ConfirmationDialog } from '@components/ConfirmationDialog';

import { useListJobs } from '@hooks/jobs/use-list-jobs';
import { useCreateJob } from '@hooks/jobs/use-create-job';
import { useDeleteJob } from '@hooks/jobs/use-delete-job';
import { useJobLanguages } from '@hooks/jobs/use-job-languages';
import { EventRouteSelector } from '@components/EventRouteSelector';
import type { Job } from '@services/jobs.service';

function JobRow({ job, onDelete }: { job: Job; onDelete: (id: string) => void }) {
  return (
    <Card className='hover:border-primary/30 transition-all'>
      <CardHeader>
        <CardIcon>
          <Code className='w-5 h-5' />
        </CardIcon>
        <div className='flex-1 min-w-0'>
          <CardTitle className='truncate'>{job.name}</CardTitle>
          <div className='flex gap-2 mt-1 flex-wrap'>
            <Badge variant='outline' className='text-xs'>
              {job.language}
            </Badge>
            <Badge variant='secondary' className='text-xs'>
              <Hash className='w-3 h-3' />
              priority {job.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardFooter className='gap-2'>
        <ButtonLink
          to={`/background-jobs/${job.id}`}
          variant='secondary'
          size='sm'
          className='mr-auto'
        >
          Open
        </ButtonLink>
        <ProtectedComponent requireScope='wjb:job:Enqueue'>
          <Button
            variant='ghost'
            size='icon'
            className='text-destructive'
            onClick={() => onDelete(job.id)}
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </ProtectedComponent>
      </CardFooter>
    </Card>
  );
}

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

type TriggerType = 'eager' | 'timestamp' | 'cron' | 'queue';

function CreateDialog({ open, onOpenChange }: CreateDialogProps) {
  const create = useCreateJob();
  const { data: langs } = useJobLanguages();
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [priority, setPriority] = useState(0);
  const [timeoutSeconds, setTimeoutSeconds] = useState('');
  const [maxAttempts, setMaxAttempts] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [resultTopics, setResultTopics] = useState<string[]>([]);
  const [resultQueues, setResultQueues] = useState<string[]>([]);
  const [triggerType, setTriggerType] = useState<TriggerType>('eager');
  const [timestampAt, setTimestampAt] = useState('');
  const [cronExpr, setCronExpr] = useState('*/5 * * * *');
  const [cronTz, setCronTz] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  );
  const [queueId, setQueueId] = useState('');

  const reset = () => {
    setName('');
    setLanguage('python');
    setCode('');
    setStdin('');
    setPriority(0);
    setTimeoutSeconds('');
    setMaxAttempts('');
    setEnabled(true);
    setResultTopics([]);
    setResultQueues([]);
    setTriggerType('eager');
    setTimestampAt('');
    setCronExpr('*/5 * * * *');
    setQueueId('');
  };

  const buildTrigger = () => {
    switch (triggerType) {
      case 'eager':
        return { type: 'eager' as const };
      case 'timestamp':
        return {
          type: 'timestamp' as const,
          at: new Date(timestampAt).toISOString(),
        };
      case 'cron':
        return {
          type: 'cron' as const,
          expr: cronExpr,
          tz: cronTz || undefined,
        };
      case 'queue':
        return { type: 'queue' as const, queue_id: queueId };
    }
  };

  const triggerValid = () => {
    switch (triggerType) {
      case 'eager':
        return true;
      case 'timestamp':
        return !!timestampAt;
      case 'cron':
        return !!cronExpr.trim();
      case 'queue':
        return !!queueId.trim();
    }
  };

  const parseNullableNumber = (v: string) => {
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const handleSubmit = () => {
    if (!name.trim() || !code.trim() || !triggerValid()) return;
    create.mutate(
      {
        name,
        language,
        code,
        stdin: stdin || null,
        priority,
        trigger: buildTrigger(),
        timeout_seconds: parseNullableNumber(timeoutSeconds),
        max_attempts: parseNullableNumber(maxAttempts),
        enabled,
        result_topics: resultTopics,
        result_queues: resultQueues,
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
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>New Job</DialogTitle>
          <DialogDescription>Define a job to enqueue.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <TextField
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div>
            <label className='text-sm font-medium block mb-1'>Language</label>
            <select
              className='w-full bg-background border border-border rounded-sm px-3 py-2 text-sm'
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {(langs?.results.length
                ? langs.results.map((l) => l.language)
                : ['python']
              ).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <TextField
            label='Priority (-10..10)'
            type='number'
            value={priority}
            min={-10}
            max={10}
            onChange={(e) => setPriority(Number(e.target.value) || 0)}
          />

          <div>
            <label className='text-sm font-medium block mb-1'>Trigger</label>
            <select
              className='w-full bg-background border border-border rounded-sm px-3 py-2 text-sm'
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as TriggerType)}
            >
              <option value='eager'>Eager (run once now)</option>
              <option value='timestamp'>Timestamp (run once at)</option>
              <option value='cron'>Cron (schedule)</option>
              <option value='queue'>Queue (on message)</option>
            </select>
          </div>

          {triggerType === 'timestamp' && (
            <TextField
              label='Run at'
              type='datetime-local'
              value={timestampAt}
              onChange={(e) => setTimestampAt(e.target.value)}
              required
            />
          )}

          {triggerType === 'cron' && (
            <>
              <TextField
                label='Cron expression'
                value={cronExpr}
                onChange={(e) => setCronExpr(e.target.value)}
                placeholder='*/5 * * * *'
                required
              />
              <TextField
                label='Timezone'
                value={cronTz}
                onChange={(e) => setCronTz(e.target.value)}
                placeholder='America/Sao_Paulo'
              />
            </>
          )}

          {triggerType === 'queue' && (
            <TextField
              label='Queue ID'
              value={queueId}
              onChange={(e) => setQueueId(e.target.value)}
              placeholder='queue uuid'
              required
            />
          )}

          <div>
            <label className='text-sm font-medium block mb-1'>Code</label>
            <Textarea
              className='min-h-64 font-mono text-sm'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div>
            <label className='text-sm font-medium block mb-1'>
              Stdin (optional)
            </label>
            <Textarea
              className='min-h-20 font-mono text-sm'
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder='Input fed to the script via stdin…'
            />
          </div>

          <TextField
            label='Timeout (seconds, empty = default)'
            type='number'
            value={timeoutSeconds}
            onChange={(e) => setTimeoutSeconds(e.target.value)}
          />
          <TextField
            label='Max attempts (empty = default)'
            type='number'
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(e.target.value)}
          />
          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Enabled
          </label>

          <EventRouteSelector
            topics={resultTopics}
            queues={resultQueues}
            onTopicsChange={setResultTopics}
            onQueuesChange={setResultQueues}
            label={{ topics: 'Result topics', queues: 'Result queues' }}
          />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !name.trim() ||
              !code.trim() ||
              !triggerValid() ||
              create.isPending
            }
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

export default function BackgroundJobsPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useListJobs({
    page,
    page_size: 50,
  });
  const deleteJob = useDeleteJob();

  const jobs = data?.results ?? [];
  const total = data?.count ?? 0;

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
    <div className='space-y-4'>
      <PageHeader
        title='Background Jobs'
        icon={<ServerCog className='w-5 h-5' />}
        action={
          <ProtectedComponent requireScope='wjb:job:Enqueue'>
            <Button onClick={() => setCreateOpen(true)} size='icon'>
              <Plus className='w-4 h-4' />
            </Button>
          </ProtectedComponent>
        }
      />

      {jobs.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <ServerCog className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>No jobs yet.</p>
          </CardContent>
        </Card>
      )}

      <div className='space-y-3'>
        {jobs.map((job) => (
          <JobRow key={job.id} job={job} onDelete={setConfirmDelete} />
        ))}
      </div>

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

      <CreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmationDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title='Delete Job'
        description='This will permanently delete the job definition.'
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={() =>
          confirmDelete &&
          deleteJob.mutate(confirmDelete, {
            onSuccess: () => setConfirmDelete(null),
          })
        }
        isLoading={deleteJob.isPending}
        loadingText='Deleting...'
      />
    </div>
  );
}
