import { useState } from 'react';
import { Settings, Bell, Palette, Save, Check } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
} from '@components/base/card';
import { Button } from '@components/base/button';
import PageHeader from '@components/PageHeader';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@components/base/tabs';
import { cn } from '@utils/cn';
import { useTheme, THEMES, type Theme } from '@hooks/use-theme';

const THEME_META: Record<
  Theme,
  { label: string; bg: string; primary: string; accent: string }
> = {
  cyberpunk: {
    label: 'Cyberpunk',
    bg: '#0b0f1a',
    primary: '#9131be',
    accent: '#ff2bd6',
  },
  dark: {
    label: 'Dark',
    bg: '#09090b',
    primary: '#6d28d9',
    accent: '#7c3aed',
  },
  light: {
    label: 'Light',
    bg: '#ffffff',
    primary: '#7c3aed',
    accent: '#a855f7',
  },
  neon: {
    label: 'Neon',
    bg: '#000000',
    primary: '#00ffcc',
    accent: '#ff00ff',
  },
};

export default function ConfigPage() {
  return (
    <div className='space-y-4'>
      <PageHeader
        title='Configuration'
        icon={<Settings className='w-5 h-5' />}
      />

      <Tabs defaultValue='appearance'>
        <TabsList>
          <TabsTrigger value='notifications'>
            <Bell className='w-4 h-4' />
            Notifications
          </TabsTrigger>
          <TabsTrigger value='appearance'>
            <Palette className='w-4 h-4' />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value='notifications'>
          <NotificationSettings />
        </TabsContent>

        <TabsContent value='appearance'>
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationSettings() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  const handleSave = () => {
    // TODO: Implement endpoint PATCH /api/config/notifications
    console.log('Saving notifications:', { emailNotifs, pushNotifs });
  };

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Bell className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between p-4 rounded-sm bg-muted/30 border border-border'>
          <div>
            <h4 className='font-medium text-foreground'>Email Notifications</h4>
            <p className='text-sm text-muted-foreground'>
              Receive updates via email
            </p>
          </div>
          <Button
            className='min-w-20'
            variant={emailNotifs ? 'default' : 'outline'}
            size='sm'
            onClick={() => setEmailNotifs(!emailNotifs)}
          >
            {emailNotifs ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <div className='flex items-center justify-between p-4 rounded-sm bg-muted/30 border border-border'>
          <div>
            <h4 className='font-medium text-foreground'>Push Notifications</h4>
            <p className='text-sm text-muted-foreground'>
              Browser push notifications
            </p>
          </div>
          <Button
            className='min-w-20'
            variant={pushNotifs ? 'default' : 'outline'}
            size='sm'
            onClick={() => setPushNotifs(!pushNotifs)}
          >
            {pushNotifs ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className='ml-auto'>
          <Save className='w-4 h-4' />
          Save Changes
        </Button>
      </CardFooter>
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
