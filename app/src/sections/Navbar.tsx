import { useState, useEffect, useRef } from 'react';
import { Menu, X, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['proces', 'serveis', 'tecnologia', 'comparativa', 'contacte'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const activeLink = linkRefs.current[activeSection];
    const indicator = indicatorRef.current;
    if (!activeLink || !indicator) {
      if (indicator) indicator.style.opacity = '0';
      return;
    }
    const rect = activeLink.getBoundingClientRect();
    const navRect = navRef.current?.getBoundingClientRect();
    if (!navRect) return;
    indicator.style.left = `${rect.left - navRect.left}px`;
    indicator.style.width = `${rect.width}px`;
    indicator.style.opacity = '1';
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Procés', id: 'proces' },
    { label: 'Tecnologia', id: 'tecnologia' },
    { label: 'Serveis', id: 'serveis' },
    { label: 'Comparativa', id: 'comparativa' },
    { label: 'Contacte', id: 'contacte' },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <Server className="w-5 h-5 text-[#0891B2] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-[#0891B2]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-lg font-semibold text-[#1D1D1F] tracking-tight">
              Sobiran<span className="text-[#0891B2]">IA</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navItems.map((item) => (
              <button
                key={item.id}
                ref={(el) => { linkRefs.current[item.id] = el; }}
                onClick={() => scrollToSection(item.id)}
                className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-[#1D1D1F]'
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div
              ref={indicatorRef}
              className="nav-indicator absolute -bottom-px opacity-0"
            />

            <div className="ml-4 pl-4 border-l border-black/10">
              <button
                onClick={() => scrollToSection('contacte')}
                className="inline-flex items-center justify-center border border-[#1D1D1F]/20 text-[#1D1D1F] hover:border-[#0891B2] hover:text-[#0891B2] hover:bg-[#0891B2]/[0.04] bg-transparent font-medium px-5 py-2 h-9 text-sm rounded-full transition-all duration-300"
              >
                Diagnosi gratuïta
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1D1D1F] hover:text-[#0891B2] transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass border-t border-black/5 px-4 py-5 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left text-base font-medium py-2.5 px-3 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? 'text-[#1D1D1F] bg-black/5'
                  : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('contacte')}
            className="w-full inline-flex items-center justify-center border border-[#1D1D1F]/20 text-[#1D1D1F] hover:border-[#0891B2] hover:text-[#0891B2] bg-transparent font-medium py-3 rounded-full transition-all duration-200 mt-3"
          >
            Diagnosi gratuïta
          </button>
        </div>
      </div>
    </nav>
  );
}
