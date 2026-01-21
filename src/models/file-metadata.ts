export type FileMetadata = {
  id: string;
  basename: string;
  filepath: string;
  size: number;
  mime?: string;
  checksum?: string;
  created_at: string;
  is_archived: boolean;
  archived_at?: string;
};
