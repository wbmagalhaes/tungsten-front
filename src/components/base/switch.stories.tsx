import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    size: 'default',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <Switch {...args} checked={checked} onCheckedChange={setChecked} />;
  },
};

export const Sizes: Story = {
  render: () => {
    const [sm, setSm] = useState(true);
    const [def, setDef] = useState(true);
    return (
      <div className='flex items-center gap-4'>
        <Switch size='sm' checked={sm} onCheckedChange={setSm} />
        <Switch size='default' checked={def} onCheckedChange={setDef} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Switch disabled checked={false} />
      <Switch disabled checked={true} />
    </div>
  ),
};
