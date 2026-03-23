import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Shield, Zap, Clock, Server, TrendingUp, Award } from 'lucide-react';

// ─── Services Section ────────────────────────────────────────
// Carries id="serveis" to fix nav anchor
// Showcases services + real verifiable stats (no fake testimonials)

const services = [
  {
    icon: Server,
    title: 'Servidor dedicat',
    desc: "Maquinari d'alta gamma instal·lat al teu despatx. Sense núvol, sense dependències externes.",
    stat: '100%',
    statLabel: 'Local',
  },
  {
    icon: Shield,
    title: 'Privacitat total',
    desc: "Xifratge AES-256, compliment GDPR natiu. Les teves dades mai surten del teu perímetre.",
    stat: 'GDPR',
    statLabel: 'Compliant',
  },
  {
    icon: Zap,
    title: 'Fine-tuning a mida',
    desc: "La IA aprèn el teu negoci: documents, processos i terminologia. Respostes precises des del dia 1.",
    stat: '3.5x',
    statLabel: 'Precisió',
  },
  {
    icon: TrendingUp,
    title: 'Integració directa',
    desc: "Connexió nativa amb els teus ERPs, CRMs i bases de dades. Sense APIs externes ni costos per token.",
    stat: '0€',
    statLabel: 'Per token',
  },
  {
    icon: Clock,
    title: 'Suport presencial',
    desc: "Tècnics a Barcelona. Resposta en menys de 4 hores. Formació fins que el teu equip ho domina.",
    stat: '<4h',
    statLabel: 'Resposta',
  },
  {
    icon: Award,
    title: 'Sense quotes mensuals',
    desc: "Un únic pagament. Sense subscripcions, sense sorpreses. La IA és teva, per sempre.",
    stat: '0€',
    statLabel: '/mes',
  },
];

// Comparison: Cloud vs SobiranIA — verifiable facts, not testimonials
const comparisons = [
  { label: 'Les teves dades surten del teu despatx?', cloud: 'Sí, sempre', local: 'Mai' },
  { label: 'Cost mensual per token', cloud: 'Variable i creixent', local: '0€ — és teu' },
  { label: 'Compliment GDPR automàtic', cloud: 'Parcial / depèn', local: '100% natiu' },
  { label: 'Coneix el teu negoci específic', cloud: 'No — és genèrica', local: 'Sí — fine-tuning' },
  { label: 'Suport tècnic presencial', cloud: 'No disponible', local: 'Barcelona, <4h' },
  { label: 'Funciona sense internet', cloud: 'No', local: 'Sí, 100% offline' },
];

// Sectors where AI provides the most value — not clients, just use cases
const sectors = [
  { name: 'Advocacia', use: 'Redacció de contractes i anàlisi jurídica' },
  { name: 'Clíniques', use: 'Gestió de pacients i informes mèdics' },
  { name: 'Finances', use: 'Anàlisi de dades i informes regulatoris' },
  { name: 'Consultoria', use: 'Automatització de reports i propostes' },
  { name: 'Immobiliària', use: 'Generació de descripcions i anàlisi de mercat' },
  { name: 'Enginyeria', use: 'Documentació tècnica i càlculs' },
];

