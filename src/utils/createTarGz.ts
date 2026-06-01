import { gzip } from 'fflate';

export interface TarEntry {
  path: string;
  data: Uint8Array;
}

const BLOCK = 512;

function writeString(block: Uint8Array, offset: number, value: string) {
  for (let i = 0; i < value.length; i++) {
    block[offset + i] = value.charCodeAt(i) & 0xff;
  }
}

function writeOctal(
  block: Uint8Array,
  offset: number,
  length: number,
  value: number,
) {
  const str = value.toString(8).padStart(length - 1, '0');
  writeString(block, offset, str);
}

function splitPath(path: string): { name: string; prefix: string } {
  if (path.length <= 100) return { name: path, prefix: '' };

  let cut = path.length - 100;
  const slash = path.indexOf('/', cut);
  if (slash === -1 || slash > 154) {
    throw new Error(`Path too long for tar format: ${path}`);
  }
  cut = slash;
  return { name: path.slice(cut + 1), prefix: path.slice(0, cut) };
}

function buildHeader(path: string, size: number, mtime: number): Uint8Array {
  const header = new Uint8Array(BLOCK);
  const { name, prefix } = splitPath(path);

  writeString(header, 0, name);
  writeOctal(header, 100, 8, 0o644);
  writeOctal(header, 108, 8, 0);
  writeOctal(header, 116, 8, 0);
  writeOctal(header, 124, 12, size);
  writeOctal(header, 136, 12, mtime);
  header[156] = '0'.charCodeAt(0);
  writeString(header, 257, 'ustar');
  header[263] = '0'.charCodeAt(0);
  header[264] = '0'.charCodeAt(0);
  if (prefix) writeString(header, 345, prefix);

  for (let i = 148; i < 156; i++) header[i] = 0x20;
  let checksum = 0;
  for (let i = 0; i < BLOCK; i++) checksum += header[i];
  writeOctal(header, 148, 7, checksum);
  header[155] = 0x20;

  return header;
}

export function createTar(entries: TarEntry[], mtime: number): Uint8Array {
  const chunks: Uint8Array[] = [];
  let total = 0;

  const push = (chunk: Uint8Array) => {
    chunks.push(chunk);
    total += chunk.length;
  };

  for (const entry of entries) {
    push(buildHeader(entry.path, entry.data.length, mtime));
    push(entry.data);
    const remainder = entry.data.length % BLOCK;
    if (remainder !== 0) push(new Uint8Array(BLOCK - remainder));
  }

  push(new Uint8Array(BLOCK * 2));

  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export async function createTarGz(
  files: File[],
  options: { stripTopDir?: boolean; mtime?: number } = {},
): Promise<Blob> {
  const { stripTopDir = true, mtime = 0 } = options;

  const paths = files.map((file) => {
    const raw =
      (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
      file.name;
    return raw.replace(/^\.?\/+/, '');
  });

  let prefix = '';
  if (stripTopDir && paths.length > 0) {
    const firstSegments = paths.map((p) => p.split('/')[0]);
    const allShareTop =
      paths.every((p) => p.includes('/')) &&
      firstSegments.every((s) => s === firstSegments[0]);
    if (allShareTop) prefix = `${firstSegments[0]}/`;
  }

  const entries: TarEntry[] = await Promise.all(
    files.map(async (file, i) => {
      const buffer = await file.arrayBuffer();
      const path = prefix ? paths[i].slice(prefix.length) : paths[i];
      return { path, data: new Uint8Array(buffer) };
    }),
  );

  const valid = entries.filter((e) => e.path.length > 0);
  const tar = createTar(valid, mtime);

  const gzipped = await new Promise<Uint8Array>((resolve, reject) => {
    gzip(tar, { level: 6, mtime }, (err, data) =>
      err ? reject(err) : resolve(data),
    );
  });

  return new Blob([gzipped as unknown as BlobPart], {
    type: 'application/gzip',
  });
}
