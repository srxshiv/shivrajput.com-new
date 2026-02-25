import { motion } from "framer-motion";

export const GlassmorphicBackdrop = () => {
  return (
    // 1. THE ROOT: Must be completely transparent so the Hero shows through.
    <div
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden bg-transparent
      `}
    >
      {/* 2. THE ARC GRADIENTS: Floating color orbs using high-perf radial gradients */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full transform-gpu bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.4)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.3)_0%,transparent_70%)]"
      />

      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full transform-gpu bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.25)_0%,transparent_70%)]"
      />

      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full transform-gpu bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.25)_0%,transparent_70%)]"
      />

      {/* 3. THE FROSTED PANE: This blurs BOTH the orbs AND the Hero section underneath. */}
      {/* Adding a subtle top border creates the physical "edge" of the glass card. */}
      <div className="absolute inset-0 bg-white/40 dark:bg-[#0a0a0a]/40 backdrop-blur-xl transform-gpu border-t border-white/50 dark:border-white/10" />
    </div>
  );
};
