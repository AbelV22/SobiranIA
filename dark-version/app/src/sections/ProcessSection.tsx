import { useEffect, useRef, useState } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════════════════════════
//  PROCESS SECTION — v3 "Cinematic Stages"
//
//  Architecture: Horizontal sticky scroll — 3 full-viewport
//  scenes side by side. Each scene has:
//    - Giant editorial step number (background watermark)
//    - Left: overline + headline + desc + feature list
//    - Right: unique generative SVG illustration per step
//  The strip translates horizontally as user scrolls.
// ════════════════════════════════════════════════════════════

// ─── Step definitions ────────────────────────────────────────
const steps = [
  {
    number: '01',
    phase: 'Diagnosi',
    title: 'Analitzem el teu negoci',
    description:
      'Estudiem els teus fluxos de treball, documents i processos. Identifiquem exactament on la IA et pot estalviar hores cada setmana.',
    features: [
      'Auditoria completa de processos',
      "Oportunitats d'automatització",
      'Pla personalitzat sense cost',
    ],
    accent: '#06b6d4',
    accentDim: 'rgba(6,182,212,0.06)',
    accentMid: 'rgba(6,182,212,0.18)',
    accentGlow: 'rgba(6,182,212,0.35)',
    bg: 'radial-gradient(ellipse 60% 80% at 70% 50%, rgba(6,182,212,0.07) 0%, transparent 65%)',
  },
  {
    number: '02',
    phase: 'Instal·lació',
    title: 'En 48h, la teva empresa ja té IA pròpia',
    description:
      "Instal·lem tot nosaltres. Un servidor d'alta gamma al teu despatx, configurat i a punt. Tu no tocs res — nosaltres ens encarreguem de tot.",
    features: [
      'Instal·lació in situ en 48h',
      'Xifratge AES-256 natiu',
      'Zero connexions externes',
    ],
    accent: '#818cf8',
    accentDim: 'rgba(129,140,248,0.06)',
    accentMid: 'rgba(129,140,248,0.18)',
    accentGlow: 'rgba(129,140,248,0.35)',
    bg: 'radial-gradient(ellipse 60% 80% at 70% 50%, rgba(99,102,241,0.08) 0%, transparent 65%)',
  },
  {
    number: '03',
    phase: 'Integració',
    title: 'El teu equip guanya hores cada dia',
    description:
      'La IA s\'integra als teus programes actuals i el teu equip comença a estalviar temps des del primer dia. Amb formació presencial fins que en treuen el màxim profit.',
    features: [
      'Integració amb el teu software',
      'Formació presencial inclosa',
      'Suport continu il·limitat',
    ],
    accent: '#34d399',
    accentDim: 'rgba(52,211,153,0.06)',
    accentMid: 'rgba(52,211,153,0.18)',
    accentGlow: 'rgba(52,211,153,0.35)',
    bg: 'radial-gradient(ellipse 60% 80% at 70% 50%, rgba(16,185,129,0.07) 0%, transparent 65%)',
  },
];

