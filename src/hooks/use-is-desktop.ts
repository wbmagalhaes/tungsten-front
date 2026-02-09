import { useState, useEffect } from 'react';

export function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= breakpoint;
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= breakpoint);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isDesktop;
}
