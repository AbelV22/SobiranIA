import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  brightness: number;
}

export function BarcelonaConstructSimple({ 
  imageSrc, 
  className = '' 
}: { 
  imageSrc: string; 
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const frameRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      bgImageRef.current = img;
      
      // Crear canvas temporal para análisis
      const tempCanvas = document.createElement('canvas');
      const analysisW = 200;
      const analysisH = Math.floor(analysisW * (img.height / img.width));
      tempCanvas.width = analysisW;
      tempCanvas.height = analysisH;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) return;

      // Dibujar imagen con alto contraste para detectar bordes
      tempCtx.filter = 'grayscale(100%) contrast(1.5) brightness(0.9)';
      tempCtx.drawImage(img, 0, 0, analysisW, analysisH);
      const imageData = tempCtx.getImageData(0, 0, analysisW, analysisH);
      const data = imageData.data;

      // Crear partículas SOLO en bordes y detalles (no en fondo plano)
      const particles: Particle[] = [];
      const step = 2; // Cada 2px para más densidad
      const scaleX = width / analysisW;
      const scaleY = height / analysisH;

      for (let y = 1; y < analysisH - 1; y += step) {
        for (let x = 1; x < analysisW - 1; x += step) {
          const idx = (y * analysisW + x) * 4;
          const brightness = data[idx];
          
          // Detectar bordes: diferencia con píxeles vecinos
          const left = data[((y) * analysisW + (x - 1)) * 4];
          const right = data[((y) * analysisW + (x + 1)) * 4];
          const up = data[((y - 1) * analysisW + (x)) * 4];
          const down = data[((y + 1) * analysisW + (x)) * 4];
          
          const edge = Math.abs(brightness - left) + Math.abs(brightness - right) + 
                       Math.abs(brightness - up) + Math.abs(brightness - down);
          
          // Crear partículas en bordes O en áreas claras (no fondo negro)
          if (edge > 20 || brightness > 80) {
            const targetX = x * scaleX;
            const targetY = y * scaleY;
            
            particles.push({
              x: targetX,
              y: targetY,
              targetX,
              targetY,
              vx: 0,
              vy: 0,
              size: 1.5 + (brightness / 255) * 3,
              brightness: 0.5 + (brightness / 255) * 0.5,
            });
          }
        }
      }

      particlesRef.current = particles;
      console.log(`Created ${particles.length} particles on edges/details`);
      setIsReady(true);
    };
    
    img.src = imageSrc;

    // Mouse tracking
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

    // Loop de animación
    let lastTime = performance.now();
    
    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const chaos = scrollRef.current * 2.5;
      const mouse = mouseRef.current;

      // Clear
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, width, height);
      
      // Dibujar imagen de fondo (Barcelona visible)
      if (bgImageRef.current) {
        ctx.save();
        ctx.globalAlpha = 0.35; // 35% opacidad para que se vea pero no domine
        ctx.filter = 'grayscale(100%) contrast(1.2)';
        
        // Ajustar imagen al canvas
        const imgAspect = bgImageRef.current.width / bgImageRef.current.height;
        const canvasAspect = width / height;
        let sx = 0, sy = 0, sw = bgImageRef.current.width, sh = bgImageRef.current.height;
        
        if (imgAspect > canvasAspect) {
          sw = bgImageRef.current.height * canvasAspect;
          sx = (bgImageRef.current.width - sw) / 2;
        } else {
          sh = bgImageRef.current.width / canvasAspect;
          sy = (bgImageRef.current.height - sh) / 2;
        }
        
        ctx.drawImage(bgImageRef.current, sx, sy, sw, sh, 0, 0, width, height);
        ctx.restore();
      }

      // Actualizar y dibujar partículas BRILLANTES encima
      particlesRef.current.forEach((p, i) => {
        // Física: resorte hacia objetivo
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        
        const springStrength = 6 * (1 - chaos * 0.25);
        p.vx += dx * springStrength * dt;
        p.vy += dy * springStrength * dt;
        
        // Caos
        if (chaos > 0) {
          const time = now * 0.001;
          const noiseX = Math.sin(time + i * 0.1) * Math.cos(time * 0.7 + i * 0.05);
          const noiseY = Math.cos(time + i * 0.15) * Math.sin(time * 0.8 + i * 0.03);
          p.vx += noiseX * 250 * chaos * dt;
          p.vy += noiseY * 250 * chaos * dt;
        }
        
        // Repulsión del mouse
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const dist = Math.hypot(mdx, mdy);
        if (dist < 140 && dist > 0) {
          const force = (1 - dist / 140) * 1000;
          p.vx += (mdx / dist) * force * dt;
          p.vy += (mdy / dist) * force * dt;
        }
        
        // Amortiguación
        p.vx *= 0.9;
        p.vy *= 0.9;
        
        // Actualizar posición
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Dibujar partícula BRILLANTE
        const speed = Math.hypot(p.vx, p.vy);
        
        // Glow effect
        ctx.shadowBlur = 8 + speed * 0.1;
        ctx.shadowColor = '#22D3EE';
        
        // Color: Cyan brillante
        const intensity = p.brightness + (speed / 200);
        ctx.fillStyle = `rgba(34, 211, 238, ${Math.min(1, intensity)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
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
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ 
          touchAction: 'none',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10, 10, 15, 0.85) 0%, rgba(10, 10, 15, 0.4) 35%, rgba(10, 10, 15, 0.1) 65%, rgba(10, 10, 15, 0.3) 100%),
            linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.2) 30%, transparent 60%)
          `,
        }}
      />
    </div>
  );
}

export default BarcelonaConstructSimple;
