"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const customEase = [0.25, 1, 0.5, 1];

const services = [
  {
    id: "founders",
    label: "Founders",
    title: "Product Development",
    description: "Transforming raw concepts into market-ready platforms. I architect and build scalable MVPs using the modern TypeScript ecosystem designed to ship fast and survive scale.",
    deliverables: ["End-to-End Software Development", "Robust API Designs", "Scalable Database & Auth Architecture"],
    cta: "Contact Me",
    tag: "01",
  },
  {
    id: "sme",
    label: "Agencies & SMEs",
    title: "AI & Workflow Scaling",
    description: "Eliminate manual bottlenecks and scale your operations. I integrate complex automation workflows and deploy AI agents that handle customer engagement around the clock.",
    deliverables: ["Custom n8n, Make, Pipedream & Zapier", "AI Voice & Chatbot Agents", "CRM & GoHighLevel Integrations"],
    cta: "Contact Me",
    tag: "02",
  },
  {
    id: "teams",
    label: "Established Teams",
    title: "Custom Integrations",
    description: "Break down data silos. I connect your fragmented tools and build bespoke internal dashboards, allowing your team to operate from a single source of truth.",
    deliverables: ["Custom OAuth 2.0 Gateways", "Internal Tooling (Retool / Payload CMS)", "Third-Party API SDK Development"],
    cta: "Contact Me",
    tag: "03",
  },
];

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const active = services[activeIndex];
  const itemHeight = 60; 
  const yOffset = -(activeIndex * itemHeight);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 4500); 
    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    // The background color is mandatory here so it obscures the sticky hero beneath it
    <section 
      id="services" 
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24 py-32"
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-24 items-start">
        
        {/* LEFT COLUMN: The Target Selector */}
        <div className="lg:col-span-5 relative">
          <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6 mt-4 lg:mt-[5rem] relative">
            <span className="text-xl md:text-4xl font-light text-zinc-400 dark:text-zinc-600 flex md:h-[60px] items-center shrink-0">
              For
            </span>
            
            <div className="relative h-auto md:h-[60px] w-full z-10 overflow-visible">
              <motion.div 
                className="relative md:absolute top-0 left-0 flex flex-col w-full gap-2 md:gap-0"
                animate={{ y: isMobile ? 0 : yOffset }}
                transition={{ duration: 0.6, ease: customEase }}
              >
                {services.map((s, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveIndex(index)}
                      className="text-left group flex items-center h-auto md:h-[60px] w-full py-1.5 md:py-0"
                    >
                      <motion.span
                        animate={{
                          opacity: isActive ? 1 : 0.25, 
                          scale: isActive ? 1 : 0.85,
                          x: isActive ? (isMobile ? 12 : 0) : (isMobile ? 0 : -10),
                        }}
                        transition={{ duration: 0.5, ease: customEase }}
                        className={`block text-2xl md:text-4xl lg:text-5xl tracking-tight transition-colors duration-500 origin-left whitespace-nowrap font-medium ${
                          isActive
                            ? "text-zinc-900 dark:text-zinc-50"
                            : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                        }`}
                      >
                        {s.label}
                      </motion.span>
                    </button>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Value Proposition Panel */}
        <div className="lg:col-span-7 relative min-h-[400px]"> 
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: isMobile ? 0.8 : 0.4, ease: customEase }}
              className="flex flex-col relative z-20 lg:pl-12 xl:pl-24 pt-2 mt-4 md:mt-0" 
            >
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 mb-8">
                <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-500 md:mt-2.5 hidden md:block">
                  {active.tag}
                </span>
                
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 md:mb-6 leading-tight flex items-center gap-3">
                    {active.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base font-light mb-8 max-w-xl">
                    {active.description}
                  </p>

                  <ul className="flex flex-col gap-3 mb-10 md:mb-12">
                    {active.deliverables.map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 * i + 0.2, duration: 0.5, ease: customEase }}
                        className="flex items-center gap-3 text-[13px] md:text-sm text-zinc-700 dark:text-zinc-300 font-light tracking-wide"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 dark:bg-zinc-200 opacity-60 shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.a
                    href="#contact"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 md:py-4 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-[11px] md:text-xs font-semibold tracking-[0.15em] uppercase rounded-full hover:scale-105 active:scale-95 transition-all duration-300 w-full md:w-max"
                  >
                    {active.cta}
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}