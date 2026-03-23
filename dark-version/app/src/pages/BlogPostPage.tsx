import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getPostBySlug, formatDate } from '@/blog/posts';
import { Navbar } from '@/sections/Navbar';
import { Footer } from '@/sections/Footer';
import { ArrowLeft, Clock, Tag, ArrowRight } from 'lucide-react';

import { ArticleIALocalVsNuvol } from '@/blog/content/ia-local-vs-nuvol';
import { ArticleGDPR } from '@/blog/content/gdpr-ia-empreses';
import { ArticleChatGPTvsPrivada } from '@/blog/content/chatgpt-vs-ia-privada';

const articleComponents: Record<string, React.FC> = {
  'ia-local-vs-nuvol': ArticleIALocalVsNuvol,
  'gdpr-ia-empreses': ArticleGDPR,
  'chatgpt-vs-ia-privada': ArticleChatGPTvsPrivada,
};

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      document.title = `${post.title} - SobiranIA Blog`;
    }
  }, [post]);

  if (!post || !slug) return <Navigate to="/blog" replace />;

  const ArticleContent = articleComponents[slug];
  if (!ArticleContent) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-dvh bg-[#08080A] text-white">
      <Navbar onTecnologiaClick={() => {}} />

      {/* JSON-LD Article schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Organization", name: "SobiranIA" },
            publisher: { "@type": "Organization", name: "SobiranIA" },
            keywords: post.keywords.join(', '),
            inLanguage: "ca",
          }),
        }}
      />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        {/* Back link */}
        <div style={{
          maxWidth: 720, margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px)',
          marginBottom: 40,
        }}>
          <Link
            to="/blog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: '#06b6d4', textDecoration: 'none',
              fontWeight: 500,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <ArrowLeft size={14} />
            Tornar al blog
          </Link>
        </div>

        {/* Article header */}
        <header style={{
          maxWidth: 720, margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 48px)',
          marginBottom: 48,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            marginBottom: 20, flexWrap: 'wrap',
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

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em',
            color: 'rgba(255,255,255,0.95)', marginBottom: 16,
          }}>
            {post.title}
          </h1>

          <p style={{
            fontSize: 17, color: '#71717a', lineHeight: 1.6,
          }}>
            {post.description}
          </p>

          {/* Divider */}
          <div style={{
            marginTop: 32, height: 1,
            background: 'linear-gradient(90deg, rgba(6,182,212,0.3), rgba(6,182,212,0.05), transparent)',
          }} />
        </header>

        {/* Article body */}
        <article
          style={{
            maxWidth: 720, margin: '0 auto',
            padding: '0 clamp(20px, 5vw, 48px)',
          }}
          className="blog-article"
        >
          <ArticleContent />
        </article>

        {/* Bottom CTA */}
        <div style={{
          maxWidth: 720, margin: '64px auto 0',
          padding: '0 clamp(20px, 5vw, 48px)',
        }}>
          <div style={{
            padding: '32px',
            borderRadius: 16,
            background: 'rgba(6,182,212,0.04)',
            border: '1px solid rgba(6,182,212,0.12)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', gap: 16,
          }}>
            <h3 style={{
              fontSize: 20, fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
            }}>
              Vols que t'ho expliquem en persona?
            </h3>
            <p style={{ fontSize: 14, color: '#71717a' }}>
              La diagnosi gratuïta triga 45 minuts. Sense compromís.
            </p>
            <Link
              to="/#contacte"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                color: '#030304', fontWeight: 700,
                padding: '11px 24px', fontSize: 14,
                borderRadius: 9999, textDecoration: 'none',
                boxShadow: '0 0 24px rgba(6,182,212,0.2)',
              }}
            >
              Sol·licita la diagnosi gratuïta
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Back to blog */}
        <div style={{
          maxWidth: 720, margin: '40px auto 0',
          padding: '0 clamp(20px, 5vw, 48px)',
          textAlign: 'center',
        }}>
          <Link
            to="/blog"
            style={{
              fontSize: 13, color: '#52525b', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <ArrowLeft size={12} />
            Més articles
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
