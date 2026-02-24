import { Github, Linkedin, Instagram, Twitter, ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";

// Buttery smooth easing curve for that premium, fluid feel
const transitionEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: transitionEase },
  },
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/srxshiv", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/in/srxshiv", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com/srxshiv", icon: Twitter },
  { name: "Instagram", href: "https://instagram.com/srxshiv", icon: Instagram },
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-24 max-w-7xl mx-auto"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-start max-w-3xl"
      >
        {/* Minimalist Subtitle */}
        <motion.div variants={itemVariants} className="mb-4">
          <span className="px-3 py-1 text-xs md:text-sm font-medium tracking-wider uppercase text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-full bg-zinc-50 dark:bg-zinc-900/50">
            Available for new opportunities
          </span>
        </motion.div>

        {/* Massive, clean typography */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-8xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6"
        >
          Shiv Rajput.
        </motion.h1>

        {/* Refined bio mentioning the core stack naturally */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mb-10 max-w-2xl"
        >
          I am a Full Stack Developer engineering elegant, high-performance web applications. Specializing in TypeScript, Next.js, and crafting fluid user interfaces from the ground up.
        </motion.p>

        {/* Clean, pill-shaped action buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#projects"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-full font-medium transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            View My Work
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          
          <a
            href="https://drive.google.com/file/d/1duCXXk6CCvQtwsI8yievs73X0xLVqvEc/view?usp=share_link"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-transparent text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-full font-medium transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Resume
          </a>
        </motion.div>

        {/* Subtle Social Links at the bottom of the content block */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 flex items-center gap-6"
        >
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors duration-300"
              aria-label={social.name}
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}