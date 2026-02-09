import * as React from 'react';
import { cn } from '@utils/cn';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn(
        'bg-gray-800 border border-gray-700 rounded-sm shadow-lg overflow-hidden',
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
      className={cn('text-lg font-semibold text-white leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot='card-description'
      className={cn('text-sm text-gray-400', className)}
      {...props}
    />
  );
}

function CardIcon({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-icon'
      className={cn('text-blue-400 shrink-0', className)}
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
      className={cn('flex gap-2 p-4 pt-3 border-t border-gray-700', className)}
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
