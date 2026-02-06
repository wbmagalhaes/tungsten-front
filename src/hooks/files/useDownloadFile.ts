import { useMutation } from '@tanstack/react-query';
import { downloadFile } from '@services/files.service';

export default function useDownloadFile() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => downloadFile(id),
  });
}
