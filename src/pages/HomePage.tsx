import '@styles/hero.css';
import { useState, useEffect, useRef } from 'react';
import {
  StickyNote,
  BotMessageSquare,
  ImagePlus,
  FlaskConical,
} from 'lucide-react';
import CloudflareIcon from '../components/Icons/CloudflareIcon';
import NginxIcon from '../components/Icons/NginxIcon';
import ReactIcon from '../components/Icons/ReactIcon';
import RustIcon from '../components/Icons/RustIcon';
import { Button, ButtonLink } from '@components/base/button';
import { useAuthStore } from '@stores/useAuthStore';
import { useGetProfile } from '@hooks/profile/use-get-profile';
import { usePwaInstall } from '@hooks/use-pwa-install';
import { usePwaUpdate } from '@hooks/use-pwa-update';

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
  const frameRef = useRef(0);
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
      frameRef.current = frame;
    }, 60);
    return () => clearInterval(intervalRef.current);
  }, [active, original]);

  return display;
}

interface RainColumnProps {
  x: number;
  delay: number;
  speed: number;
}

function RainColumn({ x, delay, speed }: RainColumnProps) {
  const [offset, setOffset] = useState(-100);
  const [columnChars, setColumnChars] = useState(() =>
    Array.from(
      { length: 20 },
      () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
    ),
  );

  useEffect(() => {
    const t = setTimeout(() => {
      let pos = -100;
      const iv = setInterval(() => {
        pos += speed;
        if (pos > 110) pos = -100;
        setOffset(pos);
        setColumnChars((prev) =>
          prev.map((c) =>
            Math.random() > 0.85
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : c,
          ),
        );
      }, 50);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [delay, speed]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${offset}%`,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        fontFamily: 'var(--font-mono-tech)',
        fontSize: '12px',
        lineHeight: '1.4',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {columnChars.map((c, i) => (
        <span
          key={i}
          style={{
            color:
              i === columnChars.length - 1
                ? '#00ff88'
                : `rgba(0, ${Math.floor(180 - i * 8)}, ${Math.floor(60 + i * 4)}, ${Math.max(0.05, 0.6 - i * 0.03)})`,
            textShadow:
              i === columnChars.length - 1 ? '0 0 8px #00ff88' : 'none',
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
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

interface StackCardProps {
  icon: React.ReactNode;
  name: string;
  label: string;
  color: AccentColor;
}

function StackCard({ icon, name, label, color }: StackCardProps) {
  return (
    <div className={`tg-card tg-stack-card tg-accent-${color}`}>
      <div className='tg-card-icon'>{icon}</div>
      <div className={`tg-card-name`}>{name}</div>
      <div className='tg-card-label'>{label}</div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: AccentColor;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className={`tg-card tg-feature-card tg-accent-${color}`}>
      <div className={`tg-feature-icon-wrap tg-accent-${color}`}>{icon}</div>
      <div>
        <div className='tg-feature-title'>{title}</div>
        <div className='tg-feature-desc'>{description}</div>
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

  const textShadowBase = `0 0 20px rgba(0,255,136,0.8), 0 0 40px rgba(0,255,136,0.4), 0 0 80px rgba(0,255,136,0.2)`;

  return (
    <div className='tg-hero'>
      <div className='tg-grid-bg' />
      <div className='tg-corner tg-corner-tl' />
      <div className='tg-corner tg-corner-tr' />
      <div className='tg-corner tg-corner-bl' />
      <div className='tg-corner tg-corner-br' />
      {rainColumns.map((col, i) => (
        <RainColumn key={i} {...col} />
      ))}
      <div className='tg-scanline-beam' style={{ top: `${scanlinePos}%` }} />
      <div className='tg-scanlines-static' />
      {blockGlitch.map((block) => (
        <div
          key={block.id}
          className='tg-block-glitch'
          style={{
            top: `${block.top}%`,
            height: `${block.height}px`,
            transform: `translateX(${block.offset}px)`,
            background: `rgba(0,255,136,${block.opacity * 0.1})`,
            boxShadow: `0 0 10px rgba(0,255,136,0.15)`,
          }}
        />
      ))}

      <div className='tg-hero-content'>
        {isAuthenticated && (
          <div className='tg-welcome-badge'>
            {isLoading ? (
              <div className='my-1 h-4 w-4 border-2 border-t-green-300 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin' />
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

        <div className='tg-title-container'>
          <div
            className='tg-title-layer tg-title-red'
            aria-hidden='true'
            style={{
              fontFamily: activeFont.family,
              transform: `translate(${-3 + chromaOffset.x * 0.6}px, ${chromaOffset.y * 0.3}px)`,
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
              transform: `translate(${3 - chromaOffset.x * 0.6}px, ${-chromaOffset.y * 0.3}px)`,
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
              textShadow: glitching
                ? `0 0 30px rgba(0,255,136,1), 0 0 60px rgba(0,255,136,0.6), 0 0 100px rgba(0,255,136,0.3)`
                : textShadowBase,
            }}
          >
            {display}
          </div>

          <div
            className='tg-title-spacer'
            style={{ fontFamily: activeFont.family }}
            aria-hidden='true'
          >
            {ORIGINAL}
          </div>
        </div>

        <div className='tg-subtitle'>
          &gt; personal self-hosted server _ system online
        </div>

        <div className='tg-divider' />

        <div className='tg-stack-grid'>
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
                className='bg-emerald-600 hover:bg-emerald-500'
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

        <div className='tg-feature-grid'>
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
          className='fixed bottom-4 right-4 bg-emerald-600 text-foreground px-4 py-2 rounded shadow-lg cursor-pointer z-50'
          onClick={update}
        >
          New version available - Click to update
        </div>
      )}
    </div>
  );
}