// ─── SVG Visual: Step 01 — Magnifying glass + document scan ──
function VisualDiagnosi({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 400 340" fill="none" style={{ width: '100%', height: '100%', maxWidth: 420 }}>
      {/* Grid background */}
      {Array.from({ length: 9 }).map((_, i) =>
        <line key={`h${i}`} x1="40" y1={40 + i * 30} x2="360" y2={40 + i * 30}
          stroke={accent} strokeOpacity="0.05" strokeWidth="1" />
      )}
      {Array.from({ length: 11 }).map((_, i) =>
        <line key={`v${i}`} x1={40 + i * 32} y1="40" x2={40 + i * 32} y2="300"
          stroke={accent} strokeOpacity="0.05" strokeWidth="1" />
      )}

      {/* Document base */}
      <rect x="80" y="60" width="200" height="240" rx="8"
        fill="rgba(255,255,255,0.02)" stroke={accent} strokeOpacity="0.15" strokeWidth="1" />

      {/* Document lines (content) */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x="104" y={88 + i * 26} width={i % 3 === 2 ? 100 : 152} height="8" rx="3"
          fill={accent} opacity={0.06 + i * 0.01} />
      ))}

      {/* Highlight stripe on doc */}
      <rect x="104" y="140" width="152" height="26" rx="4"
        fill={accent} opacity="0.08"
        stroke={accent} strokeOpacity="0.2" strokeWidth="0.5" />
      <rect x="104" y="140" width="152" height="8" rx="3"
        fill={accent} opacity="0.12" />

      {/* Magnifying glass */}
      <circle cx="272" cy="210" r="58" fill="rgba(0,0,0,0.6)"
        stroke={accent} strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="272" cy="210" r="44" fill="rgba(0,0,0,0.4)"
        stroke={accent} strokeOpacity="0.4" strokeWidth="1" />
      {/* Lens glare */}
      <ellipse cx="258" cy="195" rx="10" ry="6"
        fill={accent} opacity="0.12" transform="rotate(-30 258 195)" />

      {/* Content seen through lens — highlighted */}
      <rect x="244" y="200" width="56" height="7" rx="2" fill={accent} opacity="0.25" />
      <rect x="248" y="212" width="40" height="5" rx="2" fill={accent} opacity="0.15" />
      <rect x="244" y="222" width="52" height="5" rx="2" fill={accent} opacity="0.12" />

      {/* Handle */}
      <line x1="314" y1="252" x2="342" y2="282" stroke={accent} strokeWidth="8"
        strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="314" y1="252" x2="342" y2="282" stroke={accent} strokeWidth="4"
        strokeLinecap="round" strokeOpacity="0.9" />

      {/* Scan line animation */}
      <line x1="228" y1="170" x2="316" y2="170" stroke={accent} strokeWidth="1" strokeOpacity="0.6"
        strokeDasharray="4 2">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,80;0,0"
          dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="2.8s" repeatCount="indefinite" />
      </line>

      {/* Corner accent dots */}
      <circle cx="80" cy="60" r="3" fill={accent} opacity="0.4" />
      <circle cx="280" cy="60" r="3" fill={accent} opacity="0.4" />
      <circle cx="80" cy="300" r="3" fill={accent} opacity="0.4" />

      {/* Floating data chips */}
      {[
        { x: 310, y: 80, label: 'AUDIT', delay: '0s' },
        { x: 46, y: 200, label: 'MAP', delay: '0.6s' },
      ].map(({ x, y, label, delay }) => (
        <g key={label}>
          <rect x={x - 20} y={y - 10} width={40} height={20} rx="4"
            fill="rgba(0,0,0,0.7)" stroke={accent} strokeOpacity="0.3" strokeWidth="0.8" />
          <text x={x} y={y + 4} textAnchor="middle"
            fontSize="7" fontFamily="monospace" fill={accent} opacity="0.7"
            letterSpacing="0.12em">{label}</text>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s"
            begin={delay} repeatCount="indefinite" />
        </g>
      ))}
    </svg>
  );
}

