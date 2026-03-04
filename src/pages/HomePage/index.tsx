import '@styles/hero.css';
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
import { RainColumn, type RainColumnProps } from './RainColumn';
import { FeatureCard } from './FeatureCard';

const ORIGINAL = 'TUNGSTEN';

const GLITCH_CHARS =
  '!@#$%^&*<>[]{}|\\/?~`АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789';

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

type AccentColor =
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'yellow'
  | 'violet'
  | 'fuchsia'
  | 'cyan';

function StackCard({
  icon,
  name,
  label,
  color,
}: {
  icon: React.ReactNode;
  name: string;
  label: string;
  color: AccentColor;
}) {
  return (
    <div
      className={`tg-card tg-stack-card tg-accent-${color} relative border border-white/6 rounded-md bg-white/2 overflow-hidden transition-[border-color,box-shadow] duration-200 p-5 flex flex-col items-center text-center gap-2 cursor-default`}
    >
      <div className='tg-card-icon transition-transform duration-100'>
        {icon}
      </div>
      <div className='font-mono-tech font-bold text-[15px] tracking-[0.05em] transition-[text-shadow] duration-150'>
        {name}
      </div>
      <div className='tg-card-label font-mono-tech text-[10px] tracking-widest uppercase text-white/30 transition-colors duration-150'>
        {label}
      </div>
    </div>
  );
}

interface BlockGlitchItem {
  id: number;
  top: number;
  height: number;
  offset: number;
  opacity: number;
}

export default function HomePage() {
  const [glitching, setGlitching] = useState(false);
  const [scanlinePos, setScanlinePos] = useState(-10);
  const [chromaOffset, setChromaOffset] = useState({ x: 0, y: 0 });
  const [blockGlitch, setBlockGlitch] = useState<BlockGlitchItem[]>([]);
  const [activeFontIndex, setActiveFontIndex] = useState(0);
  const display = useGlitchText(ORIGINAL, glitching);
  const activeFont = FONTS[activeFontIndex];

  const { isAuthenticated } = useAuthStore();
  const { data: user, isLoading } = useGetProfile();
  const { canInstall, install, needsInstructions } = usePwaInstall();
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
    const numBlocks = Math.floor(Math.random() * 5) + 2;
    setBlockGlitch(
      Array.from({ length: numBlocks }, (_, i) => ({
        id: i,
        top: Math.random() * 80,
        height: 2 + Math.random() * 12,
        offset: (Math.random() - 0.5) * 30,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    );
    setTimeout(() => setBlockGlitch([]), duration);
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

  useEffect(() => {
    let pos = -10;
    const iv = setInterval(() => {
      pos += 0.6;
      if (pos > 110) pos = -10;
      setScanlinePos(pos);
    }, 16);
    return () => clearInterval(iv);
  }, []);

  const rainColumns: RainColumnProps[] = [
    { x: 2, delay: 0, speed: 1.2 },
    { x: 8, delay: 800, speed: 0.9 },
    { x: 15, delay: 300, speed: 1.5 },
    { x: 22, delay: 1200, speed: 0.7 },
    { x: 78, delay: 500, speed: 1.1 },
    { x: 85, delay: 0, speed: 0.8 },
    { x: 91, delay: 900, speed: 1.4 },
    { x: 97, delay: 400, speed: 1.0 },
    { x: 35, delay: 600, speed: 0.6 },
    { x: 65, delay: 1100, speed: 1.3 },
  ];

  const textShadowBase = `0 0 20px color-mix(in srgb, var(--color-ring) 80%, transparent), 0 0 40px color-mix(in srgb, var(--color-ring) 40%, transparent), 0 0 80px color-mix(in srgb, var(--color-ring) 20%, transparent)`;
  const textShadowGlitch = `0 0 30px var(--color-ring), 0 0 60px color-mix(in srgb, var(--color-ring) 60%, transparent), 0 0 100px color-mix(in srgb, var(--color-ring) 30%, transparent)`;

  return (
    <div className='relative overflow-hidden flex flex-col items-center justify-center px-10 py-20 min-h-[70vh] bg-transparent max-sm:px-5 max-sm:py-15'>
      <div className='tg-grid-bg' />
      <div className='tg-scanlines-static' />

      <div className='tg-corner tg-corner-tl' />
      <div className='tg-corner tg-corner-tr' />
      <div className='tg-corner tg-corner-bl' />
      <div className='tg-corner tg-corner-br' />

      {rainColumns.map((col, i) => (
        <RainColumn key={i} {...col} />
      ))}

      <div className='tg-scanline-beam' style={{ top: `${scanlinePos}%` }} />

      {blockGlitch.map((block) => (
        <div
          key={block.id}
          className='absolute left-0 right-0 pointer-events-none z-8 overflow-hidden'
          style={{
            top: `${block.top}%`,
            height: `${block.height}px`,
            transform: `translateX(${block.offset}px)`,
            background: `color-mix(in srgb, var(--color-ring) ${Math.round(block.opacity * 10)}%, transparent)`,
            boxShadow: `0 0 10px color-mix(in srgb, var(--color-ring) 15%, transparent)`,
          }}
        />
      ))}

      <div className='relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center'>
        {isAuthenticated && (
          <div className='tg-welcome-badge'>
            {isLoading ? (
              <div className='my-1 h-4 w-4 border-2 border-t-success border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin' />
            ) : (
              <>Welcome back, {user?.fullname || user?.username || 'User'}!</>
            )}
          </div>
        )}
        {isAuthenticated && (
          <span className='text-sm text-muted-foreground mb-8'>
            Want to login with another account?{' '}
            <ButtonLink variant='link' className='p-0' to='/login'>
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
            className='tg-title-main'
            style={{
              fontFamily: activeFont.family,
              transform: `translate(${chromaOffset.x * 0.1}px, ${chromaOffset.y * 0.1}px)`,
              textShadow: glitching ? textShadowGlitch : textShadowBase,
            }}
          >
            {display}
          </div>
        </div>

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

        <div className='grid grid-cols-4 max-sm:grid-cols-2 gap-3 w-full mb-3'>
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

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-4'>
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
            {needsInstructions && (
              <div className='text-sm text-muted-foreground text-center'>
                iOS: Share → Add to Home Screen
                <br />
                Firefox: Browser menu → Add to Home Screen
              </div>
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
