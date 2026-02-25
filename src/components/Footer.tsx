

export default function Footer (){

    return         <footer className="py-12 px-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-px bg-zinc-300 dark:bg-zinc-700 mb-4" />
            <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 font-medium">
              © {new Date().getFullYear()} Shiv.
            </p>
            <p className="text-[10px] tracking-wide text-zinc-300 dark:text-zinc-600">
              Engineered with precision.
            </p>
          </div>
        </footer>
}