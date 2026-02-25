import { useState } from 'react';
import { Navbar } from './sections/Navbar';
import { HeroDark } from './sections/HeroDark';

import { ProcessSection } from './sections/ProcessSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './sections/Footer';
import { NoiseOverlay } from './components/NoiseOverlay';
import { CursorGlow } from './components/CursorGlow';
import { TechPageOverlay } from './components/TechPageOverlay';
import { BridgeStrip } from './components/BridgeStrip';

import { Km0Section } from './sections/Km0Section';

function App() {
  const [isTechOpen, setIsTechOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080A] text-white">
      <CursorGlow />
      <NoiseOverlay />
      <Navbar onTecnologiaClick={() => setIsTechOpen(true)} />
      <main style={{ position: 'relative' }}>
        <HeroDark />
        <Km0Section />
        <BridgeStrip />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />

      {/* Tech overlay — models + comparison, only accessible from nav */}
      <TechPageOverlay isOpen={isTechOpen} onClose={() => setIsTechOpen(false)} />
    </div>
  );
}

export default App;
