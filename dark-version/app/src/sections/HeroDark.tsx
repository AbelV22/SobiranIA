import { useEffect, useRef, useCallback, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  id: number; x: number; y: number;
  size: number; opacity: number; vx: number; vy: number;
}

/*
  GRID (fixed px — nothing can overflow):
    Row 1:  72px  → nav clearance (48px) + overline (24px)
    Row 2:  1fr   → maquette fills ALL remaining space
    Row 3: 175px  → headline + subtitle + single CTA button
  Total: 72 + 1fr + 175 = 100vh  ✓
*/

export function HeroDark() {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);
  const maquetteInnerRef = useRef<HTMLDivElement>(null);
  const maquetteWrapperRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const fullLightRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const iv = setInterval(() => setActiveImage(p => p === 0 ? 2 : 0), 3500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    setParticles(Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1 + Math.random() * 2.5,
      opacity: 0.04 + Math.random() * 0.16,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
    })));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const xN = mouse.current.x / rect.width - 0.5;
    const yN = mouse.current.y / rect.height - 0.5;

    if (maquetteInnerRef.current) {
      gsap.to(maquetteInnerRef.current, {
        rotateY: xN * 7, rotateX: -yN * 4,
        duration: 1.6, ease: 'power2.out', overwrite: 'auto',
      });
    }

    if (fullLightRef.current && maquetteWrapperRef.current) {
      const r = maquetteWrapperRef.current.getBoundingClientRect();
      const lx = e.clientX - r.left, ly = e.clientY - r.top;
      // Smoothly animate the flashlight mask position
      gsap.to(fullLightRef.current, {
        '--mouse-x': `${lx}px`,
        '--mouse-y': `${ly}px`,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const ctx = gsap.context(() => {
      gsap.ticker.add(() => {
        if (!particlesRef.current) return;
        particles.forEach((p, i) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = window.innerWidth;
          if (p.x > window.innerWidth) p.x = 0;
          if (p.y < 0) p.y = window.innerHeight;
          if (p.y > window.innerHeight) p.y = 0;
          const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let mx = p.x, my = p.y;
          if (dist < 140) {
            const f = (140 - dist) / 140, a = Math.atan2(dy, dx);
            mx += Math.cos(a) * f * 2.5; my += Math.sin(a) * f * 2.5;
            p.x += Math.cos(a) * 0.25; p.y += Math.sin(a) * 0.25;
          }
          const el = particlesRef.current?.children[i] as HTMLElement;
          if (el) gsap.set(el, { x: mx, y: my, opacity: p.opacity });
        });
      });
    });
    hero.addEventListener('mousemove', handleMouseMove);
    return () => { hero.removeEventListener('mousemove', handleMouseMove); ctx.revert(); };
  }, [handleMouseMove, particles]);

  useEffect(() => {
    if (!maquetteWrapperRef.current || !headlineRef.current) return;
    const els = [maquetteWrapperRef.current, headlineRef.current, subtitleRef.current, ctaRef.current];
    els.forEach(el => { if (el) gsap.set(el, { opacity: 0, y: 24 }); });
    if (shadowRef.current) gsap.set(shadowRef.current, { opacity: 0, scale: 0.7 });
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(maquetteWrapperRef.current, { opacity: 1, y: 0, duration: 1.6 }, 0.1)
      .to(shadowRef.current, { opacity: 1, scale: 1, duration: 1.5 }, 0.28)
      .to(headlineRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.55)
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.72)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.88);
    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const targets = [maquetteWrapperRef.current, headlineRef.current, subtitleRef.current, ctaRef.current].filter(Boolean);
    const ctx = gsap.context(() => {
      gsap.fromTo(targets,
        { y: 0, opacity: 1, filter: 'blur(0px)' },
        {
          y: -40, opacity: 0, filter: 'blur(12px)', ease: 'none', stagger: 0.08,
          scrollTrigger: { trigger: heroRef.current, start: '5% top', end: '85% top', scrub: true },
          immediateRender: false
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        minHeight: isMobile ? 650 : 500,
        overflow: 'hidden',
        background: '#07070A',
        display: 'grid',
        gridTemplateRows: isMobile ? '48px 1fr auto' : '48px 1fr min-content',
        gridTemplateColumns: '1fr',
      }}
    >

      {/* ── Background glow ── */}
      <div style={{
        position: 'absolute', top: '2%', left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: '72%', borderRadius: '50%',
        background: 'radial-gradient(ellipse 60% 55% at 50% 36%, rgba(0,188,212,0.12) 0%, rgba(0,130,180,0.05) 45%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none', zIndex: 1,
        animation: 'ambient-breathe 9s ease-in-out infinite',
      }} />

      {/* ── Particles ── */}
      <div ref={particlesRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute', top: 0, left: 0,
            width: `${p.size}px`, height: `${p.size}px`, borderRadius: '50%',
            background: `rgba(0,188,212,${p.opacity})`,
            boxShadow: `0 0 ${p.size * 4}px rgba(0,188,212,${p.opacity * 0.4})`,
          }} />
        ))}
      </div>

      {/* ── Side vignettes ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '8%', background: 'linear-gradient(to right, rgba(7,7,10,0.85), transparent)', pointerEvents: 'none', zIndex: 4 }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '8%', background: 'linear-gradient(to left, rgba(7,7,10,0.85), transparent)', pointerEvents: 'none', zIndex: 4 }} />

      {/* ROW 1 — empty spacer for fixed nav clearance */}
      <div style={{ gridRow: 1 }} />

      {/* ══ ROW 2 — MAQUETTE (1fr = all remaining space) ══ */}
      <div
        ref={maquetteWrapperRef}
        onMouseEnter={() => { if (fullLightRef.current) fullLightRef.current.style.opacity = '1'; }}
        onMouseLeave={() => {
          if (fullLightRef.current) {
            fullLightRef.current.style.opacity = '0';
          }
        }}
        style={{
          gridRow: 2,
          height: '100%',      /* fill the full 1fr row */
          minHeight: 0,
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          opacity: 0,
          cursor: 'default',
        }}
      >
        <div
          ref={maquetteInnerRef}
          style={{
            perspective: '1400px',
            transformStyle: 'preserve-3d',
            position: 'relative',
            height: '100%',    /* fill the wrapper */
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Base */}
          <img src="/hero-dynamic-2.png" alt="SobiranIA maquette" style={{
            height: '100%', width: 'auto', display: 'block', objectFit: 'contain',
            opacity: activeImage === 0 ? 1 : 0, transition: 'opacity 2.2s ease-in-out',
            willChange: 'opacity',
          }} />
          {/* Flashlight */}
          <img ref={fullLightRef} src="/hero-dynamic-full.png" alt="" style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            height: '100%', width: 'auto', objectFit: 'contain',
            opacity: 0, transition: 'opacity 0.35s ease-out', zIndex: 5,
            willChange: 'opacity',
            maskImage: 'radial-gradient(circle 320px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle 320px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)',
          }} />
          {/* Wireframe */}
          <img src="/hero-dynamic-3.png" alt="" style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            height: '100%', width: 'auto', objectFit: 'contain',
            opacity: activeImage === 2 ? 1 : 0, transition: 'opacity 2.2s ease-in-out',
            willChange: 'opacity',
          }} />

          {/* Floor glow — 3 layers for Apple "stage" look */}
          <div ref={shadowRef} style={{
            position: 'absolute', bottom: '-5%', left: '50%', transform: 'translateX(-50%)',
            width: '65%', height: 52, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(0,188,212,0.55) 0%, rgba(0,188,212,0.18) 45%, transparent 70%)',
            filter: 'blur(16px)', opacity: 0, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-12%', left: '50%', transform: 'translateX(-50%)',
            width: '95%', height: 72, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(0,100,150,0.24) 0%, transparent 65%)',
            filter: 'blur(28px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: '135%', height: 100, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(0,60,100,0.14) 0%, transparent 60%)',
            filter: 'blur(48px)', pointerEvents: 'none',
          }} />

          {/* Orbit rings */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '110%', height: '110%', transform: 'translate(-50%,-50%)',
            borderRadius: '50%', border: '1px solid rgba(0,188,212,0.08)',
            pointerEvents: 'none', animation: 'orbit-spin 32s linear infinite',
          }}>
            <span style={{
              position: 'absolute', top: '2%', left: '50%',
              width: 5, height: 5, borderRadius: '50%',
              background: 'rgba(0,188,212,0.6)', boxShadow: '0 0 10px rgba(0,188,212,0.5)',
              transform: 'translate(-50%,-50%)', display: 'block',
            }} />
          </div>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '125%', height: '125%', transform: 'translate(-50%,-50%)',
            borderRadius: '50%', border: '1px solid rgba(0,188,212,0.04)',
            pointerEvents: 'none', animation: 'orbit-spin 48s linear reverse infinite',
          }}>
            <span style={{
              position: 'absolute', bottom: '10%', right: '10%',
              width: 3, height: 3, borderRadius: '50%',
              background: 'rgba(0,188,212,0.3)', display: 'block',
            }} />
          </div>
        </div>
      </div>

      {/* ══ ROW 3 — TEXT + CTA (min-content so it adapts to screen sizes) ══ */}
      <div style={{
        gridRow: 3,
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: isMobile ? '16px 24px 80px' : '16px 24px 48px', // Added vertical padding
        gap: 10,
        background: 'linear-gradient(to bottom, transparent 0%, rgba(7,7,10,0.6) 15%, #07070A 40%, #07070A 100%)',
      }}>

        {/* Overline tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '3px 12px', borderRadius: 99,
          background: 'rgba(0,188,212,0.05)',
          border: '1px solid rgba(0,188,212,0.12)',
        }}>
          <div style={{
            width: 4, height: 4, borderRadius: '50%',
            background: '#00BCD4',
            boxShadow: '0 0 8px rgba(0,188,212,0.8)',
            animation: 'ambient-breathe 2.5s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'monospace', fontSize: 8, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(0,188,212,0.6)',
          }}>
            Intel·ligència Artificial · KM0
          </span>
        </div>

        {/* Headline */}
        <h1 ref={headlineRef} style={{
          fontSize: 'clamp(28px, 4vw, 38px)',
          fontWeight: 800,
          lineHeight: 1.06,
          letterSpacing: '-0.045em',
          margin: 0,
          opacity: 0,
        }}>
          <span style={{ color: '#F5F5F7' }}>La teva empresa,</span>{' '}
          <span className="hero-dark-gradient-animated">el doble de productiva.</span>
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} style={{
          fontSize: 15,
          fontWeight: 400,
          lineHeight: 1.55,
          color: 'rgba(245,245,247,0.50)',
          maxWidth: 500,
          margin: 0,
          opacity: 0,
          letterSpacing: '-0.01em',
        }}>
          IA instal·lada al teu servidor. Sense quotes mensuals.{' '}
          <span style={{ color: 'rgba(245,245,247,0.80)', fontWeight: 500 }}>
            Les teves dades, sempre sota el teu control.
          </span>
        </p>

        {/* Single CTA — centered */}
        <div ref={ctaRef} style={{ opacity: 0 }}>
          <button
            onClick={() => scrollToSection('contacte')}
            className="group relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #00D4EF 0%, #0097A7 60%, #006F8A 100%)',
              color: '#050507', fontWeight: 700,
              padding: '13px 34px', fontSize: 14,
              borderRadius: 9999, border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 9,
              transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              boxShadow: '0 0 40px rgba(0,188,212,0.3), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
              letterSpacing: '-0.02em', whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 60px rgba(0,188,212,0.5), 0 0 80px rgba(0,188,212,0.15), inset 0 1px 0 rgba(255,255,255,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0,188,212,0.3), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)';
            }}
          >
            <div className="absolute inset-0 flex translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out">
              <div className="w-16 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]" />
            </div>
            Sol·licita la diagnosi gratuïta
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          opacity: 0.35, animation: 'scroll-bounce 2s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>scroll</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,188,212,0.6)" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes orbit-spin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.35; }
          50% { transform: translateX(-50%) translateY(6px); opacity: 0.55; }
        }
      `}</style>
    </section>
  );
}
