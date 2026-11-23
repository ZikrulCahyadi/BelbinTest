import Link from "next/link";
import { FlowIndicator } from "@/components/FlowIndicator";

export default function SelesaiPage() {
  return (
    <div className="max-w-md mx-auto my-8 space-y-6 text-center">
      {/* Indikator Alur Reusable */}
      <FlowIndicator currentStep={3} />

      <div className="bg-white rounded-2xl p-7 sm:p-8 border border-zinc-200/90 shadow-xs space-y-5">
        <div className="w-12 h-12 mx-auto rounded-full bg-forest-light text-forest flex items-center justify-center font-bold text-xl border border-forest-border">
          ✓
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-bold tracking-tight text-dark">
            Tes Berhasil Dikirim
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Terima kasih atas partisipasi Anda. Jawaban tes telah tersimpan secara aman di dalam sistem.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory border border-zinc-200 text-xs text-zinc-600 leading-relaxed text-left">
          Hasil evaluasi peran tim Belbin Anda akan ditinjau dan direkapitulasi langsung oleh pengelola tim / HR.
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full h-11 px-4 rounded-xl bg-forest hover:bg-forest-hover active:bg-[#144731] text-white text-xs sm:text-sm font-semibold transition"
          >
            Kembali ke Halaman Depan
          </Link>
        </div>
      </div>
    </div>
  );
}
