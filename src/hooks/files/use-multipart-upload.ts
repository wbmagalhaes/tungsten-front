import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  startMultipart,
  uploadPart,
  completeMultipart,
  abortMultipart,
  type CompletePart,
} from '@services/multipart.service';

export interface MultipartUploadParams {
  file: File;
  bucketId?: string;
  dir?: string;
  visibility?: 'public' | 'private';
}

export const useMultipartUpload = () => {
  const qc = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    'idle' | 'starting' | 'uploading' | 'completing' | 'done' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const uploadIdRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);

  const upload = async ({
    file,
    bucketId,
    dir,
    visibility,
  }: MultipartUploadParams) => {
    cancelledRef.current = false;
    setError(null);
    setProgress(0);

    try {
      setStatus('starting');
      const start = await startMultipart({
        bucket_id: bucketId,
        filename: file.name,
        size: file.size,
        mime: file.type || undefined,
        dir,
        visibility,
      });
      uploadIdRef.current = start.upload_id;

      setStatus('uploading');
      const completedParts: CompletePart[] = [];
      const partProgress = new Array(start.parts_count).fill(0);

      for (let i = 0; i < start.parts_count; i++) {
        if (cancelledRef.current) {
          await abortMultipart(start.upload_id);
          uploadIdRef.current = null;
          setStatus('idle');
          return;
        }
        const offset = i * start.part_size;
        const blob = file.slice(offset, offset + start.part_size);
        const result = await uploadPart(
          start.upload_id,
          i + 1,
          blob,
          (pct) => {
            partProgress[i] = pct;
            const total =
              partProgress.reduce((a, b) => a + b, 0) / start.parts_count;
            setProgress(Math.round(total));
          },
        );
        completedParts.push(result);
        partProgress[i] = 100;
      }

      setStatus('completing');
      await completeMultipart(start.upload_id, completedParts);
      uploadIdRef.current = null;
      setStatus('done');
      setProgress(100);
      qc.invalidateQueries({ queryKey: ['files'] });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      setStatus('error');
      if (uploadIdRef.current) {
        try {
          await abortMultipart(uploadIdRef.current);
        } catch {
          /* swallow abort errors */
        }
        uploadIdRef.current = null;
      }
      throw err;
    }
  };

  const cancel = () => {
    cancelledRef.current = true;
  };

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setError(null);
  };

  return { upload, cancel, reset, progress, status, error };
};