export function SocialProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.08 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  return (
    <section
      id="serveis"
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#08080A',
        overflow: 'hidden',
        paddingTop: 'clamp(80px, 10vw, 140px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
      }}
    >
      {/* Top border accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.2), transparent)',
      }} />

      {/* Ambient bg */}
      <motion.div style={{ position: 'absolute', inset: 0, y: bgY, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
      </motion.div>

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: 1200, margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px)',
        }}
      >
        {/* Section header */}
        <div style={{
          textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 80px)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 99,
            background: 'rgba(6,182,212,0.06)',
            border: '1px solid rgba(6,182,212,0.15)',
            marginBottom: 20,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#06b6d4',
              boxShadow: '0 0 8px rgba(6,182,212,0.8)',
              animation: 'ambient-breathe 2s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#06b6d4',
            }}>
              Tot inclòs · Sense lletres petites
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em',
            color: 'rgba(255,255,255,0.95)', marginBottom: 16,
          }}>
            Tot el que necessites.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Res que et sobri.
            </span>
          </h2>

          <p style={{
            fontSize: 16, color: '#71717a', lineHeight: 1.65,
            maxWidth: 560, margin: '0 auto',
          }}>
            Un servei integral que cobreix des de la instal·lació fins al suport diari.
            Sense subscripcions, sense sorpreses.
          </p>
        </div>

        {/* Services grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
          marginBottom: 'clamp(64px, 8vw, 100px)',
        }}>
          {services.map((service, i) => (
            <div
              key={service.title}
              style={{
                position: 'relative',
                padding: 'clamp(24px, 3vw, 32px)',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${150 + i * 60}ms`,
                cursor: 'default',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(6,182,212,0.04)';
                el.style.borderColor = 'rgba(6,182,212,0.15)';
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(6,182,212,0.08)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(255,255,255,0.02)';
                el.style.borderColor = 'rgba(255,255,255,0.06)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Stat badge top right */}
              <div style={{
                position: 'absolute', top: 20, right: 20,
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
              }}>
                <span style={{
                  fontSize: 22, fontWeight: 700, fontFamily: 'monospace',
                  color: '#06b6d4', lineHeight: 1, letterSpacing: '-0.02em',
                }}>
                  {service.stat}
                </span>
                <span style={{
                  fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginTop: 2,
                }}>
                  {service.statLabel}
                </span>
              </div>

              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(6,182,212,0.07)',
                border: '1px solid rgba(6,182,212,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <service.icon size={18} style={{ color: '#06b6d4' }} />
              </div>

              <h3 style={{
                fontSize: 17, fontWeight: 600,
                color: 'rgba(255,255,255,0.92)', marginBottom: 8,
                letterSpacing: '-0.01em',
              }}>
                {service.title}
              </h3>
              <p style={{
                fontSize: 14, color: '#71717a', lineHeight: 1.6,
                margin: 0, maxWidth: 280,
              }}>
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Comparison: Cloud vs Local ── */}
        <div style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
          <div style={{
            textAlign: 'center', marginBottom: 40,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.7s ease 0.4s',
          }}>
            <p style={{
              fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(6,182,212,0.5)', marginBottom: 12,
            }}>
              IA al Núvol vs IA Local
            </p>
            <div style={{
              width: 40, height: 1, margin: '0 auto',
              background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)',
            }} />
          </div>

          <div style={{
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s',
          }}>
            {/* Header row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '14px 20px',
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Característica
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(239,68,68,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
                IA al Núvol
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#06b6d4', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
                SobiranIA
              </span>
            </div>

            {comparisons.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  padding: '14px 20px',
                  borderBottom: i < comparisons.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}
              >
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                  {row.label}
                </span>
                <span style={{ fontSize: 13, color: 'rgba(239,68,68,0.5)', textAlign: 'center', lineHeight: 1.4 }}>
                  {row.cloud}
                </span>
                <span style={{ fontSize: 13, color: '#06b6d4', fontWeight: 500, textAlign: 'center', lineHeight: 1.4 }}>
                  {row.local}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sectors / Use Cases ── */}
        <div style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.7s ease 0.7s',
        }}>
          <div style={{
            textAlign: 'center', marginBottom: 28,
          }}>
            <p style={{
              fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 8,
            }}>
              Sectors on la IA local marca la diferència
            </p>
          </div>

          <div style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: 12,
          }}>
            {sectors.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: '10px 18px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', flexDirection: 'column', gap: 3,
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.15)';
                  e.currentTarget.style.background = 'rgba(6,182,212,0.03)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: 'rgba(255,255,255,0.8)',
                }}>
                  {s.name}
                </span>
                <span style={{
                  fontSize: 11, color: '#52525b',
                }}>
                  {s.use}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
