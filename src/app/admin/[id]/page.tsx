import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BELBIN_ROLES } from "@/lib/belbin/roles";
import { ROLES, Role } from "@/lib/belbin/scoring-key";
import { tentukanPeran, type SkorPeran } from "@/lib/belbin/score";
import { DeleteParticipantButton } from "@/components/DeleteParticipantButton";

interface DetailPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function AdminDetailPage({ params }: DetailPageProps) {
  const supabase = await createClient();

  const { data: participant, error } = await supabase
    .from("hasil_belbin")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !participant) {
    notFound();
  }

  const skor: SkorPeran = {
    SH: participant.skor_sh,
    CO: participant.skor_co,
    PL: participant.skor_pl,
    RI: participant.skor_ri,
    ME: participant.skor_me,
    IMP: participant.skor_imp,
    TW: participant.skor_tw,
    CF: participant.skor_cf,
  };

  const peranInfo = tentukanPeran(skor);
  const totalSkor = Object.values(skor).reduce((a, b) => a + b, 0);

  const roleUtama = BELBIN_ROLES[participant.peran_utama as Role];
  const roleSekunder = BELBIN_ROLES[participant.peran_sekunder as Role];

  const dateFormatted = new Date(participant.created_at).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 w-full">
      {/* Baris Navigasi Atas & Tombol Hapus */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          href="/admin"
          className="text-xs font-bold text-forest hover:text-forest-hover transition flex items-center space-x-1.5 bg-forest-light px-3.5 py-2 rounded-xl border border-forest-border shadow-2xs"
        >
          <span>←</span>
          <span>Kembali ke Rekapitulasi</span>
        </Link>
        <DeleteParticipantButton id={participant.id} nama={participant.nama} />
      </div>

      {/* Identitas Peserta */}
      <div className="bg-white rounded-2xl p-4 sm:p-7 border border-zinc-200/90 shadow-xs space-y-5">
        <div className="border-b border-zinc-100 pb-4">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-forest"></span>
                <span className="text-[11px] font-bold text-forest uppercase tracking-wider">
                  Hasil Evaluasi Peserta
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-dark">
                {participant.nama}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                {participant.jabatan} • Departemen <strong className="text-zinc-700">{participant.departemen}</strong>
              </p>
            </div>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60">
              Waktu Pengisian: {dateFormatted}
            </span>
          </div>
        </div>

        {/* Ringkasan Dua Peran Teratas dengan Icon Hewan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Peran Utama */}
          <div className="p-4 sm:p-5 rounded-2xl bg-forest-light/60 border border-forest-border space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest">
                  ★ PERAN UTAMA (SKOR TERTINGGI)
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-forest text-white">
                  Kelompok {roleUtama?.kelompok}
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs border border-forest/20">
                  <img
                    src={roleUtama?.gambar}
                    alt={roleUtama?.hewan}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-dark leading-tight">
                      {roleUtama?.nama} <span className="font-bold text-zinc-500">({participant.peran_utama})</span>
                    </h3>
                    <span className="text-xs font-extrabold text-forest bg-white px-2.5 py-0.5 rounded-full border border-forest/20 shrink-0 shadow-2xs">
                      {skor[participant.peran_utama as Role]} Poin
                    </span>
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-forest font-bold text-[11px] mt-1 border border-forest/20">
                    Karakter: {roleUtama?.hewan}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-forest-border/60 pt-2.5">
              <p className="text-xs text-zinc-700 leading-relaxed text-justify">
                {roleUtama?.deskripsi}
              </p>
            </div>
          </div>

          {/* Peran Sekunder */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-600">
                  » PERAN SEKUNDER
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                  Kelompok {roleSekunder?.kelompok}
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs border border-zinc-200">
                  <img
                    src={roleSekunder?.gambar}
                    alt={roleSekunder?.hewan}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-dark leading-tight">
                      {roleSekunder?.nama} <span className="font-bold text-zinc-500">({participant.peran_sekunder})</span>
                    </h3>
                    <span className="text-xs font-extrabold text-zinc-700 bg-white px-2.5 py-0.5 rounded-full border border-zinc-200 shrink-0 shadow-2xs">
                      {skor[participant.peran_sekunder as Role]} Poin
                    </span>
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-zinc-700 font-bold text-[11px] mt-1 border border-zinc-200">
                    Karakter: {roleSekunder?.hewan}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200/80 pt-2.5">
              <p className="text-xs text-zinc-700 leading-relaxed text-justify">
                {roleSekunder?.deskripsi}
              </p>
            </div>
          </div>
        </div>

        {/* Indikator Skor Seri */}
        {(peranInfo.seri.length > 1 || peranInfo.utamaSeri) && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
            <span className="font-bold flex items-center space-x-1.5">
              <span>⚡</span>
              <span>Catatan Skor Seri:</span>
            </span>
            {peranInfo.utamaSeri ? (
              <p>
                Skor Peran Utama sama dengan Peran Sekunder ({skor[peranInfo.utama]} poin).
                {peranInfo.seri.filter((r) => r !== participant.peran_sekunder).length > 0 && (
                  <span>
                    {" "}Terdapat peran lain dengan nilai yang sama:{" "}
                    <strong>
                      {peranInfo.seri
                        .filter((r) => r !== participant.peran_sekunder)
                        .map((r) => `${BELBIN_ROLES[r].nama} (${r})`)
                        .join(", ")}
                    </strong>.
                  </span>
                )}
              </p>
            ) : (
              <p>
                Terdapat peran lain dengan nilai yang sama pada posisi kedua:{" "}
                <strong>
                  {peranInfo.seri
                    .filter((r) => r !== participant.peran_sekunder)
                    .map((r) => `${BELBIN_ROLES[r].nama} (${r})`)
                    .join(", ")}
                </strong>.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Distribusi Nilai 8 Peran Tim dengan Icon Hewan */}
      <div className="bg-white rounded-2xl p-4 sm:p-7 border border-zinc-200/90 shadow-xs space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-b border-zinc-100 pb-3 gap-2">
          <div>
            <h2 className="text-base font-bold text-dark">
              Distribusi Skor 8 Peran Tim
            </h2>
            <p className="text-zinc-500 text-xs mt-0.5">
              Akumulasi poin dari 7 bagian kuesioner
            </p>
          </div>
          <span className="text-dark font-bold bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200 self-start sm:self-auto shrink-0">
            Total {totalSkor} / 70 poin
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {ROLES.map((roleKey) => {
            const role = BELBIN_ROLES[roleKey];
            const nilai = skor[roleKey];
            const isUtama = roleKey === participant.peran_utama;
            const isSekunder = roleKey === participant.peran_sekunder;
            const percentage = Math.round((nilai / 70) * 100);

            return (
              <div key={roleKey} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <img
                      src={role.gambar}
                      alt={role.hewan}
                      className="w-5 h-5 rounded-full object-cover shrink-0 border border-zinc-200 shadow-2xs"
                    />
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

      {/* Uraian Detail Profil Peran Standar Belbin (4 Komponen Resmi) */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-dark flex items-center space-x-2">
          <span>📋</span>
          <span>Uraian Lengkap Profil Peran (Standar Resmi Belbin SPI)</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Kartu Peran Utama */}
          {roleUtama && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-forest/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-2xs border border-forest/30 bg-forest-light">
                    <img
                      src={roleUtama.gambar}
                      alt={roleUtama.hewan}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-base">
                      {roleUtama.nama} ({roleUtama.kode})
                    </h3>
                    <p className="text-[11px] text-forest font-semibold">Peran Utama • Karakter: {roleUtama.hewan}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-forest-light text-forest border border-forest-border shrink-0">
                  {roleUtama.kelompok} Role
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-zinc-900 flex items-center space-x-1.5 mb-1 text-xs uppercase tracking-wider text-forest">
                    <span>📌</span>
                    <span>Karakteristik (Characteristics)</span>
                  </h4>
                  <p className="text-zinc-600 leading-relaxed bg-zinc-50/80 p-3 rounded-xl border border-zinc-100">
                    {roleUtama.karakteristik}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 flex items-center space-x-1.5 mb-1 text-xs uppercase tracking-wider text-forest">
                    <span>🎯</span>
                    <span>Fungsi dalam Tim (Function)</span>
                  </h4>
                  <p className="text-zinc-600 leading-relaxed bg-zinc-50/80 p-3 rounded-xl border border-zinc-100">
                    {roleUtama.fungsi}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 flex items-center space-x-1.5 mb-1 text-xs uppercase tracking-wider text-forest">
                    <span>⭐</span>
                    <span>Kekuatan Utama (Strengths)</span>
                  </h4>
                  <p className="text-zinc-600 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-emerald-950">
                    {roleUtama.kekuatan}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 flex items-center space-x-1.5 mb-1 text-xs uppercase tracking-wider text-amber-800">
                    <span>⚠️</span>
                    <span>Area Pengawasan / Kelemahan (Allowable Weaknesses)</span>
                  </h4>
                  <p className="text-zinc-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-amber-950">
                    {roleUtama.kelemahan}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Kartu Peran Sekunder */}
          {roleSekunder && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-zinc-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-2xs border border-zinc-200 bg-zinc-100">
                    <img
                      src={roleSekunder.gambar}
                      alt={roleSekunder.hewan}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-base">
                      {roleSekunder.nama} ({roleSekunder.kode})
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-semibold">Peran Sekunder • Karakter: {roleSekunder.hewan}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 shrink-0">
                  {roleSekunder.kelompok} Role
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-zinc-900 flex items-center space-x-1.5 mb-1 text-xs uppercase tracking-wider text-zinc-700">
                    <span>📌</span>
                    <span>Karakteristik (Characteristics)</span>
                  </h4>
                  <p className="text-zinc-600 leading-relaxed bg-zinc-50/80 p-3 rounded-xl border border-zinc-100">
                    {roleSekunder.karakteristik}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 flex items-center space-x-1.5 mb-1 text-xs uppercase tracking-wider text-zinc-700">
                    <span>🎯</span>
                    <span>Fungsi dalam Tim (Function)</span>
                  </h4>
                  <p className="text-zinc-600 leading-relaxed bg-zinc-50/80 p-3 rounded-xl border border-zinc-100">
                    {roleSekunder.fungsi}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 flex items-center space-x-1.5 mb-1 text-xs uppercase tracking-wider text-zinc-700">
                    <span>⭐</span>
                    <span>Kekuatan Utama (Strengths)</span>
                  </h4>
                  <p className="text-zinc-600 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-emerald-950">
                    {roleSekunder.kekuatan}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 flex items-center space-x-1.5 mb-1 text-xs uppercase tracking-wider text-amber-800">
                    <span>⚠️</span>
                    <span>Area Pengawasan / Kelemahan (Allowable Weaknesses)</span>
                  </h4>
                  <p className="text-zinc-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-amber-950">
                    {roleSekunder.kelemahan}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
