import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TechGridSection } from '@/sections/TechGridSection';
import { ComparisonSection } from '@/sections/ComparisonSection';

interface TechPageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TechPageOverlay({ isOpen, onClose }: TechPageOverlayProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="tech-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
            }}
          />

          {/* Panel */}
          <motion.div
            key="tech-panel"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '5vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(96vw, 1200px)',
              height: '90vh',
              background: '#0a0a0c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              zIndex: 101,
              overflowY: 'auto',
              boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Header */}
            <div style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 28px',
              background: 'rgba(10,10,12,0.9)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#06b6d4',
                  boxShadow: '0 0 8px rgba(6,182,212,0.8)',
                  animation: 'ambient-breathe 2s ease-in-out infinite',
                }} />
                <span style={{
                  fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
                }}>
                  Tecnologia
                </span>
              </div>

              <button
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content — reuse existing sections */}
            <div style={{ paddingBottom: 48 }}>
              <TechGridSection />
              <div style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                margin: '0 32px',
              }} />
              <ComparisonSection />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
