import { Bell, CheckCheck, Mail, RefreshCcw, Loader2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import PageHeader from '@components/PageHeader';
import { LoadingState } from '@components/LoadingState';
import {
  useInbox,
  useMarkInboxRead,
  useMarkAllInboxRead,
} from '@hooks/notifications/use-inbox';
import { isInboxItemRead } from '@services/notifications.service';

export default function InboxPage() {
  const { data, isLoading, isFetching, refetch } = useInbox();
  const markRead = useMarkInboxRead();
  const markAll = useMarkAllInboxRead();

  if (isLoading) return <LoadingState message='Loading inbox…' />;

  const items = data?.results ?? [];

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Inbox'
        icon={<Bell className='w-5 h-5' />}
        action={
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <RefreshCcw className='w-4 h-4' />
              )}
              Refresh
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
            >
              <CheckCheck className='w-4 h-4' />
              Mark all read
            </Button>
          </div>
        }
      />

      {items.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <Mail className='w-16 h-16 text-muted-fg mx-auto mb-4' />
            <p className='text-muted-fg'>Inbox is empty.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-2'>
          {items.map((it) => {
            const read = isInboxItemRead(it);
            return (
            <Card
              key={it.id}
              className={read ? 'opacity-70' : ''}
              onClick={() => !read && markRead.mutate(it.id)}
            >
              <CardHeader>
                <CardIcon>
                  <Mail className='w-5 h-5' />
                </CardIcon>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='flex items-center gap-2'>
                    {it.subject}
                    {!read && <Badge variant='default'>new</Badge>}
                  </CardTitle>
                  <span className='text-xs text-muted-fg'>
                    {new Date(it.created_at).toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm whitespace-pre-wrap'>{it.body}</p>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
