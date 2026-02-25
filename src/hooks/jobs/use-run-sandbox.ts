import { useMutation, useQueryClient } from '@tanstack/react-query';
import { runSandbox, type RunSandboxRequest } from '@services/jobs.service';

export const useRunSandbox = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: RunSandboxRequest) => runSandbox(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
};
