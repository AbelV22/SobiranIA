import { useEffect, useRef, useState } from 'react';

interface Stream {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  headIndex: number;
  density: number;
}

export function DigitalRainCanvas({ 
  imageSrc, 
  className = '' 
}: { 
  imageSrc: string; 
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamsRef = useRef<Stream[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const CHARS = '01{}[]<>/=+*~^⚡◉◆';
  
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = container.offsetWidth;
    let height = container.offsetHeight;

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
      // Crear canvas temporal para análisis de imagen (baja resolución)
      const analysisCanvas = document.createElement('canvas');
      const analysisW = Math.min(100, Math.floor(width / 20));
      const analysisH = Math.floor(analysisW * (height / width));
      analysisCanvas.width = analysisW;
      analysisCanvas.height = analysisH;
      const analysisCtx = analysisCanvas.getContext('2d');
      
      if (analysisCtx) {
        analysisCtx.drawImage(img, 0, 0, analysisW, analysisH);
        const imageData = analysisCtx.getImageData(0, 0, analysisW, analysisH).data;
        
        // Crear streams (máximo 60 para rendimiento)
        const streamCount = Math.min(60, Math.floor(width / 30));
        const streams: Stream[] = [];
        
        for (let i = 0; i < streamCount; i++) {
          const x = (i / streamCount) * width;
          
          // Samplear brillo de imagen
          const colX = Math.floor((i / streamCount) * analysisW);
          let brightness = 0;
          for (let y = 0; y < analysisH; y += 5) {
            const idx = (y * analysisW + colX) * 4;
            brightness += (imageData[idx] + imageData[idx + 1] + imageData[idx + 2]) / 3;
          }
          brightness = (brightness / (analysisH / 5)) / 255;
          
            // Crear streams en casi todas las áreas, con densidad variable
          const length = Math.floor(4 + brightness * 10);
          streams.push({
            x: x + (Math.random() - 0.5) * 6,
            y: Math.random() * height,
            speed: 25 + Math.random() * 35 + brightness * 25,
            length,
            chars: Array.from({ length }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
            headIndex: 0,
            density: 0.3 + brightness * 0.7,
          });
        }
        
        streamsRef.current = streams;
      }
      
      setIsReady(true);
    };
    
    img.src = imageSrc;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resize);

    // Setup context una sola vez
    ctx.font = '600 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let lastTime = performance.now();
    
    const animate = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Clear completo (más rápido que fade parcial)
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, width, height);

      const mouseX = mouseRef.current.x;

      // Dibujar streams
      streamsRef.current.forEach((stream) => {
        // Actualizar posición
        stream.y += stream.speed * dt;
        if (stream.y > height + 50) {
          stream.y = -50;
          // Actualizar caracteres periódicamente
          if (Math.random() > 0.7) {
            stream.chars = stream.chars.map(() => CHARS[Math.floor(Math.random() * CHARS.length)]);
          }
        }

        // Calcular distancia al mouse
        const distToMouse = Math.abs(stream.x - mouseX);
        const isNearMouse = distToMouse < 100;
        const mouseInfluence = isNearMouse ? 1 - (distToMouse / 100) : 0;
        
        // Dibujar cada carácter del stream
        for (let i = 0; i < stream.length; i++) {
          const charY = stream.y - (i * 18);
          if (charY < -20 || charY > height + 20) continue;
          
          const isHead = i === 0;
          const distFromHead = i;
          
          // Opacidad basada en posición
          let opacity = isHead ? 1 : Math.max(0.1, 0.7 - distFromHead * 0.15);
          opacity *= stream.density;
          
          // Efecto mouse
          if (mouseInfluence > 0) {
            opacity = Math.min(1, opacity + mouseInfluence * 0.5);
          }
          
          if (opacity < 0.05) continue;

          const x = stream.x;
          const y = charY;

          if (isHead) {
            // Head: blanco brillante con glow
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 10 + mouseInfluence * 15;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.font = '700 17px monospace';
          } else if (i === 1 && mouseInfluence > 0.3) {
            // Segundo carácter brillante cerca del mouse
            ctx.shadowColor = '#22D3EE';
            ctx.shadowBlur = 8;
            ctx.fillStyle = `rgba(67, 232, 249, ${opacity})`;
            ctx.font = '600 16px monospace';
          } else {
            // Body: cyan sin glow
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(34, 211, 238, ${opacity})`;
            ctx.font = '600 16px monospace';
          }
          
          ctx.fillText(stream.chars[i], x, y);
        }
      });

      // Resetear shadow
      ctx.shadowBlur = 0;

      frameRef.current = requestAnimationFrame(animate);
    };

    if (isReady) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
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
            linear-gradient(to right, rgba(10, 10, 15, 0.9) 0%, rgba(10, 10, 15, 0.5) 35%, rgba(10, 10, 15, 0.1) 70%, rgba(10, 10, 15, 0.3) 100%)
          `,
        }}
      />
    </div>
  );
}

export default DigitalRainCanvas;
