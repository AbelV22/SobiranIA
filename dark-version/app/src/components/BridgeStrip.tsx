import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// ─────────────────────────────────────────────────────────────
//  BridgeStrip
//
//  Narrative bridge between Km0Section (problem/solution) and
//  ProcessSection (how it works). Closes the "solution" chapter
//  and opens the "implementation" chapter with a single bold
//  statement + 3 micro-stats that echo both sides.
//
//  Design: full-bleed dark band, large editorial typography,
//  horizontal stat ticker, subtle scan-line animation.
// ─────────────────────────────────────────────────────────────

const stats = [
  { value: '100%', label: 'Dades al teu servidor' },
  { value: '0€', label: 'Cost per token' },
  { value: '<4h', label: 'Temps de resposta' },
  { value: 'GDPR', label: 'Compliment natiu' },
];

// Thin animated scan-line sweeping left→right
function ScanLine() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 120,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.04) 40%, rgba(6,182,212,0.07) 50%, rgba(6,182,212,0.04) 60%, transparent 100%)',
          animation: 'bridge-scan 6s linear infinite',
        }}
      />
      <style>{`
        @keyframes bridge-scan {
          0%   { transform: translateX(-140px); }
          100% { transform: translateX(calc(100vw + 140px)); }
        }
      `}</style>
    </div>
  );
}

export function BridgeStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: visRef, isVisible } = useIntersectionObserver({ threshold: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Subtle horizontal parallax on the big text
  const textX = useTransform(scrollYProgress, [0, 1], ['-2%', '2%']);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#000',
        overflow: 'hidden',
        borderTop: '1px solid rgba(6,182,212,0.1)',
        borderBottom: '1px solid rgba(6,182,212,0.1)',
      }}
    >
      <ScanLine />

      {/* Ambient glow — left */}
      <div
        style={{
          position: 'absolute',
          left: '-10%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 500,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main content */}
      <div
        ref={visRef as React.RefObject<HTMLDivElement>}
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1400,
          margin: '0 auto',
          padding: 'clamp(72px, 10vw, 140px) clamp(24px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
        }}
      >
        {/* ── Big editorial statement ── */}
        <motion.div
          style={{ x: textX, overflow: 'hidden' }}
          initial={false}
        >
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(11px, 1.1vw, 14px)',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(6,182,212,0.5)',
              marginBottom: 16,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            La solució · KM0
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: '0 16px',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.92)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.7s ease 0.05s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s',
              }}
            >
              El teu negoci.
            </h2>

            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(90deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s',
              }}
            >
              Les teves regles.
            </h2>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <div
          style={{
            width: '100%',
            height: 1,
            background:
              'linear-gradient(90deg, rgba(6,182,212,0.3) 0%, rgba(6,182,212,0.08) 60%, transparent 100%)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.3s',
          }}
        />

        {/* ── Stat ticker row ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(24px, 4vw, 64px)',
            alignItems: 'center',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(24px, 4vw, 64px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.6s ease ${0.35 + i * 0.08}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.35 + i * 0.08}s`,
                }}
              >
                <span
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    letterSpacing: '-0.02em',
                    color: '#06b6d4',
                    lineHeight: 1,
                    textShadow: '0 0 30px rgba(6,182,212,0.3)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: 'clamp(10px, 1.1vw, 12px)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  {s.label}
                </span>
              </div>
              {/* Vertical separator between stats */}
              {i < stats.length - 1 && (
                <div style={{
                  width: 1, height: 40,
                  background: 'linear-gradient(to bottom, transparent, rgba(6,182,212,0.2), transparent)',
                  flexShrink: 0,
                }} />
              )}
            </div>
          ))}

          {/* Spacer + next-section label */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.65s',
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              Com funciona
            </span>
            {/* Animated chevron pointing down */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[0, 1].map(n => (
                <svg
                  key={n}
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  style={{
                    opacity: 0.2 + n * 0.25,
                    animation: `bridge-chevron 1.8s ease-in-out infinite`,
                    animationDelay: `${n * 0.2}s`,
                  }}
                >
                  <path
                    d="M1 1l5 5 5-5"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <style>{`
                    @keyframes bridge-chevron {
                      0%, 100% { transform: translateY(0); }
                      50%       { transform: translateY(3px); }
                    }
                  `}</style>
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
