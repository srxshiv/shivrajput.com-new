import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Welcome } from "@/components/Welcome";

const Index = () => {
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Main content - always visible under Welcome */}
      <div className="relative z-0 backdrop-blur-sm">
        <Navigation />
        <main className="relative">
          <HeroSection />
          <ProjectsSection />
          <ExperienceSection />
          <ContactSection />
        </main>
        <footer className="py-8 px-6 bg-surface-secondary/50 border-t border-border">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-text-secondary">
              © 2025 Shiv Rajput. All rights reserved.
            </p>
          </div>
        </footer>
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
