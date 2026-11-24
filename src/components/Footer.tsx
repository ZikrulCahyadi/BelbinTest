export function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 bg-transparent py-6 mt-10 text-center text-xs text-zinc-400">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-zinc-400 font-medium">
        <span>© {new Date().getFullYear()} Belbin Assessment</span>
        <span className="text-zinc-300">•</span>
        <span>Self-Perception Inventory</span>
      </div>
    </footer>
  );
}
