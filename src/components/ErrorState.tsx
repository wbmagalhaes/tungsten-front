import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@components/base/card';
import { Button } from '@components/base/button';
import { cn } from '@utils/cn';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Error Loading Data',
  message = 'Unable to fetch the requested information',
  onRetry,
  className,
}: ErrorStateProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={cn('flex items-center justify-center h-64', className)}>
      <Card className='max-w-md'>
        <CardContent className='p-8 text-center'>
          <AlertTriangle className='w-12 h-12 text-destructive mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-foreground mb-2'>
            {title}
          </h3>
          <p className='text-sm text-muted-foreground mb-4'>{message}</p>
          <Button onClick={handleRetry} variant='secondary'>
            <RefreshCw className='w-4 h-4' />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
