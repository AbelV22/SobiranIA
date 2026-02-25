import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Users, Send, Building2, CheckCircle } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Trust signals (ex-LocalSection) ─────────────────────────
const trustItems = [
  {
    icon: MapPin,
    label: 'Instal·lació presencial',
    detail: 'Al teu despatx, sense complicacions.',
  },
  {
    icon: Clock,
    label: 'Resposta en 4 hores',
    detail: 'Garantit per a qualsevol incidència.',
  },
  {
    icon: Phone,
    label: 'Suport local directe',
    detail: 'Tècnics a Barcelona. Sense call centers.',
  },
  {
    icon: Users,
    label: 'Formació inclosa',
    detail: 'Sessions fins que el teu equip domini la IA.',
  },
];

const zones = ['Sant Gervasi', 'Eixample', 'Gràcia', 'Sarrià', 'Les Corts', 'Ciutat Vella', 'Sant Martí'];

const businessTypes = [
  { value: 'advocacia', label: 'Advocacia' },
  { value: 'dental', label: 'Clínica Dental' },
  { value: 'finances', label: 'Finances' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'immobiliaria', label: 'Immobiliària' },
  { value: 'altres', label: 'Altres' },
];

// ─── Animated circuit line background ──────────────────────
function CircuitBg() {
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.035,
      }}
      viewBox="0 0 1200 700"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Horizontal rails */}
      {[100, 200, 340, 480, 580].map((y, i) => (
        <line key={`h-${i}`} x1="0" y1={y} x2="1200" y2={y} stroke="#06b6d4" strokeWidth="0.5" />
      ))}
      {/* Vertical rails */}
      {[120, 280, 500, 720, 900, 1080].map((x, i) => (
        <line key={`v-${i}`} x1={x} y1="0" x2={x} y2="700" stroke="#06b6d4" strokeWidth="0.5" />
      ))}
      {/* Corner nodes */}
      {[
        [120, 100], [280, 200], [500, 100], [720, 340], [900, 200],
        [280, 480], [500, 340], [720, 480], [1080, 340],
      ].map(([x, y], i) => (
        <circle key={`n-${i}`} cx={x} cy={y} r="3" fill="#06b6d4" />
      ))}
      {/* Diagonal accents */}
      <path d="M120 100 L280 200 L500 100" stroke="#06b6d4" strokeWidth="0.8" />
      <path d="M720 340 L900 200 L1080 340" stroke="#06b6d4" strokeWidth="0.8" />
      <path d="M280 480 L500 340 L720 480" stroke="#06b6d4" strokeWidth="0.8" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────
