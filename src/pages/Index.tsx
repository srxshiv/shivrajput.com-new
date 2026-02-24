import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Welcome } from "@/components/Welcome";

// The Spacetime Background Component
const SpacetimeFabric = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-700">
      
      {/* 1. Ambient Gravity Wells (Breathing Orbs) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] bg-zinc-300 dark:bg-zinc-800/30"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] bg-zinc-200 dark:bg-zinc-900/30"
      />

      {/* 2. The Fabric Grid (Fades at the edges to simulate a sphere/gravity well) */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(128, 128, 128, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 128, 128, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          // This mask is the magic: it hides the edges of the grid, making it look curved and profound
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)",
        }}
      />
    </div>
  );
};

const Index = () => {
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-50 dark:selection:text-zinc-900">
      
      {/* The Dynamic Background Layer */}
      <SpacetimeFabric />

      {/* Main content layer */}
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <ProjectsSection />
          <ExperienceSection />
          <ContactSection />
        </main>
        
        {/* Minimalist Footer */}
        <footer className="py-12 px-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-px bg-zinc-300 dark:bg-zinc-700 mb-4" />
            <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 font-medium">
              © {new Date().getFullYear()} Shiv.
            </p>
            <p className="text-[10px] tracking-wide text-zinc-300 dark:text-zinc-600">
              Engineered with precision.
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