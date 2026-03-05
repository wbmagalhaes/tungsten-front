import {
  StickyNote,
  BotMessageSquare,
  ImagePlus,
  FlaskConical,
} from 'lucide-react';
import CloudflareIcon from '@components/Icons/CloudflareIcon';
import NginxIcon from '@components/Icons/NginxIcon';
import ReactIcon from '@components/Icons/ReactIcon';
import RustIcon from '@components/Icons/RustIcon';
import TypeScriptIcon from '@components/Icons/TypeScriptIcon';
import SQLiteIcon from '@components/Icons/SQLiteIcon';
import TailwindIcon from '@components/Icons/TailwindIcon';
import ViteIcon from '@components/Icons/ViteIcon';
import { Button, ButtonLink } from '@components/base/button';
import { useAuthStore } from '@stores/useAuthStore';
import { useGetProfile } from '@hooks/profile/use-get-profile';
import { usePwaInstall } from '@hooks/use-pwa-install';
import { usePwaUpdate } from '@hooks/use-pwa-update';
import { MainHeader } from './MainHeader';
import { FeatureCard } from './FeatureCard';
import { StackCard } from './StackCard';
import { LoadingShuffle } from '@components/LoadingShuffle';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const { data: user, isLoading } = useGetProfile();
  const { canInstall, install } = usePwaInstall();
  const { updateAvailable, update } = usePwaUpdate();

  return (
    <div className='relative flex flex-col items-center justify-center'>
      <div className='text-sm font-black-ops text-foreground text-shadow-sm text-shadow-ring/50 pointer-events-none'>
        <span className='absolute top-6 left-7'>
          <span className='glitch' data-text='74'>
            74
          </span>
        </span>

        <span className='absolute top-6 right-7'>
          <span className='glitch' data-text='183.84u'>
            183.84u
          </span>
        </span>
      </div>

      <div className='text-sm font-vt tracking-wide text-foreground/60 text-shadow-xs text-shadow-ring pointer-events-none'>
        <span className='absolute top-6 left-14'>
          <span className='glitch'>
            [Xe] 4f<sup>14</sup> 5d<sup>4</sup> 6s<sup>2</sup>
          </span>
        </span>
      </div>

      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center justify-center pt-18 md:pt-32 px-4 md:px-0'>
          {isAuthenticated && (
            <div className='font-mono-tech font-semibold uppercase tracking-widest text-xs sm:text-sm text-ring border border-ring/30 px-3 sm:px-4 py-0.5 rounded-sm bg-ring/5 max-w-full w-auto text-center'>
              <span className='hidden sm:inline tracking-widest'>--- </span>
              <span>Welcome back, </span>
              <LoadingShuffle
                isLoading={isLoading}
                target={`${user?.fullname || user?.username || 'username'}`}
                speed={15}
              />
              <span className='hidden sm:inline tracking-widest'> ---</span>
            </div>
          )}

          {isAuthenticated && (
            <span className='font-raj text-xs tracking-widest uppercase text-muted-foreground mb-4 mt-2 text-center'>
              Want to login with another account?{' '}
              <ButtonLink
                variant='glitch'
                className='text-xs tracking-widest uppercase p-0 h-auto'
                to='/login'
              >
                Click here
              </ButtonLink>
            </span>
          )}
        </div>

        <div className='grid place-items-center w-screen'>
          <MainHeader />
        </div>

        <div className='w-full max-w-4xl mx-auto flex flex-col items-center px-4 md:px-0'>
          <div className='flex flex-col gap-2 mt-12 text-xs font-mono-tech uppercase tracking-[0.35em] text-ring/65 select-none mb-8'>
            <div className='glitch' data-text='> personal self-hosted server'>
              &gt; personal self-hosted server
            </div>

            <div className='glitch' data-text='> system online'>
              &gt; system online
            </div>

            <div className='glitch' data-text='>'>
              &gt; <span className='cursor font-bold'>_</span>
            </div>
          </div>

          <div className='grid grid-cols-4 max-sm:grid-cols-2 gap-3 w-full'>
            <StackCard
              icon={<RustIcon />}
              title='Rust'
              description='Backend'
              color='orange'
            />
            <StackCard
              icon={<SQLiteIcon />}
              title='SQLite'
              description='Database'
              color='yellow'
            />
            <StackCard
              icon={<NginxIcon />}
              title='Nginx'
              description='Proxy'
              color='green'
            />
            <StackCard
              icon={<CloudflareIcon />}
              title='Cloudflare'
              description='Tunnel'
              color='purple'
            />
            <StackCard
              icon={<TypeScriptIcon />}
              title='TypeScript'
              description='Frontend'
              color='cyan'
            />
            <StackCard
              icon={<ReactIcon />}
              title='React'
              description='UI'
              color='blue'
            />
            <StackCard
              icon={<ViteIcon />}
              title='Vite'
              description='Build'
              color='violet'
            />
            <StackCard
              icon={<TailwindIcon />}
              title='Tailwind'
              description='Styles'
              color='fuchsia'
            />
          </div>

          <div className='tg-divider' />

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md'>
            {isAuthenticated ? (
              <>
                <ButtonLink to='/root' size='lg' className='w-full sm:w-48'>
                  Access Console
                </ButtonLink>
                <ButtonLink
                  to='/system-health'
                  variant='outline'
                  size='lg'
                  className='w-full sm:w-48'
                >
                  View System Status
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink to='/login' size='lg' className='w-full sm:w-48'>
                  Login
                </ButtonLink>
                <span className='text-muted-foreground'>or</span>
                <ButtonLink
                  variant='secondary'
                  to='/register'
                  size='lg'
                  className='w-full sm:w-48'
                >
                  Register
                </ButtonLink>
              </>
            )}
          </div>

          {isAuthenticated && (
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              {canInstall && (
                <Button
                  onClick={install}
                  variant='secondary'
                  className='bg-success hover:bg-success/80 text-success-foreground'
                >
                  Install App
                </Button>
              )}
            </div>
          )}

          <div className='tg-divider' />

          <div className='grid grid-cols-2 max-sm:grid-cols-1 gap-3 w-full'>
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

      {updateAvailable && (
        <div
          className='fixed bottom-4 right-4 bg-success text-success-foreground px-4 py-2 rounded shadow-lg cursor-pointer z-50'
          onClick={update}
        >
          New version available - Click to update
        </div>
      )}
    </div>
  );
}
