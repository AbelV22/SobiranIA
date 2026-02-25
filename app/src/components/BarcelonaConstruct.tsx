import { useEffect, useRef, useCallback, useState } from 'react';
import Worker from '../workers/imageProcessor.worker?worker';

// ============================================
// BARCELONA CONSTRUCT
// Partículas que convergen para formar la imagen
// ============================================

interface Particle {
  // Posición actual
  x: number;
  y: number;
  z: number;
  
  // Posición objetivo (imagen)
  targetX: number;
  targetY: number;
  targetZ: number;
  
  // Velocidad
  vx: number;
  vy: number;
  vz: number;
  
  // Estado visual
  r: number;
  g: number;
  b: number;
  baseBrightness: number;
  currentBrightness: number;
  size: number;
  
  // Física
  chaosOffsetX: number;
  chaosOffsetY: number;
  chaosPhase: number;
  springStrength: number;
  damping: number;
  
  // Estado
  active: boolean;
  trail: { x: number; y: number; opacity: number }[];
}

interface MouseState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isActive: boolean;
  radius: number;
  force: number;
}

// ============================================
// CONFIGURACIÓN
// ============================================
const CONFIG = {
  MAX_PARTICLES: 12000,       // Máximo de partículas
  SPRING_STRENGTH: 0.25,      // Fuerza de resorte hacia objetivo (muy fuerte)
  CHAOS_SCALE: 0.15,
  MOUSE_REPULSION: 3000,
  MOUSE_RADIUS: 150,
  DAMPING: 0.94,              // Amortiguación (más suave)
  TRAIL_LENGTH: 4,
  FOCUS_DISTANCE: 0.5,
  DOF_STRENGTH: 6,            // Menos blur
  CHROMATIC_OFFSET: 2,
  PARTICLE_SIZE_MIN: 2.5,     // Partículas más grandes
  PARTICLE_SIZE_MAX: 4.5,
  GRID_SIZE: 100,
};

// ============================================
// UTILIDADES
// ============================================
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Perlin Noise simplificado (para UI thread)
class SimpleNoise {
  private perm: number[] = [];
  
  constructor() {
    for (let i = 0; i < 256; i++) this.perm[i] = Math.floor(Math.random() * 256);
    for (let i = 0; i < 256; i++) this.perm[256 + i] = this.perm[i];
  }
  
  noise(x: number, y: number) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    return (this.perm[X] + this.perm[Y]) / 512 - 0.5;
  }
}

const noise = new SimpleNoise();

