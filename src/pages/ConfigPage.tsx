import { Settings, Bell, Palette, Check, Loader2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Switch } from '@components/base/switch';
import PageHeader from '@components/PageHeader';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@components/base/tabs';
import { cn } from '@utils/cn';
import { useTheme, THEMES, THEME_META } from '@hooks/use-theme';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@hooks/notifications/use-notification-preferences';
import {
  isPushSupported,
  useEnablePushSubscription,
} from '@hooks/notifications/use-push-subscription';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import type { NotificationPreferences } from '@services/notifications.service';

export default function ConfigPage() {
  return (
    <div className='space-y-4'>
      <PageHeader
        title='Configuration'
        icon={<Settings className='w-5 h-5' />}
      />

      <Tabs defaultValue='appearance'>
        <TabsList>
          <TabsTrigger value='appearance'>
            <Palette className='w-4 h-4' />
            Appearance
          </TabsTrigger>
          <TabsTrigger value='notifications'>
            <Bell className='w-4 h-4' />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value='appearance'>
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value='notifications'>
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

type PrefKind = keyof NotificationPreferences;

const LABELS: Record<PrefKind, string> = {
  in_app: 'In-app notifications',
  email: 'Email notifications',
  push: 'Push notifications',
};

type RowState = {
  enabled: boolean;
  description: string;
  error?: string | null;
  disabledReason?: string;
  action?: React.ReactNode;
};

function extract422(err: unknown, field: string): string | null {
  if (!isAxiosError(err) || err.response?.status !== 422) return null;
  const errors = err.response.data?.errors as
    | Record<string, string[]>
    | undefined;
  return errors?.[field]?.[0] ?? null;
}

function NotificationSettings() {
  const {
    data: prefs,
    isLoading,
    isError,
    refetch,
  } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();
  const enablePush = useEnablePushSubscription();

  if (isLoading)
    return <LoadingState message='Loading notification preferences…' />;
  if (isError || !prefs)
    return (
      <ErrorState
        title='Failed to load preferences'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  const toggle = (kind: PrefKind, next: boolean) => {
    update.mutate(
      { [kind]: next },
      {
        onSuccess: () => {
          toast.success(
            `${LABELS[kind]} ${next ? 'enabled' : 'disabled'}.`,
          );
        },
        onError: (err) => {
          const fieldErr = extract422(err, kind);
          toast.error(
            fieldErr ?? `Failed to update ${LABELS[kind].toLowerCase()}.`,
          );
        },
      },
    );
  };

  const pendingKind = update.isPending
    ? (Object.keys(update.variables ?? {})[0] as PrefKind | undefined)
    : undefined;

  const emailErr = extract422(update.error, 'email');
  const pushErr = extract422(update.error, 'push');

  const rows: { kind: PrefKind; title: string; row: RowState }[] = [
    {
      kind: 'in_app',
      title: 'In-App Notifications',
      row: {
        enabled: prefs.in_app?.enabled ?? false,
        description: 'Toast notifications inside the app.',
      },
    },
    {
      kind: 'email',
      title: 'Email Notifications',
      row: {
        enabled: prefs.email?.enabled ?? false,
        description: prefs.email
          ? prefs.email.address
          : 'Will be created using the email on your profile.',
        error:
          pendingKind !== 'email' && update.error
            ? (emailErr ?? undefined)
            : undefined,
      },
    },
    {
      kind: 'push',
      title: 'Push Notifications',
      row: {
        enabled: prefs.push?.enabled ?? false,
        description: prefs.push
          ? 'Browser / device push.'
          : 'Register this device first to enable push.',
        error:
          pendingKind !== 'push' && update.error
            ? (pushErr ?? undefined)
            : undefined,
        disabledReason:
          !prefs.push && !isPushSupported()
            ? 'Push not supported in this browser.'
            : undefined,
        action:
          !prefs.push && isPushSupported() ? (
            <Button
              variant='outline'
              size='sm'
              onClick={() => enablePush.mutate()}
              disabled={enablePush.isPending}
            >
              {enablePush.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : null}
              Register device
            </Button>
          ) : undefined,
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Bell className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {rows.map(({ kind, title, row }) => {
          const isPending = pendingKind === kind;
          const buttonDisabled = !!row.disabledReason || update.isPending;
          return (
            <div
              key={kind}
              className='flex items-center justify-between gap-4 p-4 rounded-sm bg-muted/30 border border-border'
            >
              <div className='min-w-0'>
                <h4 className='font-medium text-foreground'>{title}</h4>
                <p className='text-sm text-muted-foreground truncate'>
                  {row.description}
                </p>
                {(row.error || row.disabledReason) && (
                  <p className='text-xs text-destructive mt-1'>
                    {row.error ?? row.disabledReason}
                  </p>
                )}
              </div>
              <div className='flex items-center gap-4 shrink-0'>
                {row.action}
                {isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
                ) : null}
                <Switch
                  checked={row.enabled}
                  onCheckedChange={(v) => toggle(kind, v)}
                  disabled={buttonDisabled}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Palette className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Appearance Settings</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <h4 className='text-sm font-medium text-foreground mb-3'>
            Theme Selection
          </h4>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {THEMES.map((t) => {
              const meta = THEME_META[t];
              const isActive = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    'relative p-4 rounded-sm border-2 transition-all text-left overflow-hidden',
                    isActive
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground',
                  )}
                >
                  <div
                    className='w-full h-10 rounded-sm mb-3 flex items-center justify-center gap-1.5 overflow-hidden'
                    style={{ background: meta.bg }}
                  >
                    <span
                      className='w-3 h-3 rounded-full'
                      style={{ background: meta.primary }}
                    />
                    <span
                      className='w-3 h-3 rounded-full'
                      style={{ background: meta.accent }}
                    />
                  </div>

                  <p
                    className={cn(
                      'text-sm font-medium',
                      isActive ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {meta.label}
                  </p>

                  {isActive && (
                    <span className='absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center'>
                      <Check className='w-2.5 h-2.5 text-primary-foreground' />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
