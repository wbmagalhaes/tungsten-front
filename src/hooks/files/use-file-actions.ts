import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  renameFile,
  moveFile,
  archiveFile,
  setFileVisibility,
  signFile,
  compressFile,
  decompressFile,
  viewFile,
  type RenameRequest,
  type MoveRequest,
  type VisibilityRequest,
  type SignFileRequest,
} from '@services/files.service';

const invalidate = (qc: ReturnType<typeof useQueryClient>, id: string) => {
  qc.invalidateQueries({ queryKey: ['files'] });
  qc.invalidateQueries({ queryKey: ['files', id] });
};

export const useRenameFile = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: RenameRequest) => renameFile(id, req),
    onSuccess: () => invalidate(qc, id),
  });
};

export const useMoveFile = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: MoveRequest) => moveFile(id, req),
    onSuccess: () => invalidate(qc, id),
  });
};

export const useArchiveFile = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => archiveFile(id),
    onSuccess: () => invalidate(qc, id),
  });
};

export const useSetFileVisibility = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: VisibilityRequest) => setFileVisibility(id, req),
    onSuccess: () => invalidate(qc, id),
  });
};

export const useSignFile = (id: string) =>
  useMutation({
    mutationFn: (req?: SignFileRequest) => signFile(id, req),
  });

export const useCompressFile = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => compressFile(id),
    onSuccess: () => invalidate(qc, id),
  });
};

export const useDecompressFile = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => decompressFile(id),
    onSuccess: () => invalidate(qc, id),
  });
};

export const useViewFile = () =>
  useMutation({
    mutationFn: (id: string) => viewFile(id),
  });
