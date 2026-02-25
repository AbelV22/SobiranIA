import { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Cloud, Server, Shield, Zap, Euro, Scale, Lock, ChevronDown, X, Check, AlertTriangle } from 'lucide-react';

interface ComparisonRow {
  label: string;
  cloud: { score: number; text: string };
  local: { score: number; text: string };
  icon: typeof Shield;
}

const comparisons: ComparisonRow[] = [
  {
    label: 'Privacitat de dades',
    cloud: { score: 2, text: 'Dades a servidors de tercers fora de la UE' },
    local: { score: 10, text: 'Dades 100% al teu servidor, mai surten del despatx' },
    icon: Lock,
  },
  {
    label: 'Velocitat de resposta',
    cloud: { score: 6, text: 'Depèn de la connexió i del servei extern' },
    local: { score: 9, text: 'Resposta instantània en xarxa local' },
    icon: Zap,
  },
  {
    label: 'Cost mensual',
    cloud: { score: 4, text: 'Costos variables per ús, escalen ràpidament' },
    local: { score: 8, text: 'Cost fix mensual, sense sorpreses ni límits' },
    icon: Euro,
  },
  {
    label: 'Compliment GDPR',
    cloud: { score: 3, text: 'Risc legal per transferències internacionals' },
    local: { score: 10, text: 'Compliment total, dades dins la UE' },
    icon: Scale,
  },
  {
    label: 'Control total',
    cloud: { score: 2, text: 'Dependent del proveïdor, canvis sense avís' },
    local: { score: 10, text: 'Tu decideixes model, actualitzacions i configuració' },
    icon: Shield,
  },
];

function ScoreBar({ score, maxScore = 10, color, animated = false }: { score: number; maxScore?: number; color: string; animated?: boolean }) {
  const width = (score / maxScore) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-black/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${width}%` : '0%',
            background: color,
          }}
        />
      </div>
      <span className="text-sm font-bold mono w-8 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

function RiskMeter({ animated }: { animated: boolean }) {
  const angle = animated ? 135 : 0;
  const circumference = Math.PI * 80;
  const offset = circumference - (angle / 180) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="70" viewBox="0 0 120 70">
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="url(#riskGradient)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${circumference}`} strokeDashoffset={animated ? offset : circumference}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <text x="60" y="55" textAnchor="middle" fill="#EF4444" fontSize="14" fontWeight="bold" fontFamily="monospace">ALT</text>
      </svg>
      <span className="text-xs text-[#86868B] mt-1">Risc de dades</span>
    </div>
  );
}

function ShieldIcon({ animated }: { animated: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="70" viewBox="0 0 120 80">
        <path d="M 60 8 L 100 24 L 100 48 C 100 64 82 76 60 80 C 38 76 20 64 20 48 L 20 24 Z"
          fill="none" stroke="#0071E3" strokeWidth="2.5"
          strokeDasharray="220" strokeDashoffset={animated ? 0 : 220}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out 0.3s' }} />
        <path d="M 60 8 L 100 24 L 100 48 C 100 64 82 76 60 80 C 38 76 20 64 20 48 L 20 24 Z"
          fill="rgba(0, 113, 227, 0.06)" opacity={animated ? 1 : 0}
          style={{ transition: 'opacity 0.5s ease-out 1s' }} />
        <path d="M 42 42 L 54 54 L 78 30" fill="none" stroke="#0071E3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="60" strokeDashoffset={animated ? 0 : 60}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out 1.2s' }} />
      </svg>
      <span className="text-xs text-[#86868B] mt-1">Protecció total</span>
    </div>
  );
}

export function ComparisonSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.15 });
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [view, setView] = useState<'side' | 'cloud' | 'local'>('side');

  return (
    <section id="comparativa" className="relative py-12 md:py-20 bg-[#08080A]">
      <div ref={ref} className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-10 md:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/10 border border-cyan-500/20 mb-4 backdrop-blur-sm">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400">Comparativa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Núvol vs <span className="text-gradient-cyan">Local</span>
          </h2>
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            Compara objectivament les dues opcions. Les dades parlen per si soles.
          </p>
        </div>

        <div className="flex md:hidden justify-center gap-2 mb-6">
          {[
            { key: 'cloud' as const, label: 'Núvol', color: 'text-red-500' },
            { key: 'side' as const, label: 'Ambdós', color: 'text-white' },
            { key: 'local' as const, label: 'Local', color: 'text-cyan-400' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setView(opt.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${view === opt.key ? `${opt.color} bg-white/10` : 'text-gray-500'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
        >
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr] gap-4 mb-4">
            <div />
            <div className="text-center p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Cloud className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-red-500 text-sm">IA al Núvol</span>
              </div>
              <RiskMeter animated={isVisible} />
            </div>
            <div className="text-center p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,188,212,0.1)]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-cyan-400 text-sm">IA Local</span>
              </div>
              <ShieldIcon animated={isVisible} />
            </div>
          </div>

          <div className="space-y-2">
            {comparisons.map((row, index) => (
              <div
                key={index}
                className={`rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:border-cyan-500/30 hover:bg-white/[0.07] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <button
                  onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                  className="w-full p-3 md:p-4 flex items-center gap-4 text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <row.icon className="w-4 h-4 text-cyan-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white mb-1.5 text-sm md:text-base">{row.label}</div>
                    <div className="hidden md:grid grid-cols-2 gap-6">
                      <ScoreBar score={row.cloud.score} color="#EF4444" animated={isVisible} />
                      <ScoreBar score={row.local.score} color="#22D3EE" animated={isVisible} />
                    </div>
                    <div className="md:hidden space-y-2">
                      {(view === 'side' || view === 'cloud') && (
                        <div>
                          <div className="text-[10px] text-red-500 mb-1 font-medium">Núvol</div>
                          <ScoreBar score={row.cloud.score} color="#EF4444" animated={isVisible} />
                        </div>
                      )}
                      {(view === 'side' || view === 'local') && (
                        <div>
                          <div className="text-[10px] text-cyan-400 mb-1 font-medium">Local</div>
                          <ScoreBar score={row.local.score} color="#22D3EE" animated={isVisible} />
                        </div>
                      )}
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 flex-shrink-0 ${expandedRow === index ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${expandedRow === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-3 md:px-4 pb-3 md:pb-4 grid md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/10">
                      <X className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-300">{row.cloud.text}</span>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/10">
                      <Check className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-300">{row.local.text}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-10 text-center transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/10 border border-cyan-500/20 backdrop-blur-sm">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">
              El <span className="text-cyan-400 font-semibold">92% de les empreses</span> que proven IA local no tornen al núvol
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
