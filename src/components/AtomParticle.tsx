import { useEffect, useRef } from 'react';
import { parseGIF, decompressFrames } from 'gifuct-js';

const PALETTE_DENSE =
  " `'.,:;~-_+<>!?i|/\\r(){}[]tfjlcxzuvwsnyeoaqJYCLUZXVODB80HKW#@$&%";

const PALETTE_GLITCH =
  '!@#$%^&*<>[]{}|\\/?~`АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789§ΔΩΨλπ';

function lumaToChar(luma: number, blackThreshold: number): string {
  if (luma < blackThreshold) return ' ';
  const t = (luma - blackThreshold) / (255 - blackThreshold);
  return PALETTE_DENSE[Math.floor(t * (PALETTE_DENSE.length - 1))];
}

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function bayerThreshold(x: number, y: number): number {
  return (BAYER4[y % 4][x % 4] / 16) * 255;
}

export interface SrcConfig {
  src: string;
  opacity?: number;
  dither?: number;
  blackThreshold?: number;
  speed?: number;
}

interface AsciiCanvasProps {
  config: SrcConfig | SrcConfig[];
  cols?: number;
  rows?: number;
  fontSize?: number;
  color?: string;
  className?: string;
}

interface GifFrame {
  imageData: ImageData;
  delay: number;
}

function normaliseConfig(config: AsciiCanvasProps['config']): SrcConfig[] {
  const arr = Array.isArray(config) ? config : [config];
  return arr;
}

async function decodeGif(
  src: string,
  cols: number,
  rows: number,
  speed: number,
): Promise<GifFrame[]> {
  const res = await fetch(src);
  const buf = await res.arrayBuffer();
  const gif = parseGIF(buf);
  const frames = decompressFrames(gif, true);

  const fullW = gif.lsd.width;
  const fullH = gif.lsd.height;

  const comp = document.createElement('canvas');
  comp.width = fullW;
  comp.height = fullH;
  const compCtx = comp.getContext('2d')!;

  const sample = document.createElement('canvas');
  sample.width = cols;
  sample.height = rows;
  const sampleCtx = sample.getContext('2d', { willReadFrequently: true })!;

  const decoded: GifFrame[] = [];

  for (const frame of frames) {
    const patch = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height,
    );
    const patchCanvas = document.createElement('canvas');
    patchCanvas.width = frame.dims.width;
    patchCanvas.height = frame.dims.height;
    const patchCtx = patchCanvas.getContext('2d')!;
    patchCtx.putImageData(patch, 0, 0);
    compCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);

    sampleCtx.clearRect(0, 0, cols, rows);
    sampleCtx.drawImage(comp, 0, 0, cols, rows);
    const imageData = sampleCtx.getImageData(0, 0, cols, rows);

    decoded.push({
      imageData,
      delay: Math.max(16, (frame.delay || 10) * (10 / speed)),
    });

    if (frame.disposalType === 2) {
      compCtx.clearRect(
        frame.dims.left,
        frame.dims.top,
        frame.dims.width,
        frame.dims.height,
      );
    }
  }

  return decoded;
}

function buildAlphaCache(baseColor: string): Record<string, string> {
  const cache: Record<string, string> = {};
  for (let i = 0; i <= 20; i++) {
    const alpha = parseFloat((i * 0.05).toFixed(2));
    cache[alpha.toFixed(2)] = applyAlpha(baseColor, alpha);
  }
  return cache;
}

function quantizeAlpha(alpha: number): string {
  return (Math.round(alpha * 20) / 20).toFixed(2);
}

