import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { Welcome } from "@/components/Welcome";
import { MainContent } from "@/components/MainContent";
import { GlassmorphicBackdrop } from "@/components/GlassBack";

// The Spacetime Background Component
// Change this component in your file


const Index = () => {
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  return (
    <div className="relative min-h-screen selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-50 dark:selection:text-zinc-900">
      
      {/* The Dynamic Background Layer */}
      <GlassmorphicBackdrop isFixed={true} />
      {/* Main content layer */}
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <MainContent/>
        </main>
      </div>

      {/* Welcome screen overlay */}
      {!welcomeComplete && (
        <div className="fixed inset-0 z-50">
          <Welcome onComplete={() => setWelcomeComplete(true)} />
        </div>
      )}
    </div>
  );
};

export default Index;