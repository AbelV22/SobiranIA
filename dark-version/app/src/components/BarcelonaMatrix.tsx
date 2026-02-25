import { useEffect, useRef, useState } from 'react';

interface Stream {
  x: number;
  chars: { char: string; y: number; brightness: number }[];
  speed: number;
  active: boolean;
}

export function BarcelonaMatrix({ 
  imageSrc, 
  className = '' 
}: { 
  imageSrc: string; 
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamsRef = useRef<Stream[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const frameRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const CHARS = '01';
  const COLUMN_WIDTH = 16;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!container || !canvas || !bgCanvas) return;

    const ctx = canvas.getContext('2d');
    const bgCtx = bgCanvas.getContext('2d');
    if (!ctx || !bgCtx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      [canvas, bgCanvas].forEach(c => {
        c.width = width * dpr;
        c.height = height * dpr;
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Dibujar imagen de fondo en escala de grises
      bgCtx.filter = 'grayscale(100%) contrast(1.2) brightness(0.8)';
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      
      if (imgAspect > canvasAspect) {
        sw = img.height * canvasAspect;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / canvasAspect;
        sy = (img.height - sh) / 2;
      }
      
      bgCtx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
      bgCtx.filter = 'none';

      // Crear streams de código
      const columns = Math.floor(width / COLUMN_WIDTH);
      const streams: Stream[] = [];
      
      for (let i = 0; i < columns; i++) {
        const x = i * COLUMN_WIDTH + COLUMN_WIDTH / 2;
        const streamLength = 5 + Math.floor(Math.random() * 10);
        const chars = [];
        
        for (let j = 0; j < streamLength; j++) {
          chars.push({
            char: CHARS[Math.floor(Math.random() * CHARS.length)],
            y: Math.random() * height,
            brightness: 1 - (j / streamLength)
          });
        }
        
        streams.push({
          x,
          chars,
          speed: 30 + Math.random() * 40,
          active: Math.random() > 0.3
        });
      }
      
      streamsRef.current = streams;
      setIsReady(true);
    };
    
    img.src = imageSrc;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
    };

    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resize);

    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let lastTime = performance.now();
    
    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const chaos = scrollRef.current * 2;
      const mouse = mouseRef.current;

      // Clear canvas principal
      ctx.clearRect(0, 0, width, height);

      // Dibujar streams
      streamsRef.current.forEach((stream) => {
        if (!stream.active) return;

        // Deformación si el mouse está en la parte derecha
        let offsetX = 0;
        if (mouse.x > width * 0.5) {
          const dist = Math.abs(stream.x - mouse.x);
          const radius = 120;
          if (dist < radius) {
            const strength = (1 - dist / radius) * 30 * Math.sin(now * 0.01);
            offsetX = strength;
          }
        }

        // Actualizar posiciones
        stream.chars.forEach((char, idx) => {
          char.y += stream.speed * dt;
          
          if (char.y > height + 20) {
            char.y = -20;
            char.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          }

          // Calcular brillo basado en posición en stream
          const headIdx = Math.floor((now * 0.1) % stream.chars.length);
          const distFromHead = Math.abs(idx - headIdx);
          const brightness = Math.max(0.1, 1 - distFromHead * 0.2);
          
          // Color cyan con variación
          const alpha = brightness * (0.3 + chaos * 0.4);
          const isHead = idx === headIdx;
          
          ctx.save();
          ctx.translate(stream.x + offsetX, char.y);
          
          if (isHead) {
            // Cabeza brillante
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00FFFF';
            ctx.fillStyle = `rgba(200, 255, 255, ${alpha})`;
          } else {
            // Cuerpo
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(0, 200, 220, ${alpha})`;
          }
          
          ctx.fillText(char.char, 0, 0);
          ctx.restore();
        });
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    if (isReady) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
    };
  }, [isReady, imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: '#0A0A0F' }}
    >
      {/* Canvas de fondo con Barcelona B/N */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0"
        style={{ opacity: isReady ? 0.5 : 0, transition: 'opacity 0.5s' }}
      />
      
      {/* Canvas de streams */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10, 10, 15, 0.9) 0%, rgba(10, 10, 15, 0.5) 35%, rgba(10, 10, 15, 0.2) 70%, rgba(10, 10, 15, 0.4) 100%),
            linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.3) 25%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}

export default BarcelonaMatrix;
