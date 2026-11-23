export function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-transparent py-6 mt-12 text-center text-xs text-zinc-500">
      <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-zinc-500">
        <span>© {new Date().getFullYear()} Belbin Assessment</span>
        <span className="hidden sm:inline text-zinc-300 font-light">|</span>
        <span className="text-zinc-500 text-xs">Self-Perception Inventory</span>
      </div>
    </footer>
  );
}
