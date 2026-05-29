import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Button } from './button';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Sheet>;

export const Playground: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button>Open Sheet</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit settings</SheetTitle>
          <SheetDescription>
            Adjust your preferences. Changes are saved when you close the sheet.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button>Save</Button>} />
          <SheetClose render={<Button variant='outline'>Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant='outline'>Open left</Button>} />
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>This sheet slides in from the left.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant='outline'>Open top</Button>} />
      <SheetContent side='top'>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>This sheet slides in from the top.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant='outline'>Open bottom</Button>} />
      <SheetContent side='bottom'>
        <SheetHeader>
          <SheetTitle>Quick actions</SheetTitle>
          <SheetDescription>
            This sheet slides in from the bottom.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className='flex items-center gap-3'>
        <Button variant='secondary' onClick={() => setOpen(true)}>
          Open externally
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Controlled sheet</SheetTitle>
              <SheetDescription>
                The open state is managed by parent component state.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button variant='outline' onClick={() => setOpen(false)}>
                Close
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  },
};
