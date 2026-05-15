import { useQuery } from '@tanstack/react-query';
import { getMyQuotas } from '@services/quotas.service';

export const useMyQuotas = () =>
  useQuery({
    queryKey: ['quotas', 'me'],
    queryFn: getMyQuotas,
  });
