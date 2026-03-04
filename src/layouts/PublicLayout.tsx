import '@styles/layout.css';
import { ButtonLink } from '@components/base/button';
import { useAuthStore } from '@stores/useAuthStore';
import { Outlet } from 'react-router-dom';
import { THEME_META, THEMES, useTheme } from '@hooks/use-theme';

export default function PublicLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <PublicHeader />
      <main className='flex-1 mt-16'>
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
      <div className='tg-logo-badge relative w-9 h-9 border border-ring/35 rounded-sm flex items-center justify-center bg-ring/6 overflow-hidden transition-all duration-200'>
        <span className='tg-logo-w relative z-10 font-cyber text-base font-black text-ring leading-none'>
          W
        </span>
        <span className='absolute top-0.5 right-0.5 z-10 font-mono-tech text-[7px] text-ring/80 leading-none'>
          74
        </span>
      </div>
      <span className='tg-logo-name font-mono-tech text-base tracking-[0.25em] uppercase text-ring/70 transition-all duration-200'>
        Tungsten
      </span>
    </div>
  );
}

function PublicFooter() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className='tg-footer relative w-full border-t border-ring/8'>
      <div className='tg-footer-inner w-full max-w-7xl mx-auto px-6 py-3 flex items-center relative gap-4'>
        <p className='font-mono-tech text-xs tracking-widest uppercase text-ring/75 shrink-0'>
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
                className={[
                  'tg-theme-btn relative flex items-center gap-1 px-2 py-1 rounded-sm border transition-all duration-150',
                  'font-mono-tech text-xs tracking-widest uppercase',
                  isActive
                    ? 'border-ring/50 bg-ring/[0.07] text-ring/80'
                    : 'border-white/6 bg-transparent text-white/20 hover:border-ring/25 hover:text-ring/45',
                ].join(' ')}
              >
                <span
                  className='w-1.5 h-1.5 rounded-full shrink-0 hidden sm:inline'
                  style={{ background: meta.primary }}
                />
                <span
                  className='w-1.5 h-1.5 rounded-full shrink-0 hidden sm:inline'
                  style={{ background: meta.accent }}
                />

                <span>{meta.label}</span>

                {isActive && (
                  <span className='tg-theme-active-dot absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-ring' />
                )}
              </button>
            );
          })}
        </div>

        <p className='font-mono-tech text-xs tracking-widest text-ring/75 shrink-0'>
          v0.1.0_stable
        </p>
      </div>
    </footer>
  );
}
