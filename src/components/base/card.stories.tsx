import type { Meta, StoryObj } from '@storybook/react-vite';
import { Database, Settings } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className='w-96'>
      <CardHeader>
        <CardIcon>
          <Database className='size-5' />
        </CardIcon>
        <div className='flex flex-col'>
          <CardTitle>Primary Cluster</CardTitle>
          <CardDescription>us-east-1 / production</CardDescription>
        </div>
        <CardAction>
          <Button variant='ghost' size='icon-sm'>
            <Settings className='size-4' />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        Replication is healthy across all three nodes. Last snapshot completed
        2 minutes ago with no detected anomalies.
      </CardContent>
      <CardFooter>
        <Button variant='outline' size='sm'>
          Details
        </Button>
        <Button variant='default' size='sm'>
          Connect
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <Card {...args} className='w-80'>
      <CardHeader>
        <CardIcon>
          <Database className='size-4' />
        </CardIcon>
        <CardTitle>Cache Node</CardTitle>
      </CardHeader>
      <CardContent>Compact card variant with a tighter footprint.</CardContent>
      <CardFooter>
        <Button variant='ghost' size='sm'>
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args} className='w-80'>
      <CardContent>
        A minimal card containing only body content with no header or footer.
      </CardContent>
    </Card>
  ),
};
