import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts, formatDate } from '@/blog/posts';
import { Navbar } from '@/sections/Navbar';
import { Footer } from '@/sections/Footer';
import { ArrowRight, Clock, Tag } from 'lucide-react';

export function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Blog - SobiranIA | Articles sobre IA local per a empreses";
  }, []);

  return (
    <div className="min-h-dvh bg-[#08080A] text-white">
      <Navbar onTecnologiaClick={() => {}} />

      <main style={{ paddingTop: 120, paddingBottom: 80 }}>
        {/* Header */}
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px)',
          marginBottom: 64,
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
            }} />
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#06b6d4',
            }}>
              Blog · SobiranIA
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em',
            color: 'rgba(255,255,255,0.95)', marginBottom: 16,
          }}>
            Intel·ligència artificial{' '}
            <span style={{
              background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              sense secrets.
            </span>
          </h1>

          <p style={{
            fontSize: 17, color: '#71717a', lineHeight: 1.65, maxWidth: 560,
          }}>
            Articles pràctics sobre IA local, privacitat de dades i com les empreses de Barcelona estan transformant els seus processos.
          </p>
        </div>

        {/* Articles grid */}
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px)',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          {blogPosts.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article
                style={{
                  padding: 'clamp(24px, 4vw, 36px)',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.background = 'rgba(6,182,212,0.04)';
                  el.style.borderColor = 'rgba(6,182,212,0.15)';
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.background = 'rgba(255,255,255,0.02)';
                  el.style.borderColor = 'rgba(255,255,255,0.06)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Top accent line */}
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)',
                  }} />
                )}

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  marginBottom: 16, flexWrap: 'wrap',
                }}>
                  <div style={{
                    display: 'inline-flex', padding: '3px 10px', borderRadius: 6,
                    background: 'rgba(6,182,212,0.06)',
                    border: '1px solid rgba(6,182,212,0.12)',
                  }}>
                    <Tag size={10} style={{ color: '#06b6d4', marginRight: 5 }} />
                    <span style={{
                      fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: '#06b6d4',
                    }}>
                      {post.category}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 12, color: '#52525b',
                  }}>
                    <Clock size={12} />
                    {post.readTime}
                  </div>

                  <span style={{ fontSize: 12, color: '#3f3f46' }}>
                    {formatDate(post.date)}
                  </span>
                </div>

                <h2 style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                  fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em',
                  color: 'rgba(255,255,255,0.92)', marginBottom: 10,
                }}>
                  {post.title}
                </h2>

                <p style={{
                  fontSize: 15, color: '#71717a', lineHeight: 1.6,
                  marginBottom: 16, maxWidth: 640,
                }}>
                  {post.description}
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 600, color: '#06b6d4',
                }}>
                  Llegir article
                  <ArrowRight size={14} />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          maxWidth: 900, margin: '64px auto 0',
          padding: '0 clamp(20px, 5vw, 48px)',
          textAlign: 'center',
        }}>
          <div style={{
            padding: '40px 32px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(99,102,241,0.04) 100%)',
            border: '1px solid rgba(6,182,212,0.1)',
          }}>
            <h3 style={{
              fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.92)',
              marginBottom: 10,
            }}>
              Vols veure com la IA pot ajudar el teu negoci?
            </h3>
            <p style={{
              fontSize: 15, color: '#71717a', marginBottom: 24,
            }}>
              La diagnosi gratuïta triga 45 minuts. L'estalvi de temps dura anys.
            </p>
            <Link
              to="/#contacte"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                color: '#030304', fontWeight: 700,
                padding: '12px 28px', fontSize: 14,
                borderRadius: 9999, textDecoration: 'none',
                boxShadow: '0 0 32px rgba(6,182,212,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(6,182,212,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 32px rgba(6,182,212,0.2)';
              }}
            >
              Sol·licita la diagnosi gratuïta
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
