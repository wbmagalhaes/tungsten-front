import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { Button } from './button';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant='outline'>Hover me</Button>} />
      <TooltipContent>Add to library</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      <Tooltip>
        <TooltipTrigger render={<Button variant='outline'>Top</Button>} />
        <TooltipContent side='top'>Top tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant='outline'>Right</Button>} />
        <TooltipContent side='right'>Right tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant='outline'>Bottom</Button>} />
        <TooltipContent side='bottom'>Bottom tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant='outline'>Left</Button>} />
        <TooltipContent side='left'>Left tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Open: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger render={<Button>Always shown</Button>} />
      <TooltipContent>This tooltip opens by default</TooltipContent>
    </Tooltip>
  ),
};
