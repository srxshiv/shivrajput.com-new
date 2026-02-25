import { motion } from "framer-motion";

export const GlassmorphicBackdrop = () => {
  return (
    // 1. THE ROOT
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-transparent">
      
      {/* 2. THE ARC GRADIENTS: Enhanced with 5 multi-stop gradients */}
      
      {/* 1. Top Left: Indigo */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full transform-gpu bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.6)_0%,rgba(99,102,241,0.2)_50%,transparent_80%)] dark:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.5)_0%,rgba(79,70,229,0.15)_50%,transparent_80%)]"
      />

      {/* 2. Bottom Right: Rose */}
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full transform-gpu bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.5)_0%,rgba(251,113,133,0.2)_50%,transparent_80%)] dark:bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.4)_0%,rgba(225,29,72,0.15)_50%,transparent_80%)]"
      />

      {/* 3. Middle Left: Violet (NEW - Bridges the gap in the center) */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.25, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-[35%] left-[25%] w-[55vw] h-[55vw] rounded-full transform-gpu bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.45)_0%,rgba(139,92,246,0.15)_50%,transparent_80%)] dark:bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.35)_0%,rgba(124,58,237,0.1)_50%,transparent_80%)]"
      />

      {/* 4. Top Right: Cyan */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full transform-gpu bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.5)_0%,rgba(34,211,238,0.2)_50%,transparent_80%)] dark:bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.4)_0%,rgba(8,145,178,0.15)_50%,transparent_80%)]"
      />

      {/* 5. Bottom Left: Fuchsia */}
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[20%] left-[10%] w-[45vw] h-[45vw] rounded-full transform-gpu bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.4)_0%,rgba(217,70,239,0.15)_50%,transparent_80%)] dark:bg-[radial-gradient(circle_at_center,rgba(192,38,211,0.3)_0%,rgba(192,38,211,0.1)_50%,transparent_80%)]"
      />

      {/* 3. THE FROSTED PANE */}
      <div className="absolute inset-0 bg-white/15 dark:bg-[#0a0a0a]/20 backdrop-blur-2xl transform-gpu border-t border-white/40 dark:border-white/10" />
    </div>
  );
};