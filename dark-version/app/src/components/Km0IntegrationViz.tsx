import { memo } from 'react';

/**
 * Km0IntegrationViz — "Connection Matrix" visualization
 * Animated hub-and-spoke showing a central server connected to
 * ERP, SQL, CRM, API nodes with instant data pulse lines.
 * Pure SVG + CSS animations. Color: Emerald (#10b981).
 */

interface ServiceNode {
  label: string;
  x: number;
  y: number;
  icon: string; // SVG path
}

const services: ServiceNode[] = [
  {
    label: 'ERP',
    x: 120,
    y: 100,
    icon: 'M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z', // list/document
  },
  {
    label: 'SQL',
    x: 480,
    y: 100,
    icon: 'M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3z', // database
  },
  {
    label: 'CRM',
    x: 120,
    y: 380,
    icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z', // people
  },
  {
    label: 'API',
    x: 480,
    y: 380,
    icon: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z', // code brackets
  },
  {
    label: 'DOCS',
    x: 80,
    y: 240,
    icon: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z', // file
  },
  {
    label: 'EMAIL',
    x: 520,
    y: 240,
    icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', // mail
  },
];

const HUB = { x: 300, y: 240 };

const Km0IntegrationViz = memo(function Km0IntegrationViz() {
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
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 600 480"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 600,
          opacity: 0.9,
        }}
      >
        <defs>
          <filter id="int-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="int-hub-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="int-hub-fill" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>

          {/* Line gradient for data flow */}
          {services.map((_, i) => {
            const id = `int-line-grad-${i}`;
            return (
              <linearGradient
                key={id}
                id={id}
                gradientUnits="userSpaceOnUse"
                x1={services[i].x}
                y1={services[i].y}
                x2={HUB.x}
                y2={HUB.y}
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="40%" stopColor="#34d399" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
              </linearGradient>
            );
          })}
        </defs>

        {/* Hexagonal grid background pattern */}
        <g opacity="0.04">
          {Array.from({ length: 12 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => {
              const offset = row % 2 === 0 ? 0 : 30;
              return (
                <circle
                  key={`grid-${row}-${col}`}
                  cx={col * 60 + offset}
                  cy={row * 40 + 20}
                  r="1"
                  fill="#10b981"
                />
              );
            })
          )}
        </g>

        {/* Connection lines with animated data flow */}
        {services.map((service, i) => {
          const pathId = `int-path-${i}`;
          // Curved path from service to hub
          const midX = (service.x + HUB.x) / 2;
          const midY = (service.y + HUB.y) / 2;
          const perpX = -(service.y - HUB.y) * 0.12;
          const perpY = (service.x - HUB.x) * 0.12;

          return (
            <g key={`conn-${i}`}>
              {/* Static line (faint) */}
              <path
                id={pathId}
                d={`M${service.x},${service.y} Q${midX + perpX},${midY + perpY} ${HUB.x},${HUB.y}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="1"
                strokeOpacity="0.12"
              />

              {/* Animated dashed overlay */}
              <path
                d={`M${service.x},${service.y} Q${midX + perpX},${midY + perpY} ${HUB.x},${HUB.y}`}
                fill="none"
                stroke={`url(#int-line-grad-${i})`}
                strokeWidth="2"
                strokeDasharray="6 12"
                style={{
                  animation: `int-dash 2s linear infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />

              {/* Traveling pulse particle */}
              <circle r="3.5" fill="#34d399" filter="url(#int-glow)">
                <animateMotion
                  dur={`${1.8 + i * 0.2}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={`${1.8 + i * 0.2}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                />
                <animate
                  attributeName="r"
                  values="2;3.5;2"
                  dur={`${1.8 + i * 0.2}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                />
              </circle>

              {/* Return pulse (bidirectional) */}
              <circle r="2" fill="#6ee7b7" filter="url(#int-glow)">
                <animateMotion
                  dur={`${2.2 + i * 0.15}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.5 + 1}s`}
                  keyPoints="1;0"
                  keyTimes="0;1"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;0.6;0.6;0"
                  dur={`${2.2 + i * 0.15}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.5 + 1}s`}
                />
              </circle>
            </g>
          );
        })}

        {/* Hub (central server) */}
        <g>
          {/* Outer ring pulses */}
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r="42"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.5"
            strokeOpacity="0.2"
            style={{ animation: 'int-hub-ring 3s ease-in-out infinite' }}
          />
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r="55"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.3"
            strokeOpacity="0.1"
            style={{ animation: 'int-hub-ring 3s ease-in-out infinite 1s' }}
          />

          {/* Hexagonal frame around hub */}
          <polygon
            points={Array.from({ length: 6 })
              .map((_, i) => {
                const angle = (i * 60 - 30) * (Math.PI / 180);
                return `${HUB.x + 36 * Math.cos(angle)},${HUB.y + 36 * Math.sin(angle)}`;
              })
              .join(' ')}
            fill="none"
            stroke="#10b981"
            strokeWidth="1"
            strokeOpacity="0.3"
            style={{ animation: 'int-hex-rotate 20s linear infinite' }}
          />

          {/* Core circle */}
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r="26"
            fill="url(#int-hub-fill)"
            filter="url(#int-hub-glow)"
            style={{ animation: 'int-hub-breathe 4s ease-in-out infinite' }}
          />

          {/* Server icon inside */}
          <g transform={`translate(${HUB.x - 12}, ${HUB.y - 12})`} opacity="0.85">
            {/* Server stack */}
            <rect x="2" y="2" width="20" height="6" rx="1" fill="#d1fae5" fillOpacity="0.8" />
            <rect x="2" y="10" width="20" height="6" rx="1" fill="#d1fae5" fillOpacity="0.6" />
            <rect x="2" y="18" width="20" height="6" rx="1" fill="#d1fae5" fillOpacity="0.4" />
            {/* LEDs */}
            <circle cx="18" cy="5" r="1.5" fill="#10b981" style={{ animation: 'int-led 2s ease-in-out infinite' }} />
            <circle cx="18" cy="13" r="1.5" fill="#10b981" style={{ animation: 'int-led 2s ease-in-out infinite 0.7s' }} />
            <circle cx="18" cy="21" r="1.5" fill="#10b981" style={{ animation: 'int-led 2s ease-in-out infinite 1.4s' }} />
          </g>

          {/* Hub label */}
          <text
            x={HUB.x}
            y={HUB.y + 48}
            textAnchor="middle"
            fill="#6ee7b7"
            fontSize="7"
            fontFamily="monospace"
            letterSpacing="0.2em"
            opacity="0.5"
          >
            LOCAL SERVER
          </text>
        </g>

        {/* Service nodes */}
        {services.map((service, i) => (
          <g key={`service-${i}`}>
            {/* Outer ring */}
            <circle
              cx={service.x}
              cy={service.y}
              r="24"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              style={{
                animation: `int-node-pulse 3s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />

            {/* Node background */}
            <circle
              cx={service.x}
              cy={service.y}
              r="20"
              fill="#022c22"
              stroke="#10b981"
              strokeWidth="1"
              strokeOpacity="0.3"
              filter="url(#int-glow)"
            />

            {/* Icon */}
            <g transform={`translate(${service.x - 12}, ${service.y - 12})`} opacity="0.7">
              <path d={service.icon} fill="#6ee7b7" transform="scale(1)" />
            </g>

            {/* Label */}
            <text
              x={service.x}
              y={service.y + 34}
              textAnchor="middle"
              fill="#a7f3d0"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="0.15em"
              opacity="0.5"
            >
              {service.label}
            </text>
          </g>
        ))}

        {/* Latency indicators near connections */}
        {services.map((service, i) => {
          const midX = (service.x + HUB.x) / 2;
          const midY = (service.y + HUB.y) / 2;
          return (
            <g key={`lat-${i}`} opacity="0" style={{ animation: `int-lat-flash 4s ease-in-out infinite ${i * 0.6}s` }}>
              <rect
                x={midX - 16}
                y={midY - 7}
                width="32"
                height="14"
                rx="3"
                fill="#022c22"
                stroke="#10b981"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
              <text
                x={midX}
                y={midY + 3}
                textAnchor="middle"
                fill="#34d399"
                fontSize="7"
                fontFamily="monospace"
                fontWeight="bold"
              >
                0ms
              </text>
            </g>
          );
        })}
      </svg>

      <style>{`
        @keyframes int-dash {
          0% { stroke-dashoffset: 18; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes int-hub-ring {
          0%, 100% { opacity: 0.15; transform-origin: center; }
          50% { opacity: 0.35; }
        }
        @keyframes int-hub-breathe {
          0%, 100% { filter: url(#int-hub-glow) drop-shadow(0 0 10px rgba(16,185,129,0.3)); }
          50% { filter: url(#int-hub-glow) drop-shadow(0 0 20px rgba(16,185,129,0.6)); }
        }
        @keyframes int-hex-rotate {
          0% { transform: rotate(0deg); transform-origin: 300px 240px; }
          100% { transform: rotate(360deg); transform-origin: 300px 240px; }
        }
        @keyframes int-node-pulse {
          0%, 100% { stroke-opacity: 0.15; }
          50% { stroke-opacity: 0.4; }
        }
        @keyframes int-led {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes int-lat-flash {
          0%, 15%, 100% { opacity: 0; }
          5%, 10% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
});

export default Km0IntegrationViz;
