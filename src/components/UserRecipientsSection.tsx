import {
  Send,
  Loader2,
  ShieldCheck,
  Inbox,
  AlertTriangle,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import {
  useUserRecipients,
  useEnsureInapp,
} from '@hooks/notifications/use-user-recipients';

interface Props {
  userId: string;
}

export function UserRecipientsSection({ userId }: Props) {
  const { data, isLoading } = useUserRecipients(userId);
  const ensure = useEnsureInapp(userId);

  const recipients = data?.results ?? [];

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Send className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Recipients ({recipients.length})</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        {isLoading ? (
          <p className='text-sm text-muted-fg'>Loading…</p>
        ) : recipients.length === 0 ? (
          <p className='text-sm text-muted-fg'>
            No recipients configured for this user.
          </p>
        ) : (
          recipients.map((r) => (
            <div
              key={r.id}
              className='flex items-center gap-2 p-2 bg-muted/30 rounded-sm border border-border'
            >
              <Badge variant='outline'>{r.kind}</Badge>
              <span className='font-mono text-xs truncate flex-1'>
                {r.address}
              </span>
              {r.verified ? (
                <Badge variant='success'>
                  <ShieldCheck className='w-3 h-3' />
                  verified
                </Badge>
              ) : (
                <Badge variant='warning'>unverified</Badge>
              )}
              {r.disabled && (
                <Badge variant='warning'>
                  <AlertTriangle className='w-3 h-3' />
                  disabled
                </Badge>
              )}
            </div>
          ))
        )}
        {ensure.isError && (
          <p className='text-sm text-destructive'>{ensure.error.message}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => ensure.mutate()}
          disabled={ensure.isPending}
        >
          {ensure.isPending ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Inbox className='w-4 h-4' />
          )}
          Ensure inbox recipient
        </Button>
      </CardFooter>
    </Card>
  );
}
