import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Simple SVG placeholders for tech logos. In a real production app, these would be proper SVGs.
// Using text/icon combos for now to ensure it looks good immediately without external assets.

const TechLogo = ({ name, color }: { name: string; color: string }) => (
    <div
        className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group"
    >
        <div
            className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]"
            style={{ backgroundColor: color, color: color }}
        />
        <span className="text-lg font-semibold tracking-tight text-white/80 group-hover:text-white transition-colors">
            {name}
        </span>
    </div>
);

export function TechLogos() {
    const { ref: sectionRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });

    const technologies = [
        { name: 'Meta Llama 3', color: '#0668E1' },
        { name: 'Mistral AI', color: '#F59F00' },
        { name: 'NVIDIA AI', color: '#76B900' },
        { name: 'HuggingFace', color: '#FFD21E' },
        { name: 'LangChain', color: '#1C3C3C' }, // Darker cyan/green
    ];

    return (
        <section
            id="tech-trust"
            className="relative w-full border-y border-white/5 bg-[#08080A] py-10 overflow-hidden"
        >
            <div
                className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-transparent to-[#08080A] z-10 pointer-events-none"
            />

            <div
                ref={sectionRef}
                className={`max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
            >
                <span className="text-xs font-medium tracking-[0.2em] text-white/20 uppercase whitespace-nowrap">
                    Powered by
                </span>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {technologies.map((tech) => (
                        <TechLogo key={tech.name} {...tech} />
                    ))}
                </div>
            </div>
        </section>
    );
}
