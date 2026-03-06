import { useState, useEffect } from 'react';
import { randomGlitchArray, randomGlitchChar } from '@utils/ascii-pallet';

export interface RainColumnProps {
  x: number;
  delay: number;
  speed: number;
}

export function RainColumn({ x, delay, speed }: RainColumnProps) {
  const [offset, setOffset] = useState(-100);
  const [columnChars, setColumnChars] = useState(() => randomGlitchArray(20));

  useEffect(() => {
    const t = setTimeout(() => {
      let pos = -100;
      const iv = setInterval(() => {
        pos += speed;
        if (pos > 110) pos = -100;
        setOffset(pos);
        setColumnChars((prev) =>
          prev.map((c) => (Math.random() > 0.85 ? randomGlitchChar() : c)),
        );
      }, 50);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [delay, speed]);

  return (
    <div
      className='absolute flex flex-col pointer-events-none select-none text-xs font-mono-tech'
      style={{
        left: `${x}%`,
        top: `${offset}%`,
        gap: '2px',
        lineHeight: '1.4',
      }}
    >
      {columnChars.map((c, i) => (
        <span
          key={i}
          style={{
            color: (() => {
              if (i === columnChars.length - 1) {
                return 'var(--color-ring)';
              }

              const strength = (i / (columnChars.length - 1)) ** 2;
              return `color-mix(
                in srgb,
                var(--color-ring) ${Math.max(5, strength * 70)}%,
                transparent
              )`;
            })(),
            textShadow:
              i === columnChars.length - 1
                ? '0 0 8px var(--color-ring)'
                : 'none',
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}
