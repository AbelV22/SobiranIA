import { useEffect, useRef, useState } from 'react';

export function BarcelonaMatrixV2({ 
  imageSrc, 
  className = '' 
}: { 
  imageSrc: string; 
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  
  const mousePos = useRef<{x: number; y: number} | null>(null);
  const chars = useRef<{char: string; x: number; y: number}[]>([]);
  const rafRef = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isReadyRef = useRef(false);

  // Sync isReady state with ref
  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    
    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    resize();

    // Crear caracteres iniciales solo si están vacíos
    if (chars.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        chars.current.push({
          char: Math.random() > 0.5 ? '1' : '0',
          x: Math.random() * width,
          y: Math.random() * height
        });
      }
    }

    // Cargar imagen solo una vez
    if (!imgRef.current) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setIsReady(true);
      };
      img.src = imageSrc;
      imgRef.current = img;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    const handleMouseLeave = () => {
      mousePos.current = null;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    let y = 0;
    let autoTime = 0;
    const animate = () => {
      // Limpiar
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, width, height);

      // Dibujar imagen B/N
      if (isReadyRef.current && imgRef.current) {
        ctx.filter = 'grayscale(100%) brightness(0.6)';
        ctx.drawImage(imgRef.current, 0, 0, width, height);
        ctx.filter = 'none';
      }

      // Actualizar posiciones
      y += 2;
      if (y > 20) y = 0;
      
      // Punto de animación: centro automático si no hay mouse
      autoTime += 0.02;
      const hasMouse = mousePos.current !== null;
      const mx = hasMouse ? mousePos.current!.x : width * 0.3 + Math.sin(autoTime) * (width * 0.2);
      const my = hasMouse ? mousePos.current!.y : height * 0.5 + Math.cos(autoTime * 0.7) * (height * 0.2);
      const radius = hasMouse ? 120 : 150; // Radio más grande por defecto

      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';

      chars.current.forEach((c) => {
        c.y += 3;
        if (c.y > height) {
          c.y = -20;
          c.x = Math.random() * width;
          c.char = Math.random() > 0.5 ? '1' : '0';
        }

        const dist = Math.hypot(c.x - mx, c.y - my);
        if (dist < radius) {
          const alpha = 1 - (dist / radius);
          ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00FFFF';
          ctx.fillText(c.char, c.x, c.y);
          ctx.shadowBlur = 0;
        }
      });

      // Dibujar círculo indicador
      ctx.beginPath();
      ctx.arc(mx, my, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(animate);
    };

    // Iniciar animación solo si no está corriendo
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, [imageSrc]); // Removido isReady de las dependencias

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: '#0A0A0F' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10, 10, 15, 0.85) 0%, rgba(10, 10, 15, 0.4) 35%, rgba(10, 10, 15, 0.15) 65%, rgba(10, 10, 15, 0.35) 100%),
            linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.2) 25%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}

export default BarcelonaMatrixV2;