export function AsciiCanvas({
  config,
  cols = 80,
  rows = 40,
  fontSize = 10,
  color = 'var(--color-ring)',
  className = '',
}: AsciiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchRef = useRef(false);

  const allFrames = useRef<Map<string, GifFrame[]>>(new Map());
  const frameIdx = useRef(0);
  const activeSrcRef = useRef<SrcConfig | null>(null);
  const vignetteRef = useRef<HTMLCanvasElement | null>(null);

  const resolvedColorRef = useRef<string>('');
  const alphaCacheRef = useRef<Record<string, string>>({});
  const glitchRedCacheRef = useRef<Record<string, string>>({});
  const glitchBlueCacheRef = useRef<Record<string, string>>({});

  const charW = Math.ceil(fontSize * 0.6);
  const charH = fontSize;
  const canvasW = cols * charW;
  const canvasH = rows * charH;

  const srcKey = Array.isArray(config)
    ? config.map((s) => (typeof s === 'string' ? s : s.src)).join('|')
    : typeof config === 'string'
      ? config
      : (config as SrcConfig).src;

  useEffect(() => {
    const resolved = resolveColorOnce(color);
    resolvedColorRef.current = resolved;
    alphaCacheRef.current = buildAlphaCache(resolved);
    glitchRedCacheRef.current = buildAlphaCache('rgb(255,20,70)');
    glitchBlueCacheRef.current = buildAlphaCache('rgb(20,100,255)');
  }, [color]);

  useEffect(() => {
    let cancelled = false;

    const vc = document.createElement('canvas');
    vc.width = canvasW;
    vc.height = canvasH;
    const vctx = vc.getContext('2d')!;
    const cx = canvasW / 2;
    const cy = canvasH / 2;
    const rad = Math.max(canvasW, canvasH) * 0.58;
    const grad = vctx.createRadialGradient(cx, cy, rad * 0.25, cx, cy, rad);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.55, 'rgba(0,0,0,0.1)');
    grad.addColorStop(0.68, 'rgba(0,0,0,0.5)');
    grad.addColorStop(0.85, 'rgba(0,0,0,0.82)');
    grad.addColorStop(1, 'rgba(0,0,0,1.0)');
    vctx.fillStyle = grad;
    vctx.fillRect(0, 0, canvasW, canvasH);
    vignetteRef.current = vc;

    const configs = normaliseConfig(config);

    const loadAll = async () => {
      await Promise.all(
        configs.map(async (cfg) => {
          const frames = await decodeGif(cfg.src, cols, rows, cfg.speed!);
          if (!cancelled) allFrames.current.set(cfg.src, frames);
        }),
      );
      if (cancelled) return;

      activeSrcRef.current = configs[0];
      frameIdx.current = 0;
      startLoop();
    };

    const pickOtherConfig = (): SrcConfig => {
      if (configs.length === 1) return configs[0];
      let next = activeSrcRef.current;
      while (next?.src === activeSrcRef.current?.src) {
        next = configs[Math.floor(Math.random() * configs.length)];
      }
      return next!;
    };

    const drawPass = (
      ctx: CanvasRenderingContext2D,
      data: Uint8ClampedArray,
      isGlitching: boolean,
      alphaCache: Record<string, string>,
      offsetX: number,
      blackThresh: number,
      ditherAmt: number,
    ) => {
      const batches: Map<string, Array<[number, number, string]>> = new Map();

      for (let row = 0; row < rows; row++) {
        if (isGlitching) {
          const rng = Math.random();
          if (rng < 0.18) {
            const shift = (Math.random() - 0.5) * canvasW * 0.35;
            ctx.setTransform(1, 0, 0, 1, shift + offsetX, 0);
          } else if (rng < 0.28) {
            const scaleX = 0.7 + Math.random() * 0.6;
            const skewY = (Math.random() - 0.5) * 0.15;
            const shift = (Math.random() - 0.5) * charW * 8;
            ctx.setTransform(scaleX, skewY, 0, 1, shift + offsetX, 0);
          } else if (rng < 0.33) {
            ctx.setTransform(
              1,
              0,
              0,
              0.25 + Math.random() * 0.4,
              offsetX,
              row * charH * 0.6,
            );
          } else {
            ctx.setTransform(1, 0, 0, 1, offsetX, 0);
          }

          for (const [style, calls] of batches) {
            ctx.fillStyle = style;
            for (const [x, y, ch] of calls) ctx.fillText(ch, x, y);
          }
          batches.clear();
        } else {
          ctx.setTransform(1, 0, 0, 1, offsetX, 0);
        }

        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 4;
          const r = data[i],
            g = data[i + 1],
            b = data[i + 2],
            a = data[i + 3];
          if (a < 10) continue;

          let luma = 0.299 * r + 0.587 * g + 0.114 * b;
          if (ditherAmt > 0)
            luma = Math.min(255, luma + bayerThreshold(col, row) * ditherAmt);

          let ch: string;
          if (isGlitching && Math.random() < 0.05) {
            ch =
              PALETTE_GLITCH[Math.floor(Math.random() * PALETTE_GLITCH.length)];
          } else {
            const jitter = (Math.random() - 0.5) * 0.08 * 255;
            ch = lumaToChar(
              Math.max(0, Math.min(255, luma + jitter)),
              blackThresh,
            );
          }
          if (ch === ' ') continue;

          const alpha = isGlitching
            ? 0.4 + Math.random() * 0.6
            : 0.25 + (luma / 255) * 0.75;

          const alphaKey = quantizeAlpha(alpha);
          const style =
            alphaCache[alphaKey] ?? applyAlpha(resolvedColorRef.current, alpha);

          if (!batches.has(style)) batches.set(style, []);
          batches.get(style)!.push([col * charW, row * charH, ch]);
        }
      }

      for (const [style, calls] of batches) {
        ctx.fillStyle = style;
        for (const [x, y, ch] of calls) ctx.fillText(ch, x, y);
      }
      batches.clear();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const renderFrame = (imageData: ImageData, cfg: SrcConfig) => {
      const canvas = canvasRef.current;
      const vignette = vignetteRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isGlitching = glitchRef.current;
      const { data } = imageData;

      const mainCache = alphaCacheRef.current;
      const redCache = glitchRedCacheRef.current;
      const blueCache = glitchBlueCacheRef.current;

      canvas.style.opacity = String(cfg.opacity!);

      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
      ctx.textBaseline = 'top';

      if (isGlitching) {
        const shift = charW * (1 + Math.random() * 1.5);
        ctx.globalCompositeOperation = 'screen';
        drawPass(
          ctx,
          data,
          true,
          redCache,
          -shift,
          cfg.blackThreshold!,
          cfg.dither!,
        );
        drawPass(
          ctx,
          data,
          true,
          blueCache,
          shift,
          cfg.blackThreshold!,
          cfg.dither!,
        );
        ctx.globalCompositeOperation = 'source-over';
        drawPass(
          ctx,
          data,
          true,
          mainCache,
          0,
          cfg.blackThreshold!,
          cfg.dither!,
        );
      } else {
        drawPass(
          ctx,
          data,
          false,
          mainCache,
          0,
          cfg.blackThreshold!,
          cfg.dither!,
        );
      }

      if (vignette) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(vignette, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
      }
    };

    const startLoop = () => {
      const advance = () => {
        const cfg = activeSrcRef.current;
        if (!cfg) return;
        const frames = allFrames.current.get(cfg.src);
        if (!frames || !frames.length) return;

        const frame = frames[frameIdx.current];
        renderFrame(frame.imageData, cfg);
        frameIdx.current = (frameIdx.current + 1) % frames.length;
        frameTimer.current = setTimeout(advance, frame.delay);
      };
      advance();
    };

    const scheduleGlitch = () => {
      glitchTimer.current = setTimeout(
        () => {
          glitchRef.current = true;

          if (configs.length > 1) {
            const next = pickOtherConfig();
            activeSrcRef.current = next;
            frameIdx.current = 0;
          }

          setTimeout(
            () => {
              glitchRef.current = false;
              scheduleGlitch();
            },
            250 + Math.random() * 500,
          );
        },
        3000 + Math.random() * 7000,
      );
    };
    scheduleGlitch();

    loadAll();

    const raf = rafRef.current;

    return () => {
      cancelled = true;
      const fTimer = frameTimer.current;
      const gTimer = glitchTimer.current;
      cancelAnimationFrame(raf);
      if (fTimer) clearTimeout(fTimer);
      if (gTimer) clearTimeout(gTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcKey, cols, rows, fontSize, charW, charH, canvasW, canvasH, color]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasW}
      height={canvasH}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}

function resolveColorOnce(color: string): string {
  if (!color.startsWith('var(')) return color;
  const match = color.match(/var\((--[^)]+)\)/);
  if (!match) return '#00ff88';
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue(match[1])
    .trim();
  return val || '#00ff88';
}

function applyAlpha(color: string, alpha: number): string {
  if (color.startsWith('#')) return hexToRgba(color, alpha);
  if (color.startsWith('rgb('))
    return color.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
  if (color.startsWith('rgba('))
    return color.replace(/,\s*[\d.]+\)$/, `,${alpha})`);
  return `rgba(${color},${alpha})`;
}

function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace('#', '');
  return `rgba(${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)},${alpha})`;
}
