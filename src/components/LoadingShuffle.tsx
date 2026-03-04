import { useEffect, useRef, useState } from 'react';

const CHARS = '!@#$%^&*<>[]{}|\\/?~`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

interface Props {
  target: string;
  isLoading: boolean;
  speed?: number;
}

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export function LoadingShuffle({ target, isLoading, speed = 20 }: Props) {
  const n = target.length;

  const [display, setDisplay] = useState<string[]>(() =>
    Array.from({ length: n }, randomChar),
  );

  const revealed = useRef<Set<number>>(new Set());

  useEffect(() => {
    revealed.current.clear();
    setDisplay(Array.from({ length: n }, randomChar));
  }, [target, n]);

  useEffect(() => {
    const iv = setInterval(() => {
      setDisplay((prev) => {
        const next = [...prev];

        if (isLoading) {
          const swaps = Math.max(1, Math.floor(n * (speed / 100)));

          for (let i = 0; i < swaps; i++) {
            const idx = Math.floor(Math.random() * n);
            if (!revealed.current.has(idx)) {
              next[idx] = randomChar();
            }
          }

          return next;
        }

        const remaining: number[] = [];

        for (let i = 0; i < n; i++) {
          if (!revealed.current.has(i)) remaining.push(i);
        }

        if (remaining.length <= 4) {
          revealed.current = new Set(Array.from({ length: n }, (_, i) => i));
          return target.split('');
        }

        const revealsPerFrame = 2 + Math.floor(Math.random() * 3);

        for (let r = 0; r < revealsPerFrame; r++) {
          if (remaining.length === 0) break;

          const idx = Math.floor(Math.random() * remaining.length);
          const pick = remaining.splice(idx, 1)[0];

          revealed.current.add(pick);
          next[pick] = target[pick];
        }

        for (let i = 0; i < n; i++) {
          if (!revealed.current.has(i) && target[i] !== ' ') {
            next[i] = randomChar();
          }
        }

        return next;
      });
    }, 40);

    return () => clearInterval(iv);
  }, [isLoading, target, speed, n]);

  return <span>{display.join('')}</span>;
}