// ─── SVG Visual: Step 02 — Server tower with shield ──────────
function VisualInstallacio({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 400 340" fill="none" style={{ width: '100%', height: '100%', maxWidth: 420 }}>
      {/* Floor perspective lines */}
      {[-60, -30, 0, 30, 60].map((offset, i) => (
        <line key={i} x1={200 + offset * 3} y1={290} x2={200 + offset} y2={180}
          stroke={accent} strokeOpacity="0.04" strokeWidth="1" />
      ))}

      {/* Server chassis — isometric feel */}
      {/* Main body */}
      <rect x="130" y="80" width="140" height="200" rx="6"
        fill="rgba(10,10,14,0.95)" stroke={accent} strokeOpacity="0.2" strokeWidth="1.5" />
      {/* Top face */}
      <path d="M130 80 L200 54 L270 80 L200 106 Z"
        fill="rgba(20,20,28,0.9)" stroke={accent} strokeOpacity="0.18" strokeWidth="1" />
      {/* Right face */}
      <path d="M270 80 L270 280 L200 306 L200 106 Z"
        fill="rgba(5,5,8,0.95)" stroke={accent} strokeOpacity="0.12" strokeWidth="1" />

      {/* Rack slots on server */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="146" y={102 + i * 34} width="108" height="22" rx="2"
            fill="rgba(255,255,255,0.02)" stroke={accent} strokeOpacity="0.1" strokeWidth="0.8" />
          {/* LED indicator */}
          <circle cx="152" cy={113 + i * 34} r="3" fill={accent} opacity={0.5 + (i % 2) * 0.3}>
            <animate attributeName="opacity"
              values={i % 2 === 0 ? '0.5;1;0.5' : '0.8;0.3;0.8'}
              dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          {/* Slot activity bar */}
          <rect x="162" y={109 + i * 34} width={40 + (i * 7) % 30} height="8" rx="1"
            fill={accent} opacity="0.07" />
        </g>
      ))}

      {/* Shield overlay */}
      <path d="M200 130 L240 148 L240 185 C240 206 222 222 200 230 C178 222 160 206 160 185 L160 148 Z"
        fill="rgba(0,0,0,0.5)" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5"
        filter="url(#shieldGlow)" />
      {/* Shield inner */}
      <path d="M200 140 L232 155 L232 185 C232 202 218 215 200 222 C182 215 168 202 168 185 L168 155 Z"
        fill={accent} opacity="0.05" />
      {/* Shield checkmark */}
      <path d="M186 182 L196 193 L218 168" stroke={accent} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

      {/* Pulse rings on shield */}
      {[0, 1].map((i) => (
        <path key={i}
          d="M200 130 L240 148 L240 185 C240 206 222 222 200 230 C178 222 160 206 160 185 L160 148 Z"
          stroke={accent} strokeOpacity="0" strokeWidth="2" fill="none">
          <animate attributeName="stroke-opacity" values="0;0.3;0" dur="2.5s"
            begin={`${i * 1.25}s`} repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="scale"
            values="1;1.08;1" dur="2.5s" begin={`${i * 1.25}s`}
            additive="sum" repeatCount="indefinite" />
        </path>
      ))}

      {/* Encrypted data streams */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={155 + i * 20} y1="280" x2={155 + i * 20} y2="60"
            stroke={accent} strokeWidth="1" strokeOpacity="0">
            <animate attributeName="stroke-opacity" values="0;0.2;0.2;0"
              dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="y2" values="280;60;60"
              dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          </line>
        </g>
      ))}

      {/* Corner badge: AES-256 */}
      <rect x="282" y="76" width="62" height="22" rx="4"
        fill="rgba(0,0,0,0.8)" stroke={accent} strokeOpacity="0.35" strokeWidth="0.8" />
      <text x="313" y="91" textAnchor="middle"
        fontSize="7.5" fontFamily="monospace" fill={accent} opacity="0.8"
        letterSpacing="0.08em">AES-256</text>

      {/* Floor shadow */}
      <ellipse cx="200" cy="295" rx="80" ry="12"
        fill={accent} opacity="0.04" />

      <defs>
        <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

