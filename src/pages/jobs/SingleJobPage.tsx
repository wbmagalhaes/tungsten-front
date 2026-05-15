import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  ServerCog,
  Code,
  Clock,
  StopCircle,
  RotateCcw,
  Pencil,
  Save,
  Loader2,
  Trash2,
  Play,
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
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import { Textarea } from '@components/base/text-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/base/select';
import { Switch } from '@components/base/switch';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import ProtectedComponent from '@components/ProtectedComponent';
import { EventRouteSelector } from '@components/EventRouteSelector';

import { useGetJob } from '@hooks/jobs/use-get-job';
import { useUpdateJob } from '@hooks/jobs/use-update-job';
import { useDeleteJob } from '@hooks/jobs/use-delete-job';
import { useRunJob } from '@hooks/jobs/use-run-job';
import { useJobLanguages } from '@hooks/jobs/use-job-languages';
import { useListExecutions } from '@hooks/jobs/use-list-executions';
import { useCancelExecution } from '@hooks/jobs/use-cancel-execution';
import { useRetryExecution } from '@hooks/jobs/use-retry-execution';
import {
  normalizeTrigger,
  type Job,
  type JobExecution,
  type JobTrigger,
} from '@services/jobs.service';
import { STATUS_CONFIG, formatTimestamp, formatDuration } from './mappings';

