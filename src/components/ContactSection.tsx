import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const transitionEase = [0.16, 1, 0.3, 1];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "srxhshiv@gmail.com",
    href: "mailto:srxhshiv@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 7668585139",
    href: "tel:+917668585139",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dehradun, IN",
    href: "https://maps.google.com/?q=Dehradun",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative py-32 px-6 md:px-24 max-w-7xl mx-auto min-h-[70vh] flex flex-col justify-center">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
        {/* Left Column: Massive Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: transitionEase }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6">
            Let's build <br className="hidden md:block" />
            <span className="text-zinc-400 dark:text-zinc-600">something.</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
            Feel free to reach out if you're looking for a developer, have a question, or simply want to connect.
          </p>
        </motion.div>

        {/* Right Column: Sleek Interactive Rows */}
        <div className="flex flex-col justify-center w-full">
          {contactInfo.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.label === "Location" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: transitionEase, delay: index * 0.15 }}
              className="group flex items-center justify-between py-6 md:py-8 border-b border-zinc-200 dark:border-zinc-800 transition-colors hover:border-zinc-900 dark:hover:border-zinc-50"
            >
              <div className="flex items-center gap-6 md:gap-8">
                {/* Icon wrapper - completely flat */}
                <div className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors duration-300">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                
                {/* Clean Typography */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-500 tracking-wide uppercase mb-1">
                    {item.label}
                  </span>
                  <span className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {item.value}
                  </span>
                </div>
              </div>

              {/* The "Arc" interaction detail: sliding arrow */}
              <div className="overflow-hidden p-2">
                <ArrowUpRight 
                  size={24} 
                  strokeWidth={1.5}
                  className="text-zinc-900 dark:text-zinc-50 opacity-0 -translate-x-full translate-y-full transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" 
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}