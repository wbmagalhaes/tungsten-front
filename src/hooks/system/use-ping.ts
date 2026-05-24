import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ping } from '@services/system.service';

export const usePing = (delay: number | undefined = undefined) => {
  const [enabled, setEnabled] = useState(!delay);

  useEffect(() => {
    if (!delay) return;
    const t = setTimeout(() => setEnabled(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const query = useQuery({
    queryKey: ['system-ping'],
    queryFn: ping,
    refetchInterval: 5000,
    enabled,
  });

  return {
    ...query,
    isLoading: !enabled || query.isLoading,
  };
};
