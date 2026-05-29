import type { Meta, StoryObj } from '@storybook/react-vite';
import { Lock } from 'lucide-react';
import { PasswordField } from './password-field';

const meta: Meta<typeof PasswordField> = {
  title: 'Components/PasswordField',
  component: PasswordField,
  parameters: { layout: 'centered' },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
  decorators: [(Story) => <div className='w-72'><Story /></div>],
};

export default meta;

type Story = StoryObj<typeof PasswordField>;

export const Playground: Story = {};

export const WithDescription: Story = {
  args: {
    label: 'Password',
    description: 'Must be at least 8 characters.',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Password',
    icon: <Lock className='size-4' />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    error: 'Password is too weak.',
    value: '1234',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Password',
    disabled: true,
    value: 'secret',
  },
};
