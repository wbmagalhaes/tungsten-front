import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';
import { Button } from './button';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Playground: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button>Open Popover</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      <Popover>
        <PopoverTrigger render={<Button variant='outline'>Top</Button>} />
        <PopoverContent side='top'>
          <PopoverTitle>Top side</PopoverTitle>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant='outline'>Right</Button>} />
        <PopoverContent side='right'>
          <PopoverTitle>Right side</PopoverTitle>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant='outline'>Bottom</Button>} />
        <PopoverContent side='bottom'>
          <PopoverTitle>Bottom side</PopoverTitle>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant='outline'>Left</Button>} />
        <PopoverContent side='left'>
          <PopoverTitle>Left side</PopoverTitle>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant='secondary'>Toggle</Button>} />
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Controlled popover</PopoverTitle>
            <PopoverDescription>
              The open state is managed by parent component state.
            </PopoverDescription>
          </PopoverHeader>
          <Button size='sm' variant='outline' onClick={() => setOpen(false)}>
            Close
          </Button>
        </PopoverContent>
      </Popover>
    );
  },
};
