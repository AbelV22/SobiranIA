import { useRef, useState, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { Cpu, Zap, Brain, Sparkles, Code2, Layers } from 'lucide-react';

interface ModelCard {
  name: string;
  description: string;
  icon: typeof Cpu;
  color: string;
  colorBg: string;
  tags: string[];
}

const models: ModelCard[] = [
  {
    name: 'Llama 3',
    description: 'Model open-source de Meta. Excel·lent en raonament, generació de text i anàlisi de documents.',
    icon: Brain,
    color: '#8B5CF6',
    colorBg: 'rgba(139, 92, 246, 0.06)',
    tags: ['Raonament', 'Text', 'Codi'],
  },
  {
    name: 'Mistral',
    description: 'Alt rendiment amb baixos recursos. Ideal per a despatxos professionals i pimes.',
    icon: Zap,
    color: '#F59E0B',
    colorBg: 'rgba(245, 158, 11, 0.06)',
    tags: ['Eficient', 'Ràpid', 'Multilingüe'],
  },
  {
    name: 'Phi',
    description: 'Model compacte de Microsoft. Perfecte per a equips amb recursos limitats.',
    icon: Cpu,
    color: '#3B82F6',
    colorBg: 'rgba(59, 130, 246, 0.06)',
    tags: ['Lleuger', 'Versàtil', 'Eficient'],
  },
  {
    name: 'Qwen',
    description: 'Potent model multilingüe amb comprensió nativa de català i castellà.',
    icon: Sparkles,
    color: '#10B981',
    colorBg: 'rgba(16, 185, 129, 0.06)',
    tags: ['Multilingüe', 'Anàlisi', 'Documents'],
  },
  {
    name: 'DeepSeek',
    description: 'Especialitzat en raonament profund i anàlisi de documents legals complexos.',
    icon: Layers,
    color: '#EC4899',
    colorBg: 'rgba(236, 72, 153, 0.06)',
    tags: ['Raonament', 'Anàlisi', 'Precisió'],
  },
  {
    name: 'Gemma',
    description: 'Model de Google optimitzat per a productivitat i automatització empresarial.',
    icon: Code2,
    color: '#0071E3',
    colorBg: 'rgba(0, 113, 227, 0.06)',
    tags: ['Productivitat', 'Text', 'Resum'],
  },
];

const stats = [
  { end: 500, prefix: '+', suffix: '', label: 'Models disponibles' },
  { end: 10, prefix: '', suffix: 'M+', label: 'Consultes processades' },
  { end: 99.9, prefix: '', suffix: '%', label: 'Uptime garantit', decimals: 1 },
];

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export function TechGridSection() {
  const { ref: sectionRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="tecnologia" className="relative py-24 md:py-32 lg:py-40 bg-[#F5F5F7] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#0071E3]/[0.02] blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-[#5E5CE6]/[0.02] blur-3xl" />
      </div>

      <div ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 md:mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/[0.06] mb-6 apple-shadow">
            <Cpu className="w-4 h-4 text-[#0071E3]" />
            <span className="text-sm font-medium text-[#0071E3]">Tecnologia</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6">
            Els millors models d'IA,{' '}
            <span className="text-gradient">al teu servidor</span>
          </h2>
          <p className="text-lg text-[#86868B] max-w-2xl mx-auto">
            Treballem amb els models de codi obert més potents del mercat.
            Seleccionem el millor per a cada necessitat del teu negoci.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-20">
          {models.map((model) => (
            <TiltCard
              key={model.name}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <div className="relative p-6 rounded-2xl bg-white apple-shadow hover:apple-shadow-lg transition-all duration-300 h-full group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: model.colorBg }}
                >
                  <model.icon className="w-6 h-6" style={{ color: model.color }} />
                </div>

                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">{model.name}</h3>
                <p className="text-sm text-[#86868B] mb-4 leading-relaxed">{model.description}</p>

                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full border transition-colors duration-300 font-medium"
                      style={{
                        borderColor: `${model.color}20`,
                        color: model.color,
                        background: `${model.color}06`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        <div
          className={`grid grid-cols-3 gap-8 max-w-3xl mx-auto transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-2 mono">
                <AnimatedCounter
                  end={stat.end}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  duration={2500}
                />
              </div>
              <div className="text-sm text-[#86868B]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
