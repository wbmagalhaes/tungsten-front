import {
  Megaphone,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  RefreshCcw,
  Loader2,
} from 'lucide-react';
import { Button } from '@components/base/button';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Badge } from '@components/base/badge';
import PageHeader from '@components/PageHeader';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { useNotifications } from '@hooks/notifications/use-notifications';
import type { Notification } from '@services/notifications.service';

const STATUS_CONFIG: Record<
  Notification['status'],
  { badge: React.ReactNode }
> = {
  pending: {
    badge: (
      <Badge variant='secondary'>
        <Clock className='w-3 h-3' />
        pending
      </Badge>
    ),
  },
  sent: {
    badge: (
      <Badge variant='success'>
        <CheckCircle className='w-3 h-3' />
        sent
      </Badge>
    ),
  },
  failed: {
    badge: (
      <Badge variant='destructive'>
        <XCircle className='w-3 h-3' />
        failed
      </Badge>
    ),
  },
};

export default function NotificationsPage() {
  return (
    <div className='space-y-4'>
      <PageHeader
        title='Sent Notifications'
        icon={<Send className='w-5 h-5' />}
      />
      <NotificationsSection />
    </div>
  );
}

export function NotificationsSection() {
  const { data, isLoading, isError, isFetching, refetch } = useNotifications();

  if (isLoading) return <LoadingState message='Loading notifications…' />;
  if (isError)
    return (
      <ErrorState
        title='Failed to load notifications'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  const items = data?.results ?? [];

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
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
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <Megaphone className='w-16 h-16 text-muted-fg mx-auto mb-4' />
            <p className='text-muted-fg'>No notifications sent yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {items.map((n) => (
            <Card key={n.id}>
              <CardHeader>
                <CardIcon>
                  <Send className='w-5 h-5' />
                </CardIcon>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='flex items-center gap-2 flex-wrap'>
                    <span className='truncate'>{n.subject}</span>
                    {STATUS_CONFIG[n.status].badge}
                  </CardTitle>
                  <div className='flex gap-3 mt-1 text-xs text-muted-fg font-mono'>
                    <span>topic {n.topic_id.slice(0, 8)}</span>
                    <span>recipient {n.recipient_id.slice(0, 8)}</span>
                    {n.sent_at && (
                      <span>sent {new Date(n.sent_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm whitespace-pre-wrap line-clamp-3'>
                  {n.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
