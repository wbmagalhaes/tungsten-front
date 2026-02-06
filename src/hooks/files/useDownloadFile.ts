import { useMutation } from '@tanstack/react-query';
import { downloadFile, type DownloadFileParams } from '@services/files.service';

export default function useDownloadFile() {
  return useMutation({
    mutationFn: (params: DownloadFileParams) => downloadFile(params),
  });
}
