import { BellIcon, CheckCheck, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@components/base/button';
import { Kbd, KbdGroup } from '@components/base/kbd';
import { Badge } from '@components/base/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/base/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@components/base/popover';
import { useHotkeys } from '@hooks/use-hotkeys';
import {
  useInbox,
  useInboxUnreadCount,
  useMarkInboxRead,
  useMarkAllInboxRead,
} from '@hooks/notifications/use-inbox';
import { isInboxItemRead } from '@services/notifications.service';

export function HeaderAlerts() {
  const [open, setOpen] = useState(false);
  const { data: unread } = useInboxUnreadCount();
  const { data: inbox, isLoading } = useInbox();
  const markRead = useMarkInboxRead();
  const markAll = useMarkAllInboxRead();
  useHotkeys('ctrl+.', () => setOpen(true));

  const unreadCount = unread?.count ?? 0;
  const items = inbox?.results ?? [];

  return (
    <Tooltip>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  onClick={() => setOpen(true)}
                  variant='ghost'
                  size='icon-sm'
                  className='relative'
                >
                  <BellIcon />
                  {unreadCount > 0 && (
                    <Badge
                      variant='destructive'
                      className='absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] leading-none'
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              }
            />
          }
        />

        <PopoverContent
          side='bottom'
          sideOffset={12}
          className='w-[calc(100vw-1rem)] sm:w-96 p-0'
        >
          <PopoverHeader className='flex flex-row items-center justify-between gap-2 p-3 border-b border-border'>
            <div>
              <PopoverTitle>Inbox</PopoverTitle>
              <PopoverDescription>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : 'You are all caught up.'}
              </PopoverDescription>
            </div>
            {unreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}
              >
                <CheckCheck className='w-4 h-4' />
                Mark all
              </Button>
            )}
          </PopoverHeader>

          <div className='max-h-80 overflow-y-auto'>
            {isLoading ? (
              <div className='flex items-center justify-center py-6 text-muted-foreground'>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Loading…
              </div>
            ) : items.length === 0 ? (
              <div className='flex flex-col items-center py-8 text-muted-foreground'>
                <Mail className='w-8 h-8 mb-2' />
                <p className='text-sm'>Inbox is empty.</p>
              </div>
            ) : (
              <div className='flex flex-col divide-y divide-border'>
                {items.slice(0, 8).map((it) => {
                  const read = isInboxItemRead(it);
                  return (
                  <button
                    key={it.id}
                    type='button'
                    onClick={() => !read && markRead.mutate(it.id)}
                    className={`text-left p-3 hover:bg-muted/40 transition-colors ${
                      read ? 'opacity-60' : ''
                    }`}
                  >
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-sm font-medium truncate flex-1'>
                        {it.subject}
                      </span>
                      {!read && (
                        <Badge variant='default' className='text-[10px]'>
                          new
                        </Badge>
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground line-clamp-2'>
                      {it.body}
                    </p>
                    <p className='text-[10px] text-muted-foreground mt-1'>
                      {new Date(it.created_at).toLocaleString()}
                    </p>
                  </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className='border-t border-border p-2'>
            <Link
              to='/inbox'
              onClick={() => setOpen(false)}
              className='block text-center text-sm text-primary hover:underline py-1'
            >
              Open inbox
            </Link>
          </div>
        </PopoverContent>
      </Popover>

      <TooltipContent>
        <div className='flex items-center gap-2'>
          Open Inbox
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>.</Kbd>
          </KbdGroup>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
