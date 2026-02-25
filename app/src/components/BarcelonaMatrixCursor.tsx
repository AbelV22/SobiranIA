import { useEffect, useRef, useState } from 'react';

interface MatrixCell {
  char: string;
  y: number;
  brightness: number;
}

export function BarcelonaMatrixCursor({ 
  imageSrc, 
  className = '' 
}: { 
  imageSrc: string; 
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const imageRef = useRef<HTMLImageElement | null>(null);
  const matrixDataRef = useRef<MatrixCell[][]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const frameRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const CHARS = '01';
  const RADIUS = 120;
  const COLS = 40;

  useEffect(() => {
    const container = containerRef.current;
    const baseCanvas = baseCanvasRef.current;
    const matrixCanvas = matrixCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    
    if (!container || !baseCanvas || !matrixCanvas || !overlayCanvas) return;

    const baseCtx = baseCanvas.getContext('2d');
    const matrixCtx = matrixCanvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    
    if (!baseCtx || !matrixCtx || !overlayCtx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      [baseCanvas, matrixCanvas, overlayCanvas].forEach(c => {
        c.width = width * dpr;
        c.height = height * dpr;
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      });
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      matrixCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      imageRef.current = img;
      
      // Dibujar imagen base en B/N
      baseCtx.filter = 'grayscale(100%) contrast(1.3) brightness(0.7)';
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
      
      baseCtx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
      baseCtx.filter = 'none';

      // Crear datos Matrix
      const colWidth = width / COLS;
      matrixDataRef.current = [];
      
      for (let i = 0; i < COLS; i++) {
        const col: MatrixCell[] = [];
        const charsInCol = Math.ceil(height / colWidth) + 2;
        
        for (let j = 0; j < charsInCol; j++) {
          col.push({
            char: CHARS[Math.floor(Math.random() * CHARS.length)],
            y: j * colWidth - colWidth,
            brightness: Math.random()
          });
        }
        matrixDataRef.current.push(col);
      }
      
      setIsReady(true);
    };
    
    img.src = imageSrc;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    matrixCtx.font = 'bold 14px monospace';
    matrixCtx.textAlign = 'center';
    matrixCtx.textBaseline = 'middle';

    let time = 0;
    
    const animate = () => {
      time += 0.016;
      const mouse = mouseRef.current;
      const colWidth = width / COLS;

      // Limpiar canvas de overlay
      overlayCtx.clearRect(0, 0, width, height);

      if (mouse.active) {
        // Actualizar y dibujar Matrix
        matrixCtx.clearRect(0, 0, width, height);
        
        matrixDataRef.current.forEach((col, colIdx) => {
          const x = colIdx * colWidth + colWidth / 2;
          
          col.forEach((cell, cellIdx) => {
            // Mover caracteres hacia abajo
            cell.y += 40 * 0.016; // velocidad
            
            if (cell.y > height + colWidth) {
              cell.y = -colWidth;
              cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
            }

            // Solo dibujar si está cerca del cursor
            const dist = Math.hypot(x - mouse.x, cell.y - mouse.y);
            if (dist < RADIUS) {
              const intensity = 1 - (dist / RADIUS);
              const headPos = (time * 2) % col.length;
              const isHead = Math.abs(cellIdx - headPos) < 1;
              
              matrixCtx.save();
              matrixCtx.translate(x, cell.y);
              
              if (isHead) {
                matrixCtx.shadowBlur = 15;
                matrixCtx.shadowColor = '#FFFFFF';
                matrixCtx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
              } else {
                matrixCtx.shadowBlur = 8;
                matrixCtx.shadowColor = '#00CED1';
                matrixCtx.fillStyle = `rgba(0, 206, 209, ${intensity * 0.8})`;
              }
              
              matrixCtx.fillText(cell.char, 0, 0);
              matrixCtx.restore();
            }
          });
        });

        // Crear máscara circular en overlay
        overlayCtx.save();
        overlayCtx.beginPath();
        overlayCtx.arc(mouse.x, mouse.y, RADIUS, 0, Math.PI * 2);
        overlayCtx.clip();
        
        // Dibujar el canvas Matrix dentro del círculo
        overlayCtx.drawImage(matrixCanvas, 0, 0);
        
        // Borde brillante del círculo
        overlayCtx.strokeStyle = 'rgba(0, 206, 209, 0.8)';
        overlayCtx.lineWidth = 2;
        overlayCtx.shadowBlur = 20;
        overlayCtx.shadowColor = '#00CED1';
        overlayCtx.stroke();
        
        overlayCtx.restore();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    if (isReady) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, [isReady, imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: '#0A0A0F' }}
    >
      {/* Capa 1: Barcelona B/N */}
      <canvas
        ref={baseCanvasRef}
        className="absolute inset-0"
        style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.5s' }}
      />
      
      {/* Capa 2: Matrix (oculta, se usa como fuente para el overlay) */}
      <canvas
        ref={matrixCanvasRef}
        className="absolute inset-0"
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
      
      {/* Capa 3: Overlay con el círculo del cursor */}
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Gradient para legibilidad del texto */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10, 10, 15, 0.88) 0%, rgba(10, 10, 15, 0.4) 35%, rgba(10, 10, 15, 0.15) 65%, rgba(10, 10, 15, 0.35) 100%),
            linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.2) 25%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}

export default BarcelonaMatrixCursor;
