import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Welcome({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<"greeting" | "lifting" | "done">("greeting");

  useEffect(() => {
    // Sequence the unboxing experience
    const textRevealTimer = setTimeout(() => {
      setStage("lifting");
    }, 3200); // Time spent admiring the "box"

    const completionTimer = setTimeout(() => {
      setStage("done");
      onComplete();
    }, 4500); // Total time including the lift animation

    return () => {
      clearTimeout(textRevealTimer);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  // Apple's signature smooth deceleration curve
  const customEase = [0.25, 1, 0.5, 1]; 

  if (stage === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
      initial={{ y: 0 }}
      animate={{ y: stage === "lifting" ? "-100%" : 0 }}
      transition={{ 
        duration: 1.2, 
        ease: customEase // Creates that "friction lid" feeling
      }}
    >
      {/* Subtle ambient spotlight/shimmer */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: stage === "greeting" ? 1 : 0, scale: 1.2 }}
        transition={{ duration: 3, ease: "easeOut" }}
      />

      <AnimatePresence>
        {stage === "greeting" && (
          <motion.div
            className="relative flex flex-col items-center justify-center"
            initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
            transition={{
              duration: 1.5,
              ease: customEase,
            }}
          >
            {/* The core profound statement. Keep it simple. */}
            <h1 
              className="text-white text-5xl md:text-7xl tracking-tighter" 
              style={{ fontWeight: 300 }} // SF Pro Display / Inter feels best here
            >
              Hello.
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ delay: 1.2, duration: 2, ease: "easeOut" }}
              className="mt-4 text-xs tracking-[0.3em] text-white uppercase"
            >
              Welcome to my little corner on the web
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}