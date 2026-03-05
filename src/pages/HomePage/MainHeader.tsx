import { useState, useEffect, useRef } from 'react';

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

export function MainHeader() {
  const [glitching, setGlitching] = useState(false);
  const [chromaOffset, setChromaOffset] = useState({ x: 0, y: 0 });
  const [activeFontIndex, setActiveFontIndex] = useState(0);

  const display = useGlitchText(ORIGINAL, glitching);
  const activeFont = FONTS[activeFontIndex];

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
        style={{
          fontFamily: activeFont.family,
        }}
      >
        {display}
      </div>
      <div
        className='tg-title-layer tg-title-slice-2'
        aria-hidden='true'
        style={{
          fontFamily: activeFont.family,
        }}
      >
        {display}
      </div>
      <div
        className='tg-title-layer tg-title-desync'
        aria-hidden='true'
        style={{
          fontFamily: activeFont.family,
        }}
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
  );
}

const GLITCH_CHARS =
  '!@#$%^&*<>[]{}|\\/?~`АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789§ΔΩΨλπ';

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
