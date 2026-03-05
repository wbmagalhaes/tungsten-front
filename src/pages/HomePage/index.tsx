import { useState, useEffect, useRef } from 'react';
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
import { Button, ButtonLink } from '@components/base/button';
import { useAuthStore } from '@stores/useAuthStore';
import { useGetProfile } from '@hooks/profile/use-get-profile';
import { usePwaInstall } from '@hooks/use-pwa-install';
import { usePwaUpdate } from '@hooks/use-pwa-update';
import { FeatureCard } from './FeatureCard';
import { StackCard } from './StackCard';
import { LoadingShuffle } from '@components/LoadingShuffle';

const GLITCH_CHARS =
  '!@#$%^&*<>[]{}|\\/?~`АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const ORIGINAL = 'TUNGSTEN';

const FONTS: { name: string; family: string; note: string }[] = [
  { name: 'Orbitron', family: 'var(--font-cyber)', note: 'Geométrico, sci-fi' },
  {
    name: 'Share Tech Mono',
    family: 'var(--font-mono-tech)',
    note: 'Terminal monospaced',
  },
  {
    name: 'Russo One',
    family: 'var(--font-russo)',
    note: 'Militar/industrial',
  },
  {
    name: 'Black Ops One',
    family: 'var(--font-black-ops)',
    note: 'Bold tático, punk',
  },
  { name: 'VT323', family: 'var(--font-vt)', note: 'CRT retro puro' },
  {
    name: 'Chakra Petch',
    family: 'var(--font-chakra)',
    note: 'Tech asiático, clean',
  },
  { name: 'Rajdhani', family: 'var(--font-raj)', note: 'Condensado, punk' },
  { name: 'Nova Mono', family: 'var(--font-nova)', note: 'Mono com caráter' },
];

function useGlitchText(original: string, active: boolean): string {
  const [display, setDisplay] = useState(original);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!active) {
      setDisplay(original);
      return;
    }
    let frame = 0;
    intervalRef.current = setInterval(() => {
      frame++;
      setDisplay(
        original
          .split('')
          .map((char, i) => {
            const noise = Math.sin(frame * 0.3 + i * 1.7) * 0.5 + 0.5;
            return noise > 0.78
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : char;
          })
          .join(''),
      );
    }, 60);
    return () => clearInterval(intervalRef.current);
  }, [active, original]);

  return display;
}

