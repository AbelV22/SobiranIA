import { Search, Server, Workflow, ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function ProcessSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const steps = [
    {
      icon: Search,
      title: 'Analitzem el teu negoci',
      description: 'Estudiem els teus fluxos de treball, documents i processos. Identifiquem exactament on la IA et pot estalviar hores.',
      number: '01',
      features: ['Auditoria completa de processos', 'Oportunitats d\'automatització', 'Pla personalitzat'],
    },
    {
      icon: Server,
      title: 'Instal·lem el teu servidor',
      description: 'Servidor d\'alta gamma instal·lat físicament al teu despatx. Les teves dades mai surten del teu espai.',
      number: '02',
      features: ['Instal·lació in situ', 'Xifratge AES-256', 'Zero connexions externes'],
    },
    {
      icon: Workflow,
      title: 'Integrem i formem',
      description: 'La IA treballa dins dels teus programes habituals. El teu equip aprèn a treure\'n el màxim rendiment.',
      number: '03',
      features: ['Integració amb el teu software', 'Formació presencial', 'Suport continu il·limitat'],
    },
  ];

  return (
    <section id="proces" className="relative py-24 md:py-32 lg:py-40 bg-[#FAFAFA]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#0071E3]/[0.02] blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 md:mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/[0.06] mb-6 apple-shadow">
            <span className="text-sm font-medium text-[#0071E3]">El Procés</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6">
            Tres passos cap a la <span className="text-gradient">sobirania digital</span>
          </h2>
          <p className="text-lg text-[#86868B] max-w-2xl mx-auto">
            Un procés senzill, transparent i sense interrupcions per portar la intel·ligència
            artificial al teu negoci amb total seguretat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-24 left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px">
            <div
              className={`h-full transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0, 113, 227, 0.2), transparent)',
              }}
            />
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-3xl bg-white apple-shadow hover:apple-shadow-lg transition-all duration-700 hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div
                className={`absolute -top-4 left-8 px-3 py-1 rounded-full bg-[#1D1D1F] text-white text-sm font-bold mono transition-all duration-500 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                {step.number}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/8 flex items-center justify-center mb-6 group-hover:bg-[#0071E3]/12 transition-all duration-300 group-hover:scale-110">
                <step.icon className="w-7 h-7 text-[#0071E3]" />
              </div>

              <h3 className="text-xl font-semibold text-[#1D1D1F] mb-4">
                {step.title}
              </h3>
              <p className="text-[#86868B] mb-6 leading-relaxed">
                {step.description}
              </p>

              <ul className="space-y-2">
                {step.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-sm text-[#6E6E73]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-5 h-5 text-[#0071E3]" />
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-[#86868B] mb-4">
            Vols saber com podem transformar el teu negoci concretament?
          </p>
          <button
            onClick={() => document.getElementById('contacte')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-[#0071E3] hover:text-[#0077ED] font-medium transition-all duration-200 group"
          >
            Parlem del teu cas
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
