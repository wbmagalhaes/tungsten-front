import * as React from 'react';
import { cn } from '@utils/cn';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'w-full min-w-0 min-h-16 px-3 py-2 text-sm bg-input border border-border rounded-sm text-foreground placeholder-gray-500 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-ring-600 focus:border-transparent',
        'disabled:bg-background disabled:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        'resize-none',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
