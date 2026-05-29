import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search, Send } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from './input-group';

const meta: Meta<typeof InputGroup> = {
  title: 'Components/InputGroup',
  component: InputGroup,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div className='w-80'><Story /></div>],
};

export default meta;

type Story = StoryObj<typeof InputGroup>;

export const Playground: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon align='inline-start'>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder='Search...' />
    </InputGroup>
  ),
};

export const WithText: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon align='inline-start'>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder='example.com' />
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder='Type a message' />
      <InputGroupAddon align='inline-end'>
        <InputGroupButton size='icon-xs'>
          <Send />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <InputGroup>
      <InputGroupTextarea placeholder='Write something...' />
      <InputGroupAddon align='block-end'>
        <InputGroupButton size='xs'>Send</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};
