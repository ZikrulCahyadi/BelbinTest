"use client";

import { useState, useEffect } from "react";
import { FlowIndicator } from "@/components/FlowIndicator";
import { BELBIN_ROLES } from "@/lib/belbin/roles";
import { ROLES, type Role } from "@/lib/belbin/scoring-key";
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
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-6">
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

        {/* Teks Header di Atas Card Sesuai Permintaan */}
        {isLoaded && roleUtama && roleSekunder && (
          <div className="text-center pt-3 border-t border-zinc-100">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">
              PROFIL PERAN TIM ANDA
            </span>
            <h2 className="text-base sm:text-xl font-extrabold text-dark mt-0.5">
              Karakteristik & Peran Alami Anda dalam Tim
            </h2>
          </div>
        )}

        {/* Hasil Peran Utama & Sekunder Persis Desain Mockup */}
        {isLoaded && roleUtama && roleSekunder && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: PERAN UTAMA */}
            <div className="relative bg-white rounded-3xl border border-emerald-200/90 shadow-xs overflow-hidden p-6 pt-5 flex flex-col justify-between">
              {/* Badge Ribbon Pojok Kiri Atas */}
              <div className="-mt-5 -ml-6 mb-5">
                <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#13583B] text-white text-[11px] font-extrabold tracking-wider rounded-br-2xl uppercase shadow-2xs">
                  <span>★</span>
                  <span>PERAN UTAMA</span>
                </span>
              </div>

              {/* Row Avatar & Info */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-[#E2F3EB] flex items-center justify-center text-4xl shrink-0 shadow-2xs">
                  {roleUtama.hewanEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#1B2A22] leading-tight truncate">
                      {roleUtama.nama} <span className="font-bold">({roleUtama.kode})</span>
                    </h3>
                    {(hasil?.skorUtama !== undefined || hasil?.skorSemua?.[roleUtama.kode] !== undefined) && (
                      <span className="text-xs font-extrabold text-forest bg-[#E2F3EB] px-2.5 py-0.5 rounded-full border border-forest/20 shrink-0">
                        {hasil?.skorSemua?.[roleUtama.kode] ?? hasil?.skorUtama} Poin
                      </span>
                    )}
                  </div>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#E2F3EB] text-[#13583B] font-bold text-xs mt-1.5">
                    Karakter: {roleUtama.hewan}
                  </span>
                </div>
              </div>

              {/* Garis Pembatas */}
              <div className="border-t border-zinc-200/80 my-4" />

              {/* Deskripsi Karakter */}
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                {roleUtama.deskripsi}
              </p>
            </div>

            {/* Card 2: PERAN SEKUNDER */}
            <div className="relative bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden p-6 pt-5 flex flex-col justify-between">
              {/* Badge Ribbon Pojok Kiri Atas */}
              <div className="-mt-5 -ml-6 mb-5">
                <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#3F4D67] text-white text-[11px] font-extrabold tracking-wider rounded-br-2xl uppercase shadow-2xs">
                  <span>»</span>
                  <span>PERAN SEKUNDER</span>
                </span>
              </div>

              {/* Row Avatar & Info */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-[#E8EDF5] flex items-center justify-center text-4xl shrink-0 shadow-2xs">
                  {roleSekunder.hewanEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#1B2A22] leading-tight truncate">
                      {roleSekunder.nama} <span className="font-bold">({roleSekunder.kode})</span>
                    </h3>
                    {(hasil?.skorSekunder !== undefined || hasil?.skorSemua?.[roleSekunder.kode] !== undefined) && (
                      <span className="text-xs font-extrabold text-[#3F4D67] bg-[#E8EDF5] px-2.5 py-0.5 rounded-full border border-[#3F4D67]/20 shrink-0">
                        {hasil?.skorSemua?.[roleSekunder.kode] ?? hasil?.skorSekunder} Poin
                      </span>
                    )}
                  </div>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#E8EDF5] text-[#3F4D67] font-bold text-xs mt-1.5">
                    Karakter: {roleSekunder.hewan}
                  </span>
                </div>
              </div>

              {/* Garis Pembatas */}
              <div className="border-t border-zinc-200/80 my-4" />

              {/* Deskripsi Karakter */}
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                {roleSekunder.deskripsi}
              </p>
            </div>
          </div>
        )}

        {/* Distribusi Skor 8 Peran Tim (Persis Seperti di Admin) */}
        {isLoaded && hasil?.skorSemua && (
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-xs space-y-5 pt-4">
            <div className="flex items-center justify-between text-xs border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-dark">
                  Distribusi Skor 8 Peran Tim
                </h3>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Akumulasi poin dari 7 bagian kuesioner
                </p>
              </div>
              <span className="text-dark font-bold bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
                Total {Object.values(hasil.skorSemua).reduce((a, b) => a + b, 0)} / 70 poin
              </span>
            </div>

            <div className="space-y-3.5 pt-1">
              {ROLES.map((roleKey) => {
                const role = BELBIN_ROLES[roleKey];
                const nilai = hasil.skorSemua[roleKey] ?? 0;
                const isUtama = roleKey === hasil.peranUtama;
                const isSekunder = roleKey === hasil.peranSekunder;
                const percentage = Math.round((nilai / 70) * 100);

                return (
                  <div key={roleKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-dark">
                          {role.nama} ({roleKey})
                        </span>
                        <span className="text-xs text-zinc-400">
                          • {role.kelompok}
                        </span>
                        {isUtama && (
                          <span className="text-[10px] font-bold text-forest bg-forest-light border border-forest-border px-2 py-0.5 rounded-full">
                            Utama
                          </span>
                        )}
                        {isSekunder && (
                          <span className="text-[10px] font-bold text-zinc-700 bg-zinc-200 px-2 py-0.5 rounded-full">
                            Sekunder
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-dark">{nilai} poin</span>
                    </div>

                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden border border-zinc-200/60">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          isUtama
                            ? "bg-forest"
                            : isSekunder
                            ? "bg-forest/60"
                            : "bg-zinc-300"
                        }`}
                        style={{ width: `${Math.max(2, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
