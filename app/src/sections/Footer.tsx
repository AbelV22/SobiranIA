import { Server, MapPin, Phone, Mail, Linkedin, Twitter } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const footerLinks = {
    serveis: [
      { label: 'Diagnosi IA', href: '#proces' },
      { label: 'Instal·lacio', href: '#proces' },
      { label: 'Formacio', href: '#proces' },
      { label: 'Suport', href: '#serveis' },
    ],
    empresa: [
      { label: 'Qui som', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Partners', href: '#' },
      { label: 'Contacte', href: '#contacte' },
    ],
    legal: [
      { label: 'Politica de privacitat', href: '#' },
      { label: 'Termes de servei', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#') && href.length > 1) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative bg-[#0A0A0F]">
      {/* Animated gradient separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#22D3EE]/30 to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Server className="w-6 h-6 text-[#22D3EE]" />
              <span className="text-xl font-semibold text-[#F5F5F7]">
                Sobiran<span className="text-[#22D3EE]">IA</span>
              </span>
            </div>
            <p className="text-[#6B6B78] mb-6 max-w-sm">
              Servei integral d'intel·ligencia artificial local per a empreses de Barcelona.
              Dades sota el teu control.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#6B6B78] hover:text-[#F5F5F7] transition-colors duration-200">
                <MapPin className="w-5 h-5 text-[#22D3EE]" />
                <span>Barcelona, Catalunya</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B6B78] hover:text-[#F5F5F7] transition-colors duration-200">
                <Phone className="w-5 h-5 text-[#22D3EE]" />
                <span>+34 93 000 00 00</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B6B78] hover:text-[#F5F5F7] transition-colors duration-200">
                <Mail className="w-5 h-5 text-[#22D3EE]" />
                <span>hola@sobiranIA.cat</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-[#F5F5F7] mb-4">Serveis</h4>
            <ul className="space-y-3">
              {footerLinks.serveis.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-[#6B6B78] hover:text-[#F5F5F7] transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#22D3EE] group-hover:w-full transition-all duration-300" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-[#F5F5F7] mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-[#6B6B78] hover:text-[#F5F5F7] transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#22D3EE] group-hover:w-full transition-all duration-300" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-[#F5F5F7] mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-[#6B6B78] hover:text-[#F5F5F7] transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#22D3EE] group-hover:w-full transition-all duration-300" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B6B78]">
            {currentYear} SobiranIA. Tots els drets reservats.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-[#111118] flex items-center justify-center text-[#6B6B78] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-all duration-200 hover:scale-110">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#111118] flex items-center justify-center text-[#6B6B78] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-all duration-200 hover:scale-110">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
