import { useEffect, useRef, useState, useCallback } from 'react';

interface Tile {
  sx: number; // source x on pre-rendered canvas
  sy: number; // source y on pre-rendered canvas
  x: number;
  y: number;
  w: number;
  h: number;
  dissolved: boolean;
  floatX: number;
  floatY: number;
  velocity: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  fadeSpeed: number;
  toCyan: boolean;
  delay: number;
  started: boolean;
  dead: boolean;
}

interface PixelDissolutionCanvasProps {
  imageSrc: string;
  className?: string;
}

export function PixelDissolutionCanvas({ imageSrc, className = '' }: PixelDissolutionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<Tile[]>([]);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const scrollRef = useRef<number>(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleScroll = useCallback(() => {
    const heroH = window.innerHeight;
    scrollRef.current = Math.min(window.scrollY / heroH, 1);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.innerWidth < 768;
    const TILE_SIZE = isMobile ? 26 : 16;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      dimensionsRef.current = { w, h };

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Pre-render grayscale image to source canvas
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = w;
      srcCanvas.height = h;
      const srcCtx = srcCanvas.getContext('2d');
      if (!srcCtx) return;

      srcCtx.filter = 'grayscale(100%) contrast(1.15) brightness(0.9)';
      const imgAspect = img.width / img.height;
      const canvasAspect = w / h;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgAspect > canvasAspect) {
        sw = img.height * canvasAspect;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / canvasAspect;
        sy = (img.height - sh) / 2;
      }
      srcCtx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      srcCtx.filter = 'none';
      sourceCanvasRef.current = srcCanvas;

      // Create tiles
      const cols = Math.ceil(w / TILE_SIZE);
      const rows = Math.ceil(h / TILE_SIZE);
      const tiles: Tile[] = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * TILE_SIZE;
          const y = row * TILE_SIZE;
          const tw = Math.min(TILE_SIZE, w - x);
          const th = Math.min(TILE_SIZE, h - y);
          if (tw <= 0 || th <= 0) continue;

          const horizontalFactor = col / cols;
          // More dissolution on the right, some random on left for organic feel
          const dissolveChance = Math.pow(horizontalFactor, 1.2) * 0.9 + (horizontalFactor > 0.3 ? 0.05 : 0);
          const willDissolve = Math.random() < dissolveChance;

          tiles.push({
            sx: x, sy: y, x, y, w: tw, h: th,
            dissolved: false,
            floatX: 0,
            floatY: 0,
            velocity: 15 + Math.random() * 50,
            velocityY: (Math.random() - 0.5) * 25,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 2.5,
            opacity: 1,
            fadeSpeed: 0.25 + Math.random() * 0.4,
            toCyan: Math.random() < 0.18,
            delay: willDissolve ? (horizontalFactor * 4 + Math.random() * 2) : 999,
            started: false,
            dead: false,
          });
        }
      }

      tilesRef.current = tiles;
      setIsLoaded(true);
      lastTimeRef.current = performance.now();
      elapsedRef.current = 0;
    };

    img.onerror = () => {
      setIsLoaded(true);
    };

    img.src = imageSrc;

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [imageSrc]);

  // Separate animation loop
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    lastTimeRef.current = performance.now();

    function animate() {
      if (!ctx || !canvas) return;

      const now = performance.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      elapsedRef.current += dt;

      const { w, h } = dimensionsRef.current;
      const scrollMult = 1 + scrollRef.current * 3;
      const time = elapsedRef.current * scrollMult;
      const srcCanvas = sourceCanvasRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const tiles = tilesRef.current;
      let allDead = true;

      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        if (t.dead) continue;
        allDead = false;

        if (time > t.delay && !t.started) {
          t.started = true;
          t.dissolved = true;
        }

        if (t.dissolved && t.started) {
          t.floatX += t.velocity * dt * scrollMult;
          t.floatY += t.velocityY * dt;
          t.rotation += t.rotationSpeed * dt;
          t.opacity -= t.fadeSpeed * dt * scrollMult * 0.5;

          if (t.opacity <= 0) {
            t.dead = true;
            continue;
          }

          ctx.save();
          ctx.globalAlpha = t.opacity;
          const dx = t.x + t.floatX;
          const dy = t.y + t.floatY;
          ctx.translate(dx + t.w / 2, dy + t.h / 2);
          ctx.rotate(t.rotation);

          if (t.toCyan && t.opacity < 0.65) {
            ctx.fillStyle = `rgba(34, 211, 238, ${t.opacity * 0.8})`;
            ctx.fillRect(-t.w / 2, -t.h / 2, t.w, t.h);
          } else if (srcCanvas) {
            ctx.drawImage(srcCanvas, t.sx, t.sy, t.w, t.h, -t.w / 2, -t.h / 2, t.w, t.h);
          }
          ctx.restore();
        } else if (!t.dissolved && srcCanvas) {
          ctx.drawImage(srcCanvas, t.sx, t.sy, t.w, t.h, t.x, t.y, t.w, t.h);
        }
      }

      if (!allDead) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* Multi-layer overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10, 10, 15, 0.9) 0%, rgba(10, 10, 15, 0.5) 35%, rgba(10, 10, 15, 0.15) 70%, rgba(10, 10, 15, 0.3) 100%),
            linear-gradient(to top, rgba(10, 10, 15, 1) 0%, rgba(10, 10, 15, 0.3) 20%, transparent 50%),
            linear-gradient(to bottom, rgba(10, 10, 15, 0.7) 0%, transparent 15%)
          `,
        }}
      />
    </div>
  );
}