function ExecutionRow({ execution }: { execution: JobExecution }) {
  const cancel = useCancelExecution();
  const retry = useRetryExecution();
  const cfg = STATUS_CONFIG[execution.status];
  const isActive =
    execution.status === 'queued' || execution.status === 'running';
  const canRetry =
    execution.status === 'failed' || execution.status === 'cancelled';

  return (
    <Card>
      <CardHeader>
        <CardIcon>{cfg.icon}</CardIcon>
        <div className='flex-1 min-w-0'>
          <CardTitle className='font-mono text-sm truncate'>
            {execution.id.slice(0, 8)}
          </CardTitle>
          <div className='flex gap-2 mt-1 flex-wrap text-xs text-muted-foreground'>
            <span>Started {formatTimestamp(execution.started_at)}</span>
            {execution.duration_ms != null && (
              <span>· {formatDuration(execution.duration_ms)}</span>
            )}
            {execution.exit_code != null && (
              <span>· exit {execution.exit_code}</span>
            )}
          </div>
        </div>
        {cfg.badge}
      </CardHeader>
      {(execution.stdout || execution.stderr || execution.error) && (
        <CardContent className='space-y-2'>
          {execution.stdout && (
            <pre className='text-xs font-mono whitespace-pre-wrap bg-success/5 border border-success/20 p-2 rounded-sm max-h-32 overflow-auto'>
              {execution.stdout}
            </pre>
          )}
          {execution.stderr && (
            <pre className='text-xs font-mono whitespace-pre-wrap bg-warning/5 border border-warning/20 p-2 rounded-sm max-h-32 overflow-auto'>
              {execution.stderr}
            </pre>
          )}
          {execution.error && (
            <pre className='text-xs font-mono whitespace-pre-wrap text-destructive bg-destructive/5 border border-destructive/20 p-2 rounded-sm'>
              {execution.error}
            </pre>
          )}
        </CardContent>
      )}
      {(isActive || canRetry) && (
        <CardFooter className='gap-2'>
          {isActive && (
            <ProtectedComponent requireScope='wjb:job:Cancel'>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => cancel.mutate(execution.id)}
                disabled={cancel.isPending}
              >
                <StopCircle className='w-4 h-4' />
                Cancel
              </Button>
            </ProtectedComponent>
          )}
          {canRetry && (
            <ProtectedComponent requireScope='wjb:job:Retry'>
              <Button
                variant='secondary'
                size='sm'
                onClick={() => retry.mutate(execution.id)}
                disabled={retry.isPending}
              >
                <RotateCcw className='w-4 h-4' />
                Retry
              </Button>
            </ProtectedComponent>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

type TriggerType = JobTrigger['type'];

function EditSection({
  job,
  onSaved,
}: {
  job: Job;
  onSaved: () => void;
}) {
  const update = useUpdateJob(job.id);
  const { data: langs } = useJobLanguages();
  const trigger = normalizeTrigger(job);

  const [name, setName] = useState(job.name);
  const [language, setLanguage] = useState(job.language);
  const [code, setCode] = useState(job.code);
  const [stdin, setStdin] = useState(job.stdin ?? '');
  const [priority, setPriority] = useState(job.priority);
  const [timeoutSeconds, setTimeoutSeconds] = useState(
    job.timeout_seconds?.toString() ?? '',
  );
  const [maxAttempts, setMaxAttempts] = useState(
    job.max_attempts?.toString() ?? '',
  );
  const [enabled, setEnabled] = useState(job.enabled);
  const [resultTopics, setResultTopics] = useState(job.result_topics ?? []);
  const [resultQueues, setResultQueues] = useState(job.result_queues ?? []);

  const [triggerType, setTriggerType] = useState<TriggerType>(trigger.type);
  const [timestampAt, setTimestampAt] = useState(
    trigger.type === 'timestamp' && trigger.at
      ? new Date(trigger.at).toISOString().slice(0, 16)
      : '',
  );
  const [cronExpr, setCronExpr] = useState(
    trigger.type === 'cron' ? trigger.expr : '*/5 * * * *',
  );
  const [cronTz, setCronTz] = useState(
    trigger.type === 'cron'
      ? (trigger.tz ?? '')
      : Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  );
  const [queueId, setQueueId] = useState(
    trigger.type === 'queue' ? trigger.queue_id : '',
  );

  const buildTrigger = (): JobTrigger => {
    switch (triggerType) {
      case 'eager':
        return { type: 'eager' };
      case 'timestamp':
        return { type: 'timestamp', at: new Date(timestampAt).toISOString() };
      case 'cron':
        return { type: 'cron', expr: cronExpr, tz: cronTz || undefined };
      case 'queue':
        return { type: 'queue', queue_id: queueId };
    }
  };

  const parseNullableNumber = (v: string) => {
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const handleSave = () => {
    update.mutate(
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
      { onSuccess: () => onSaved() },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Pencil className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Edit Job</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <TextField
          label='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <label className='text-sm font-medium block mb-1'>Language</label>
          <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(langs?.results.length
                ? langs.results.map((l) => l.language)
                : [job.language]
              ).map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select
            value={triggerType}
            onValueChange={(v) => v && setTriggerType(v as TriggerType)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='eager'>Eager (run once now)</SelectItem>
              <SelectItem value='timestamp'>Timestamp (run once at)</SelectItem>
              <SelectItem value='cron'>Cron (schedule)</SelectItem>
              <SelectItem value='queue'>Queue (on message)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {triggerType === 'timestamp' && (
          <TextField
            label='Run at'
            type='datetime-local'
            value={timestampAt}
            onChange={(e) => setTimestampAt(e.target.value)}
          />
        )}
        {triggerType === 'cron' && (
          <>
            <TextField
              label='Cron expression'
              value={cronExpr}
              onChange={(e) => setCronExpr(e.target.value)}
            />
            <TextField
              label='Timezone'
              value={cronTz}
              onChange={(e) => setCronTz(e.target.value)}
            />
          </>
        )}
        {triggerType === 'queue' && (
          <TextField
            label='Queue ID'
            value={queueId}
            onChange={(e) => setQueueId(e.target.value)}
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
          <label className='text-sm font-medium block mb-1'>Stdin</label>
          <Textarea
            className='min-h-20 font-mono text-sm'
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
          />
        </div>

        <TextField
          label='Timeout (seconds)'
          type='number'
          value={timeoutSeconds}
          onChange={(e) => setTimeoutSeconds(e.target.value)}
        />
        <TextField
          label='Max attempts'
          type='number'
          value={maxAttempts}
          onChange={(e) => setMaxAttempts(e.target.value)}
        />
        <label className='flex items-center gap-2 text-sm'>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          Enabled
        </label>

        <EventRouteSelector
          topics={resultTopics}
          queues={resultQueues}
          onTopicsChange={setResultTopics}
          onQueuesChange={setResultQueues}
          label={{ topics: 'Result topics', queues: 'Result queues' }}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={update.isPending}>
          {update.isPending ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Save className='w-4 h-4' />
          )}
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SingleJobPage() {
  const { id = '' } = useParams();
  const { data: job, isLoading, error } = useGetJob(id);
  const { data: executions } = useListExecutions(id, { page_size: 20 });
  const deleteJob = useDeleteJob();
  const runJob = useRunJob(id);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) return <LoadingState message='Loading job…' />;
  if (error || !job) {
    return (
      <ErrorState
        title='Job not found'
        message={error?.message || 'Unable to load this job'}
      />
    );
  }

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
          <CardIcon>
            <ServerCog className='w-5 h-5' />
          </CardIcon>
          <div className='flex flex-col items-start gap-1 flex-1'>
            <CardTitle>{job.name}</CardTitle>
            <div className='flex gap-2 flex-wrap'>
              <Badge variant='outline' className='text-xs'>
                {job.language}
              </Badge>
              <Badge variant='secondary' className='text-xs'>
                priority {job.priority}
              </Badge>
              <Badge variant='outline' className='text-xs'>
                trigger {normalizeTrigger(job).type}
              </Badge>
              {!job.enabled && (
                <Badge variant='warning' className='text-xs'>
                  disabled
                </Badge>
              )}
            </div>
            <span className='text-xs text-muted-foreground font-mono'>
              {job.id}
            </span>
          </div>
          <ProtectedComponent requireScope='wjb:job:Enqueue'>
            <>
              <Button
                size='sm'
                onClick={() => runJob.mutate()}
                disabled={runJob.isPending}
              >
                {runJob.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Play className='w-4 h-4' />
                )}
                Run now
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowEdit((v) => !v)}
              >
                <Pencil className='w-4 h-4' />
                Edit
              </Button>
            </>
          </ProtectedComponent>
        </CardHeader>
      </Card>

      {showEdit && (
        <EditSection job={job} onSaved={() => setShowEdit(false)} />
      )}

      <Card>
        <CardHeader>
          <CardIcon>
            <Code className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Code</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className='text-sm font-mono whitespace-pre-wrap bg-muted/30 rounded-sm border border-border p-4 overflow-x-auto max-h-96'>
            {job.code}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardIcon>
            <Clock className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Executions ({executions?.count ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {executions?.results.length ? (
            executions.results.map((e) => (
              <ExecutionRow key={e.id} execution={e} />
            ))
          ) : (
            <p className='text-sm text-muted-foreground text-center py-4'>
              No executions yet.
            </p>
          )}
        </CardContent>
      </Card>

      <ProtectedComponent requireScope='wjb:job:Enqueue'>
        <Card className='border-destructive/50'>
          <CardHeader>
            <CardIcon className='bg-destructive/10 text-destructive'>
              <Trash2 className='w-5 h-5' />
            </CardIcon>
            <div>
              <CardTitle>Delete Job</CardTitle>
              <CardDescription>
                Permanently remove this job definition.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant='destructive'
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className='w-4 h-4' />
              Delete Job
            </Button>
          </CardContent>
        </Card>
      </ProtectedComponent>

      <ConfirmationDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title='Delete Job'
        description='This will permanently delete the job definition and all its executions history.'
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={() => deleteJob.mutate(job.id)}
        isLoading={deleteJob.isPending}
        loadingText='Deleting…'
      />
    </div>
  );
}