export default function HomePage() {
  const [glitching, setGlitching] = useState(false);
  const [chromaOffset, setChromaOffset] = useState({ x: 0, y: 0 });
  const [activeFontIndex, setActiveFontIndex] = useState(0);
  const display = useGlitchText(ORIGINAL, glitching);
  const activeFont = FONTS[activeFontIndex];

  const { isAuthenticated } = useAuthStore();
  const { data: user, isLoading } = useGetProfile();
  const { canInstall, install } = usePwaInstall();
  const { updateAvailable, update } = usePwaUpdate();

  const randomOtherFont = (current: number) => {
    let next = current;
    while (next === current) next = Math.floor(Math.random() * FONTS.length);
    return next;
  };

  const triggerGlitch = (switchFont: boolean) => {
    const duration = 200 + Math.random() * 400;
    setGlitching(true);
    if (switchFont) {
      setTimeout(
        () => setActiveFontIndex((cur) => randomOtherFont(cur)),
        duration * 0.4,
      );
    }
    const frames = Math.floor(duration / 30);
    let f = 0;
    const iv = setInterval(() => {
      f++;
      setChromaOffset({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 3,
      });
      if (f >= frames) {
        clearInterval(iv);
        setChromaOffset({ x: 0, y: 0 });
        setGlitching(false);
      }
    }, 30);
  };

  useEffect(() => {
    setTimeout(() => triggerGlitch(false), 600);
    const schedule = () => {
      const next = 1500 + Math.random() * 3000;
      return setTimeout(() => {
        triggerGlitch(true);
        scheduleRef.current = schedule();
      }, next);
    };
    const scheduleRef: { current: ReturnType<typeof setTimeout> } = {
      current: schedule(),
    };
    return () => clearTimeout(scheduleRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textShadowBase = `0 0 20px color-mix(in srgb, var(--color-ring) 80%, transparent), 0 0 40px color-mix(in srgb, var(--color-ring) 40%, transparent), 0 0 80px color-mix(in srgb, var(--color-ring) 20%, transparent)`;
  const textShadowGlitch = `0 0 30px var(--color-ring), 0 0 60px color-mix(in srgb, var(--color-ring) 60%, transparent), 0 0 100px color-mix(in srgb, var(--color-ring) 30%, transparent)`;

  return (
    <div className='flex flex-col items-center justify-center mt-8'>
      {isAuthenticated && (
        <div className='font-mono-tech font-semibold uppercase tracking-widest text-sm text-ring border border-ring/30 px-4 py-1 rounded-sm bg-ring/5'>
          <LoadingShuffle
            isLoading={isLoading}
            target={`--- Welcome back, ${user?.fullname || user?.username || 'User'}! ---`}
            speed={15}
          />
        </div>
      )}

      {isAuthenticated && (
        <span className='font-raj text-xs tracking-widest uppercase text-muted-foreground mb-8'>
          Want to login with another account?{' '}
          <ButtonLink
            variant='glitch'
            className='text-xs tracking-widest uppercase p-0'
            to='/login'
          >
            Click here
          </ButtonLink>
        </span>
      )}

      <div className='relative inline-block cursor-default z-10 select-none'>
        <div
          className='tg-title-layer tg-title-red'
          aria-hidden='true'
          style={{
            fontFamily: activeFont.family,
            transform: `translate(${-3 + chromaOffset.x * 0.6}px, ${+2 + chromaOffset.y * 0.3}px)`,
            mixBlendMode: 'screen',
          }}
        >
          {display}
        </div>
        <div
          className='tg-title-layer tg-title-blue'
          aria-hidden='true'
          style={{
            fontFamily: activeFont.family,
            transform: `translate(${3 - chromaOffset.x * 0.6}px, ${-2 - chromaOffset.y * 0.3}px)`,
            mixBlendMode: 'screen',
          }}
        >
          {display}
        </div>
        <div
          className='tg-title-layer tg-title-slice-1'
          aria-hidden='true'
          style={{ fontFamily: activeFont.family }}
        >
          {display}
        </div>
        <div
          className='tg-title-layer tg-title-slice-2'
          aria-hidden='true'
          style={{ fontFamily: activeFont.family }}
        >
          {display}
        </div>
        <div
          className='tg-title-layer tg-title-desync'
          aria-hidden='true'
          style={{ fontFamily: activeFont.family }}
        >
          {display}
        </div>
        <div
          className='tg-title-main'
          data-text={display}
          style={{
            fontFamily: activeFont.family,
            transform: `translate(${chromaOffset.x * 0.1}px, ${chromaOffset.y * 0.1}px)`,
            textShadow: glitching ? textShadowGlitch : textShadowBase,
          }}
        >
          {display}
        </div>
      </div>

      <div className='w-full max-w-4xl mx-auto flex flex-col items-center'>
        <div className='flex flex-col gap-2 mt-12 text-xs font-mono-tech uppercase tracking-[0.35em] text-ring/65 select-none'>
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

        <div className='tg-divider' />

        <div className='grid grid-cols-4 max-sm:grid-cols-2 gap-3 w-full'>
          <StackCard
            icon={<ReactIcon />}
            name='React'
            label='Frontend'
            color='blue'
          />
          <StackCard
            icon={<NginxIcon />}
            name='Nginx'
            label='Proxy'
            color='green'
          />
          <StackCard
            icon={<RustIcon />}
            name='Rust'
            label='Backend'
            color='orange'
          />
          <StackCard
            icon={<CloudflareIcon />}
            name='Cloudflare'
            label='Tunnel'
            color='purple'
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
