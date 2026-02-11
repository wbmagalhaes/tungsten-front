import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 justify-center w-fit whitespace-nowrap shrink-0 px-2 py-1 rounded-xs text-xs font-medium transition-all [&>svg]:size-3 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-blue-900/50 text-blue-400 border border-blue-700',
        secondary: 'bg-gray-700 text-gray-200 border border-transparent',
        success: 'bg-green-900/50 text-green-400 border border-green-700',
        warning: 'bg-orange-900/50 text-orange-400 border border-orange-700',
        destructive: 'bg-red-900/50 text-red-400 border border-red-700',
        purple: 'bg-purple-900/50 text-purple-400 border border-purple-700',
        outline: 'bg-transparent text-secondary-foreground border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge };
