import { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Quant costa el servei complet?",
    a: "Oferim un únic pagament que inclou el maquinari, la instal·lació, el fine-tuning i la formació. No hi ha quotes mensuals ni costos per token. Sol·licita una diagnosi gratuïta per rebre un pressupost personalitzat.",
  },
  {
    q: "Necessito coneixements tècnics per usar la IA?",
    a: "No. Nosaltres ens encarreguem de tot: instal·lació, configuració i integració. A més, incloem formació presencial per al teu equip fins que tothom se senti còmode amb l'eina.",
  },
  {
    q: "Les meves dades estan realment segures?",
    a: "Absolutament. El servidor s'instal·la físicament al teu despatx. Les dades mai surten del teu perímetre. Utilitzem xifratge AES-256 i complim el GDPR de forma nativa, sense dependre de tercers.",
  },
  {
    q: "Quant temps triga la instal·lació?",
    a: "En 48 hores el sistema està operatiu. La diagnosi inicial triga 45 minuts i la formació de l'equip es completa en la primera setmana.",
  },
  {
    q: "Puc integrar-ho amb el meu software actual?",
    a: "Sí. Ens connectem directament als teus ERPs, CRMs, bases de dades SQL i eines de correu. Sense APIs externes ni intermediaris que afegeixin latència o costos.",
  },
  {
    q: "Què passa si necessito suport tècnic?",
    a: "Tenim tècnics a Barcelona amb temps de resposta garantit de menys de 4 hores. Sense call centers, sense esperes. Suport presencial quan cal.",
  },
  {
    q: "En què es diferencia de ChatGPT o Copilot?",
    a: "ChatGPT i Copilot envien les teves dades als seus servidors al núvol. SobiranIA funciona 100% en local: les dades no surten mai del teu despatx, la IA coneix el teu negoci específic, i no pagues per token.",
  },
];

function FAQItem({ faq, index, isVisible }: {
  faq: typeof faqs[number];
  index: number;
  isVisible: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.5s ease ${0.15 + index * 0.05}s, transform 0.5s ease ${0.15 + index * 0.05}s`,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 16,
        }}
      >
        <span style={{
          fontSize: 'clamp(15px, 1.2vw, 17px)',
          fontWeight: 500,
          color: isOpen ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
          lineHeight: 1.4,
          transition: 'color 0.2s ease',
          letterSpacing: '-0.01em',
        }}>
          {faq.q}
        </span>
        <div style={{
          flexShrink: 0,
          width: 28, height: 28,
          borderRadius: 8,
          background: isOpen ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isOpen ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.06)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}>
          <ChevronDown
            size={14}
            style={{
              color: isOpen ? '#06b6d4' : 'rgba(255,255,255,0.3)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease, color 0.2s ease',
            }}
          />
        </div>
      </button>
      <div style={{
        maxHeight: isOpen ? 200 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <p style={{
          fontSize: 14,
          color: '#71717a',
          lineHeight: 1.7,
          paddingBottom: 20,
          margin: 0,
          maxWidth: 640,
        }}>
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      style={{
        position: 'relative',
        background: '#030304',
        overflow: 'hidden',
        paddingTop: 'clamp(64px, 8vw, 120px)',
        paddingBottom: 'clamp(64px, 8vw, 100px)',
      }}
    >
      {/* Top border */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
      }} />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{
          position: 'relative',
          maxWidth: 760,
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px)',
        }}
      >
        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: 48,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 12px', borderRadius: 99,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 20,
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
            }}>
              Preguntes freqüents
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em',
            color: 'rgba(255,255,255,0.95)', marginBottom: 12,
          }}>
            Tot el que vols saber
          </h2>
          <p style={{ fontSize: 15, color: '#52525b', lineHeight: 1.6 }}>
            Si no trobes la teva resposta, contacta'ns directament.
          </p>
        </div>

        {/* FAQ items */}
        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} isVisible={isVisible} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center', marginTop: 48,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.8s',
        }}>
          <p style={{
            fontSize: 14, color: '#52525b', marginBottom: 16,
          }}>
            Encara tens dubtes?
          </p>
          <button
            onClick={() => document.getElementById('contacte')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.2)',
              color: '#06b6d4',
              fontWeight: 600,
              padding: '10px 24px',
              fontSize: 13,
              borderRadius: 9999,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(6,182,212,0.15)';
              e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(6,182,212,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(6,182,212,0.08)';
              e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Parla amb nosaltres
          </button>
        </div>
      </div>
    </section>
  );
}
