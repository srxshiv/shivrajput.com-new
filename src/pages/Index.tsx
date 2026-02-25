import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { Welcome } from "@/components/Welcome";
import SpacetimeFabric from "@/components/SpaceTimeFabric";
import { ProjectsSection } from "@/components/ProjectsSection";
import { GlassmorphicBackdrop } from "@/components/GlassBack";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Services } from "@/components/Services";
import Footer from "@/components/Footer";

// The Spacetime Background Component
// Change this component in your file


const Index = () => {
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  return (
    <div className="relative min-h-screen selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-50 dark:selection:text-zinc-900">
      
      <GlassmorphicBackdrop />
      
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <Services />
                <ProjectsSection />
                <ExperienceSection />
                <ContactSection />
                <Footer />
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