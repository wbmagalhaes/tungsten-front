import { Badge } from '@components/base/badge';
import { CheckCircle, Clock, Loader2, StopCircle, XCircle } from 'lucide-react';
import type { JobStatus } from '@services/jobs.service';

export const STATUS_CONFIG: Record<
  JobStatus,
  { badge: React.ReactNode; icon: React.ReactNode }
> = {
  queued: {
    badge: (
      <Badge variant='secondary'>
        <Clock className='w-3 h-3' />
        Queued
      </Badge>
    ),
    icon: <Clock className='w-5 h-5 text-muted-fg' />,
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
    icon: <StopCircle className='w-5 h-5 text-muted-fg' />,
  },
};

export function formatTimestamp(iso: string | null): string {
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

export function formatDuration(ms: number | null): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
