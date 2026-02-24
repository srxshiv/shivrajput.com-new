import {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

// The signature physical deceleration curve
const customEase = [0.25, 1, 0.5, 1];

const socialLinks = [
  { name: "GH", href: "https://github.com/srxshiv", icon: Github },
  { name: "LI", href: "https://linkedin.com/in/srxshiv", icon: Linkedin },
  { name: "TW", href: "https://twitter.com/srxshiv", icon: Twitter },
  { name: "IG", href: "https://instagram.com/srxshiv", icon: Instagram },
];

const services = [
  {
    id: "founders",
    label: "For Founders",
    title: "Product Engineering",
    description:
      "End-to-end fullstack development. Scalable, containerized MVPs and robust backends using the TypeScript ecosystem — built to ship fast and survive scale.",
    tag: "01",
  },
  {
    id: "sme",
    label: "For Agencies & SMEs",
    title: "AI & Workflow Scaling",
    description:
      "Eliminate manual operations. Complex workflows via n8n, Zapier, and GHL — plus AI agents that handle customer engagement around the clock.",
    tag: "02",
  },
  {
    id: "teams",
    label: "For Established Teams",
    title: "Custom Integrations",
    description:
      "Connect your siloed tools. Custom REST APIs, OAuth 2.0 gateways, and internal tooling via Retool and Payload CMS to unify your entire data layer.",
    tag: "03",
  },
];

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  // Defaulting to null shows the stats. Change to "founders" if you want it open by default.
  const [activeService, setActiveService] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const active = services.find((s) => s.id === activeService);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden transition-colors duration-500"
      style={{ fontFamily: "'Inter', 'SF Pro Display', sans-serif" }}
    >
      {/* Ambient Depth - adapts to light/dark */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(150,150,150,0.03) 0%, transparent 60%)",
        }}
      />

      <motion.div
        style={{ y: yParallax, opacity: opacityParallax }}
        className="relative z-10 w-full max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center min-h-screen py-32">
          
          {/* LEFT COLUMN: The Identity */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.2, ease: customEase, delay: 0.1 }}
            className="flex flex-col items-start"
          >
            {/* Elegant Status Indicator */}
            <div className="flex items-center gap-3 mb-12">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 dark:bg-zinc-500 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500 dark:bg-zinc-400"></span>
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 dark:text-zinc-400 font-medium">
                Accepting Projects
              </span>
            </div>

            {/* Name */}
            <h1 className="text-[clamp(4.5rem,10vw,8rem)] font-medium tracking-tighter leading-[0.9] text-zinc-900 dark:text-zinc-50 mb-8">
              Shiv.
            </h1>

            {/* Tagline */}
            <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-light leading-relaxed mb-12 max-w-sm">
              I engineer scalable solutions — from custom products to intelligent automations — for businesses that demand performance.
            </p>

            {/* Premium CTAs */}
            <div className="flex items-center gap-6 mb-16">
              <a
                href="#contact"
                className="group flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm font-medium rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
              >
                Let's Talk
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="https://drive.google.com/file/d/1duCXXk6CCvQtwsI8yievs73X0xLVqvEc/view?usp=share_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-medium rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-300"
              >
                <Download className="w-3.5 h-3.5" />
                Resume
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-50 transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5 stroke-[1.5]" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: The Value Proposition */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(12px)", x: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            transition={{ duration: 1.2, ease: customEase, delay: 0.3 }}
            className="flex flex-col gap-0"
          >
            {/* Sleek Service Tabs */}
            <div className="flex gap-6 mb-12  ">
              {services.map((s) => {
                const isActive = activeService === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveService(isActive ? null : s.id)}
                    className="relative pb-4 text-xs tracking-[0.1em] font-medium uppercase transition-colors duration-300"
                  >
                    <span className={isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"}>
                      {s.label}
                    </span>
                    {/* Animated Underline Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-zinc-900 dark:bg-zinc-50"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Service Panel */}
            <div className="relative min-h-[220px]">
              <AnimatePresence mode="wait">
                {active ? (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: customEase }}
                    className="flex flex-col"
                  >
                    <div className="flex items-start gap-6 mb-6">
                      <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-2">
                        {active.tag}
                      </span>
                      <div>
                        <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 leading-tight">
                          {active.title}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base max-w-md font-light">
                          {active.description}
                        </p>
                      </div>
                    </div>

                    <motion.a
                      href="#contact"
                      className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors ml-12 w-max mt-4"
                    >
                      Start a project
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </motion.a>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: customEase }}
                    className="flex flex-col justify-center h-full"
                  >
                    <p className="text-zinc-500 dark:text-zinc-500 text-sm font-light tracking-wide mb-12">
                      Select an engagement model above.
                    </p>

                    {/* Highly Refined Decorative Stats */}
                    <div className="grid grid-cols-3 gap-8">
                      {[
                        { num: "3+", label: "Years building" },
                        { num: "20+", label: "Products shipped" },
                        { num: "∞", label: "Uptime obsession" },
                      ].map((stat, i) => (
                        <motion.div 
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 + 0.2, ease: customEase }}
                        >
                          <div className="text-3xl font-medium tracking-tighter text-zinc-900 dark:text-zinc-100 mb-2">
                            {stat.num}
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-500">
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}