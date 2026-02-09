import { Loader2 } from 'lucide-react';
import { Badge } from '@components/base/badge';

interface RefetchingIndicatorProps {
  message?: string;
}

export function RefetchingIndicator({
  message = 'Updating...',
}: RefetchingIndicatorProps) {
  return (
    <div className='fixed top-20 w-full pointer-events-none z-50 flex justify-center'>
      <Badge variant='default' className='gap-2 pr-3 py-1'>
        <Loader2 className='w-3 h-3 animate-spin' />
        {message}
      </Badge>
    </div>
  );
}
