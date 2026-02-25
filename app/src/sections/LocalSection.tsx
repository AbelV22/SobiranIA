import { MapPin, Phone, Mail, Clock, Users } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function LocalSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const zones = ['Sant Gervasi', 'Eixample', 'Gràcia', 'Sarrià', 'Les Corts', 'Ciutat Vella', 'Sant Martí'];

  const benefits = [
    {
      icon: MapPin,
      title: 'Instal·lació presencial',
      description: 'Venim al teu despatx i configurem tot el sistema in situ. Sense complicacions.',
    },
    {
      icon: Phone,
      title: 'Suport local directe',
      description: 'Atenció telefònica directa amb tècnics a Barcelona. Sense call centers.',
    },
    {
      icon: Clock,
      title: 'Resposta en 4 hores',
      description: 'Temps de resposta garantit per a qualsevol incidència o consulta tècnica.',
    },
    {
      icon: Users,
      title: 'Formació inclosa',
      description: 'Sessions presencials per al teu equip fins que dominin la IA al 100%.',
    },
  ];

  return (
    <section id="serveis" className="relative py-24 md:py-32 lg:py-40 bg-[#F5F5F7]">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/[0.06] mb-6 apple-shadow">
            <MapPin className="w-4 h-4 text-[#0071E3]" />
            <span className="text-sm font-medium text-[#0071E3]">Barcelona</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6">
            Tecnologia global, <span className="text-gradient">servei de proximitat</span>
          </h2>
          <p className="text-lg text-[#86868B] max-w-2xl mx-auto">
            Som de Barcelona. Instal·lem, mantenim i donem suport presencialment.
            La intel·ligència artificial amb el tracte que mereixes.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {zones.map((zone, i) => (
            <div
              key={zone}
              className={`px-4 py-2 rounded-full bg-white border border-black/[0.04] text-sm text-[#1D1D1F] font-medium hover:border-[#0071E3]/20 hover:bg-[#0071E3]/[0.03] transition-all duration-500 cursor-default apple-shadow ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${200 + i * 60}ms` }}
            >
              {zone}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`relative transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative p-8 rounded-3xl bg-white apple-shadow-lg overflow-hidden">
              <svg viewBox="0 0 400 300" className="w-full h-auto" fill="none">
                {[...Array(8)].map((_, i) => (
                  <line key={`h-${i}`} x1="50" y1={60 + i * 25} x2="350" y2={60 + i * 25} stroke="rgba(0, 113, 227, 0.08)" strokeWidth="0.5" />
                ))}
                {[...Array(12)].map((_, i) => (
                  <line key={`v-${i}`} x1={50 + i * 27} y1="60" x2={50 + i * 27} y2="260" stroke="rgba(0, 113, 227, 0.08)" strokeWidth="0.5" />
                ))}
                <line x1="50" y1="200" x2="350" y2="100" stroke="rgba(0, 113, 227, 0.12)" strokeWidth="1.5" />
                <line x1="200" y1="60" x2="200" y2="280" stroke="rgba(0, 113, 227, 0.1)" strokeWidth="2" />
                <circle cx="200" cy="150" r="90" fill="rgba(0, 113, 227, 0.03)" stroke="rgba(0, 113, 227, 0.12)" strokeWidth="1" strokeDasharray="4 4">
                  <animate attributeName="r" values="88;92;88" dur="4s" repeatCount="indefinite" />
                </circle>
                {[
                  { cx: 170, cy: 110 }, { cx: 200, cy: 150 }, { cx: 230, cy: 130 },
                  { cx: 155, cy: 140 }, { cx: 165, cy: 165 }, { cx: 220, cy: 180 }, { cx: 250, cy: 165 },
                ].map((point, i) => (
                  <g key={i}>
                    <circle cx={point.cx} cy={point.cy} r="4" fill="#0071E3"
                      className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transitionDelay: `${600 + i * 100}ms` }}
                    >
                      <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                    </circle>
                    <circle cx={point.cx} cy={point.cy} r="8" fill="none" stroke="rgba(0, 113, 227, 0.2)" strokeWidth="0.5">
                      <animate attributeName="r" values="8;14;8" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                      <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                    </circle>
                  </g>
                ))}
                <g>
                  <rect x="190" y="258" width="20" height="20" rx="4" fill="rgba(0, 113, 227, 0.1)" stroke="#0071E3" strokeWidth="1" />
                  <text x="200" y="272" textAnchor="middle" fill="#0071E3" fontSize="8" fontWeight="bold">HQ</text>
                </g>
                <rect x="50" y="270" width="300" height="30" fill="rgba(0, 113, 227, 0.02)" rx="4" />
                <text x="200" y="288" textAnchor="middle" fill="rgba(0, 113, 227, 0.15)" fontSize="10">Mediterrani</text>
              </svg>
              <div className="mt-4 text-center">
                <div className="text-[#1D1D1F] font-semibold">Cobertura metropolitana</div>
                <div className="text-sm text-[#86868B]">Resposta presencial en menys de 4h</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-2xl font-semibold text-[#1D1D1F] mb-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              Per què un servei local marca la diferència?
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index}
                  className={`flex gap-4 p-4 rounded-xl hover:bg-white hover:apple-shadow transition-all duration-500 group ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0071E3]/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0071E3]/10 group-hover:scale-110 transition-all duration-300">
                    <benefit.icon className="w-6 h-6 text-[#0071E3]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D1D1F] mb-1">{benefit.title}</h4>
                    <p className="text-sm text-[#86868B]">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={`mt-8 p-6 rounded-2xl bg-white apple-shadow transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <div className="text-sm text-[#86868B] mb-4 font-medium">Contacte directe</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#1D1D1F] hover:text-[#0071E3] transition-colors duration-200">
                  <Phone className="w-5 h-5 text-[#0071E3]" />
                  <span>+34 93 000 00 00</span>
                </div>
                <div className="flex items-center gap-3 text-[#1D1D1F] hover:text-[#0071E3] transition-colors duration-200">
                  <Mail className="w-5 h-5 text-[#0071E3]" />
                  <span>hola@sobiranIA.cat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
