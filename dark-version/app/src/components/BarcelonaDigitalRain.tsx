import { useEffect, useRef, useCallback, useState } from 'react';

// ============================================
// TYPES
// ============================================
interface EdgePoint {
  x: number;
  y: number;
  intensity: number;
  normalX: number;
  normalY: number;
}

interface StreamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  life: number;
  maxLife: number;
  brightness: number;
  active: boolean;
}

interface SpatialHash {
  grid: Map<string, EdgePoint[]>;
  cellSize: number;
}

// ============================================
// CONSTANTS
// ============================================
const CONFIG = {
  edgeThreshold: 30,
  streamCount: 150,
  particlePoolSize: 800,
  cellSize: 50,
  mouseRadius: 80,
  baseSpeed: 60,
  bloomRadius: 15,
  bloomIntensity: 0.6,
};

const CHARS = '01{}[]<>/=+*~^⚡◉◆▣∆∑∏';

// ============================================
// EDGE DETECTION (Sobel Operator)
// ============================================
const detectEdges = (imageData: ImageData, width: number, height: number): EdgePoint[] => {
  const edges: EdgePoint[] = [];
  const data = imageData.data;
  
  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      // Center pixel index for reference
      
      // Sobel X
      const gx = 
        -1 * data[((y - 1) * width + (x - 1)) * 4] +
        -2 * data[((y) * width + (x - 1)) * 4] +
        -1 * data[((y + 1) * width + (x - 1)) * 4] +
        1 * data[((y - 1) * width + (x + 1)) * 4] +
        2 * data[((y) * width + (x + 1)) * 4] +
        1 * data[((y + 1) * width + (x + 1)) * 4];
      
      // Sobel Y
      const gy = 
        -1 * data[((y - 1) * width + (x - 1)) * 4] +
        -2 * data[((y - 1) * width + (x)) * 4] +
        -1 * data[((y - 1) * width + (x + 1)) * 4] +
        1 * data[((y + 1) * width + (x - 1)) * 4] +
        2 * data[((y + 1) * width + (x)) * 4] +
        1 * data[((y + 1) * width + (x + 1)) * 4];
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      
      if (magnitude > CONFIG.edgeThreshold) {
        const normalX = gx / magnitude;
        const normalY = gy / magnitude;
        edges.push({ x, y, intensity: magnitude / 255, normalX, normalY });
      }
    }
  }
  
  return edges;
};

// ============================================
// SPATIAL HASH GRID
// ============================================
const createSpatialHash = (edges: EdgePoint[], cellSize: number): SpatialHash => {
  const grid = new Map<string, EdgePoint[]>();
  
  edges.forEach(edge => {
    const cellX = Math.floor(edge.x / cellSize);
    const cellY = Math.floor(edge.y / cellSize);
    const key = `${cellX},${cellY}`;
    
    if (!grid.has(key)) {
      grid.set(key, []);
    }
    grid.get(key)!.push(edge);
  });
  
  return { grid, cellSize };
};

const querySpatialHash = (hash: SpatialHash, x: number, y: number, radius: number): EdgePoint[] => {
  const results: EdgePoint[] = [];
  const cellRadius = Math.ceil(radius / hash.cellSize);
  const cellX = Math.floor(x / hash.cellSize);
  const cellY = Math.floor(y / hash.cellSize);
  
  for (let dx = -cellRadius; dx <= cellRadius; dx++) {
    for (let dy = -cellRadius; dy <= cellRadius; dy++) {
      const key = `${cellX + dx},${cellY + dy}`;
      const cell = hash.grid.get(key);
      if (cell) {
        cell.forEach(edge => {
          const dist = Math.hypot(edge.x - x, edge.y - y);
          if (dist < radius) {
            results.push(edge);
          }
        });
      }
    }
  }
  
  return results;
};

