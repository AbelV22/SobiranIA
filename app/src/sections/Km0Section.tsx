import { Suspense, lazy, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

// ════════════════════════════════════════════════════════════
//  KM0 SCROLLYTELLING — "Del Caos al Control"
//
//  Layout:
//    - Tall container (~250vh) to create scroll runway
//    - Right column: Sticky 3D globe (stays fixed)
//    - Left column: Two text blocks that scroll through
//
//  STATE A (0-50% scroll): "La Fuga" — danger, red icons
//  STATE B (50-100% scroll): "Sobirania" — safe, cyan icons
//
//  scrollProgress (0→1) is passed to globe for color/behavior lerp
// ════════════════════════════════════════════════════════════

const Km0Globe3D = lazy(() => import('@/components/Km0Globe3D'));

// ─── Benefit item component ───
function BenefitItem({
  icon,
  title,
  description,
  color,
  delay = 0,
  isVisible,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'danger' | 'safe';
  delay?: number;
  isVisible: boolean;
}) {
  const isDanger = color === 'danger';
  const accentBg = isDanger ? 'rgba(255,68,68,0.08)' : 'rgba(34,211,238,0.08)';
  const accentBorder = isDanger ? 'rgba(255,68,68,0.15)' : 'rgba(34,211,238,0.12)';
  const iconColor = isDanger ? 'text-red-400' : 'text-cyan-400';

  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, x: -30 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
      >
        <div className={`w-5 h-5 ${iconColor}`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white/95 mb-1">{title}</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── SVG Icons ───
const IconLeak = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

const IconBlackBox = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const IconGavel = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M3 6l3 1m0 0l-3 9a5 5 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5 5 0 01-6.001 0M18 7l-3 9m-5.301-1.699L12 12m0 0l2.699-2.699M12 12l-2.699 2.699"
    />
  </svg>
);

const IconShield = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const IconBrain = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const IconLock = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

export function Km0Section() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll position within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Derive which block is visible
  // 0-0.45 = Block A (danger), 0.45-0.55 = transition, 0.55-1 = Block B (safe)
  const blockAOpacity = useTransform(scrollYProgress, [0, 0.1, 0.4, 0.5], [0, 1, 1, 0]);
  const blockAY = useTransform(scrollYProgress, [0, 0.1, 0.4, 0.5], [60, 0, 0, -80]);
  const blockBOpacity = useTransform(scrollYProgress, [0.45, 0.6, 0.9, 1], [0, 1, 1, 1]);
  const blockBY = useTransform(scrollYProgress, [0.45, 0.6, 0.9, 1], [60, 0, 0, 0]);

  // Globe mode: 0→1 as we scroll from danger to safe
  const globeProgress = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);

  // Update state for globe (via ref sync)
  useMotionValueEvent(globeProgress, 'change', (v) => {
    setScrollProgress(Math.max(0, Math.min(1, v)));
  });

  // Block visibility flags for benefit animations
  const [blockAVisible, setBlockAVisible] = useState(false);
  const [blockBVisible, setBlockBVisible] = useState(false);

  useMotionValueEvent(blockAOpacity, 'change', (v) => setBlockAVisible(v > 0.3));
  useMotionValueEvent(blockBOpacity, 'change', (v) => setBlockBVisible(v > 0.3));

  // Dynamic ambient glow color
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      'radial-gradient(ellipse, rgba(255,68,68,0.05) 0%, transparent 65%)',
      'radial-gradient(ellipse, rgba(180,100,80,0.04) 0%, transparent 65%)',
      'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 65%)',
    ]
  );

  // Scroll indicator progress bar color
  const progressBarColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#ff4444', '#cc8844', '#22d3ee']
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-black text-white"
      style={{ height: '250vh' }}
    >
      {/* ─── Sticky wrapper (full viewport height, stays fixed) ─── */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Top gradient blend from hero */}
        <div
          className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-30"
          style={{ background: 'linear-gradient(to bottom, #050506 0%, transparent 100%)' }}
        />

        {/* Ambient background glow */}
        <motion.div
          className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: glowColor, filter: 'blur(80px)' }}
        />

        {/* Scroll progress micro-bar */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] z-50"
          style={{
            width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
            backgroundColor: progressBarColor,
            boxShadow: useTransform(
              progressBarColor,
              (c) => `0 0 12px ${c}40, 0 0 4px ${c}60`
            ),
          }}
        />

        <div className="container mx-auto px-6 lg:px-12 h-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full">
            {/* ═══ LEFT COLUMN: Scrollable text blocks ═══ */}
            <div className="relative flex items-center justify-center h-full">
              {/* ─── BLOCK A: The Problem ("La Fuga") ─── */}
              <motion.div
                className="absolute inset-0 flex items-center"
                style={{ opacity: blockAOpacity, y: blockAY }}
              >
                <div className="max-w-lg py-20">
                  {/* Overline */}
                  <motion.p
                    className="text-[11px] font-medium tracking-[0.2em] uppercase mb-5"
                    style={{ color: 'rgba(255,68,68,0.5)' }}
                    initial={{ opacity: 0 }}
                    animate={blockAVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Advertència · Fuga de dades
                  </motion.p>

                  <motion.h2
                    className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold mb-6 leading-[1.1]"
                    initial={{ opacity: 0, y: 30 }}
                    animate={blockAVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="text-white/95">La teva IA actual </span>
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #ff4444 0%, #ff6b35 50%, #ff4444 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      treballa per a altres
                    </span>
                    <span className="text-white/95">.</span>
                  </motion.h2>

                  <motion.p
                    className="text-base lg:text-lg leading-relaxed mb-10 max-w-md"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={blockAVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Quan uses models públics al núvol, les dades de la teva empresa entren
                    a una caixa negra fora del teu control.
                  </motion.p>

                  <div className="space-y-5">
                    <BenefitItem
                      icon={IconLeak}
                      title="Fuga de Dades"
                      description="Informació confidencial enviada a servidors estrangers sense cap garantia."
                      color="danger"
                      delay={0.2}
                      isVisible={blockAVisible}
                    />
                    <BenefitItem
                      icon={IconBlackBox}
                      title="Model Genèric"
                      description="Una IA que no entén el teu negoci ni el teu sector."
                      color="danger"
                      delay={0.3}
                      isVisible={blockAVisible}
                    />
                    <BenefitItem
                      icon={IconGavel}
                      title="Risc Legal"
                      description="Incompliment constant de la normativa GDPR europea."
                      color="danger"
                      delay={0.4}
                      isVisible={blockAVisible}
                    />
                  </div>
                </div>
              </motion.div>

              {/* ─── BLOCK B: The Solution ("Sobirania") ─── */}
              <motion.div
                className="absolute inset-0 flex items-center"
                style={{ opacity: blockBOpacity, y: blockBY }}
              >
                <div className="max-w-lg py-20">
                  {/* Overline */}
                  <motion.p
                    className="text-[11px] font-medium tracking-[0.2em] uppercase mb-5"
                    style={{ color: 'rgba(34,211,238,0.6)' }}
                    initial={{ opacity: 0 }}
                    animate={blockBVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Sobirania Digital · Quilòmetre Zero
                  </motion.p>

                  <motion.h2
                    className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold mb-6 leading-[1.1]"
                    initial={{ opacity: 0, y: 30 }}
                    animate={blockBVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="text-white/95">Control total: La teva IA de </span>
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 50%, #0891B2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Quilòmetre Zero
                    </span>
                    <span className="text-white/95">.</span>
                  </motion.h2>

                  <motion.p
                    className="text-base lg:text-lg leading-relaxed mb-10 max-w-md"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={blockBVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Recupera la sobirania. Models LLM privats, executats als teus servidors
                    i entrenats amb les teves dades.
                  </motion.p>

                  <div className="space-y-5">
                    <BenefitItem
                      icon={IconShield}
                      title="Privacitat Blindada"
                      description="El que passa al teu servidor, es queda al teu servidor."
                      color="safe"
                      delay={0.2}
                      isVisible={blockBVisible}
                    />
                    <BenefitItem
                      icon={IconBrain}
                      title="Cervell Corporatiu"
                      description="Fine-tuning real amb el coneixement de la teva empresa."
                      color="safe"
                      delay={0.3}
                      isVisible={blockBVisible}
                    />
                    <BenefitItem
                      icon={IconLock}
                      title="Compliment Natiu"
                      description="GDPR garantit per disseny, no per promesa."
                      color="safe"
                      delay={0.4}
                      isVisible={blockBVisible}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ═══ RIGHT COLUMN: Sticky 3D Globe ═══ */}
            <div className="hidden lg:flex items-center justify-center h-full">
              <div className="w-full h-[70vh] max-h-[700px] relative">
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div
                          className="w-20 h-20 rounded-full"
                          style={{
                            border: '1.5px solid rgba(255,68,68,0.15)',
                            borderTopColor: 'rgba(255,68,68,0.5)',
                            animation: 'spin 1.5s linear infinite',
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: '#ff4444', boxShadow: '0 0 10px rgba(255,68,68,0.5)' }}
                          />
                        </div>
                      </div>
                    </div>
                  }
                >
                  <Km0Globe3D scrollProgress={scrollProgress} />
                </Suspense>

                {/* Globe legend overlay */}
                <motion.div
                  className="absolute bottom-6 left-6 pointer-events-none space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  {/* Danger legend */}
                  <motion.div
                    className="flex items-center gap-2 text-[10px] tracking-wider uppercase"
                    style={{
                      color: useTransform(
                        scrollYProgress,
                        [0, 0.5, 1],
                        ['rgba(255,68,68,0.5)', 'rgba(255,68,68,0.25)', 'rgba(255,68,68,0.1)']
                      ),
                    }}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        background: 'rgba(255,68,68,0.6)',
                        boxShadow: '0 0 6px rgba(255,68,68,0.4)',
                        transition: 'opacity 0.5s',
                        opacity: scrollProgress < 0.8 ? 1 : 0.3,
                      }}
                    />
                    Fuga de dades · Servidors estrangers
                  </motion.div>

                  {/* Safe legend */}
                  <motion.div
                    className="flex items-center gap-2 text-[10px] tracking-wider uppercase"
                    style={{
                      color: useTransform(
                        scrollYProgress,
                        [0, 0.5, 1],
                        ['rgba(34,211,238,0.1)', 'rgba(34,211,238,0.3)', 'rgba(34,211,238,0.5)']
                      ),
                    }}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        background: '#22D3EE',
                        boxShadow: '0 0 6px rgba(34,211,238,0.5)',
                        transition: 'opacity 0.5s',
                        opacity: scrollProgress > 0.2 ? 1 : 0.2,
                      }}
                    />
                    Barcelona · Node Sobirà
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* ═══ MOBILE: Globe shown between text blocks (non-sticky) ═══ */}
            <div className="lg:hidden w-full h-[350px] relative -mt-4 mb-8">
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-14 h-14 rounded-full border border-cyan-500/20"
                      style={{ borderTopColor: 'rgba(34,211,238,0.5)', animation: 'spin 1.5s linear infinite' }}
                    />
                  </div>
                }
              >
                <Km0Globe3D scrollProgress={scrollProgress} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Scroll hint at bottom */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.6, 0.3, 0.3, 0]),
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-[9px] tracking-[0.25em] uppercase"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              Scroll
            </span>
            <div className="w-5 h-8 rounded-full border border-white/10 flex justify-center pt-1.5">
              <motion.div
                className="w-0.5 h-2 rounded-full bg-white/20"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom gradient for transition to next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-30"
          style={{ background: 'linear-gradient(to top, #000000 0%, transparent 100%)' }}
        />
      </div>
    </section>
  );
}

export default Km0Section;
