import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Floating data particles ─── */
function DataParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => {
    const size = Math.random() * 2.5 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 6;
    const duration = 4 + Math.random() * 6;
    const opacity = 0.15 + Math.random() * 0.3;
    const isCyan = i % 3 === 0;
    return (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          left: `${x}%`,
          top: `${y}%`,
          background: isCyan
            ? `rgba(0, 188, 212, ${opacity})`
            : `rgba(255, 255, 255, ${opacity * 0.3})`,
          boxShadow: isCyan
            ? `0 0 ${size * 4}px rgba(0, 188, 212, ${opacity * 0.5})`
            : 'none',
          animation: `particle-drift ${duration}s ease-in-out ${delay}s infinite alternate`,
        }}
      />
    );
  });
  return <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">{particles}</div>;
}

export function HeroDark() {
  const heroRef = useRef<HTMLElement>(null);
  const maquetteRef = useRef<HTMLDivElement>(null);
  const maquetteInnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  /* ─── Mouse-tracking 3D tilt ─── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!maquetteInnerRef.current || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(maquetteInnerRef.current, {
      rotateY: x * 8,
      rotateX: -y * 5,
      duration: 0.8,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    hero.addEventListener('mousemove', handleMouseMove);
    return () => hero.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  /* ─── Scroll parallax ─── */
  useEffect(() => {
    if (!maquetteRef.current || !textRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(maquetteRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
      gsap.to(textRef.current, {
        opacity: 0,
        y: -20,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: '55% top', end: 'bottom top', scrub: 0.5 },
      });
    });
    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #111113 0%, #0A0A0C 50%, #050506 100%)' }}
    >
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(0,188,212,0.07) 0%, transparent 65%)', filter: 'blur(50px)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(0,0,0,0.5) 100%)' }}
        />
      </div>

      <DataParticles />

      {/* ═══ MAQUETTE — centered, positioned in top 60% of viewport ═══ */}
      <div
        ref={maquetteRef}
        className={`absolute left-1/2 -translate-x-1/2 top-[5%] z-10 transition-all duration-[1800ms] ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.85]'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div
          ref={maquetteInnerRef}
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {/* Circuit glow on base */}
          <div className="absolute inset-0 pointer-events-none z-[1]">
            <div
              className="absolute bottom-[26%] left-[15%] right-[15%] h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,188,212,0.4), rgba(34,211,238,0.55), rgba(0,188,212,0.4), transparent)',
                boxShadow: '0 0 14px rgba(0,188,212,0.35), 0 0 35px rgba(0,188,212,0.15)',
                animation: 'circuit-pulse 3s ease-in-out infinite',
              }}
            />
            <div
              className="absolute bottom-[30%] left-[22%] right-[28%] h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0,188,212,0.2), rgba(34,211,238,0.3), transparent)',
                boxShadow: '0 0 8px rgba(0,188,212,0.2)',
                animation: 'circuit-pulse 4s ease-in-out 1s infinite',
              }}
            />
            <div
              className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[55%] h-[14%]"
              style={{
                background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,188,212,0.15) 0%, transparent 70%)',
                filter: 'blur(12px)',
                animation: 'circuit-pulse 5s ease-in-out infinite',
              }}
            />
          </div>

          <img
            src="/city-hero-nobg.png"
            alt="SobiranIA - Servidor IA Local a Barcelona"
            className="relative w-auto object-contain mx-auto block"
            style={{
              height: '52vh',
              maxHeight: '460px',
              minHeight: '280px',
              filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.5)) drop-shadow(0 15px 35px rgba(0,188,212,0.1))',
            }}
          />

          {/* Ground reflection */}
          <div
            className="absolute bottom-[-4%] left-[15%] right-[15%] h-[14px]"
            style={{
              background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,188,212,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)',
              filter: 'blur(10px)',
            }}
          />
        </div>
      </div>

      {/* ═══ TEXT — absolutely positioned at bottom, overlapping maquette ═══ */}
      <div
        ref={textRef}
        className={`absolute bottom-[8%] left-0 right-0 z-20 text-center px-6 transition-all duration-[1400ms] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '500ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Overline */}
        <p
          className={`text-[11px] font-medium tracking-[0.2em] uppercase mb-3 transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color: 'rgba(0,188,212,0.65)', transitionDelay: '700ms' }}
        >
          Sobirania Digital · Barcelona
        </p>

        {/* Headline */}
        <h1
          className={`font-display text-[2.4rem] sm:text-[3rem] lg:text-[3.5rem] font-extrabold leading-[1.0] mb-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '900ms' }}
        >
          <span className="text-white/95">Sobirania </span>
          <span className="hero-dark-gradient">digital total.</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-sm sm:text-base font-light leading-relaxed mb-6 max-w-md mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ color: 'rgba(255,255,255,0.45)', transitionDelay: '1100ms' }}
        >
          Models d'IA instal·lats al teu propi servidor. Dades que mai surten del teu despatx.
        </p>

        {/* CTA + trust */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '1300ms' }}
        >
          <Button
            onClick={() => scrollToSection('contacte')}
            className="bg-[#00BCD4] hover:bg-[#00ACC1] text-[#0A0A0C] font-semibold px-7 py-3 text-sm rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#00BCD4]/30 flex items-center gap-2 group"
          >
            <span>Sol·licita diagnosi gratuïta</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

          <span className="text-[10px] tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
            GDPR
            <span className="mx-2" style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
            AES-256
            <span className="mx-2" style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
            Barcelona
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
        <div
          className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '1800ms' }}
        >
          <div className="w-5 h-8 rounded-full border-[1.5px] border-white/10 flex justify-center pt-1.5">
            <div className="w-0.5 h-2 rounded-full bg-white/15 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[5] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FAFAFA 0%, transparent 100%)' }}
      />
    </section>
  );
}
