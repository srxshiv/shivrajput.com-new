import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-faint">
        404
      </p>
      <h1 className="text-5xl font-medium tracking-tighter text-foreground md:text-7xl">
        Nothing here.
      </h1>
      <p className="handwritten rotate-[-2deg] text-xl">
        wrong turn, happens to the best of us
      </p>
      <Link
        href="/"
        className="mt-4 rounded-full border border-line px-6 py-3 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
      >
        Back home
      </Link>
    </main>
  );
}
