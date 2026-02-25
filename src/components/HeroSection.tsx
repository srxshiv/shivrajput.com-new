"use client";

import { Github, Linkedin, Instagram, Twitter, Download } from "lucide-react";
import { motion } from "framer-motion";

const customEase = [0.25, 1, 0.5, 1];

const socialLinks = [
  { name: "GH", href: "https://github.com/srxshiv", icon: Github },
  { name: "LI", href: "https://linkedin.com/in/srxshiv", icon: Linkedin },
  { name: "TW", href: "https://twitter.com/srxshiv", icon: Twitter },
  { name: "IG", href: "https://instagram.com/srxshiv", icon: Instagram },
];

export function HeroSection() {
  return (
    // Replaced -z-10 with z-0. This ensures elements stay clickable!
    <section className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 z-0 overflow-hidden">
      
      {/* Centered Main Text */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 1.2, ease: customEase, delay: 0.1 }}
        className="flex-1 flex items-center justify-center"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tighter text-zinc-900 dark:text-zinc-50">
          Hi, I'm Shiv.
        </h1>
      </motion.div>

      {/* Bottom Bar: Resume & Socials */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: customEase, delay: 0.4 }}
        // Changed to justify-center, increased pb to bring it slightly up, added a wider gap
        className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-center gap-10 pb-24 md:pb-32"
      >
        <a
          href="https://drive.google.com/file/d/1GHUuIceA_ufZ-ypgUDFTQ1IniPbyJEk2/view?usp=share_link"
          target="_blank"
          rel="noopener noreferrer"
          // Scaled up text, icon, and padding
          className="flex items-center gap-3 px-8 py-4 text-zinc-500 dark:text-zinc-400 text-base font-medium hover:text-zinc-900 dark:hover:text-zinc-50 rounded-full transition-colors duration-300"
        >
          <Download className="w-5 h-5" />
          Resume
        </a>
        
        <div className="flex items-center gap-8">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-50 transition-colors duration-300"
            >
              {/* Scaled up social icons */}
              <social.icon className="w-6 h-6 stroke-[1.5]" />
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}