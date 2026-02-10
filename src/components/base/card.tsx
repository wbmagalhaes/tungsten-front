import * as React from 'react';
import { cn } from '@utils/cn';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn(
        'bg-card border border-border rounded-sm shadow-lg overflow-hidden',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn('p-4 flex items-center gap-2', className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot='card-title'
      className={cn(
        'text-lg font-semibold text-card-foreground leading-none',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot='card-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardIcon({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-icon'
      className={cn('p-2 bg-primary/10 rounded-sm text-primary shrink-0', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn('p-4 has-[~[data-slot=card-header]]:pt-0', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('flex gap-2 p-4 pt-3 border-t border-border', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
