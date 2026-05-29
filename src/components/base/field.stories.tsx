import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from './field';
import { Input } from './input';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
  decorators: [(Story) => <div className='w-80'><Story /></div>],
};

export default meta;

type Story = StoryObj<typeof Field>;

export const Playground: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor='pg-name'>Name</FieldLabel>
      <Input id='pg-name' placeholder='Jane Doe' />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor='fd-username'>Username</FieldLabel>
      <FieldDescription>This will be visible to others.</FieldDescription>
      <Input id='fd-username' placeholder='jdoe' />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor='fe-email'>Email</FieldLabel>
      <Input id='fe-email' aria-invalid defaultValue='invalid' />
      <FieldError>Please enter a valid email.</FieldError>
    </Field>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Field orientation='horizontal'>
      <FieldLabel htmlFor='hz-enabled'>Enabled</FieldLabel>
      <Input id='hz-enabled' className='w-40' placeholder='value' />
    </Field>
  ),
};

export const GroupedFieldSet: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Account details</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='gs-first'>First name</FieldLabel>
          <Input id='gs-first' placeholder='Jane' />
        </Field>
        <FieldSeparator>and</FieldSeparator>
        <Field>
          <FieldLabel htmlFor='gs-last'>Last name</FieldLabel>
          <Input id='gs-last' placeholder='Doe' />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};