export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ nom: '', email: '', tipus: '' });
  const [focused, setFocused] = useState<string | null>(null);
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section
      id="contacte"
      style={{
        position: 'relative',
        background: '#030304',
        overflow: 'hidden',
        paddingTop: 'clamp(64px, 8vw, 120px)',
        paddingBottom: 'clamp(64px, 8vw, 120px)',
      }}
    >
      {/* Circuit background */}
      <CircuitBg />

      {/* Ambient glows */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '15%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{
          position: 'relative',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px)',
        }}
      >
        {/* Section header */}
        <div style={{
          marginBottom: 64,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 12px', borderRadius: 99,
            background: 'rgba(6,182,212,0.06)',
            border: '1px solid rgba(6,182,212,0.18)',
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
              Barcelona · Servei Local
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
            fontFamily: "'Syne', -apple-system, sans-serif",
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: 'rgba(255,255,255,0.95)', marginBottom: 14,
          }}>
            Quant temps perds ara{' '}
            <span style={{
              background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              que podries recuperar?
            </span>
          </h2>

          <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.65, maxWidth: 540 }}>
            La diagnosi gratuïta triga 45 minuts. L'estalvi de temps dura anys. Som de Barcelona — instal·lem, mantenim i donem suport presencialment.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'start',
        }}>

          {/* ── LEFT: Local trust signals ── */}
          <div style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-32px)',
            transition: 'opacity 0.7s ease 100ms, transform 0.7s ease 100ms',
          }}>
            {/* 4 benefits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 36 }}>
              {trustItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    padding: '14px 16px', borderRadius: 12,
                    border: '1px solid transparent',
                    transition: 'background 0.25s ease, border-color 0.25s ease',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-16px)',
                    transitionDelay: `${200 + i * 80}ms`,
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(6,182,212,0.04)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(6,182,212,0.12)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(6,182,212,0.07)',
                    border: '1px solid rgba(6,182,212,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={16} style={{ color: '#06b6d4' }} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: 14, fontWeight: 600,
                      color: 'rgba(255,255,255,0.9)', marginBottom: 2,
                    }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.5 }}>
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coverage zones */}
            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
                marginBottom: 12,
              }}>
                Cobertura metropolitana
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {zones.map((zone, i) => (
                  <div
                    key={zone}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 99,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                      fontWeight: 500,
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 0.5s ease ${400 + i * 50}ms`,
                    }}
                  >
                    {zone}
                  </div>
                ))}
              </div>
            </div>

            {/* Direct contact */}
            <div style={{
              padding: '20px 24px', borderRadius: 14,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{
                fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
                marginBottom: 14,
              }}>
                Contacte directe
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: Phone, text: '+34 93 000 00 00' },
                  { icon: Mail, text: 'hola@sobiranIA.cat' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 14, color: 'rgba(255,255,255,0.7)',
                  }}>
                    <Icon size={14} style={{ color: '#06b6d4', flexShrink: 0 }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(32px)',
            transition: 'opacity 0.7s ease 200ms, transform 0.7s ease 200ms',
          }}>
            <div style={{
              padding: 'clamp(24px, 4vw, 40px)',
              borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(15,15,20,0.95) 0%, rgba(8,8,12,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,188,212,0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)',
              }} />

              {/* Inner glow */}
              <div style={{
                position: 'absolute', top: -60, right: -60,
                width: 200, height: 200, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {isSubmitted ? (
                /* ── Success state ── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    textAlign: 'center', padding: '40px 0',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'rgba(6,182,212,0.1)',
                      border: '1px solid rgba(6,182,212,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckCircle size={28} style={{ color: '#06b6d4' }} />
                    </div>
                    {/* Pulse rings */}
                    {[1, 2].map(n => (
                      <div key={n} style={{
                        position: 'absolute', inset: -n * 12,
                        borderRadius: '50%',
                        border: '1px solid rgba(6,182,212,0.15)',
                        animation: `pulse-ring ${1.5 + n * 0.3}s ease-out infinite`,
                        animationDelay: `${n * 0.3}s`,
                      }} />
                    ))}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: 20, fontWeight: 600,
                      color: 'rgba(255,255,255,0.95)', marginBottom: 8,
                    }}>
                      Sol·licitud enviada!
                    </h3>
                    <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6 }}>
                      Et contactarem en menys de 24 hores.<br />
                      Prepara't per a la teva diagnosi gratuïta.
                    </p>
                  </div>
                  <div style={{
                    padding: '8px 20px', borderRadius: 99,
                    background: 'rgba(6,182,212,0.07)',
                    border: '1px solid rgba(6,182,212,0.2)',
                    fontSize: 12, color: '#06b6d4', fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                  }}>
                    RESPOSTA EN &lt;24H
                  </div>
                </motion.div>
              ) : (
                /* ── Form ── */
                <>
                  <div style={{ marginBottom: 28 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 99,
                      background: 'rgba(6,182,212,0.07)',
                      border: '1px solid rgba(6,182,212,0.18)',
                      marginBottom: 14,
                    }}>
                      <div style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: '#06b6d4',
                        boxShadow: '0 0 6px #06b6d4',
                      }} />
                      <span style={{
                        fontSize: 9, fontWeight: 600, letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: '#06b6d4',
                      }}>
                        Diagnosi gratuïta · sense compromís
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                      fontWeight: 700, lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      color: 'rgba(255,255,255,0.95)',
                      marginBottom: 8,
                    }}>
                      Sol·licita la teva diagnosi gratuïta
                    </h3>
                    <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6 }}>
                      T'identifiquem exactament quantes hores pot estalviar la IA al teu equip. Sense compromís.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Company name */}
                    <div>
                      <label style={{
                        display: 'block', fontSize: 11, fontWeight: 600,
                        color: 'rgba(255,255,255,0.5)', marginBottom: 6,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>
                        Empresa
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Building2
                          size={14}
                          style={{
                            position: 'absolute', left: 14, top: '50%',
                            transform: 'translateY(-50%)',
                            color: focused === 'nom' ? '#06b6d4' : '#52525b',
                            transition: 'color 0.2s',
                            pointerEvents: 'none',
                          }}
                        />
                        <Input
                          type="text"
                          placeholder="Ex: Despatx Jurídic Garcia"
                          value={formData.nom}
                          onChange={e => setFormData({ ...formData, nom: e.target.value })}
                          onFocus={() => setFocused('nom')}
                          onBlur={() => setFocused(null)}
                          required
                          style={{
                            paddingLeft: 36, height: 44,
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${focused === 'nom' ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: 10,
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: 14,
                            outline: 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                            boxShadow: focused === 'nom' ? '0 0 0 3px rgba(6,182,212,0.08)' : 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label style={{
                        display: 'block', fontSize: 11, fontWeight: 600,
                        color: 'rgba(255,255,255,0.5)', marginBottom: 6,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>
                        Correu electrònic
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail
                          size={14}
                          style={{
                            position: 'absolute', left: 14, top: '50%',
                            transform: 'translateY(-50%)',
                            color: focused === 'email' ? '#06b6d4' : '#52525b',
                            transition: 'color 0.2s',
                            pointerEvents: 'none',
                          }}
                        />
                        <Input
                          type="email"
                          placeholder="hola@exemple.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          required
                          style={{
                            paddingLeft: 36, height: 44,
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${focused === 'email' ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: 10,
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: 14,
                            outline: 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                            boxShadow: focused === 'email' ? '0 0 0 3px rgba(6,182,212,0.08)' : 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Sector */}
                    <div>
                      <label style={{
                        display: 'block', fontSize: 11, fontWeight: 600,
                        color: 'rgba(255,255,255,0.5)', marginBottom: 6,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>
                        Sector
                      </label>
                      <Select
                        value={formData.tipus}
                        onValueChange={value => setFormData({ ...formData, tipus: value })}
                      >
                        <SelectTrigger
                          style={{
                            height: 44,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 10,
                            color: formData.tipus ? 'rgba(255,255,255,0.9)' : '#52525b',
                            fontSize: 14,
                          }}
                        >
                          <SelectValue placeholder="Selecciona el teu sector" />
                        </SelectTrigger>
                        <SelectContent style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {businessTypes.map(type => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      style={{
                        width: '100%', height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        border: 'none',
                        color: '#030304',
                        fontSize: 14, fontWeight: 700,
                        letterSpacing: '0.02em',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0 0 0 rgba(6,182,212,0)',
                        marginTop: 4,
                      }}
                      onMouseEnter={e => {
                        const btn = e.currentTarget as HTMLButtonElement;
                        btn.style.transform = 'translateY(-1px) scale(1.01)';
                        btn.style.boxShadow = '0 8px 32px rgba(6,182,212,0.25), 0 0 0 1px rgba(6,182,212,0.3)';
                      }}
                      onMouseLeave={e => {
                        const btn = e.currentTarget as HTMLButtonElement;
                        btn.style.transform = 'translateY(0) scale(1)';
                        btn.style.boxShadow = '0 0 0 rgba(6,182,212,0)';
                      }}
                    >
                      Sol·licita la meva diagnosi gratuïta
                      <Send size={14} />
                    </button>

                    <p style={{
                      textAlign: 'center', fontSize: 11, color: '#3f3f46',
                      lineHeight: 1.5,
                    }}>
                      Resposta en 24h · Sense compromís · Dades protegides
                    </p>

                    {/* Trust badge row */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 16, marginTop: 8,
                    }}>
                      {['🔒 AES-256', '🛡️ GDPR', '🏢 KM0'].map((badge) => (
                        <span key={badge} style={{
                          fontSize: 10, fontFamily: 'monospace',
                          letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)',
                          padding: '3px 8px', borderRadius: 6,
                          border: '1px solid rgba(255,255,255,0.05)',
                          background: 'rgba(255,255,255,0.02)',
                        }}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
