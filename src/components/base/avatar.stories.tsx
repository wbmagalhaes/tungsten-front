import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  AvatarPlaceholder,
} from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    loading: { control: 'boolean' },
  },
  args: {
    size: 'default',
    loading: false,
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

const SRC = 'https://i.pravatar.cc/150?img=12';

export const Playground: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={SRC} alt='Ada Lovelace' />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src='https://invalid.example/missing.png' alt='Grace Hopper' />
      <AvatarFallback>GH</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Avatar size='sm'>
        <AvatarImage src={SRC} alt='Ada Lovelace' />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar size='default'>
        <AvatarImage src={SRC} alt='Ada Lovelace' />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar size='lg'>
        <AvatarImage src={SRC} alt='Ada Lovelace' />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src={SRC} alt='Ada Lovelace' />
      <AvatarFallback>AL</AvatarFallback>
      <AvatarBadge className='bg-success' />
    </Avatar>
  ),
};

export const Loading: Story = {
  render: () => <Avatar loading />,
};

export const Placeholder: Story = {
  render: () => <AvatarPlaceholder />,
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src='https://i.pravatar.cc/150?img=1' alt='User 1' />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src='https://i.pravatar.cc/150?img=2' alt='User 2' />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src='https://i.pravatar.cc/150?img=3' alt='User 3' />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  ),
};