// Spatial Hash Grid para optimizar colisiones
class SpatialHash {
  private grid: Map<string, Particle[]> = new Map();
  private cellSize: number;
  
  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }
  
  clear() {
    this.grid.clear();
  }
  
  insert(p: Particle) {
    const cellX = Math.floor(p.x / this.cellSize);
    const cellY = Math.floor(p.y / this.cellSize);
    const key = `${cellX},${cellY}`;
    
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(p);
  }
  
  query(x: number, y: number, radius: number): Particle[] {
    const results: Particle[] = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    
    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        const cell = this.grid.get(key);
        if (cell) {
          cell.forEach(p => {
            const dist = Math.hypot(p.x - x, p.y - y);
            if (dist < radius) results.push(p);
          });
        }
      }
    }
    return results;
  }
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export function BarcelonaConstruct({
  imageSrc,
  className = ''
}: {
  imageSrc: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const particlesRef = useRef<Particle[]>([]);
  const spatialHashRef = useRef<SpatialHash>(new SpatialHash(CONFIG.GRID_SIZE));
  const mouseRef = useRef<MouseState>({
    x: -1000, y: -1000, vx: 0, vy: 0, isActive: false,
    radius: CONFIG.MOUSE_RADIUS, force: CONFIG.MOUSE_REPULSION
  });
  
  const scrollRef = useRef(0);
  const timeRef = useRef(0);
  const frameRef = useRef(0);
  const lastMousePos = useRef({ x: -1000, y: -1000 });
  const [isReady, setIsReady] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  // Inicializar pool de partículas
  const initParticlePool = useCallback(() => {
    particlesRef.current = Array.from({ length: CONFIG.MAX_PARTICLES }, () => ({
      x: 0, y: 0, z: 0,
      targetX: 0, targetY: 0, targetZ: 0,
      vx: 0, vy: 0, vz: 0,
      r: 255, g: 255, b: 255,
      baseBrightness: 1,
      currentBrightness: 1,
      size: 2,
      chaosOffsetX: 0, chaosOffsetY: 0,
      chaosPhase: Math.random() * Math.PI * 2,
      springStrength: CONFIG.SPRING_STRENGTH,
      damping: CONFIG.DAMPING,
      active: false,
      trail: [],
    }));
  }, []);

  // Procesar imagen con Web Worker
  const processImage = useCallback(async (img: HTMLImageElement, width: number, height: number) => {
    return new Promise<void>((resolve) => {
      const canvas = document.createElement('canvas');
      const w = 250; // Aumentar resolución para más detalle
      const h = Math.floor(w * (height / width));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve();
        return;
      }

      // Dibujar y convertir a escala de grises
      ctx.filter = 'grayscale(100%)';
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      
      // Usar Web Worker
      const worker = new Worker();
      
      worker.onmessage = (e) => {
        const { particles: particleData, count } = e.data;
        
        // Asignar datos a pool de partículas
        const scaleX = width / w;
        const scaleY = height / h;
        
        particleData.forEach((data: any, i: number) => {
          if (i >= CONFIG.MAX_PARTICLES) return;
          
          const p = particlesRef.current[i];
          p.active = true;
          
          // Posición objetivo (imagen)
          p.targetX = data.targetX * scaleX;
          p.targetY = data.targetY * scaleY;
          p.targetZ = data.z;
          
          // Posición inicial: muy cerca del objetivo (convergencia rápida)
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 30; // Solo 0-30px de distancia
          p.x = p.targetX + Math.cos(angle) * distance;
          p.y = p.targetY + Math.sin(angle) * distance;
          p.z = data.z;
          
          // Velocidad inicial aleatoria
          p.vx = (Math.random() - 0.5) * 50;
          p.vy = (Math.random() - 0.5) * 50;
          p.vz = 0;
          
          // Color - convertir a paleta cyan/turquesa para efecto digital
          const intensity = data.brightness / 255;
          p.r = 20 + intensity * 60;   // R bajo
          p.g = 150 + intensity * 105; // G alto (cyan)
          p.b = 200 + intensity * 55;  // B muy alto (turquesa)
          p.baseBrightness = 0.4 + intensity * 0.8; // Brillo aumentado
          p.currentBrightness = p.baseBrightness;
          p.size = CONFIG.PARTICLE_SIZE_MIN + intensity * (CONFIG.PARTICLE_SIZE_MAX - CONFIG.PARTICLE_SIZE_MIN);
          
          // Caos individual
          p.chaosOffsetX = Math.random() * 1000;
          p.chaosOffsetY = Math.random() * 1000;
          
          // Trail
          p.trail = Array(CONFIG.TRAIL_LENGTH).fill(null).map(() => ({ x: p.x, y: p.y, opacity: 0 }));
        });
        
        setParticleCount(Math.min(count, CONFIG.MAX_PARTICLES));
        worker.terminate();
        resolve();
      };
      
      worker.postMessage({
        imageData,
        width,
        height,
        chaosScale: CONFIG.CHAOS_SCALE
      });
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Crear offscreen canvas para post-procesamiento
    const offscreen = document.createElement('canvas');
    offscreenCanvasRef.current = offscreen;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    initParticlePool();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      await processImage(img, width, height);
      setIsReady(true);
    };
    
    img.src = imageSrc;

    // Mouse tracking con velocidad
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      
      mouseRef.current.vx = (newX - lastMousePos.current.x) * 0.3;
      mouseRef.current.vy = (newY - lastMousePos.current.y) * 0.3;
      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
      mouseRef.current.isActive = true;
      
      lastMousePos.current = { x: newX, y: newY };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
      mouseRef.current.vx = 0;
      mouseRef.current.vy = 0;
    };

    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resize);

    // Loop de animación
    let lastTime = performance.now();
    let frameCount = 0;
    
    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;
      timeRef.current += dt;
      frameCount++;

      const mouse = mouseRef.current;
      const chaosFactor = scrollRef.current * 1.5; // 0 = formación perfecta, 1.5 = caos total
      const spatialHash = spatialHashRef.current;
      
      // Limpiar
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, width, height);
      offCtx.clearRect(0, 0, width, height);

      // Actualizar spatial hash cada 3 frames
      if (frameCount % 3 === 0) {
        spatialHash.clear();
        particlesRef.current.forEach(p => {
          if (p.active) spatialHash.insert(p);
        });
      }

      // Partículas cercanas al mouse (para efectos de luz)
      const nearbyParticles = mouse.isActive 
        ? spatialHash.query(mouse.x, mouse.y, mouse.radius * 1.5)
        : [];

      // Procesar partículas
      particlesRef.current.forEach((p, i) => {
        if (!p.active) return;

        // Solo procesar cada 2da partícula si hay muchas
        if (particleCount > 5000 && i % 2 !== frameCount % 2) {
          // Dibujar última posición conocida
          drawParticle(ctx, p, chaosFactor, mouse, false);
          return;
        }

        // Física: Fuerza de resorte hacia objetivo
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const springFx = dx * p.springStrength * (1 - chaosFactor * 0.5);
        const springFy = dy * p.springStrength * (1 - chaosFactor * 0.5);

        // Física: Caos Perlin
        const time = timeRef.current * 0.5;
        const chaosFx = noise.noise(p.x * 0.01 + time, p.chaosOffsetX) * 100 * chaosFactor;
        const chaosFy = noise.noise(p.y * 0.01 + time, p.chaosOffsetY) * 100 * chaosFactor;

        // Física: Repulsión del mouse
        let mouseFx = 0, mouseFy = 0;
        if (mouse.isActive) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const dist = Math.hypot(mdx, mdy);
          
          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * mouse.force;
            mouseFx = (mdx / dist) * force;
            mouseFy = (mdy / dist) * force;
            p.currentBrightness = Math.min(1.5, p.baseBrightness + 0.5);
          } else {
            p.currentBrightness = lerp(p.currentBrightness, p.baseBrightness, dt * 3);
          }
        } else {
          p.currentBrightness = lerp(p.currentBrightness, p.baseBrightness, dt * 3);
        }

        // Aplicar fuerzas
        p.vx += (springFx + chaosFx + mouseFx) * dt;
        p.vy += (springFy + chaosFy + mouseFy) * dt;
        
        // Amortiguación
        p.vx *= p.damping;
        p.vy *= p.damping;
        
        // Limitar velocidad máxima
        const maxSpeed = 500;
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
        
        // Actualizar posición
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Actualizar trail
        if (frameCount % 2 === 0) {
          p.trail.pop();
          p.trail.unshift({ x: p.x, y: p.y, opacity: p.currentBrightness });
        }

        // Dibujar
        drawParticle(ctx, p, chaosFactor, mouse, true, nearbyParticles.includes(p));
      });

      // Aplicar bloom en offscreen canvas
      applyBloom(ctx, offCtx, width, height);

      frameRef.current = requestAnimationFrame(animate);
    };

    const drawParticle = (
      context: CanvasRenderingContext2D,
      p: Particle,
      chaosFactor: number,
      _mouse: MouseState,
      _isUpdated: boolean,
      isNearMouse: boolean = false
    ) => {
      // Calcular desenfoque por profundidad (DOF simulado)
      const zDiff = Math.abs(p.z - CONFIG.FOCUS_DISTANCE);
      const blur = zDiff * CONFIG.DOF_STRENGTH;
      
      // Color con iluminación
      let r = p.r, g = p.g, b = p.b;
      
      if (isNearMouse) {
        // Iluminación especular cerca del mouse
        const intensity = 1.3;
        r = Math.min(255, r * intensity);
        g = Math.min(255, g * intensity);
        b = Math.min(255, b * intensity);
      }
      
      // Aberración cromática basada en velocidad
      const speed = Math.hypot(p.vx, p.vy);
      const chromatic = Math.min(1, speed / 100) * chaosFactor;

      // Dibujar trail
      if (speed > 30) {
        p.trail.forEach((t, idx) => {
          if (idx === 0) return;
          const trailOpacity = (1 - idx / p.trail.length) * t.opacity * 0.3;
          if (trailOpacity < 0.01) return;
          
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${trailOpacity})`;
          context.beginPath();
          context.arc(t.x, t.y, p.size * 0.6, 0, Math.PI * 2);
          context.fill();
        });
      }

      // Dibujar partícula principal
      context.save();
      
      if (blur > 0.5) {
        context.shadowBlur = blur;
        context.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
      }
      
      // Aberración cromática: dibujar 3 veces con offset
      if (chromatic > 0.1) {
        const offset = CONFIG.CHROMATIC_OFFSET * chromatic;
        
        // Canal rojo
        context.fillStyle = `rgba(${r}, 0, 0, ${p.currentBrightness * 0.8})`;
        context.beginPath();
        context.arc(p.x - offset, p.y, p.size, 0, Math.PI * 2);
        context.fill();
        
        // Canal verde
        context.fillStyle = `rgba(0, ${g}, 0, ${p.currentBrightness * 0.8})`;
        context.beginPath();
        context.arc(p.x, p.y - offset * 0.5, p.size, 0, Math.PI * 2);
        context.fill();
        
        // Canal azul
        context.fillStyle = `rgba(0, 0, ${b}, ${p.currentBrightness * 0.8})`;
        context.beginPath();
        context.arc(p.x + offset, p.y + offset * 0.5, p.size, 0, Math.PI * 2);
        context.fill();
      } else {
        // Normal
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.currentBrightness})`;
        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fill();
      }
      
      context.restore();
    };

    const applyBloom = (
      sourceCtx: CanvasRenderingContext2D,
      bloomCtx: CanvasRenderingContext2D,
      w: number,
      h: number
    ) => {
      // Copiar a bloom canvas con blur
      bloomCtx.filter = 'blur(12px) brightness(1.5)';
      bloomCtx.drawImage(canvas, 0, 0, w, h);
      bloomCtx.filter = 'none';
      
      // Componer de vuelta con screen blend
      sourceCtx.globalCompositeOperation = 'screen';
      sourceCtx.globalAlpha = 0.4;
      sourceCtx.drawImage(offscreen, 0, 0, w, h);
      sourceCtx.globalCompositeOperation = 'source-over';
      sourceCtx.globalAlpha = 1;
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
  }, [isReady, imageSrc, initParticlePool, processImage, particleCount]);

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
          transition: 'opacity 1s ease-out',
        }}
      />
      
      {/* Gradient overlay para legibilidad del texto */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 100% at 20% 50%, rgba(10, 10, 15, 0.9) 0%, transparent 60%),
            radial-gradient(ellipse 60% 100% at 50% 100%, rgba(10, 10, 15, 0.8) 0%, transparent 50%),
            linear-gradient(to right, rgba(10, 10, 15, 0.85) 0%, rgba(10, 10, 15, 0.4) 40%, rgba(10, 10, 15, 0.1) 70%, rgba(10, 10, 15, 0.3) 100%)
          `,
        }}
      />
    </div>
  );
}

export default BarcelonaConstruct;