// ─── SVG Visual: Step 03 — Integration network ───────────────
function VisualIntegracio({ accent }: { accent: string }) {
  const nodes = [
    { x: 200, y: 170, label: 'IA', main: true },
    { x: 100, y: 80, label: 'CRM' },
    { x: 300, y: 80, label: 'ERP' },
    { x: 80, y: 200, label: 'SQL' },
    { x: 320, y: 200, label: 'API' },
    { x: 150, y: 280, label: 'EMAIL' },
    { x: 270, y: 275, label: 'SLACK' },
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  ];

  return (
    <svg viewBox="0 0 400 340" fill="none" style={{ width: '100%', height: '100%', maxWidth: 420 }}>
      {/* Background radial grid */}
      {[40, 80, 120].map((r) => (
        <circle key={r} cx="200" cy="170" r={r}
          stroke={accent} strokeOpacity="0.04" strokeWidth="1" />
      ))}
      {[0, 30, 60, 90, 120, 150].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={angle}
            x1={200} y1={170}
            x2={200 + Math.cos(rad) * 130}
            y2={170 + Math.sin(rad) * 130}
            stroke={accent} strokeOpacity="0.03" strokeWidth="1" />
        );
      })}

      {/* Edges with animated data packets */}
      {edges.map(([from, to], ei) => {
        const n1 = nodes[from], n2 = nodes[to];
        return (
          <g key={ei}>
            {/* Static edge */}
            <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
              stroke={accent} strokeOpacity="0.12" strokeWidth="1" />
            {/* Animated packet */}
            <circle r="3" fill={accent} opacity="0.7">
              <animateMotion
                dur={`${1.4 + ei * 0.25}s`}
                begin={`${ei * 0.35}s`}
                repeatCount="indefinite"
                path={`M${n2.x},${n2.y} L${n1.x},${n1.y}`}
              />
              <animate attributeName="opacity" values="0;0.8;0.8;0"
                dur={`${1.4 + ei * 0.25}s`} begin={`${ei * 0.35}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* Satellite nodes */}
      {nodes.slice(1).map((node, i) => (
        <g key={i}>
          <rect x={node.x - 22} y={node.y - 13} width={44} height={26} rx="5"
            fill="rgba(8,8,12,0.9)" stroke={accent} strokeOpacity="0.25" strokeWidth="1" />
          <text x={node.x} y={node.y + 5} textAnchor="middle"
            fontSize="8" fontFamily="monospace" fill={accent} opacity="0.7"
            letterSpacing="0.1em">{node.label}</text>
        </g>
      ))}

      {/* Central node — IA hub */}
      <circle cx={nodes[0].x} cy={nodes[0].y} r="36"
        fill="rgba(0,0,0,0.8)" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx={nodes[0].x} cy={nodes[0].y} r="28"
        fill={accent} opacity="0.07" />
      <text x={nodes[0].x} y={nodes[0].y + 5} textAnchor="middle"
        fontSize="13" fontFamily="monospace" fontWeight="700" fill={accent} opacity="0.9"
        letterSpacing="0.06em">IA</text>

      {/* Pulse on hub */}
      {[0, 1].map((i) => (
        <circle key={i} cx={nodes[0].x} cy={nodes[0].y} r="36"
          stroke={accent} fill="none">
          <animate attributeName="r" values="36;60;36" dur="2.4s"
            begin={`${i * 1.2}s`} repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="2.4s"
            begin={`${i * 1.2}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* People / team indicator at bottom */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={160 + i * 42} cy={318} r="9"
            fill="rgba(8,8,12,0.9)" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
          <circle cx={160 + i * 42} cy={312} r="4" fill={accent} opacity="0.25" />
          <path d={`M${148 + i * 42},327 Q${160 + i * 42},318 ${172 + i * 42},327`}
            stroke={accent} strokeOpacity="0.25" strokeWidth="1" fill="none" />
        </g>
      ))}
      <text x="200" y="334" textAnchor="middle"
        fontSize="7" fontFamily="monospace" fill={accent} opacity="0.4" letterSpacing="0.14em">
        EQUIP FORMAT
      </text>
    </svg>
  );
}

const visuals = [VisualDiagnosi, VisualInstallacio, VisualIntegracio];

