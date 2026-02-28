import { useState, useEffect, useRef } from 'react';
import { Menu, X, Server } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onTecnologiaClick: () => void;
}

export function Navbar({ onTecnologiaClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isMobile = useIsMobile();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; // Reset
    }
    return () => { document.body.style.overflow = 'auto'; }; // Cleanup
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['proces', 'serveis', 'contacte'];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  // Scroll-based nav items (no Comparativa, no Tecnologia)
  const scrollNavItems = [
    { label: 'Procés', id: 'proces' },
    { label: 'Serveis', id: 'serveis' },
    { label: 'Contacte', id: 'contacte' },
  ];

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
        background: isScrolled ? 'rgba(8, 8, 10, 0.72)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(30px) saturate(200%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(30px) saturate(200%)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        boxShadow: isScrolled ? '0 1px 0 rgba(0,188,212,0.06)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 48px 0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isMobile ? '56px' : '48px' }}>
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', zIndex: 60 }}
          >
            <Server style={{ width: 20, height: 20, color: '#00BCD4' }} />
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em', transition: 'color 0.5s' }}>
              Sobiran<span style={{ color: '#00BCD4' }}>IA</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden md:flex">

            {/* Scroll-based items */}
            {scrollNavItems.map((item) => (
              <button
                key={item.id}
                ref={(el) => { linkRefs.current[item.id] = el; }}
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s',
                  color: activeSection === item.id
                    ? '#FFFFFF'
                    : 'rgba(255,255,255,0.6)',
                }}
                className="hover:text-white hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}

            {/* Tecnologia — opens overlay */}
            <button
              onClick={onTecnologiaClick}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s',
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              className="hover:text-white hover:bg-white/5"
            >
              Tecnologia
              {/* Small arrow-up-right hint */}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.4 }}>
                <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div style={{ marginLeft: '16px', paddingLeft: '16px', borderLeft: `1px solid rgba(255,255,255,0.08)`, display: isScrolled ? 'block' : 'none' }}>
              <button
                onClick={() => scrollToSection('contacte')}
                style={{
                  background: 'rgba(0,188,212,0.08)',
                  border: `1px solid rgba(0,188,212,0.25)`,
                  color: '#22D3EE',
                  fontWeight: 600,
                  padding: '8px 22px',
                  fontSize: '13px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                  opacity: isScrolled ? 1 : 0,
                  pointerEvents: isScrolled ? 'auto' : 'none',
                  transform: isScrolled ? 'translateY(0)' : 'translateY(-10px)',
                  boxShadow: '0 0 20px rgba(0,188,212,0.08)',
                  letterSpacing: '-0.01em',
                }}
                className="hover:bg-[rgba(0,188,212,0.15)] hover:border-[rgba(0,188,212,0.4)]"
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(0,188,212,0.2)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,188,212,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                Diagnosi gratuïta
              </button>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#FFFFFF',
              padding: '8px', zIndex: 60
            }}
            className="md:hidden"
          >
            {isMobileMenuOpen ? <X style={{ width: 24, height: 24 }} /> : <Menu style={{ width: 24, height: 24 }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? '56px' : '48px',
          left: 0,
          right: 0,
          background: 'rgba(8, 8, 10, 0.95)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '24px',
          padding: '32px 24px 40px',
          transition: 'all 0.4s ease-in-out',
          opacity: isMobileMenuOpen ? 1 : 0,
          visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
        }}
      >
        {scrollNavItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              fontWeight: 600,
              color: '#FFFFFF',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.4s ease-out ${index * 0.1}s`,
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}

        {/* Tecnologia in mobile menu */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            setTimeout(onTecnologiaClick, 300);
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            fontWeight: 600,
            color: '#06b6d4',
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.4s ease-out ${scrollNavItems.length * 0.1}s`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          Tecnologia
          <svg width="16" height="16" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.6 }}>
            <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={() => scrollToSection('contacte')}
          style={{
            marginTop: '24px',
            background: '#00BCD4',
            color: '#08080A',
            border: 'none',
            fontSize: '18px',
            fontWeight: 600,
            padding: '16px 32px',
            borderRadius: '9999px',
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.4s ease-out ${(scrollNavItems.length + 1) * 0.1}s`,
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 188, 212, 0.3)',
          }}
        >
          Diagnosi gratuïta
        </button>
      </div>
    </nav>
  );
}
