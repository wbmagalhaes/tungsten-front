import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Monitor,
  Globe,
  Clock,
  LogOut,
  Trash2,
  AlertCircle,
  ShieldOff,
  KeyIcon,
  Loader2,
} from 'lucide-react';
import { describeSession } from '@utils/describe-session';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { useSessions } from '@hooks/auth/use-sessions';
import { useRevokeSession } from '@hooks/auth/use-revoke-session';
import { useRevokeAll } from '@hooks/auth/use-revoke-all';
import { useAuthStore } from '@stores/useAuthStore';
import { Badge } from '@components/base/badge';
import formatDate from '@utils/formatDate';

dayjs.extend(relativeTime);

export default function SessionsCard() {
  const { data: sessions, isLoading, error } = useSessions();
  const revokeSession = useRevokeSession();
  const revokeAll = useRevokeAll();
  const currentSessionId = useAuthStore((s) => s.user?.session_id ?? null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);
  const [confirmRevokeAllOpen, setConfirmRevokeAllOpen] = useState(false);

  const confirmRevoke = () => {
    if (!confirmRevokeId) return;
    const id = confirmRevokeId;
    setRevokingId(id);
    revokeSession.mutate(id, {
      onSettled: () => {
        setRevokingId(null);
        setConfirmRevokeId(null);
      },
    });
  };

  const confirmRevokeAll = () => {
    revokeAll.mutate(undefined, {
      onSettled: () => setConfirmRevokeAllOpen(false),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Monitor className='w-5 h-5' />
        </CardIcon>
        <div className='flex flex-wrap items-center gap-2'>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Devices currently signed in to your account
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoading && <LoadingState message='Loading sessions...' />}
        {error && (
          <ErrorState title='Could not load sessions' message={error.message} />
        )}
        {!isLoading && !error && (sessions?.length ?? 0) === 0 && (
          <p className='text-sm text-muted-foreground'>
            No active sessions found.
          </p>
        )}
        {!isLoading && !error && (sessions?.length ?? 0) > 0 && (
          <ul className='space-y-2'>
            {sessions!.map((s) => {
              const { label, Icon } = describeSession(s.user_agent);
              const isCurrent = s.id === currentSessionId;
              return (
                <li
                  key={s.id}
                  className={
                    'rounded-sm p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border ' +
                    (isCurrent
                      ? 'border-primary bg-primary/5'
                      : 'border-border')
                  }
                >
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex items-center gap-2 font-medium text-sm'>
                      <Icon className='w-4 h-4 shrink-0' />
                      <span className='truncate' title={s.user_agent ?? ''}>
                        {label}
                      </span>
                      {isCurrent && (
                        <Badge variant='outline' className='shrink-0'>
                          this device
                        </Badge>
                      )}
                    </div>
                    <div className='flex flex-col gap-1 text-xs text-muted-foreground'>
                      {s.ip && (
                        <span className='flex items-center gap-1'>
                          <Globe className='w-3 h-3' />
                          {s.ip}
                        </span>
                      )}
                      <span
                        className='flex items-center gap-1'
                        title={formatDate(s.last_used_at)}
                      >
                        <Clock className='w-3 h-3' />
                        Active {dayjs(s.last_used_at).fromNow()}
                      </span>
                      <span
                        className='flex items-center gap-1'
                        title={formatDate(s.created_at)}
                      >
                        <KeyIcon className='w-3 h-3' />
                        Signed in {dayjs(s.created_at).fromNow()}
                      </span>
                    </div>
                  </div>
                  <Button
                    className='mb-auto'
                    variant='destructive'
                    size='icon-sm'
                    onClick={() => setConfirmRevokeId(s.id)}
                    disabled={revokingId === s.id}
                  >
                    {revokingId === s.id ? (
                      <Loader2 className='w-3 h-3' />
                    ) : (
                      <Trash2 className='w-3 h-3' />
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}

        {revokeSession.isError && (
          <div className='flex items-center gap-2 text-sm text-destructive'>
            <AlertCircle className='w-4 h-4' />
            {revokeSession.error.message}
          </div>
        )}

        <div className='border-t border-border pt-4'>
          <Button
            variant='destructive'
            className='w-full'
            onClick={() => setConfirmRevokeAllOpen(true)}
            disabled={revokeAll.isPending}
          >
            {revokeAll.isPending ? (
              <>
                <ShieldOff className='w-4 h-4' />
                Signing out everywhere...
              </>
            ) : (
              <>
                <LogOut className='w-4 h-4' />
                Sign out of all devices
              </>
            )}
          </Button>
          {revokeAll.isError && (
            <p className='text-sm text-destructive mt-2 flex items-center gap-2'>
              <AlertCircle className='w-4 h-4' />
              {revokeAll.error.message}
            </p>
          )}
        </div>
      </CardContent>

      <ConfirmationDialog
        open={!!confirmRevokeId}
        onOpenChange={(open) => !open && setConfirmRevokeId(null)}
        title='Revoke this session?'
        description='The device will be signed out within seconds.'
        icon={<Trash2 className='w-5 h-5 text-destructive' />}
        confirmText='Revoke'
        confirmVariant='destructive'
        isLoading={revokeSession.isPending}
        loadingText='Revoking...'
        onConfirm={confirmRevoke}
      />

      <ConfirmationDialog
        open={confirmRevokeAllOpen}
        onOpenChange={setConfirmRevokeAllOpen}
        title='Sign out of all devices?'
        description='Every device, including this one, will be signed out. You will need to log in again.'
        icon={<LogOut className='w-5 h-5 text-destructive' />}
        confirmText='Sign out everywhere'
        confirmVariant='destructive'
        isLoading={revokeAll.isPending}
        loadingText='Signing out...'
        onConfirm={confirmRevokeAll}
      />
    </Card>
  );
}
