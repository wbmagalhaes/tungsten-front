import { useEffect, useRef, useState } from 'react';
import { randomGlitchChar } from '@utils/ascii-pallet';

interface ShuffleTextProps {
  text: string;
  active: boolean;
  speed?: number;
  settleDelay?: number;
}

export function ShuffleText({
  text,
  active,
  speed = 3,
  settleDelay = 300,
}: ShuffleTextProps) {
  const n = text.length;

  const [display, setDisplay] = useState(text.split(''));

  const progress = useRef(0);
  const revealStarted = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      progress.current = 0;
      revealStarted.current = false;
      setTimeout(() => setDisplay(text.split('')), 0);
      return;
    }

    const settleTimer = window.setTimeout(() => {
      revealStarted.current = true;
    }, settleDelay);

    function tick() {
      setDisplay((prev) => {
        const next = [...prev];

        if (!revealStarted.current) {
          const swaps = Math.max(1, speed * 2);

          for (let i = 0; i < swaps; i++) {
            const idx = Math.floor(Math.random() * n);
            if (text[idx] !== ' ') next[idx] = randomGlitchChar();
          }

          return next;
        }

        progress.current = Math.min(n, progress.current + 1);
        const p = progress.current;

        for (let i = 0; i < n; i++) {
          if (i < p) {
            next[i] = text[i];
          } else if (text[i] !== ' ') {
            next[i] = randomGlitchChar();
          }
        }

        return next;
      });

      if (progress.current < n) {
        timer.current = window.setTimeout(tick, 900 / speed);
      }
    }

    tick();

    return () => {
      clearTimeout(settleTimer);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, text, speed, settleDelay, n]);

  return <>{display.join('')}</>;
}
