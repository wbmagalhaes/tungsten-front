import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import { Toaster } from './sonner';
import { Button } from './button';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Sonner',
  component: Toaster,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div className='flex min-h-screen flex-wrap items-center justify-center gap-3 p-8'>
      <Toaster />
      <Button onClick={() => toast('Event has been created')}>Default</Button>
      <Button variant='secondary' onClick={() => toast.success('Profile saved')}>
        Success
      </Button>
      <Button variant='outline' onClick={() => toast.info('A new update is available')}>
        Info
      </Button>
      <Button variant='outline' onClick={() => toast.warning('Storage is almost full')}>
        Warning
      </Button>
      <Button variant='destructive' onClick={() => toast.error('Something went wrong')}>
        Error
      </Button>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className='flex min-h-screen flex-wrap items-center justify-center gap-3 p-8'>
      <Toaster />
      <Button
        onClick={() =>
          toast.success('Deployment complete', {
            description: 'Your changes are live at example.com.',
          })
        }
      >
        Toast with description
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className='flex min-h-screen flex-wrap items-center justify-center gap-3 p-8'>
      <Toaster />
      <Button
        onClick={() =>
          toast('File deleted', {
            description: 'document.pdf was removed.',
            action: {
              label: 'Undo',
              onClick: () => toast.success('Restored'),
            },
          })
        }
      >
        Toast with action
      </Button>
      <Button
        variant='outline'
        onClick={() => {
          const promise = new Promise((resolve) => setTimeout(resolve, 2000));
          toast.promise(promise, {
            loading: 'Uploading...',
            success: 'Upload finished',
            error: 'Upload failed',
          });
        }}
      >
        Promise toast
      </Button>
    </div>
  ),
};
