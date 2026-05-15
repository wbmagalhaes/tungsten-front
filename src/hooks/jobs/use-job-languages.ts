import { useQuery } from '@tanstack/react-query';
import { listJobLanguages } from '@services/jobs.service';

export const useJobLanguages = () =>
  useQuery({
    queryKey: ['jobs', 'languages'],
    queryFn: () => listJobLanguages({ page_size: 100 }),
  });
