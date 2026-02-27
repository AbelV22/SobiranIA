import { useState, Suspense, lazy } from 'react';
import { Navbar } from './sections/Navbar';
import { HeroDark } from './sections/HeroDark';
import { NoiseOverlay } from './components/NoiseOverlay';
import { CursorGlow } from './components/CursorGlow';

const Km0Section = lazy(() => import('./sections/Km0Section').then(module => ({ default: module.Km0Section })));
const BridgeStrip = lazy(() => import('./components/BridgeStrip').then(module => ({ default: module.BridgeStrip })));
const ProcessSection = lazy(() => import('./sections/ProcessSection').then(module => ({ default: module.ProcessSection })));
const ContactSection = lazy(() => import('./sections/ContactSection').then(module => ({ default: module.ContactSection })));
const Footer = lazy(() => import('./sections/Footer').then(module => ({ default: module.Footer })));
const TechPageOverlay = lazy(() => import('./components/TechPageOverlay').then(module => ({ default: module.TechPageOverlay })));

function App() {
  const [isTechOpen, setIsTechOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[#08080A] text-white">
      <CursorGlow />
      <NoiseOverlay />
      <Navbar onTecnologiaClick={() => setIsTechOpen(true)} />
      <main style={{ position: 'relative' }}>
        <HeroDark />
        <Suspense fallback={<div className="min-h-dvh bg-[#08080A]" />}>
          <Km0Section />
          <BridgeStrip />
          <ProcessSection />
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <TechPageOverlay isOpen={isTechOpen} onClose={() => setIsTechOpen(false)} />
      </Suspense>
    </div>
  );
}

export default App;
