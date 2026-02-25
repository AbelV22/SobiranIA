import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const maquetteRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Parallax on scroll
  useEffect(() => {
    if (!maquetteRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(maquetteRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      gsap.to(textRef.current, {
        opacity: 0,
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '60% top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[640px] max-h-[960px] overflow-hidden bg-[#FAFAFA]"
    >
      {/* Ambient gradient — clean, no patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#0891B2]/[0.04] via-[#22D3EE]/[0.02] to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#0891B2]/[0.02] to-transparent blur-3xl" />
      </div>

      {/* Main container */}
      <div className="relative h-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* Text block — left, vertically centered */}
        <div
          ref={textRef}
          className="absolute left-6 sm:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-20 max-w-[420px] xl:max-w-[480px]"
        >
          {/* Overline */}
          <p
            className={`text-xs font-semibold text-[#0891B2] tracking-[0.15em] uppercase mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            style={{ transitionDelay: '300ms' }}
          >
            Sobirania Digital
          </p>

          {/* Headline — 2 lines, tight leading, compact block */}
          <h1
            className={`font-display text-[2.6rem] sm:text-[3rem] lg:text-[3.2rem] xl:text-[3.5rem] font-extrabold text-[#1D1D1F] leading-[0.98] mb-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: '500ms' }}
          >
            Sobirania
            <br />
            <span className="text-gradient-hero">digital total.</span>
          </h1>

          {/* Subtitle — one short line */}
          <p
            className={`text-base lg:text-lg text-[#86868B] mb-7 leading-relaxed transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '700ms' }}
          >
            IA instal·lada al teu despatx. Les teves dades, sempre teves.
          </p>

          {/* Single CTA — cyan accent matching 3D circuits */}
          <div
            className={`mb-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            style={{ transitionDelay: '900ms' }}
          >
            <Button
              onClick={() => scrollToSection('contacte')}
              className="bg-[#0891B2] hover:bg-[#0E7490] text-white font-semibold px-6 py-3 text-sm rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#0891B2]/25 flex items-center gap-2 group ripple-btn"
            >
              <span className="relative z-10">Sol·licita diagnosi gratuïta</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Trust row — aligned right under button */}
          <div
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            style={{ transitionDelay: '1100ms' }}
          >
            <span className="text-[11px] text-[#86868B]/60 tracking-wider uppercase">
              GDPR
              <span className="text-[#86868B]/25 mx-2">·</span>
              AES-256
              <span className="text-[#86868B]/25 mx-2">·</span>
              Barcelona
            </span>
          </div>
        </div>

        {/* Maquette — right-aligned, large, grounded */}
        <div
          ref={maquetteRef}
          className={`absolute right-0 lg:right-[-2%] xl:right-0 top-[20%] -translate-y-1/2 w-[55%] lg:w-[56%] xl:w-[58%] z-10 transition-all duration-[1400ms] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.92]'
            }`}
          style={{ transitionDelay: '600ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Grounding: radial gradient behind maquette for depth */}
          <div
            className="absolute bottom-[-8%] left-[10%] right-[10%] h-[40%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(8, 145, 178, 0.08) 0%, rgba(0,0,0,0.03) 40%, transparent 70%)',
              filter: 'blur(16px)',
            }}
          />

          {/* Secondary ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#0891B2]/[0.04] via-[#22D3EE]/[0.02] to-transparent blur-3xl pointer-events-none" />

          <img
            src="/city-hero-nobg.png"
            alt="SobiranIA - Intel·ligència Artificial Local a Barcelona"
            className="relative w-full h-auto max-h-[80vh] object-contain animation-float-slow"
            style={{
              filter: 'drop-shadow(0px 30px 60px rgba(0,0,0,0.12))',
            }}
          />

          {/* Contact shadow — elliptical ground shadow */}
          <div
            className="absolute bottom-[2%] left-[22%] right-[22%] h-[6px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0, 0, 0, 0.12) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div
          className={`flex flex-col items-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          style={{ transitionDelay: '1600ms' }}
        >
          <div className="w-5 h-8 rounded-full border-[1.5px] border-[#86868B]/20 flex justify-center pt-1.5">
            <div className="w-0.5 h-2 rounded-full bg-[#86868B]/25 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-[5] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FAFAFA 0%, transparent 100%)' }}
      />
    </section>
  );
}
