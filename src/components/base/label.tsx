import * as React from 'react';
import { cn } from '@utils/cn';

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot='label'
      className={cn(
        'text-sm text-muted-foreground font-medium select-none',
        'group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50',
        'group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
        'flex items-center gap-2',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
