import { cn } from '@utils/cn';

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot='kbd'
      className={cn(
        "bg-muted text-secondary-foreground border border-muted-foreground/20 h-5 w-fit min-w-5 gap-1 rounded px-1.5 font-mono text-xs font-medium [&_svg:not([class*='size-'])]:size-3 pointer-events-none inline-flex items-center justify-center select-none shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <kbd
      data-slot='kbd-group'
      className={cn('gap-1 inline-flex items-center', className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
