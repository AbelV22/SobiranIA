import { motion, useTransform, type MotionValue } from 'framer-motion';

const features = [
    {
        title: "Integritat i Privacitat",
        subtitle: "Les dades mai surten del perímetre.",
        description: "Tota la infraestructura s'executa localment. El que passa als teus servidors, es queda als teus servidors. Compliment GDPR natiu.",
        hex: "#06b6d4", // Cyan-500
        border: "rgba(34,211,238,0.3)",
        gradient: "linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(6,182,212,0.05) 100%)"
    },
    {
        title: "Personalització Real (Fine-Tuning)",
        subtitle: "No és xerrameca, és coneixement corporatiu.",
        description: "Entrenem els models específicament amb el teu històric, el teu to i els teus productes. Una IA que pensa com la teva empresa.",
        hex: "#6366f1", // Indigo-500
        border: "rgba(129,140,248,0.3)",
        gradient: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.05) 100%)"
    },
    {
        title: "Integració Total",
        subtitle: "Connexió directa amb el teu ADN.",
        description: "A diferència de les APIs externes, la nostra IA s'integra profundament amb els teus ERPs i SQL sense restriccions ni fuites.",
        hex: "#10b981", // Emerald-500
        border: "rgba(52,211,153,0.3)",
        gradient: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 100%)"
    }
];

export function StickyFeatures({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    return (
        <div className="w-full max-w-4xl h-[450px] md:h-[520px] relative px-4">
            {features.map((card, i) => (
                <Card
                    key={i}
                    i={i}
                    card={card}
                    progress={scrollYProgress}
                    total={features.length}
                />
            ))}
        </div>
    );
}


function Card({
    i,
    card,
    progress,
    total
}: {
    i: number;
    card: typeof features[0];
    progress: MotionValue<number>;
    total: number;
}) {
    // Stagger start times
    // Range available: ~0.45 to ~0.95
    const start = 0.45 + (i * 0.20); // 0.45, 0.65, 0.85

    // Entrance Y: slides up
    const yRange = i === 0
        ? [0, 0]
        : [`${75 + (i - 1) * 10}%`, '0%'];

    // Slower entrance
    const targetStart = i === 0 ? 0.35 : start - 0.10;

    // ALWAYS call useTransform the same way (Rules of Hooks)
    const y = useTransform(progress, [targetStart, start], yRange as [string, string]);
    const opacity = useTransform(progress, [targetStart, start], [0, 1]);

    // Scaling/Dimming logic (when covered by NEXT card)
    const nextStart = 0.45 + ((i + 1) * 0.20);
    const scale = useTransform(progress, [nextStart - 0.05, nextStart + 0.15], [1, 0.90]);
    const filter = useTransform(progress, [nextStart - 0.05, nextStart + 0.15], ["brightness(1)", "brightness(0.6)"]);

    const isLast = i === total - 1;

    return (
        <motion.div
            style={{
                y,
                scale: isLast ? 1 : scale,
                filter: isLast ? 'none' : filter,
                opacity,
                zIndex: i,
                top: 0
            }}
            className="absolute inset-0 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-2xl origin-top overflow-hidden"
        >
            {/* Decorative Glow */}
            <div
                className="absolute -top-[200px] -right-[200px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none"
                style={{ background: card.hex }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border bg-white/5 backdrop-blur-sm"
                    style={{ borderColor: card.border }}>
                    <div className="w-3 h-3 rounded-full shadow-[0_0_15px_currentColor]"
                        style={{ backgroundColor: card.hex, color: card.hex }} />
                </div>
                <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">
                    Feature 0{i + 1}
                </span>
            </div>

            {/* Text Content */}
            <div className="relative z-10 max-w-2xl">
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                    {card.title}
                </h3>
                <p className="text-lg md:text-xl font-medium mb-6 tracking-wide" style={{ color: card.hex }}>
                    {card.subtitle}
                </p>
                <p className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-xl">
                    {card.description}
                </p>
            </div>

            {/* Bottom Gradient Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, transparent, ${card.hex}, transparent)` }}
            />
        </motion.div>
    );
}
