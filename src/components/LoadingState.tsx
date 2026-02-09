import { Loader2 } from 'lucide-react';
import { cn } from '@utils/cn';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message, className }: LoadingStateProps) {
  return (
    <div className={cn('flex items-center justify-center h-64', className)}>
      <div className='flex flex-col items-center gap-3'>
        <Loader2 className='w-8 h-8 text-primary animate-spin' />
        {message && <p className='text-muted-foreground'>{message}</p>}
      </div>
    </div>
  );
}
