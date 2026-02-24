import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle"; 

// The signature physical deceleration curve
const customEase = [0.25, 1, 0.5, 1];

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY, scrollYProgress } = useScroll();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0.1 } 
    );

    navItems.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasScrolled(latest > 20);
    if (latest > 150 && latest > lastScrollY.current) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    lastScrollY.current = latest;
  });

  const scrollToSection = useCallback((href: string, sectionId: string) => {
    setActiveSection(sectionId); 
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      {/* Refined Scroll Progress Line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1.5px] bg-zinc-900/20 dark:bg-zinc-100/20 origin-left z-[60]"
      >
        <motion.div 
          className="h-full bg-zinc-900 dark:bg-zinc-50"
          style={{ scaleX: scrollYProgress, originX: 0 }}
        />
      </motion.div>

      {/* ─── Desktop Nav ─── */}
      <motion.nav
        initial={{ y: -80, opacity: 0, filter: "blur(10px)" }}
        animate={{ 
          y: isVisible ? 0 : -80, 
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? "blur(0px)" : "blur(10px)"
        }}
        transition={{ duration: 0.8, ease: customEase }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-3"
      >
        {/* The Navigation Pill (Perfectly Centered) */}
        <div
          className={`relative flex items-center gap-1 px-2 py-2 rounded-full border transition-all duration-700 ease-out ${
            hasScrolled
              ? "bg-white/40 dark:bg-[#0a0a0a]/40 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              : "bg-transparent border-transparent"
          }`}
          style={{ WebkitBackdropFilter: hasScrolled ? "blur(24px)" : "none" }}
        >
          {navItems.map((item, index) => {
            const sectionId = item.href.substring(1);
            const isActive = sectionId === activeSection;
            
            return (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.href, sectionId)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: customEase,
                  delay: 0.1 + index * 0.05,
                }}
                className="relative px-5 py-2 rounded-full group"
              >
                <span
                  className={`relative z-10 text-[13px] tracking-wide font-medium whitespace-nowrap transition-colors duration-500 ${
                    isActive
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-300"
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-indicator"
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-900 dark:bg-zinc-50"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* The Theme Toggle (Detached Satellite) */}
        <div 
           className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-700 ease-out ${
            hasScrolled
              ? "bg-white/40 dark:bg-[#0a0a0a]/40 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              : "bg-transparent border-transparent"
          }`}
        >
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* ─── Mobile Nav (Bottom Dock) ─── */}
      <motion.nav
        initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: customEase, delay: 0.2 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden flex items-center gap-2 w-[90%] max-w-sm"
      >
        <div className="relative flex-1 flex items-center justify-between px-2 py-2 rounded-full bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {navItems.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = sectionId === activeSection;
            
            return (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href, sectionId)}
                className="relative px-3 py-2.5 rounded-full"
              >
                <span
                  className={`relative z-10 text-[10px] tracking-wide font-medium uppercase whitespace-nowrap transition-colors duration-500 ${
                    isActive
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-500"
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-900 dark:bg-zinc-50"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Theme Toggle Satellite */}
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <ThemeToggle />
        </div>
      </motion.nav>
    </>
  );
}