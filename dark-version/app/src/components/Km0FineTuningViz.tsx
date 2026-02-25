import { memo, useMemo } from 'react';

/**
 * Km0FineTuningViz — "Neural Mesh" visualization
 * Animated neural network showing data flowing into a central brain node.
 * Pure SVG + CSS animations, zero external dependencies.
 * Color: Indigo (#6366f1) matching the Fine-Tuning accordion item.
 */

// Deterministic pseudo-random for consistent layouts
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface Node {
  x: number;
  y: number;
  r: number;
  delay: number;
  type: 'data' | 'hidden' | 'core';
}

interface Connection {
  from: Node;
  to: Node;
  delay: number;
  strength: number;
}

const Km0FineTuningViz = memo(function Km0FineTuningViz() {
  const { nodes, connections } = useMemo(() => {
    const allNodes: Node[] = [];

    // Core node (center)
    const core: Node = { x: 300, y: 250, r: 28, delay: 0, type: 'core' };
    allNodes.push(core);

    // Hidden layer nodes (ring around core)
    const hiddenCount = 8;
    for (let i = 0; i < hiddenCount; i++) {
      const angle = (i / hiddenCount) * Math.PI * 2 - Math.PI / 2;
      const radius = 100 + seededRandom(i * 3) * 30;
      allNodes.push({
        x: 300 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        r: 8 + seededRandom(i * 7) * 6,
        delay: i * 0.3,
        type: 'hidden',
      });
    }

    // Data nodes (outer ring — representing corporate data sources)
    const dataCount = 14;
    for (let i = 0; i < dataCount; i++) {
      const angle = (i / dataCount) * Math.PI * 2 + 0.2;
      const radius = 190 + seededRandom(i * 11) * 40;
      allNodes.push({
        x: 300 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        r: 3 + seededRandom(i * 13) * 3,
        delay: i * 0.2 + 1,
        type: 'data',
      });
    }

    // Build connections
    const allConnections: Connection[] = [];
    const hidden = allNodes.filter((n) => n.type === 'hidden');
    const data = allNodes.filter((n) => n.type === 'data');

    // Hidden -> Core
    hidden.forEach((h, i) => {
      allConnections.push({ from: h, to: core, delay: i * 0.15, strength: 0.8 });
    });

    // Data -> nearest Hidden
    data.forEach((d, i) => {
      // Find 2 closest hidden nodes
      const sorted = [...hidden].sort(
        (a, b) =>
          Math.hypot(a.x - d.x, a.y - d.y) - Math.hypot(b.x - d.x, b.y - d.y)
      );
      allConnections.push({ from: d, to: sorted[0], delay: i * 0.12 + 0.5, strength: 0.4 });
      if (sorted[1]) {
        allConnections.push({ from: d, to: sorted[1], delay: i * 0.12 + 1.2, strength: 0.2 });
      }
    });

    // Inter-hidden connections
    for (let i = 0; i < hidden.length; i++) {
      const next = hidden[(i + 1) % hidden.length];
      allConnections.push({ from: hidden[i], to: next, delay: i * 0.1 + 2, strength: 0.3 });
    }

    return { nodes: allNodes, connections: allConnections };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 600 500"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 600,
          opacity: 0.85,
        }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="ft-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stronger glow for core */}
          <filter id="ft-core-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for connections */}
          <linearGradient id="ft-conn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>

          {/* Radial gradient for core */}
          <radialGradient id="ft-core-fill" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="60%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </radialGradient>

          {/* Particle along path */}
          <circle id="ft-particle" r="2" fill="#c7d2fe" />
        </defs>

        {/* Connections */}
        {connections.map((conn, i) => {
          const pathId = `ft-path-${i}`;
          const dx = conn.to.x - conn.from.x;
          const dy = conn.to.y - conn.from.y;
          // Slight curve via midpoint offset
          const mx = (conn.from.x + conn.to.x) / 2 + dy * 0.1;
          const my = (conn.from.y + conn.to.y) / 2 - dx * 0.1;

          return (
            <g key={`conn-${i}`}>
              <path
                id={pathId}
                d={`M${conn.from.x},${conn.from.y} Q${mx},${my} ${conn.to.x},${conn.to.y}`}
                fill="none"
                stroke="#6366f1"
                strokeWidth={conn.strength * 1.5}
                strokeOpacity={conn.strength * 0.3}
                style={{
                  strokeDasharray: '4 8',
                  animation: `ft-dash 3s linear infinite`,
                  animationDelay: `${conn.delay}s`,
                }}
              />
              {/* Traveling particle */}
              <circle r="2.5" fill="#a5b4fc" filter="url(#ft-glow)">
                <animateMotion
                  dur={`${2.5 + conn.delay * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${conn.delay}s`}
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;0.8;0.8;0"
                  dur={`${2.5 + conn.delay * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${conn.delay}s`}
                />
              </circle>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          if (node.type === 'core') {
            return (
              <g key={`node-${i}`}>
                {/* Core pulsing ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + 8}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  style={{
                    animation: 'ft-pulse 3s ease-in-out infinite',
                  }}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + 16}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  strokeOpacity="0.15"
                  style={{
                    animation: 'ft-pulse 3s ease-in-out infinite 0.5s',
                  }}
                />
                {/* Core circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill="url(#ft-core-fill)"
                  filter="url(#ft-core-glow)"
                  style={{
                    animation: 'ft-core-breathe 4s ease-in-out infinite',
                  }}
                />
                {/* Brain/AI icon inside core */}
                <g transform={`translate(${node.x - 14}, ${node.y - 14})`} opacity="0.9">
                  <path
                    d="M14 2C7.37 2 2 7.37 2 14s5.37 12 12 12 12-5.37 12-12S20.63 2 14 2zm0 3c1.1 0 2 .9 2 2v2c1.66 0 3 1.34 3 3v1h-2v-1c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v1H9v-1c0-1.66 1.34-3 3-3V7c0-1.1.9-2 2-2zm-4 12c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2h2v2c0 1.66-1.34 3-3 3h-6c-1.66 0-3-1.34-3-3v-2h2v2z"
                    fill="#e0e7ff"
                    fillOpacity="0.85"
                    transform="scale(1)"
                  />
                </g>
              </g>
            );
          }

          if (node.type === 'hidden') {
            return (
              <g key={`node-${i}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + 4}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  strokeOpacity="0.2"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill="#1e1b4b"
                  stroke="#6366f1"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  filter="url(#ft-glow)"
                  style={{
                    animation: `ft-node-pulse 3s ease-in-out infinite`,
                    animationDelay: `${node.delay}s`,
                  }}
                />
                {/* Inner dot */}
                <circle cx={node.x} cy={node.y} r="2" fill="#818cf8" fillOpacity="0.8" />
              </g>
            );
          }

          // Data nodes
          return (
            <g key={`node-${i}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="#312e81"
                stroke="#6366f1"
                strokeWidth="0.5"
                strokeOpacity="0.4"
                style={{
                  animation: `ft-data-float 4s ease-in-out infinite`,
                  animationDelay: `${node.delay}s`,
                }}
              />
            </g>
          );
        })}

        {/* Center label */}
        <text
          x="300"
          y="310"
          textAnchor="middle"
          fill="#a5b4fc"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="0.15em"
          opacity="0.6"
        >
          TRAINING
        </text>
      </svg>

      <style>{`
        @keyframes ft-dash {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes ft-pulse {
          0%, 100% { r: inherit; opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes ft-core-breathe {
          0%, 100% { filter: url(#ft-core-glow) drop-shadow(0 0 12px rgba(99,102,241,0.4)); }
          50% { filter: url(#ft-core-glow) drop-shadow(0 0 24px rgba(99,102,241,0.7)); }
        }
        @keyframes ft-node-pulse {
          0%, 100% { stroke-opacity: 0.3; }
          50% { stroke-opacity: 0.8; }
        }
        @keyframes ft-data-float {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(0, -3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
});

export default Km0FineTuningViz;
