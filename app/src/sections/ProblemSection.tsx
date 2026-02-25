import { AlertTriangle, MapPin, Globe } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { AnimatedCounter } from '@/components/AnimatedCounter';

export function ProblemSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="problema" className="relative py-24 md:py-32 bg-[#F5F5F7]">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">El risc que ignores</span>
            </div>

            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6 leading-tight transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Els teus documents
              <br />
              <span className="text-red-500">viatgen a Amsterdam.</span>
            </h2>

            <p
              className={`text-lg text-[#86868B] mb-8 leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Cada vegada que uses ChatGPT, Copilot o qualsevol IA al núvol, les teves dades confidencials
              surten del teu despatx cap a servidors fora de la UE. Sense control, sense retorn.
            </p>

            <div
              className={`grid sm:grid-cols-2 gap-4 mb-8 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="p-6 rounded-2xl bg-white apple-shadow hover:apple-shadow-lg transition-all duration-300 group">
                <div className="text-4xl font-bold text-red-500 mb-2 mono">
                  <AnimatedCounter end={20000} suffix="€" duration={2000} />
                </div>
                <div className="text-sm text-[#86868B]">Multa mitjana GDPR per incompliment de dades</div>
              </div>
              <div className="p-6 rounded-2xl bg-white apple-shadow hover:apple-shadow-lg transition-all duration-300 group">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-6 h-6 text-red-500" />
                  <span className="text-lg font-semibold text-red-500">Fora de la UE</span>
                </div>
                <div className="text-sm text-[#86868B]">On van les teves dades amb IA al núvol</div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                'Contractes, expedients i dades sensibles exposades',
                'Dependència total de proveïdors americans',
                'Incompliment de la normativa europea GDPR',
                'Vulnerabilitat a bretxes de seguretat massives',
              ].map((risk, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${400 + index * 80}ms` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-[#6E6E73]">{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className={`order-1 lg:order-2 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative">
              <div className="relative p-8 rounded-3xl bg-white apple-shadow-lg overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                />

                <div className="relative z-10">
                  <div className="mb-8">
                    <div className="text-sm text-[#86868B] mb-4 font-medium">Serveis al núvol</div>
                    <div className="flex flex-wrap gap-3">
                      {['OpenAI', 'Google AI', 'Azure', 'AWS'].map((service, i) => (
                        <div
                          key={service}
                          className={`relative px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-red-500 font-medium transition-all duration-500 ${
                            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                          }`}
                          style={{ transitionDelay: `${500 + i * 100}ms` }}
                        >
                          <span className="relative z-10">{service}</span>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-red-400 rotate-[-12deg]" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-red-500">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">USA, Amsterdam, Singapur...</span>
                    </div>
                  </div>

                  <div className="flex justify-center mb-8">
                    <div
                      className={`w-px h-12 transition-all duration-1000 delay-700 ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.4), rgba(0, 113, 227, 0.4))',
                      }}
                    />
                  </div>

                  <div
                    className={`p-6 rounded-2xl bg-[#0071E3]/5 border border-[#0071E3]/15 transition-all duration-700 delay-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0071E3]/10 flex items-center justify-center relative">
                        <MapPin className="w-5 h-5 text-[#0071E3]" />
                        <div className="absolute inset-0 rounded-xl border border-[#0071E3]/20 animation-pulse-ring" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#1D1D1F]">SobiranIA Local</div>
                        <div className="text-sm text-[#0071E3] font-medium">Barcelona, al teu despatx</div>
                      </div>
                    </div>
                    <div className="text-sm text-[#86868B]">
                      Les teves dades mai surten del teu espai. Compliment total amb GDPR i normativa europea.
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#0071E3]/5 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-red-500/5 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
