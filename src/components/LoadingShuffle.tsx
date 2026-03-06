import { randomGlitchChar, randomGlitchArray } from '@utils/ascii-pallet';
import { useEffect, useRef, useState } from 'react';

interface Props {
  target: string;
  isLoading: boolean;
  speed?: number;
}

export function LoadingShuffle({ target, isLoading, speed = 20 }: Props) {
  const n = target.length;

  const [display, setDisplay] = useState<string[]>(() => randomGlitchArray(n));

  const progress = useRef(0);
  const timer = useRef<number | null>(null);
  const lastTarget = useRef(target);

  useEffect(() => {
    function tick() {
      setDisplay((prev) => {
        let next = [...prev];

        if (lastTarget.current !== target) {
          lastTarget.current = target;
          progress.current = 0;
          next = randomGlitchArray(n);
        }

        if (isLoading) {
          for (let i = 0; i < n; i++) {
            if (target[i] !== ' ') next[i] = randomGlitchChar();
          }
          return next;
        }

        const revealStep = Math.max(1, Math.floor(speed / 15));
        progress.current = Math.min(n, progress.current + revealStep);

        const p = progress.current;

        for (let i = 0; i < n; i++) {
          if (i < p) {
            next[i] = target[i];
          } else if (target[i] !== ' ') {
            next[i] = randomGlitchChar();
          }
        }

        return next;
      });

      timer.current = window.setTimeout(tick, 900 / speed);
    }

    tick();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isLoading, target, speed, n]);

  return (
    <span className='inline-block' style={{ minWidth: `${target.length}ch` }}>
      {display.join('')}
    </span>
  );
}
