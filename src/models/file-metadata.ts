export type FileMetadata = {
  id: string;
  basename: string;
  filepath: string;
  size: number;
  mime?: string;
  checksum?: string;
  visibility: 'private' | 'public';
  created_at: string;
  is_archived: boolean;
  archived_at?: string;
  version_hash?: string;
  canonical_uri?: string;
};
