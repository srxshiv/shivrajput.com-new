import { motion } from "framer-motion";


export default function SpacetimeFabric  ({ isFixed = false }: { isFixed?: boolean }) {
    return (
      <div 
        className={`
          ${isFixed ? "fixed" : "absolute"} 
          inset-0 z-0 pointer-events-none overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-700
        `}
      >
        {/* 1. Ambient Gravity Wells (Breathing Orbs) */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] bg-zinc-300 dark:bg-zinc-800/30"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] bg-zinc-200 dark:bg-zinc-900/30"
        />
  
        {/* 2. The Fabric Grid */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(128, 128, 128, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(128, 128, 128, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)",
          }}
        />
      </div>
    );
  };