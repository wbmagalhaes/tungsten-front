import { useState } from 'react';
import {
  ServerCog,
  Loader2,
  CheckCircle,
  XCircle,
  StopCircle,
  ImagePlus,
  BotMessageSquare,
  FlaskConical,
  Clock,
  Trash2,
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
import { ConfirmationDialog } from '@components/ConfirmationDialog';

type JobType = 'image_generation' | 'chatbot_conversation' | 'sandbox_run';
type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'canceled';

interface BackgroundJob {
  id: number;
  type: JobType;
  title: string;
  description: string;
  status: JobStatus;
  progress?: number;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
}

export default function BackgroundJobsPage() {
  const [cancelJobId, setCancelJobId] = useState<number | null>(null);

  // TODO: Implement endpoint GET /api/jobs
  const jobs: BackgroundJob[] = [
    {
      id: 1,
      type: 'image_generation',
      title: 'Cyberpunk City',
      description: 'Generating image: A futuristic cyberpunk city at night...',
      status: 'running',
      progress: 45,
      createdAt: '2 minutes ago',
      startedAt: '1 minute ago',
    },
    {
      id: 2,
      type: 'sandbox_run',
      title: 'Data Analysis Script',
      description: 'Running Python sandbox with pandas and numpy',
      status: 'running',
      progress: 78,
      createdAt: '5 minutes ago',
      startedAt: '4 minutes ago',
    },
    {
      id: 3,
      type: 'chatbot_conversation',
      title: 'GPT-4 Conversation',
      description: 'Processing response for: Explain React hooks...',
      status: 'pending',
      createdAt: '10 seconds ago',
    },
    {
      id: 4,
      type: 'image_generation',
      title: 'Abstract Art',
      description: 'Generated image: Abstract geometric patterns...',
      status: 'completed',
      createdAt: '1 hour ago',
      startedAt: '1 hour ago',
      finishedAt: '55 minutes ago',
    },
    {
      id: 5,
      type: 'sandbox_run',
      title: 'Web Scraper',
      description: 'Python script failed',
      status: 'failed',
      error: 'ModuleNotFoundError: No module named "requests"',
      createdAt: '2 hours ago',
      startedAt: '2 hours ago',
      finishedAt: '2 hours ago',
    },
    {
      id: 6,
      type: 'chatbot_conversation',
      title: 'Claude Conversation',
      description: 'Conversation canceled by user',
      status: 'canceled',
      createdAt: '3 hours ago',
      startedAt: '3 hours ago',
      finishedAt: '3 hours ago',
    },
  ];

  const handleCancelJob = () => {
    if (!cancelJobId) return;
    // TODO: Implement endpoint POST /api/jobs/:id/cancel
    console.log('Canceling job:', cancelJobId);
    setCancelJobId(null);
  };

  const handleDeleteJob = (jobId: number) => {
    // TODO: Implement endpoint DELETE /api/jobs/:id
    console.log('Deleting job:', jobId);
  };

  const activeJobs = jobs.filter(
    (j) => j.status === 'running' || j.status === 'pending',
  );
  const completedJobs = jobs.filter(
    (j) =>
      j.status === 'completed' ||
      j.status === 'failed' ||
      j.status === 'canceled',
  );

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Background Jobs'
        icon={<ServerCog className='w-5 h-5' />}
      />

      {activeJobs.length > 0 && (
        <div>
          <h2 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
            <Loader2 className='w-5 h-5 text-primary animate-spin' />
            Active Jobs ({activeJobs.length})
          </h2>
          <div className='space-y-3'>
            {activeJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onCancel={() => setCancelJobId(job.id)}
                onDelete={() => handleDeleteJob(job.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
          <CheckCircle className='w-5 h-5 text-success' />
          Completed Jobs ({completedJobs.length})
        </h2>
        <div className='space-y-3'>
          {completedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onCancel={() => setCancelJobId(job.id)}
              onDelete={() => handleDeleteJob(job.id)}
            />
          ))}
        </div>
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <ServerCog className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>
              No background jobs running or completed
            </p>
          </CardContent>
        </Card>
      )}

      <ConfirmationDialog
        open={!!cancelJobId}
        onOpenChange={() => setCancelJobId(null)}
        title='Cancel Job'
        description='Are you sure you want to cancel this job? This action cannot be undone.'
        icon={<StopCircle className='w-5 h-5 text-warning' />}
        confirmText='Cancel Job'
        confirmVariant='destructive'
        onConfirm={handleCancelJob}
      />
    </div>
  );
}

function JobCard({
  job,
  onCancel,
  onDelete,
}: {
  job: BackgroundJob;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const typeConfig = {
    image_generation: {
      icon: <ImagePlus className='w-5 h-5' />,
      label: 'Image Generation',
      color: 'text-fuchsia-400',
    },
    chatbot_conversation: {
      icon: <BotMessageSquare className='w-5 h-5' />,
      label: 'ChatBot',
      color: 'text-cyan-400',
    },
    sandbox_run: {
      icon: <FlaskConical className='w-5 h-5' />,
      label: 'Sandbox',
      color: 'text-purple-400',
    },
  };

  const statusConfig = {
    pending: {
      badge: (
        <Badge variant='secondary'>
          <Clock className='w-3 h-3' />
          Pending
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
    completed: {
      badge: (
        <Badge variant='success'>
          <CheckCircle className='w-3 h-3' />
          Completed
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
    canceled: {
      badge: <Badge variant='outline'>Canceled</Badge>,
    },
  };

  const canCancel = job.status === 'pending' || job.status === 'running';
  const canDelete = job.status !== 'running' && job.status !== 'pending';

  return (
    <Card className='hover:border-primary/30 transition-all'>
      <CardHeader>
        <CardIcon className={typeConfig[job.type].color}>
          {typeConfig[job.type].icon}
        </CardIcon>
        <div className='flex-1 min-w-0'>
          <CardTitle className='mb-1'>{job.title}</CardTitle>
          <Badge variant='outline' className='text-xs'>
            {typeConfig[job.type].label}
          </Badge>
        </div>
        {statusConfig[job.status].badge}
      </CardHeader>

      <CardContent className='space-y-3'>
        <p className='text-sm text-muted-foreground'>{job.description}</p>

        {job.status === 'running' && job.progress !== undefined && (
          <div>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-xs text-muted-foreground'>Progress</span>
              <span className='text-xs text-foreground font-medium'>
                {job.progress}%
              </span>
            </div>
            <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
              <div
                className='h-full bg-linear-to-r from-primary to-accent transition-all duration-300'
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
        )}

        {job.error && (
          <div className='p-3 bg-destructive/5 rounded-sm border border-destructive/20'>
            <div className='text-xs font-medium text-destructive mb-1'>
              Error:
            </div>
            <pre className='text-xs text-destructive font-mono whitespace-pre-wrap'>
              {job.error}
            </pre>
          </div>
        )}

        <div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <Clock className='w-3 h-3' />
            Created {job.createdAt}
          </span>
          {job.startedAt && <span>• Started {job.startedAt}</span>}
          {job.finishedAt && <span>• Finished {job.finishedAt}</span>}
        </div>
      </CardContent>

      <CardFooter className='gap-2'>
        {canCancel && (
          <Button variant='destructive' size='sm' onClick={onCancel}>
            <StopCircle className='w-4 h-4' />
            Cancel
          </Button>
        )}
        {canDelete && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onDelete}
            className='ml-auto text-destructive hover:bg-destructive/10'
          >
            <Trash2 className='w-4 h-4' />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
