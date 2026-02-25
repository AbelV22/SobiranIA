
import { Suspense, lazy, useRef, useState, memo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

// ════════════════════════════════════════════════════════════
//  KM0 SCROLLYTELLING — "Del Caos al Control"
//
//  FINAL ARCHITECTURE (v12 - Sequential Scroll Bullets):
//    - Premium Horizontal Accordion
//    - Bullets appear sequentially driven by scroll progress
//    - Compact typography that fits the viewport cleanly
// ════════════════════════════════════════════════════════════

const Km0Globe3D = lazy(() => import('@/components/Km0Globe3D'));
const Km0FineTuningViz = lazy(() => import('@/components/Km0FineTuningViz'));
const Km0IntegrationViz = lazy(() => import('@/components/Km0IntegrationViz'));

// ─── SVG Icons ───
const IconLeak = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);
const IconBlackBox = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const IconGavel = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M3 6l3 1m0 0l-3 9a5 5 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5 5 0 01-6.001 0M18 7l-3 9m-5.301-1.699L12 12m0 0l2.699-2.699M12 12l-2.699 2.699" />
  </svg>
);

// ─── Benefit item — scroll-driven reveal, zigzag layout ───
function BenefitItem({
  icon, title, desc, isDanger, isVisible, zigzag,
}: {
  icon: React.ReactNode; title: string; desc: string;
  isDanger: boolean; isVisible: boolean; zigzag: 'left' | 'right';
}) {
  const isRight = zigzag === 'right';
  return (
    <div style={{
      display: 'flex',
      flexDirection: isRight ? 'row-reverse' : 'row',
      gap: 14, marginBottom: 18,
      alignItems: 'flex-start',
      // Offset alternating rows for zigzag
      marginLeft: isRight ? 24 : 0,
      marginRight: isRight ? 0 : 24,
      opacity: isVisible ? 1 : 0,
      transform: isVisible
        ? 'translateY(0) translateX(0)'
        : isRight
          ? 'translateY(14px) translateX(12px)'
          : 'translateY(14px) translateX(-12px)',
      filter: isVisible ? 'blur(0px)' : 'blur(4px)',
      transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease',
    }}>
      <div style={{
        flexShrink: 0, width: 38, height: 38, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDanger ? 'rgba(239,68,68,0.08)' : 'rgba(34,211,238,0.08)',
        border: `1px solid ${isDanger ? 'rgba(239,68,68,0.18)' : 'rgba(34,211,238,0.18)'}`,
        color: isDanger ? '#ef4444' : '#06b6d4',
        boxShadow: isDanger ? '0 0 16px rgba(239,68,68,0.08)' : '0 0 16px rgba(34,211,238,0.08)',
      }}>
        {icon}
      </div>
      <div style={{ textAlign: isRight ? 'right' : 'left' }}>
        <h3 style={{
          fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.92)',
          marginBottom: 3, letterSpacing: '-0.01em', lineHeight: 1.3,
        }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'rgba(161,161,170,0.85)', lineHeight: 1.45, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Accordion Data ───
const accordionItems = [
  {
    id: '01',
    title: "Privacitat",
    subtitle: "Dades dins del perímetre.",
    desc: "Infraestructura 100% local. Les teves dades mai surten dels teus servidors. Compliment GDPR natiu.",
    stats: "100%",
    statsLabel: "Local",
    hex: "#06b6d4",
    bgGradient: "radial-gradient(circle at center, rgba(6,182,212,0.15) 0%, transparent 70%)",
    bgImage: "/assets/km0-security.png",
    vizComponent: null as React.ReactNode,
  },
  {
    id: '02',
    title: "Coneixement",
    subtitle: "La IA aprèn el teu negoci.",
    desc: "Alimentes la IA amb els teus documents, processos i historial intern. Respostes precises sobre el teu negoci, sense compartir res a fora.",
    stats: "3.5x",
    statsLabel: "Precisió",
    hex: "#6366f1",
    bgGradient: "radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 70%)",
    bgImage: null as string | null,
    vizComponent: 'fine-tuning' as const,
  },
  {
    id: '03',
    title: "Integració",
    subtitle: "Connexió directa.",
    desc: "Connectat directament als teus ERPs i SQL. Sense APIs externes lentes ni costos per token.",
    stats: "0ms",
    statsLabel: "Latència externa",
    hex: "#10b981",
    bgGradient: "radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, transparent 70%)",
    bgImage: null as string | null,
    vizComponent: 'integration' as const,
  },
];

// ─── Globe wrapper ───
const GlobeWrapper = memo(function GlobeWrapper({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const [progress, setProgress] = useState(0);
  // Globe morphs during the transition from Block A → Block B (0.40→0.58)
  const mode = useTransform(scrollYProgress, [0.40, 0.58], [0, 1]);
  useMotionValueEvent(mode, 'change', (v) => setProgress(Math.max(0, Math.min(1, v))));
  return <Km0Globe3D scrollProgress={progress} />;
});


// ═══════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════
export function Km0Section() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [blockAOpacity, setBlockAOpacity] = useState(1);
  const [blockMOpacity, setBlockMOpacity] = useState(0); // pivot bridge
  const [blockBOpacity, setBlockBOpacity] = useState(0);
  const [activeItem, setActiveItem] = useState(0); // 0, 1, or 2

  // Sequential bullet visibility — each appears as scroll advances
  // BLOCK A occupies 0→0.28 of scroll progress
  // We divide that into 3 windows for each bullet:
  //   bullet 0: visible from 0.04
  //   bullet 1: visible from 0.10
  //   bullet 2: visible from 0.18
  const [bullet0, setBullet0] = useState(false);
  const [bullet1, setBullet1] = useState(false);
  const [bullet2, setBullet2] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  // Globe fades out as Block A transitions
  const globeOpacity = useTransform(scrollYProgress, [0, 0.35, 0.45], [1, 1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // 1. Block A Opacity — fades out 0.35→0.45
    let newA = 1;
    if (v > 0.35) {
      newA = 1 - ((v - 0.35) / (0.45 - 0.35));
      if (newA < 0) newA = 0;
    }
    setBlockAOpacity(newA);

    // 2. Block M (pivot) — bell curve: in 0.38→0.45, peak 0.45→0.50, out 0.50→0.56
    let newM = 0;
    if (v >= 0.38 && v < 0.45) {
      newM = (v - 0.38) / (0.45 - 0.38);
    } else if (v >= 0.45 && v < 0.50) {
      newM = 1;
    } else if (v >= 0.50 && v < 0.56) {
      newM = 1 - ((v - 0.50) / (0.56 - 0.50));
    }
    setBlockMOpacity(Math.max(0, Math.min(1, newM)));

    // 3. Block B Opacity — fades in 0.53→0.62
    let newB = 0;
    if (v > 0.53) {
      newB = (v - 0.53) / (0.62 - 0.53);
      if (newB > 1) newB = 1;
    }
    setBlockBOpacity(newB);

    // 3. Active Accordion Logic
    let newItem = 0;
    if (v >= 0.85) newItem = 2;
    else if (v >= 0.70) newItem = 1;
    else newItem = 0;
    if (newItem !== activeItem) setActiveItem(newItem);

    // 4. Sequential bullets
    setBullet0(v >= 0.05);
    setBullet1(v >= 0.13);
    setBullet2(v >= 0.22);
  });

  const showBlockA = blockAOpacity > 0.05;
  const showBlockM = blockMOpacity > 0.05;
  const showBlockB = blockBOpacity > 0.05;

  return (
    <section
      ref={containerRef}
      style={{ position: 'relative', height: '240vh', background: '#030304', color: '#fff' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)', zIndex: 50 }}>
          <motion.div style={{ height: '100%', width: barWidth, background: 'linear-gradient(90deg, #ef4444, #06b6d4)' }} />
        </div>

        {/* Top Vignette — reduced so badge is visible */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 72,
          background: 'linear-gradient(to bottom, #030304 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 30,
        }} />

        {/* ════════ BLOCK A: The Problem ════════ */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          opacity: blockAOpacity,
          visibility: showBlockA ? 'visible' : 'hidden',
          transition: 'opacity 0.2s ease, visibility 0.2s',
          pointerEvents: showBlockA ? 'auto' : 'none',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', height: '100%',
            maxWidth: 1200, margin: '0 auto', padding: '72px 40px 0 48px', gap: 60,
          }}>
            {/* ── Left: Text ── */}
            <div style={{ flex: '0 0 auto', width: 'min(440px, 42vw)' }}>

              {/* Overline badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '5px 12px', borderRadius: 99,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.18)',
                marginBottom: 20,
              }}>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#ef4444',
                  boxShadow: '0 0 8px rgba(239,68,68,0.7)',
                  animation: 'ambient-breathe 2s ease-in-out infinite',
                }} />
                <p style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.16em',
                  textTransform: 'uppercase', color: '#f87171', margin: 0,
                }}>
                  Advertència · Fuga de dades
                </p>
              </div>

              {/* Headline — compact */}
              <h2 style={{
                fontSize: 'clamp(1.9rem, 3.8vw, 2.75rem)', fontWeight: 700,
                lineHeight: 1.08, marginBottom: 16, letterSpacing: '-0.025em',
              }}>
                <span style={{
                  background: 'linear-gradient(180deg, #fff 20%, rgba(255,255,255,0.72) 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>La teva IA actual treballa</span>
                {' '}
                <span style={{
                  color: '#ef4444', WebkitTextFillColor: '#ef4444',
                  textShadow: '0 0 32px rgba(239,68,68,0.3)',
                }}>per a altres.</span>
              </h2>

              {/* Subtitle — tighter */}
              <p style={{
                fontSize: 15, lineHeight: 1.65, marginBottom: 32,
                color: 'rgba(161,161,170,0.9)', letterSpacing: '-0.005em',
              }}>
                Cada vegada que el teu equip usa ChatGPT o eines al núvol, les dades confidencials de la teva empresa surten dels teus servidors. Sense control. Sense garanties.
              </p>

              {/* ── Scroll-driven sequential bullets — zigzag layout ── */}
              <div style={{ position: 'relative' }}>
                <BenefitItem
                  icon={IconLeak}
                  title="Fuga de Dades"
                  desc="Contractes, clients i estratègia interna en servidors d'altri."
                  isDanger
                  isVisible={bullet0}
                  zigzag="left"
                />
                <BenefitItem
                  icon={IconBlackBox}
                  title="IA Genèrica"
                  desc="Una eina que no coneix el teu sector, terminologia ni processos."
                  isDanger
                  isVisible={bullet1}
                  zigzag="right"
                />
                <BenefitItem
                  icon={IconGavel}
                  title="Risc Legal"
                  desc="Incompliment GDPR: multes de fins al 4% de la facturació anual."
                  isDanger
                  isVisible={bullet2}
                  zigzag="left"
                />
              </div>

            </div>

            {/* ── Right: Globe ── */}
            <motion.div style={{
              flex: '1', height: '78vh',
              opacity: globeOpacity,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 0,
            }}>
              <Suspense fallback={null}> <GlobeWrapper scrollYProgress={scrollYProgress} /> </Suspense>
            </motion.div>
          </div>
        </div>


        {/* ════════ BLOCK M: Pivot — "Existeix una altra manera" ════════ */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 15,
          opacity: blockMOpacity,
          visibility: showBlockM ? 'visible' : 'hidden',
          pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          {/* Thin horizontal rule that "slashes" across */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0,
            top: '50%',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.15) 20%, rgba(6,182,212,0.3) 50%, rgba(6,182,212,0.15) 80%, transparent 100%)',
            transform: 'translateY(-1px)',
          }} />

          {/* Central pivot text */}
          <div style={{
            textAlign: 'center',
            padding: '0 clamp(24px, 8vw, 120px)',
            position: 'relative',
          }}>
            {/* Overline */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              marginBottom: 28,
            }}>
              {/* Red dot fading to cyan */}
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: `rgba(239,68,68,${1 - blockMOpacity * 0.7})`,
                boxShadow: `0 0 10px rgba(239,68,68,${0.6 - blockMOpacity * 0.5})`,
                transition: 'background 0.3s, box-shadow 0.3s',
              }} />
              <div style={{
                width: 32, height: 1,
                background: `linear-gradient(90deg, rgba(239,68,68,${0.4 - blockMOpacity * 0.3}), rgba(6,182,212,${blockMOpacity * 0.5}))`,
              }} />
              <span style={{
                fontFamily: 'monospace', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>
                La solució
              </span>
              <div style={{
                width: 32, height: 1,
                background: `linear-gradient(90deg, rgba(6,182,212,${blockMOpacity * 0.5}), rgba(6,182,212,0.15))`,
              }} />
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#06b6d4',
                boxShadow: '0 0 10px rgba(6,182,212,0.7)',
              }} />
            </div>

            {/* Main statement */}
            <h2 style={{
              fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              margin: 0,
              color: 'rgba(255,255,255,0.95)',
            }}>
              Existeix una{' '}
              <span style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                altra manera.
              </span>
            </h2>
          </div>
        </div>

        {/* ════════ BLOCK B: Premium Horizontal Accordion ════════ */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          opacity: blockBOpacity,
          visibility: showBlockB ? 'visible' : 'hidden',
          transition: 'all 0.5s ease-out',
          pointerEvents: showBlockB ? 'auto' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            display: 'flex',
            width: '100%', height: '100%',
            maxWidth: 1400, margin: '0 auto',
          }}>
            {accordionItems.map((item, i) => {
              const isActive = activeItem === i;

              return (
                <div
                  key={item.id}
                  style={{
                    position: 'relative',
                    height: '100vh',
                    // Flexbox expansion logic
                    flex: isActive ? '3' : '1',
                    minWidth: 0, // allow flex shrinking

                    background: isActive ? '#050506' : '#000000',
                    borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',

                    overflow: 'hidden',
                    transition: 'flex 0.8s cubic-bezier(0.25, 1, 0.5, 1), background 0.5s ease',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center',
                    padding: isActive ? '0 80px' : '0 20px',
                    cursor: 'default',
                  }}
                >
                  {/* Cinematic Background Gradient (Active Only) */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: item.bgGradient,
                    opacity: isActive ? 0.6 : 0,
                    transition: 'opacity 0.8s ease',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }} />

                  {/* ── CUSTOM IMAGE BACKGROUND ── */}
                  {item.bgImage && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      zIndex: 0,
                      opacity: isActive ? 0.4 : 0,
                      transition: 'opacity 1s ease',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${item.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'grayscale(0.5) contrast(1.2)',
                      }} />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, #050506 10%, transparent 80%)'
                      }} />
                    </div>
                  )}

                  {/* ── GENERATIVE VISUALIZATION BACKGROUND ── */}
                  {item.vizComponent && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      zIndex: 0,
                      opacity: isActive ? 0.55 : 0,
                      transition: 'opacity 1s ease',
                      pointerEvents: 'none',
                    }}>
                      <Suspense fallback={null}>
                        {item.vizComponent === 'fine-tuning' && <Km0FineTuningViz />}
                        {item.vizComponent === 'integration' && <Km0IntegrationViz />}
                      </Suspense>
                      {/* Overlay gradient for text readability */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to right, #050506 0%, rgba(5,5,6,0.6) 40%, transparent 70%)',
                        zIndex: 1,
                      }} />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, #050506 5%, transparent 50%)',
                        zIndex: 1,
                      }} />
                    </div>
                  )}

                  {/* Header: Giant Number (Always visible, positions differently) */}
                  <div style={{
                    position: 'absolute', top: 120, left: isActive ? 80 : 20,
                    transition: 'all 0.8s ease',
                  }}>
                    <span style={{
                      fontSize: isActive ? '2rem' : '1.5rem',
                      fontFamily: 'monospace',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.2)',
                      letterSpacing: '0.05em',
                    }}>
                      {item.id}
                    </span>
                  </div>


                  {/* ── Active Content ── */}
                  <div style={{
                    position: isActive ? 'relative' : 'absolute',
                    zIndex: 2,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s', // Delayed
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}>
                    {/* Stat Highlihght */}
                    <div style={{ marginBottom: 24 }}>
                      <span style={{
                        fontSize: 'clamp(4rem, 6vw, 6rem)', fontWeight: 700,
                        lineHeight: 1, letterSpacing: '-0.03em',
                        color: item.hex,
                        textShadow: `0 0 40px ${item.hex}40`
                      }}>
                        {item.stats}
                      </span>
                      <div style={{
                        fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em',
                        color: 'rgba(255,255,255,0.5)', marginTop: 8
                      }}>
                        {item.statsLabel}
                      </div>
                    </div>

                    <h3 style={{
                      fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 600, color: 'white',
                      marginBottom: 16, lineHeight: 1.1
                    }}>
                      {item.title}
                    </h3>

                    <p style={{
                      fontSize: '1.125rem', color: '#a1a1aa', lineHeight: 1.6, maxWidth: 500
                    }}>
                      {item.desc}
                    </p>
                  </div>


                  {/* ── Inactive Vertical Label ── */}
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-90deg)',
                    whiteSpace: 'nowrap',
                    opacity: isActive ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}>
                    <span style={{
                      fontSize: '1.5rem', fontWeight: 500, letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase'
                    }}>
                      {item.title}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
          background: 'linear-gradient(to top, #030304 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 30,
        }} />

      </div>
    </section>
  );
}

export default Km0Section;