// ─── Single Scene (one step full-viewport panel) ─────────────
function StepScene({ step, index }: { step: typeof steps[number]; index: number }) {
  const isMobile = useIsMobile();
  const Visual = visuals[index];

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Scene ambient background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: step.bg,
        pointerEvents: 'none',
      }} />

      {/* Giant watermark number */}
      <div style={{
        position: 'absolute',
        right: '-0.05em',
        bottom: '-0.1em',
        fontSize: 'clamp(220px, 28vw, 340px)',
        fontWeight: 900,
        fontFamily: 'monospace',
        color: step.accent,
        opacity: 0.03,
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        letterSpacing: '-0.06em',
      }}>
        {step.number}
      </div>

      {/* Horizontal divider line with accent */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        bottom: '18%',
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${step.accentMid} 30%, ${step.accentMid} 70%, transparent 100%)`,
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 1240,
        margin: '0 auto',
        padding: isMobile ? '0 24px' : '0 clamp(32px, 6vw, 96px)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 32 : 'clamp(40px, 6vw, 100px)',
        alignItems: 'center',
        marginTop: isMobile ? '4vh' : '0',
      }}>
        {/* LEFT — text column */}
        <div>
          {/* Step counter + overline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            {/* Numbered badge */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: '50%',
              background: step.accentDim,
              border: `1px solid ${step.accentMid}`,
              position: 'relative',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                color: step.accent, letterSpacing: '0.06em',
              }}>{step.number}</span>
              {/* Outer pulse ring */}
              <div style={{
                position: 'absolute', inset: -5, borderRadius: '50%',
                border: `1px solid ${step.accent}`,
                opacity: 0.2,
              }} />
            </div>

            {/* Divider tick */}
            <div style={{ width: 24, height: 1, background: step.accentMid, opacity: 0.6 }} />

            {/* Phase label */}
            <span style={{
              fontFamily: 'monospace', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: step.accent, opacity: 0.75,
            }}>
              {step.phase}
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: 20,
          }}>
            {step.title}
          </h2>

          {/* Description */}
          <p style={{
            fontSize: 15,
            color: 'rgba(161,161,170,0.85)',
            lineHeight: 1.7,
            marginBottom: 36,
            maxWidth: 440,
            letterSpacing: '-0.005em',
          }}>
            {step.description}
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {step.features.map((feat, fi) => (
              <div key={fi} style={{
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                {/* Check icon */}
                <div style={{
                  flexShrink: 0, width: 20, height: 20, borderRadius: 6,
                  background: step.accentDim,
                  border: `1px solid ${step.accentMid}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5L4.5 9L10 3" stroke={step.accent} strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{
                  fontSize: 13.5, color: 'rgba(255,255,255,0.7)',
                  fontWeight: 400, letterSpacing: '-0.01em',
                }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — visual column */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: isMobile ? '35vh' : 'clamp(280px, 45vh, 420px)',
          position: 'relative',
        }}>
          {/* Subtle frame */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: 20,
            border: `1px solid ${step.accentMid}`,
            opacity: 0.15,
            pointerEvents: 'none',
          }} />
          {/* Inner glow */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 20,
            background: step.accentDim,
            pointerEvents: 'none',
          }} />
          <Visual accent={step.accent} />
        </div>
      </div>

      {/* Step progress dots (bottom center) */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 10,
      }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            width: i === index ? 20 : 6,
            height: 6, borderRadius: 3,
            background: i === index ? s.accent : 'rgba(255,255,255,0.15)',
            transition: 'all 0.4s ease',
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────
export function ProcessSection() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !stripRef.current) return;

    // We have 3 panels. Total width is 300vw, so we move -200vw.
    const sectionsCount = steps.length;

    // We create a single tween that moves the strip and hook it to ScrollTrigger
    const scrollTween = gsap.to(stripRef.current, {
      x: `-${100 * (sectionsCount - 1)}vw`,
      ease: 'none', // No easing for direct 1:1 scroll tie
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true, // Pin the container, so it acts like a sticky container
        scrub: isMobile ? 0.1 : 1, // Direct tracking for mobile, smooth scrubbing for desktop
        start: 'top top',
        end: () => `+=${containerRef.current?.offsetWidth || window.innerWidth * 3}`, // scroll distance proportional to width
        snap: isMobile ? undefined : {
          snapTo: 1 / (sectionsCount - 1), // snap to 0, 0.5, 1
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1, // wait 0.1s after scroll stops before snapping
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          setProgress(self.progress);
        }
      },
    });

    return () => {
      // Clean up ST when component unmounts
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, [isMobile]);

  return (
    <section
      id="proces"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100dvh',
        background: '#030304',
        overflow: 'hidden',
      }}
    >
      {/* Section header — visible briefly before first panel */}
      <div style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
      }}>

        {/* Subtle noise texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)',
        }} />

        {/* Section overline — top left, always visible */}
        <div style={{
          position: 'absolute', top: 32, left: 'clamp(32px, 6vw, 96px)',
          zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#06b6d4',
            boxShadow: '0 0 8px rgba(6,182,212,0.8)',
            animation: 'ambient-breathe 2.5s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'monospace', fontSize: 9, fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#06b6d4', opacity: 0.7,
          }}>
            El Procés · 3 Fases
          </span>
        </div>

        {/* Horizontal scrolling strip */}
        <div
          ref={stripRef}
          style={{
            display: 'flex',
            width: '300vw',
            height: '100dvh',
            willChange: 'transform',
          }}
        >
          {steps.map((step, i) => (
            <StepScene key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* Scroll progress bar (thin, top) */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          height: '2px',
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #06b6d4, #818cf8, #34d399)',
          zIndex: 40,
        }} />

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to top, #030304 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 10,
        }} />

        {/* Right scroll hint arrow */}
        <div style={{
          position: 'absolute', bottom: 40, right: 'clamp(32px, 6vw, 96px)',
          zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 8,
          opacity: 0.35,
        }}>
          <span style={{
            fontSize: 9, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase', fontFamily: 'monospace',
          }}>scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
