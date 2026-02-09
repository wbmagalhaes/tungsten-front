import { useGetProfile } from '@hooks/profile/use-get-profile';
import { useAuthStore } from '@stores/useAuthStore';
import {
  StickyNote,
  BotMessageSquare,
  ImagePlus,
  FlaskConical,
} from 'lucide-react';
import { usePwaInstall } from '@hooks/use-pwa-install';
import { cn } from '@utils/cn';
import { usePwaUpdate } from '@hooks/use-pwa-update';
import { Button, ButtonLink } from '@components/base/button';
import { Card, CardContent } from '@components/base/card';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const { data: user, isLoading } = useGetProfile();

  const { canInstall, install, needsInstructions } = usePwaInstall();
  const { updateAvailable, update } = usePwaUpdate();

  return (
    <div className='container mx-auto px-4 pt-8 md:pt-16'>
      <div className='max-w-4xl mx-auto text-center'>
        <div className='flex flex-col items-center gap-2 mb-12'>
          {isAuthenticated && (
            <div className='px-6 py-3 bg-green-900/50 border border-green-700 text-green-300 rounded-full min-w-[200px] flex justify-center items-center gap-2'>
              {isLoading ? (
                <>
                  <div className='my-1 h-4 w-4 border-2 border-t-green-300 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin' />
                </>
              ) : (
                <>Welcome back, {user?.fullname || user?.username || 'User'}!</>
              )}
            </div>
          )}

          {isAuthenticated && (
            <span className='text-sm text-gray-400'>
              Want to login with another account?{' '}
              <ButtonLink variant='link' className='p-0' to='/login'>
                Click here
              </ButtonLink>
            </span>
          )}
        </div>

        {!isLoading && isAuthenticated && updateAvailable && (
          <div
            className='fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded shadow-lg cursor-pointer'
            onClick={update}
          >
            New version available - Click to update
          </div>
        )}

        <h1 className='text-5xl md:text-6xl font-bold text-white mb-4'>
          Tungsten
        </h1>
        <p className='text-xl text-gray-300 mb-10 max-w-2xl mx-auto'>
          Personal self-hosted server running useful tools.
        </p>
        <div className='max-w-3xl mx-auto mb-12'>
          <Card>
            <CardContent className='p-6'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
                <StackItem
                  icon={<ReactIcon />}
                  name='React'
                  label='Frontend'
                  color='blue'
                />
                <StackItem
                  icon={<NginxIcon />}
                  name='Nginx'
                  label='Proxy'
                  color='green'
                />
                <StackItem
                  icon={<RustIcon />}
                  name='Rust'
                  label='Backend'
                  color='orange'
                />
                <StackItem
                  icon={<CloudflareIcon />}
                  name='Cloudflare'
                  label='Tunnel'
                  color='purple'
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          {isAuthenticated ? (
            <>
              <ButtonLink to='/root' size='lg'>
                Access Dashboard
              </ButtonLink>
              <ButtonLink to='/system-health' variant='outline' size='lg'>
                View System Status
              </ButtonLink>
            </>
          ) : (
            <ButtonLink to='/login' size='lg'>
              Login
            </ButtonLink>
          )}
        </div>

        {isAuthenticated && (
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-6'>
            {canInstall && (
              <Button
                onClick={install}
                variant='secondary'
                className='bg-emerald-600 hover:bg-emerald-500'
              >
                Install App
              </Button>
            )}

            {needsInstructions && (
              <div className='text-sm text-gray-400 text-center'>
                iOS: Share → Add to Home Screen
                <br />
                Firefox: Browser menu → Add to Home Screen
              </div>
            )}
          </div>
        )}
      </div>

      <div className='mt-16 max-w-4xl mx-auto'>
        <div className='grid md:grid-cols-2 gap-6'>
          <FeatureCard
            icon={<StickyNote className='w-6 h-6' />}
            title='Notes'
            description='Note-taking with markdown support.'
            color='yellow'
          />
          <FeatureCard
            icon={<BotMessageSquare className='w-6 h-6' />}
            title='ChatBot'
            description='Interface for language models.'
            color='violet'
          />
          <FeatureCard
            icon={<ImagePlus className='w-6 h-6' />}
            title='Image Generation'
            description='AI-powered image generation.'
            color='fuchsia'
          />
          <FeatureCard
            icon={<FlaskConical className='w-6 h-6' />}
            title='Sandbox'
            description='Testing and experimentation environment.'
            color='cyan'
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    yellow: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    violet: 'bg-violet-900/30 text-violet-400 border-violet-800',
    fuchsia: 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-800',
    cyan: 'bg-cyan-900/30 text-cyan-400 border-cyan-800',
  };

  return (
    <Card>
      <CardContent>
        <div className='flex items-start gap-4'>
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border ${colorClasses[color as keyof typeof colorClasses]}`}
          >
            {icon}
          </div>
          <div>
            <h3 className='font-semibold text-white mb-1'>{title}</h3>
            <p className='text-gray-400 text-sm'>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StackItemProps {
  icon?: React.ReactNode;
  name: string;
  label: string;
  color: 'orange' | 'green' | 'blue' | 'purple';
}

function StackItem({ icon, name, label, color }: StackItemProps) {
  const colorClasses = {
    orange: 'text-orange-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
  };

  return (
    <div>
      <div className={cn('flex justify-center mb-2', colorClasses[color])}>
        {icon}
      </div>
      <div className={cn('font-mono font-bold text-lg', colorClasses[color])}>
        {name}
      </div>
      <div className='text-sm text-gray-400'>{label}</div>
    </div>
  );
}

function ReactIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 32 32'
    >
      <path
        fill='currentColor'
        d='M16 12c7.444 0 12 2.59 12 4s-4.556 4-12 4s-12-2.59-12-4s4.556-4 12-4m0-2c-7.732 0-14 2.686-14 6s6.268 6 14 6s14-2.686 14-6s-6.268-6-14-6'
      />
      <path fill='currentColor' d='M16 14a2 2 0 1 0 2 2a2 2 0 0 0-2-2' />
      <path
        fill='currentColor'
        d='M10.458 5.507c2.017 0 5.937 3.177 9.006 8.493c3.722 6.447 3.757 11.687 2.536 12.392a.9.9 0 0 1-.457.1c-2.017 0-5.938-3.176-9.007-8.492C8.814 11.553 8.779 6.313 10 5.608a.9.9 0 0 1 .458-.1m-.001-2A2.87 2.87 0 0 0 9 3.875C6.13 5.532 6.938 12.304 10.804 19c3.284 5.69 7.72 9.493 10.74 9.493A2.87 2.87 0 0 0 23 28.124c2.87-1.656 2.062-8.428-1.804-15.124c-3.284-5.69-7.72-9.493-10.74-9.493Z'
      />
      <path
        fill='currentColor'
        d='M21.543 5.507a.9.9 0 0 1 .457.1c1.221.706 1.186 5.946-2.536 12.393c-3.07 5.316-6.99 8.493-9.007 8.493a.9.9 0 0 1-.457-.1C8.779 25.686 8.814 20.446 12.536 14c3.07-5.316 6.99-8.493 9.007-8.493m0-2c-3.02 0-7.455 3.804-10.74 9.493C6.939 19.696 6.13 26.468 9 28.124a2.87 2.87 0 0 0 1.457.369c3.02 0 7.455-3.804 10.74-9.493C25.061 12.304 25.87 5.532 23 3.876a2.87 2.87 0 0 0-1.457-.369'
      />
    </svg>
  );
}

function NginxIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 32 32'
    >
      <path
        fill='currentColor'
        d='M16 0L2 8v16l14 8l14-8V8Zm8 23a1 1 0 0 1-1 1h-2.52a1 1 0 0 1-.78-.375L12 14v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2.52a1 1 0 0 1 .78.375L20 18V9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1Z'
      />
    </svg>
  );
}

function RustIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 32 32'
    >
      <path
        fill='currentColor'
        d='m30 12l-4-2V6h-4l-2-4l-4 2l-4-2l-2 4H6v4l-4 2l2 4l-2 4l4 2v4h4l2 4l4-2l4 2l2-4h4v-4l4-2l-2-4ZM6 16a9.9 9.9 0 0 1 .842-4H10v8H6.842A9.9 9.9 0 0 1 6 16m10 10a9.98 9.98 0 0 1-7.978-4H16v-2h-2v-2h4c.819.819.297 2.308 1.179 3.37a1.89 1.89 0 0 0 1.46.63h3.34A9.98 9.98 0 0 1 16 26m-2-12v-2h4a1 1 0 0 1 0 2Zm11.158 6H24a2.006 2.006 0 0 1-2-2a2 2 0 0 0-2-2a3 3 0 0 0 3-3q0-.08-.004-.161A3.115 3.115 0 0 0 19.83 10H8.022a9.986 9.986 0 0 1 17.136 10'
      />
    </svg>
  );
}

function CloudflareIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      viewBox='0 0 128 128'
    >
      <path
        fill='currentColor'
        d='M87.295 89.022c.763-2.617.472-5.015-.8-6.796c-1.163-1.635-3.125-2.58-5.488-2.689l-44.737-.581c-.291 0-.545-.145-.691-.363s-.182-.509-.109-.8c.145-.436.581-.763 1.054-.8l45.137-.581c5.342-.254 11.157-4.579 13.192-9.885l2.58-6.723c.109-.291.145-.581.073-.872c-2.906-13.158-14.644-22.97-28.672-22.97c-12.938 0-23.913 8.359-27.838 19.952a13.35 13.35 0 0 0-9.267-2.58c-6.215.618-11.193 5.597-11.811 11.811c-.145 1.599-.036 3.162.327 4.615C10.104 70.051 2 78.337 2 88.549c0 .909.073 1.817.182 2.726a.895.895 0 0 0 .872.763h82.57c.472 0 .909-.327 1.054-.8zm14.247-28.747c-.4 0-.836 0-1.236.036c-.291 0-.545.218-.654.509l-1.744 6.069c-.763 2.617-.472 5.015.8 6.796c1.163 1.635 3.125 2.58 5.488 2.689l9.522.581c.291 0 .545.145.691.363s.182.545.109.8c-.145.436-.581.763-1.054.8l-9.924.582c-5.379.254-11.157 4.579-13.192 9.885l-.727 1.853c-.145.363.109.727.509.727h34.089c.4 0 .763-.254.872-.654c.581-2.108.909-4.325.909-6.614c0-13.447-10.975-24.422-24.458-24.422'
      />
    </svg>
  );
}
