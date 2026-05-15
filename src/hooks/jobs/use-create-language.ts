import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createJobLanguage,
  type JobLanguageConfig,
} from '@services/jobs.service';

export const useCreateJobLanguage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: JobLanguageConfig) => createJobLanguage(body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['jobs', 'languages'] }),
  });
};