// ============================================
// COMPONENT
// ============================================
export function BarcelonaDigitalRain({ 
  imageSrc, 
  className = '' 
}: { 
  imageSrc: string; 
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamCanvasRef = useRef<HTMLCanvasElement>(null);
  const bloomCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const edgesRef = useRef<EdgePoint[]>([]);
  const spatialHashRef = useRef<SpatialHash | null>(null);
  const particlesRef = useRef<StreamParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const scrollRef = useRef(0);
  const frameRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  // Initialize particle pool
  const initParticlePool = useCallback(() => {
    particlesRef.current = Array.from({ length: CONFIG.particlePoolSize }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, char: '0', life: 0, maxLife: 0, brightness: 0, active: false,
    }));
  }, []);

  // Spawn particle from edge
  const spawnParticle = useCallback((edge: EdgePoint) => {
    const pool = particlesRef.current;
    const inactive = pool.find(p => !p.active);
    
    if (inactive) {
      inactive.x = edge.x + (Math.random() - 0.5) * 20;
      inactive.y = edge.y + (Math.random() - 0.5) * 20;
      // Flow along normal vector + gravity
      inactive.vx = edge.normalX * 20 + (Math.random() - 0.5) * 10;
      inactive.vy = CONFIG.baseSpeed + edge.normalY * 30 + Math.random() * 20;
      inactive.char = CHARS[Math.floor(Math.random() * CHARS.length)];
      inactive.life = 0;
      inactive.maxLife = 2 + Math.random() * 2;
      inactive.brightness = 0.3 + edge.intensity * 0.7;
      inactive.active = true;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const bgCanvas = bgCanvasRef.current;
    const streamCanvas = streamCanvasRef.current;
    const bloomCanvas = bloomCanvasRef.current;
    
    if (!container || !bgCanvas || !streamCanvas || !bloomCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const streamCtx = streamCanvas.getContext('2d');
    const bloomCtx = bloomCanvas.getContext('2d');
    
    if (!bgCtx || !streamCtx || !bloomCtx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = container.offsetWidth;
    let height = container.offsetHeight;

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      
      [bgCanvas, streamCanvas, bloomCanvas].forEach(canvas => {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      });
      
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      streamCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bloomCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    initParticlePool();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // 1. Draw and process image for edge detection
      const analysisCanvas = document.createElement('canvas');
      const analysisW = 120;
      const analysisH = Math.floor(analysisW * (height / width));
      analysisCanvas.width = analysisW;
      analysisCanvas.height = analysisH;
      const analysisCtx = analysisCanvas.getContext('2d');
      
      if (analysisCtx) {
        // Draw grayscale for edge detection
        analysisCtx.filter = 'grayscale(100%) contrast(1.2)';
        analysisCtx.drawImage(img, 0, 0, analysisW, analysisH);
        const imageData = analysisCtx.getImageData(0, 0, analysisW, analysisH);
        
        // Detect edges
        edgesRef.current = detectEdges(imageData, analysisW, analysisH);
        
        // Scale edges to full size
        const scaleX = width / analysisW;
        const scaleY = height / analysisH;
        edgesRef.current = edgesRef.current.map(edge => ({
          ...edge,
          x: edge.x * scaleX,
          y: edge.y * scaleY,
        }));
        
        // Create spatial hash
        spatialHashRef.current = createSpatialHash(edgesRef.current, CONFIG.cellSize);
        
        // 2. Draw background image with glitch effect
        bgCtx.filter = 'grayscale(60%) contrast(1.1) brightness(0.7)';
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
      }
      
      setIsReady(true);
    };
    
    img.src = imageSrc;

    // Mouse tracking
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

    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resize);

    // Animation
    streamCtx.font = '600 14px monospace';
    streamCtx.textAlign = 'center';
    streamCtx.textBaseline = 'middle';

    let lastTime = performance.now();
    let frameCount = 0;
    
    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;
      frameCount++;

      const scrollMult = 1 + scrollRef.current * 2;
      const mouse = mouseRef.current;

      // Clear canvases (not background)
      streamCtx.clearRect(0, 0, width, height);
      bloomCtx.clearRect(0, 0, width, height);

      // Spawn particles from edges near mouse
      if (mouse.active && spatialHashRef.current && frameCount % 2 === 0) {
        const nearbyEdges = querySpatialHash(spatialHashRef.current, mouse.x, mouse.y, CONFIG.mouseRadius * 2);
        nearbyEdges.slice(0, 5).forEach(edge => {
          if (Math.random() > 0.3) spawnParticle(edge);
        });
      }

      // Spawn random particles from all edges
      if (frameCount % 3 === 0) {
        const randomEdges = edgesRef.current.slice(0, CONFIG.streamCount);
        randomEdges.forEach(edge => {
          if (Math.random() > 0.7) spawnParticle(edge);
        });
      }

      // Update and draw particles
      let activeCount = 0;
      particlesRef.current.forEach(p => {
        if (!p.active) return;
        activeCount++;

        // Update position
        p.x += p.vx * dt * scrollMult;
        p.y += p.vy * dt * scrollMult;
        p.life += dt;

        // Mouse influence
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONFIG.mouseRadius) {
            const force = (1 - dist / CONFIG.mouseRadius) * 100;
            p.vx += (dx / dist) * force * dt;
            p.vy += (dy / dist) * force * dt;
            p.brightness = Math.min(1, p.brightness + 0.1);
          }
        }

        // Check death
        if (p.life > p.maxLife || p.y > height + 50) {
          p.active = false;
          return;
        }

        const lifeProgress = p.life / p.maxLife;
        const opacity = (1 - lifeProgress) * p.brightness;
        
        if (opacity < 0.05) return;

        const isHead = lifeProgress < 0.2;
        
        // Draw to stream canvas
        if (isHead) {
          // Head: white with glow
          streamCtx.shadowColor = '#FFFFFF';
          streamCtx.shadowBlur = 15;
          streamCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          streamCtx.font = '700 15px monospace';
        } else {
          // Body: cyan
          streamCtx.shadowBlur = 0;
          streamCtx.fillStyle = `rgba(34, 211, 238, ${opacity})`;
          streamCtx.font = '600 14px monospace';
        }
        
        streamCtx.fillText(p.char, p.x, p.y);

        // Draw to bloom canvas for glow effect
        if (isHead && opacity > 0.5) {
          bloomCtx.fillStyle = `rgba(34, 211, 238, ${opacity * CONFIG.bloomIntensity})`;
          bloomCtx.beginPath();
          bloomCtx.arc(p.x, p.y, CONFIG.bloomRadius * (1 - lifeProgress * 0.5), 0, Math.PI * 2);
          bloomCtx.fill();
        }
      });

      // Reset shadows
      streamCtx.shadowBlur = 0;

      frameRef.current = requestAnimationFrame(animate);
    };

    if (isReady) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
    };
  }, [isReady, imageSrc, initParticlePool, spawnParticle]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: '#0A0A0F' }}
    >
      {/* Layer 1: Background Image */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0"
        style={{ opacity: isReady ? 0.4 : 0, transition: 'opacity 0.8s ease-out' }}
      />
      
      {/* Layer 2: Stream Particles */}
      <canvas
        ref={streamCanvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Layer 3: Bloom/Glow Effect */}
      <canvas
        ref={bloomCanvasRef}
        className="absolute inset-0"
        style={{ 
          mixBlendMode: 'screen',
          filter: 'blur(8px)',
          opacity: 0.8,
        }}
      />
      
      {/* Overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10, 10, 15, 0.9) 0%, rgba(10, 10, 15, 0.6) 40%, rgba(10, 10, 15, 0.2) 70%, rgba(10, 10, 15, 0.4) 100%),
            linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.4) 30%, transparent 60%)
          `,
        }}
      />
    </div>
  );
}

export default BarcelonaDigitalRain;
