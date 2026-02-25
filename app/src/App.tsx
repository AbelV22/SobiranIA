import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Km0Section } from './sections/Km0Section';
import { ProblemSection } from './sections/ProblemSection';
import { ProcessSection } from './sections/ProcessSection';
import { TechGridSection } from './sections/TechGridSection';
import { ComparisonSection } from './sections/ComparisonSection';
import { LocalSection } from './sections/LocalSection';
import { CTASection } from './sections/CTASection';
import { Footer } from './sections/Footer';
import { NoiseOverlay } from './components/NoiseOverlay';
import { CursorGlow } from './components/CursorGlow';

function App() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <CursorGlow />
      <NoiseOverlay />
      <Navbar />
      <main>
        <Hero />
        <Km0Section />
        <ProblemSection />
        <ProcessSection />
        <TechGridSection />
        <ComparisonSection />
        <LocalSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
