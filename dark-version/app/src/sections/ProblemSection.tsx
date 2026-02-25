import { AlertTriangle, MapPin, Globe } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { AnimatedCounter } from '@/components/AnimatedCounter';

export function ProblemSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="problema" className="relative py-12 md:py-20 bg-[#08080A]">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium text-red-500">Riscos ocults</span>
            </div>

            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              Els teus
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"> documents viatgen a Amsterdam.</span>
            </h2>

            <p
              className={`text-base text-gray-400 mb-6 leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
            >
              Cada vegada que uses ChatGPT, Copilot o IA al núvol, les teves dades confidencials
              surten del teu despatx cap a servidors fora de la UE. Sense control, sense retorn.
            </p>

            <div
              className={`grid sm:grid-cols-2 gap-3 mb-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
            >
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 group hover:border-red-500/30">
                <div className="text-3xl font-bold text-red-500 mb-1 mono">
                  <AnimatedCounter end={20000} suffix="€" duration={2000} />
                </div>
                <div className="text-xs text-gray-400">Multa mitjana GDPR</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 group hover:border-red-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-5 h-5 text-red-500" />
                  <span className="text-base font-semibold text-red-500">Fora de la UE</span>
                </div>
                <div className="text-xs text-gray-400">On van les teves dades</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                'Contractes, expedients i dades sensibles exposades',
                'Dependència total de proveïdors americans',
                'Incompliment de la normativa europea GDPR',
                'Vulnerabilitat a bretxes de seguretat massives',
              ].map((risk, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  style={{ transitionDelay: `${400 + index * 80}ms` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 box-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  <span className="text-sm text-gray-400">{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className={`order-1 lg:order-2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
          >
            <div className="relative">
              <div className="relative p-6 rounded-3xl bg-[#0F0F12] border border-white/10 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                />

                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Serveis al núvol (Externs)</div>
                    <div className="flex flex-wrap gap-2">
                      {['OpenAI', 'Google AI', 'Azure', 'AWS'].map((service, i) => (
                        <div
                          key={service}
                          className={`relative px-3 py-1.5 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-medium transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                            }`}
                          style={{ transitionDelay: `${500 + i * 100}ms` }}
                        >
                          <span className="relative z-10">{service}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-red-500/80">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs font-medium">USA, Amsterdam, Singapur...</span>
                    </div>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div
                      className={`w-px h-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                      style={{
                        background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.5), rgba(0, 188, 212, 0.5))',
                      }}
                    />
                  </div>

                  <div
                    className={`p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center relative">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <div className="absolute inset-0 rounded-lg border border-cyan-500/30 animation-pulse-ring" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">SobiranIA Local</div>
                        <div className="text-xs text-cyan-400 font-medium">Barcelona, al teu despatx</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 leading-relaxed">
                      Les teves dades mai surten del teu espai. Compliment total amb GDPR.
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow effects */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-red-500/10 blur-[60px]" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-cyan-500/10 blur-[60px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
