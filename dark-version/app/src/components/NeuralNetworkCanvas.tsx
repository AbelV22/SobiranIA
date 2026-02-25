import { useEffect, useRef, useState } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  layer: number;
  size: number;
  brightness: number;
  pulsePhase: number;
  connections: number[];
}

interface Particle {
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  speed: number;
  active: boolean;
}

export function NeuralNetworkCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas size
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: rect.width, h: rect.height };
    };

    const { w, h } = resize();

    // Create network
    const nodes: Node[] = [];
    let id = 0;

    // 4 layers
    const layerConfig = [
      { count: 10, x: w * 0.12 },
      { count: 14, x: w * 0.35 },
      { count: 12, x: w * 0.58 },
      { count: 8, x: w * 0.82 },
    ];

    layerConfig.forEach((layer, layerIdx) => {
      const spacing = h / (layer.count + 1);
      for (let i = 0; i < layer.count; i++) {
        nodes.push({
          id: id++,
          x: layer.x + (Math.random() - 0.5) * 40,
          y: spacing * (i + 1) + (Math.random() - 0.5) * spacing * 0.5,
          layer: layerIdx,
          size: layerIdx === 0 ? 4 : layerIdx === 3 ? 7 : 5,
          brightness: 0.3 + Math.random() * 0.4,
          pulsePhase: Math.random() * Math.PI * 2,
          connections: [],
        });
      }
    });

    // Create connections
    for (let layerIdx = 0; layerIdx < 3; layerIdx++) {
      const current = nodes.filter(n => n.layer === layerIdx);
      const next = nodes.filter(n => n.layer === layerIdx + 1);
      
      current.forEach(from => {
        const targets = next.sort(() => Math.random() - 0.5).slice(0, 3);
        targets.forEach(to => {
          if (!from.connections.includes(to.id)) {
            from.connections.push(to.id);
          }
        });
      });
    }

    nodesRef.current = nodes;

    // Create particle pool
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: 0, y: 0, fromX: 0, fromY: 0, toX: 0, toY: 0,
      progress: 0, speed: 0, active: false,
    }));

    setIsReady(true);

    // Mouse tracking
    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    container.addEventListener('mousemove', handleMouse);
    window.addEventListener('resize', resize);

    // Animation
    let lastTime = performance.now();
    
    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const time = now / 1000;

      // Clear
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, w, h);

      // Draw grid
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 100) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0; y < h; y += 100) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      // Update and draw nodes
      nodesRef.current.forEach(node => {
        // Pulse
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.5 + 0.5;
        const hoverDist = Math.hypot(node.x - mouseRef.current.x, node.y - mouseRef.current.y);
        const isHovered = hoverDist < 100;
        
        const targetBrightness = isHovered ? 1 : 0.3 + pulse * 0.4;
        node.brightness += (targetBrightness - node.brightness) * dt * 3;

        // Spawn particles
        if (node.brightness > 0.5 && Math.random() < 0.05) {
          const inactive = particlesRef.current.find(p => !p.active);
          if (inactive && node.connections.length > 0) {
            const targetId = node.connections[Math.floor(Math.random() * node.connections.length)];
            const target = nodesRef.current.find(n => n.id === targetId);
            if (target) {
              inactive.active = true;
              inactive.x = inactive.fromX = node.x;
              inactive.y = inactive.fromY = node.y;
              inactive.toX = target.x;
              inactive.toY = target.y;
              inactive.progress = 0;
              inactive.speed = 0.5 + Math.random() * 0.5;
            }
          }
        }

        // Draw node glow
        const glowSize = node.size * (3 + node.brightness * 2);
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
        grad.addColorStop(0, `rgba(34, 211, 238, ${node.brightness})`);
        grad.addColorStop(0.5, `rgba(34, 211, 238, ${node.brightness * 0.3})`);
        grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw node ring
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4 + node.brightness * 0.6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 1.5, 0, Math.PI * 2);
        ctx.stroke();

        // Draw node core
        ctx.fillStyle = '#22D3EE';
        ctx.globalAlpha = 0.6 + node.brightness * 0.4;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw connections
      nodesRef.current.forEach(node => {
        node.connections.forEach(targetId => {
          const target = nodesRef.current.find(n => n.id === targetId);
          if (!target) return;
          
          const isActive = node.brightness > 0.6 || target.brightness > 0.6;
          ctx.strokeStyle = isActive ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.15)';
          ctx.lineWidth = isActive ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Update and draw particles
      particlesRef.current.forEach(p => {
        if (!p.active) return;
        
        p.progress += p.speed * dt;
        if (p.progress >= 1) {
          p.active = false;
          return;
        }
        
        // Ease
        const t = p.progress;
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        p.x = p.fromX + (p.toX - p.fromX) * eased;
        p.y = p.fromY + (p.toY - p.fromY) * eased;
        
        // Draw particle
        const size = 2 + (1 - p.progress) * 2;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.5)');
        grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: '#0A0A0F' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ touchAction: 'none', opacity: isReady ? 1 : 0, transition: 'opacity 0.5s' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10, 10, 15, 0.92) 0%, rgba(10, 10, 15, 0.6) 30%, rgba(10, 10, 15, 0.2) 60%, rgba(10, 10, 15, 0.5) 100%),
            linear-gradient(to top, rgba(10, 10, 15, 1) 0%, rgba(10, 10, 15, 0.3) 25%, transparent 50%),
            linear-gradient(to bottom, rgba(10, 10, 15, 0.9) 0%, transparent 20%)
          `,
        }}
      />
    </div>
  );
}

export default NeuralNetworkCanvas;
