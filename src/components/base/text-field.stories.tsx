import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail } from 'lucide-react';
import { TextField } from './text-field';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  parameters: { layout: 'centered' },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
  },
  decorators: [(Story) => <div className='w-72'><Story /></div>],
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Playground: Story = {};

export const WithDescription: Story = {
  args: {
    label: 'Username',
    description: 'This is how others will see you.',
    placeholder: 'jdoe',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Email',
    icon: <Mail className='size-4' />,
    placeholder: 'you@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Please enter a valid email address.',
    value: 'not-an-email',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    disabled: true,
    value: 'locked@example.com',
  },
};
