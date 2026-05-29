import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './button-group';
import { Button } from './button';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Playground: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant='outline'>One</Button>
      <Button variant='outline'>Two</Button>
      <Button variant='outline'>Three</Button>
    </ButtonGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ButtonGroup orientation='horizontal'>
      <Button variant='outline'>Left</Button>
      <Button variant='outline'>Center</Button>
      <Button variant='outline'>Right</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation='vertical'>
      <Button variant='outline'>Top</Button>
      <Button variant='outline'>Middle</Button>
      <Button variant='outline'>Bottom</Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant='outline'>Cut</Button>
      <ButtonGroupSeparator />
      <Button variant='outline'>Copy</Button>
      <ButtonGroupSeparator />
      <Button variant='outline'>Paste</Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Button variant='outline'>example.com</Button>
    </ButtonGroup>
  ),
};
