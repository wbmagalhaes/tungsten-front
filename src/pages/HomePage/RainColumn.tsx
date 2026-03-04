import { useState, useEffect } from 'react';

const GLITCH_CHARS =
  '!@#$%^&*<>[]{}|\\/?~`АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789';

export interface RainColumnProps {
  x: number;
  delay: number;
  speed: number;
}

export function RainColumn({ x, delay, speed }: RainColumnProps) {
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
            color:
              i === columnChars.length - 1
                ? 'var(--color-ring)'
                : `rgba(0, ${Math.floor(180 - i * 8)}, ${Math.floor(60 + i * 4)}, ${Math.max(0.05, 0.6 - i * 0.03)})`,
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
