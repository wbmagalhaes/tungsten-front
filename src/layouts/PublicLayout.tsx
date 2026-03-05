import '@styles/hero.css';
import '@styles/layout.css';
import { useEffect, useState } from 'react';
import { ButtonLink } from '@components/base/button';
import { useAuthStore } from '@stores/useAuthStore';
import { Outlet } from 'react-router-dom';
import { THEME_META, THEMES, useTheme } from '@hooks/use-theme';
import { RainColumn, type RainColumnProps } from '@components/RainColumn';
import { ShuffleText } from '@components/ShuffleText';

export default function PublicLayout() {
  const [scanlinePos, setScanlinePos] = useState(-10);

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

  return (
    <div className='flex flex-col min-h-screen'>
      <PublicHeader />

      <div className='relative flex-1 overflow-hidden min-h-full'>
        <div className='absolute inset-0 pointer-events-none'>
          <div className='tg-grid-bg' />
          <div className='tg-scanlines-static' />
        </div>

        {rainColumns.map((col, i) => (
          <RainColumn key={i} {...col} />
        ))}

        <div className='tg-scanline-beam' style={{ top: `${scanlinePos}%` }} />

        <main className='relative mt-16 mb-8'>
          <Outlet />
        </main>

        <div className='tg-corner tg-corner-tl' />
        <div className='tg-corner tg-corner-tr' />
      </div>

      <PublicFooter />
    </div>
  );
}

function PublicHeader() {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className='tg-header fixed top-0 inset-x-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40'>
      <div className='tg-header-inner w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative'>
        <ButtonLink to='/' render={<TgLogo />} />

        <div className='flex items-center gap-2'>
          {isAuthenticated ? (
            <ButtonLink to='/root'>Access Console</ButtonLink>
          ) : (
            <>
              <ButtonLink
                className='hidden sm:inline-flex min-w-24'
                to='/login'
              >
                Login
              </ButtonLink>
              <ButtonLink
                className='min-w-24'
                variant='secondary'
                to='/register'
              >
                Register
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function TgLogo() {
  const [hover, setHover] = useState(false);

  return (
    <div
      className='tg-logo flex items-center gap-3 cursor-pointer select-none'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className='tg-logo-badge relative w-9 h-9 border border-ring/35 rounded-sm flex items-center justify-center bg-ring/6 overflow-hidden transition-all duration-200'>
        <span className='tg-logo-w relative z-10 font-cyber text-base font-black text-ring leading-none'>
          W
        </span>
        <span className='absolute top-0.5 right-0.5 z-10 font-mono-tech text-[7px] text-ring/80 leading-none'>
          74
        </span>
      </div>
      <span className='tg-logo-name font-mono-tech font-bold text-base tracking-widest uppercase text-ring/70 transition-all duration-200'>
        <ShuffleText
          text='TUNGSTEN'
          active={hover}
          speed={15}
          settleDelay={250}
        />
      </span>
    </div>
  );
}

function PublicFooter() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className='tg-footer relative w-full border-t border-ring/8'>
      <div className='tg-footer-inner w-full max-w-7xl mx-auto px-6 py-3 flex flex-wrap-reverse items-center relative gap-4'>
        <p className='font-mono-tech text-xs tracking-widest text-ring/75 shrink-0'>
          &copy; 2026 - tungsten:v0.1.45.9f32a_unstable
        </p>

        <div className='flex items-center gap-1.5 ml-auto mr-2'>
          {THEMES.map((t) => {
            const meta = THEME_META[t];
            const isActive = theme === t;
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                title={meta.label}
                className={[
                  'tg-theme-btn relative flex items-center gap-1 px-2 py-1 rounded-sm border transition-all duration-150',
                  'font-mono-tech text-xs tracking-widest uppercase',
                  isActive
                    ? 'border-ring/50 bg-ring/5 text-ring/80'
                    : 'border-foreground/6 bg-transparent text-foreground/20 hover:border-ring/25 hover:text-ring/45',
                ].join(' ')}
              >
                <span>{meta.label}</span>

                {isActive && (
                  <span className='tg-theme-active-dot absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-ring' />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
