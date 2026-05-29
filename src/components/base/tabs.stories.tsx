import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Bell, Palette, ShieldCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue='appearance' className='w-96'>
      <TabsList>
        <TabsTrigger value='appearance'>
          <Palette />
          Appearance
        </TabsTrigger>
        <TabsTrigger value='notifications'>
          <Bell />
          Notifications
        </TabsTrigger>
        <TabsTrigger value='security'>
          <ShieldCheck />
          Security
        </TabsTrigger>
      </TabsList>
      <TabsContent value='appearance'>
        Adjust the theme, accent color, and density of the interface.
      </TabsContent>
      <TabsContent value='notifications'>
        Choose which events trigger email and in-app notifications.
      </TabsContent>
      <TabsContent value='security'>
        Manage two-factor authentication and active sessions.
      </TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue='overview' className='w-96'>
      <TabsList variant='line'>
        <TabsTrigger value='overview'>Overview</TabsTrigger>
        <TabsTrigger value='activity'>Activity</TabsTrigger>
        <TabsTrigger value='settings'>Settings</TabsTrigger>
      </TabsList>
      <TabsContent value='overview'>Summary of recent activity.</TabsContent>
      <TabsContent value='activity'>A detailed event log.</TabsContent>
      <TabsContent value='settings'>Configuration options.</TabsContent>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('first');
    return (
      <div className='flex flex-col gap-3'>
        <Tabs value={value} onValueChange={(v) => setValue(v as string)} className='w-96'>
          <TabsList>
            <TabsTrigger value='first'>First</TabsTrigger>
            <TabsTrigger value='second'>Second</TabsTrigger>
          </TabsList>
          <TabsContent value='first'>First panel content.</TabsContent>
          <TabsContent value='second'>Second panel content.</TabsContent>
        </Tabs>
        <p className='text-sm text-muted-fg'>Active tab: {value}</p>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue='general' orientation='vertical' className='w-[28rem]'>
      <TabsList>
        <TabsTrigger value='general'>General</TabsTrigger>
        <TabsTrigger value='billing'>Billing</TabsTrigger>
        <TabsTrigger value='team'>Team</TabsTrigger>
      </TabsList>
      <TabsContent value='general'>General workspace settings.</TabsContent>
      <TabsContent value='billing'>Plan and invoice management.</TabsContent>
      <TabsContent value='team'>Invite and manage members.</TabsContent>
    </Tabs>
  ),
};
