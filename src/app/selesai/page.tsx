"use client";

import { useState, useEffect } from "react";
import { FlowIndicator } from "@/components/FlowIndicator";
import { BELBIN_ROLES } from "@/lib/belbin/roles";
import { ROLES, type Role } from "@/lib/belbin/scoring-key";
import { getHasilPesertaTerakhir, type HasilPeserta } from "@/actions/submit-tes";

export default function SelesaiPage() {
  const [hasil, setHasil] = useState<HasilPeserta | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadHasil() {
      try {
        const saved = localStorage.getItem("belbin_hasil_tes");
        if (saved) {
          const parsed = JSON.parse(saved) as HasilPeserta;
          setHasil(parsed);

          // Jika data cache di browser belum memiliki skorSemua, ambil otomatis dari server
          if ((!parsed.skorSemua || Object.keys(parsed.skorSemua).length === 0) && parsed.nama) {
            const fresh = await getHasilPesertaTerakhir(parsed.nama);
            if (fresh) {
              setHasil(fresh);
              localStorage.setItem("belbin_hasil_tes", JSON.stringify(fresh));
            }
          }
        }
      } catch {
        // safe fallback
      } finally {
        setIsLoaded(true);
      }
    }

    loadHasil();
  }, []);

  const roleUtama = hasil?.peranUtama ? BELBIN_ROLES[hasil.peranUtama as Role] : null;
  const roleSekunder = hasil?.peranSekunder ? BELBIN_ROLES[hasil.peranSekunder as Role] : null;

  // Skor untuk 8 peran dengan fallback jika ada
  const displayScores: Record<Role, number> = hasil?.skorSemua || {
    SH: hasil?.peranUtama === "SH" ? (hasil?.skorUtama ?? 0) : hasil?.peranSekunder === "SH" ? (hasil?.skorSekunder ?? 0) : 0,
    CO: hasil?.peranUtama === "CO" ? (hasil?.skorUtama ?? 0) : hasil?.peranSekunder === "CO" ? (hasil?.skorSekunder ?? 0) : 0,
    PL: hasil?.peranUtama === "PL" ? (hasil?.skorUtama ?? 0) : hasil?.peranSekunder === "PL" ? (hasil?.skorSekunder ?? 0) : 0,
    RI: hasil?.peranUtama === "RI" ? (hasil?.skorUtama ?? 0) : hasil?.peranSekunder === "RI" ? (hasil?.skorSekunder ?? 0) : 0,
    ME: hasil?.peranUtama === "ME" ? (hasil?.skorUtama ?? 0) : hasil?.peranSekunder === "ME" ? (hasil?.skorSekunder ?? 0) : 0,
    IMP: hasil?.peranUtama === "IMP" ? (hasil?.skorUtama ?? 0) : hasil?.peranSekunder === "IMP" ? (hasil?.skorSekunder ?? 0) : 0,
    TW: hasil?.peranUtama === "TW" ? (hasil?.skorUtama ?? 0) : hasil?.peranSekunder === "TW" ? (hasil?.skorSekunder ?? 0) : 0,
    CF: hasil?.peranUtama === "CF" ? (hasil?.skorUtama ?? 0) : hasil?.peranSekunder === "CF" ? (hasil?.skorSekunder ?? 0) : 0,
  };

  const totalPoin = Object.values(displayScores).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto my-4 sm:my-8 px-3 sm:px-4 space-y-5 sm:space-y-6">
      {/* Indikator Alur */}
      <FlowIndicator currentStep={3} />

      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6 sm:space-y-7">
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

        {/* Teks Header di Atas Card Sesuai Mockup */}
        {isLoaded && roleUtama && roleSekunder && (
          <div className="text-center pt-2 sm:pt-3 border-t border-zinc-100">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Card 1: PERAN UTAMA */}
            <div className="relative bg-white rounded-3xl border border-emerald-200/90 shadow-xs overflow-hidden p-5 sm:p-6 flex flex-col h-full">
              {/* Baris Atas: Ribbon di Kiri & Poin di Kanan (Sudut) */}
              <div className="flex items-center justify-between -mt-5 -ml-5 -mr-5 mb-4 pr-4">
                <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#13583B] text-white text-[11px] font-extrabold tracking-wider rounded-br-2xl uppercase shadow-2xs">
                  <span>★</span>
                  <span>PERAN UTAMA</span>
                </span>
                <span className="text-xs font-extrabold text-forest bg-[#E2F3EB] px-3 py-1 rounded-full border border-forest/20 shrink-0 shadow-2xs whitespace-nowrap">
                  {displayScores[roleUtama.kode]} Poin
                </span>
              </div>

              {/* Row Avatar & Info */}
              <div className="flex items-center space-x-3.5 sm:space-x-4 min-h-[72px] sm:min-h-[80px]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E2F3EB] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs border border-emerald-100/60">
                  <img
                    src={roleUtama.gambar}
                    alt={roleUtama.hewan}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback ke emoji jika gambar belum dimuat
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-3xl sm:text-4xl hidden only:inline">
                    {roleUtama.hewanEmoji}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl font-extrabold text-[#1B2A22] leading-tight">
                    {roleUtama.nama}{" "}
                    <span className="font-bold text-zinc-500 whitespace-nowrap">
                      ({roleUtama.kode})
                    </span>
                  </h3>
                  <div className="mt-1 sm:mt-1.5">
                    <span className="inline-block px-2.5 sm:px-3 py-0.5 rounded-full bg-[#E2F3EB] text-[#13583B] font-bold text-xs">
                      Karakter: {roleUtama.hewan}
                    </span>
                  </div>
                </div>
              </div>

              {/* Garis Pembatas */}
              <div className="border-t border-zinc-200/80 my-3.5 sm:my-4" />

              {/* Deskripsi Karakter */}
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal flex-1">
                {roleUtama.deskripsi}
              </p>
            </div>

            {/* Card 2: PERAN SEKUNDER */}
            <div className="relative bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden p-5 sm:p-6 flex flex-col h-full">
              {/* Baris Atas: Ribbon di Kiri & Poin di Kanan (Sudut) */}
              <div className="flex items-center justify-between -mt-5 -ml-5 -mr-5 mb-4 pr-4">
                <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#3F4D67] text-white text-[11px] font-extrabold tracking-wider rounded-br-2xl uppercase shadow-2xs">
                  <span>»</span>
                  <span>PERAN SEKUNDER</span>
                </span>
                <span className="text-xs font-extrabold text-[#3F4D67] bg-[#E8EDF5] px-3 py-1 rounded-full border border-[#3F4D67]/20 shrink-0 shadow-2xs whitespace-nowrap">
                  {displayScores[roleSekunder.kode]} Poin
                </span>
              </div>

              {/* Row Avatar & Info */}
              <div className="flex items-center space-x-3.5 sm:space-x-4 min-h-[72px] sm:min-h-[80px]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E8EDF5] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs border border-zinc-200/60">
                  <img
                    src={roleSekunder.gambar}
                    alt={roleSekunder.hewan}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback ke emoji jika gambar belum dimuat
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-3xl sm:text-4xl hidden only:inline">
                    {roleSekunder.hewanEmoji}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl font-extrabold text-[#1B2A22] leading-tight">
                    {roleSekunder.nama}{" "}
                    <span className="font-bold text-zinc-500 whitespace-nowrap">
                      ({roleSekunder.kode})
                    </span>
                  </h3>
                  <div className="mt-1 sm:mt-1.5">
                    <span className="inline-block px-2.5 sm:px-3 py-0.5 rounded-full bg-[#E8EDF5] text-[#3F4D67] font-bold text-xs">
                      Karakter: {roleSekunder.hewan}
                    </span>
                  </div>
                </div>
              </div>

              {/* Garis Pembatas */}
              <div className="border-t border-zinc-200/80 my-3.5 sm:my-4" />

              {/* Deskripsi Karakter */}
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal flex-1">
                {roleSekunder.deskripsi}
              </p>
            </div>
          </div>
        )}

        {/* Distribusi Skor 8 Peran Tim (Persis Seperti di Admin) */}
        {isLoaded && roleUtama && (
          <div className="bg-white rounded-2xl p-4 sm:p-7 border border-zinc-200/90 shadow-xs space-y-4 sm:space-y-5 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-b border-zinc-100 pb-3 gap-2">
              <div>
                <h3 className="text-base font-bold text-dark">
                  Distribusi Skor 8 Peran Tim
                </h3>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Akumulasi poin dari 7 bagian kuesioner
                </p>
              </div>
              <span className="text-dark font-bold bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200 self-start sm:self-auto shrink-0">
                Total {totalPoin > 0 ? totalPoin : 70} / 70 poin
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {ROLES.map((roleKey) => {
                const role = BELBIN_ROLES[roleKey];
                const nilai = displayScores[roleKey] ?? 0;
                const isUtama = roleKey === hasil?.peranUtama;
                const isSekunder = roleKey === hasil?.peranSekunder;
                const percentage = Math.round((nilai / 70) * 100);

                return (
                  <div key={roleKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className="font-bold text-dark whitespace-nowrap">
                          {role.nama} ({roleKey})
                        </span>
                        <span className="text-[11px] text-zinc-400 shrink-0">
                          • {role.kelompok}
                        </span>
                        {isUtama && (
                          <span className="text-[10px] font-bold text-forest bg-forest-light border border-forest-border px-2 py-0.5 rounded-full shrink-0">
                            Utama
                          </span>
                        )}
                        {isSekunder && (
                          <span className="text-[10px] font-bold text-zinc-700 bg-zinc-200 px-2 py-0.5 rounded-full shrink-0">
                            Sekunder
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-dark shrink-0 whitespace-nowrap text-right">
                        {nilai} poin
                      </span>
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
