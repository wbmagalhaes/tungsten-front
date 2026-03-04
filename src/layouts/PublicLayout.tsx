import '@styles/layout.css';
import { ButtonLink } from '@components/base/button';
import { useAuthStore } from '@stores/useAuthStore';
import { Outlet } from 'react-router-dom';
import { THEME_META, THEMES, useTheme } from '@hooks/use-theme';

export default function PublicLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <PublicHeader />
      <main className='flex-1 mt-20'>
        <Outlet />
      </main>
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
  return (
    <div className='tg-logo flex items-center gap-3 cursor-pointer select-none'>
      <div className='tg-logo-badge relative w-9 h-9 border border-[rgba(0,255,136,0.35)] rounded-sm flex items-center justify-center bg-[rgba(0,255,136,0.06)] overflow-hidden transition-all duration-200'>
        <span
          className='tg-logo-w relative z-10 font-cyber text-base font-black text-[#00ff88] leading-none'
          style={{ textShadow: '0 0 10px rgba(0,255,136,0.6)' }}
        >
          W
        </span>
        <span className='absolute top-0.5 right-0.5 z-10 font-mono-tech text-[7px] text-[rgba(0,255,136,0.6)] leading-none'>
          74
        </span>
      </div>
      <span className='tg-logo-name font-mono-tech text-[13px] tracking-[0.25em] uppercase text-[rgba(0,255,136,0.7)] transition-all duration-200'>
        Tungsten
      </span>
    </div>
  );
}

function PublicFooter() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className='tg-footer relative w-full border-t border-[rgba(0,255,136,0.08)]'>
      <div className='tg-footer-inner w-full max-w-7xl mx-auto px-6 py-3 flex items-center relative gap-4'>
        <p className='font-mono-tech text-xs tracking-widest uppercase text-[rgba(0,255,136,0.75)] shrink-0'>
          &copy; 2026 - tungsten
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
                className={`
                  tg-theme-btn relative flex items-center gap-1 px-2 py-1 rounded-sm border transition-all duration-150
                  font-mono-tech text-[9px] tracking-widest uppercase
                  ${
                    isActive
                      ? 'border-[rgba(0,255,136,0.5)] bg-[rgba(0,255,136,0.07)] text-[rgba(0,255,136,0.8)]'
                      : 'border-[rgba(255,255,255,0.06)] bg-transparent text-[rgba(255,255,255,0.2)] hover:border-[rgba(0,255,136,0.25)] hover:text-[rgba(0,255,136,0.45)]'
                  }
                `}
              >
                <span
                  className='w-1.5 h-1.5 rounded-full shrink-0'
                  style={{ background: meta.primary }}
                />
                <span
                  className='w-1.5 h-1.5 rounded-full shrink-0'
                  style={{ background: meta.accent }}
                />
                <span className='hidden sm:inline'>{meta.label}</span>

                {isActive && (
                  <span className='tg-theme-active-dot absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00ff88]' />
                )}
              </button>
            );
          })}
        </div>

        <p className='font-mono-tech text-xs tracking-[0.15em] text-[rgba(0,255,136,0.75)] shrink-0'>
          v0.1.0_stable
        </p>
      </div>
    </footer>
  );
}
