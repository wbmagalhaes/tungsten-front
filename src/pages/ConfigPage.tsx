import { useState } from 'react';
import { Settings, Bell, Palette, Save, Sparkles } from 'lucide-react';
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

export default function ConfigPage() {
  return (
    <div className='space-y-4'>
      <PageHeader
        title='Configuration'
        icon={<Settings className='w-5 h-5' />}
      />

      <Tabs defaultValue='profile'>
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
  // TODO: Implement endpoint GET /api/config/notifications
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
  // TODO: Implement endpoint GET /api/config/appearance
  const themes = ['Cyberpunk', 'Dark', 'Light', 'Neon'];
  const [selectedTheme, setSelectedTheme] = useState('Cyberpunk');

  const handleSave = () => {
    // TODO: Implement endpoint PATCH /api/config/appearance
    console.log('Saving theme:', selectedTheme);
  };

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
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={cn(
                  'p-4 rounded-sm border-2 transition-all border-border hover:border-muted-foreground',
                  selectedTheme === theme && 'border-primary bg-primary/10',
                )}
              >
                <Sparkles
                  className={cn(
                    'w-6 h-6 mx-auto mb-2 text-muted-foreground',
                    selectedTheme === theme && 'text-primary',
                  )}
                />
                <p
                  className={cn(
                    'text-sm font-medium text-foreground',
                    selectedTheme === theme && 'text-primary font-bold',
                  )}
                >
                  {theme}
                </p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className='ml-auto'>
          <Save className='w-4 h-4' />
          Save Theme
        </Button>
      </CardFooter>
    </Card>
  );
}
