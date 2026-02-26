import { Badge } from '@components/base/badge';
import { CheckCircle, Clock, Loader2, StopCircle, XCircle } from 'lucide-react';

export const STATUS_CONFIG = {
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
