"use client";

import { useState, useEffect } from "react";
import { FlowIndicator } from "@/components/FlowIndicator";
import { BELBIN_ROLES } from "@/lib/belbin/roles";
import type { Role } from "@/lib/belbin/scoring-key";
import type { HasilPeserta } from "@/actions/submit-tes";

export default function SelesaiPage() {
  const [hasil, setHasil] = useState<HasilPeserta | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("belbin_hasil_tes");
      if (saved) {
        setHasil(JSON.parse(saved) as HasilPeserta);
      }
    } catch {
      // safe fallback
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const roleUtama = hasil?.peranUtama ? BELBIN_ROLES[hasil.peranUtama as Role] : null;
  const roleSekunder = hasil?.peranSekunder ? BELBIN_ROLES[hasil.peranSekunder as Role] : null;

  return (
    <div className="max-w-2xl mx-auto my-8 px-4 space-y-6">
      {/* Indikator Alur */}
      <FlowIndicator currentStep={3} />

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
        {/* Header Sukses */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-forest-light text-forest flex items-center justify-center font-bold text-2xl border border-forest-border shadow-2xs">
            ✓
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-dark">
              Tes Berhasil Disimpan
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
              Terima kasih atas partisipasi Anda. Jawaban tes telah tersimpan secara aman di dalam sistem.
            </p>
            {hasil?.nama && (
              <div className="pt-2 text-xs sm:text-sm font-bold text-forest bg-forest-light/60 py-1.5 px-4 rounded-full inline-block border border-forest-border/70">
                {hasil.nama} • {hasil.departemen} ({hasil.jabatan})
              </div>
            )}
          </div>
        </div>

        {/* Hasil Peran Utama & Sekunder beserta Representasi Hewan */}
        {isLoaded && roleUtama && roleSekunder && (
          <div className="space-y-4 pt-2 border-t border-zinc-100">
            <div className="text-center">
              <span className="text-xs font-bold text-forest uppercase tracking-wider">
                Profil Peran Tim Anda
              </span>
              <h2 className="text-base sm:text-lg font-bold text-dark mt-0.5">
                Karakteristik & Peran Alami Anda dalam Tim
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kartu Peran Utama */}
              <div className="bg-emerald-50/40 rounded-2xl p-5 border-2 border-forest/30 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-forest/15 pb-2.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-forest text-white uppercase tracking-wider">
                    Peran Utama
                  </span>
                  <span className="text-xs font-bold text-forest">
                    {roleUtama.kelompok} Role
                  </span>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white border border-forest/20 shadow-2xs">
                    {roleUtama.hewanEmoji}
                  </span>
                  <div>
                    <div className="text-base sm:text-lg font-extrabold text-dark leading-tight">
                      {roleUtama.nama} ({roleUtama.kode})
                    </div>
                    <div className="text-xs font-semibold text-forest mt-0.5">
                      Karakter: {roleUtama.hewan}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed pt-1">
                  {roleUtama.deskripsi}
                </p>
              </div>

              {/* Kartu Peran Sekunder */}
              <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/90 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-700 text-white uppercase tracking-wider">
                    Peran Sekunder
                  </span>
                  <span className="text-xs font-semibold text-zinc-600">
                    {roleSekunder.kelompok} Role
                  </span>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
                    {roleSekunder.hewanEmoji}
                  </span>
                  <div>
                    <div className="text-base sm:text-lg font-extrabold text-dark leading-tight">
                      {roleSekunder.nama} ({roleSekunder.kode})
                    </div>
                    <div className="text-xs font-semibold text-zinc-600 mt-0.5">
                      Karakter: {roleSekunder.hewan}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed pt-1">
                  {roleSekunder.deskripsi}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Kotak Informasi Penutup */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 leading-relaxed text-center">
          <p className="font-medium">
            Hasil evaluasi peran tim Belbin Anda telah tersimpan secara permanen di dalam sistem dan dapat ditinjau langsung oleh pengelola tim / HR.
          </p>
        </div>
      </div>
    </div>
  );
}
