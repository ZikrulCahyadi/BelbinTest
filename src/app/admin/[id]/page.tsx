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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
      {/* Baris Navigasi Atas & Tombol Hapus */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="text-xs font-bold text-forest hover:text-forest-hover transition flex items-center space-x-1.5 bg-forest-light px-3 py-1.5 rounded-xl border border-forest-border shadow-2xs"
        >
          <span>←</span>
          <span>Kembali ke Rekapitulasi</span>
        </Link>
        <DeleteParticipantButton id={participant.id} nama={participant.nama} />
      </div>

      {/* Identitas Peserta */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-xs space-y-5">
        <div className="border-b border-zinc-100 pb-4">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-forest"></span>
                <span className="text-[11px] font-bold text-forest uppercase tracking-wider">
                  Hasil Evaluasi Peserta
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-dark">
                {participant.nama}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                {participant.jabatan} • Departemen {participant.departemen}
              </p>
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              Waktu Pengisian: {dateFormatted}
            </span>
          </div>
        </div>

        {/* Ringkasan Dua Peran Teratas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Peran Utama */}
          <div className="p-5 rounded-xl bg-forest-light/60 border border-forest-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                Peran Utama (Skor Tertinggi)
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-forest text-white">
                Kelompok {roleUtama?.kelompok}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-lg font-extrabold text-dark">
                {roleUtama?.nama} <span className="text-xs text-zinc-500 font-normal">({participant.peran_utama})</span>
              </div>
              <span className="text-sm font-bold text-forest">
                {skor[participant.peran_utama as Role]} Poin
              </span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed pt-1">
              {roleUtama?.deskripsi}
            </p>
          </div>

          {/* Peran Sekunder */}
          <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                Peran Sekunder
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                Kelompok {roleSekunder?.kelompok}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-lg font-extrabold text-dark">
                {roleSekunder?.nama} <span className="text-xs text-zinc-500 font-normal">({participant.peran_sekunder})</span>
              </div>
              <span className="text-sm font-bold text-zinc-700">
                {skor[participant.peran_sekunder as Role]} Poin
              </span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed pt-1">
              {roleSekunder?.deskripsi}
            </p>
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
              <p>Skor Peran Utama sama dengan Peran Sekunder ({skor[peranInfo.utama]} poin).</p>
            ) : (
              <p>
                Terdapat peran lain dengan nilai yang sama pada posisi kedua:{" "}
                <strong>{peranInfo.seri.map((r) => `${BELBIN_ROLES[r].nama} (${r})`).join(", ")}</strong>.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Distribusi Nilai 8 Peran Tim */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between text-xs border-b border-zinc-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-dark">
              Distribusi Skor 8 Peran Tim
            </h2>
            <p className="text-zinc-500 text-xs mt-0.5">
              Akumulasi poin dari 7 bagian kuesioner
            </p>
          </div>
          <span className="text-dark font-bold bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
            Total {totalSkor} / 70 poin
          </span>
        </div>

        <div className="space-y-3.5 pt-1">
          {ROLES.map((roleKey) => {
            const role = BELBIN_ROLES[roleKey];
            const nilai = skor[roleKey];
            const isUtama = roleKey === participant.peran_utama;
            const isSekunder = roleKey === participant.peran_sekunder;
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

      {/* Uraian Detail Profil Peran Standar Belbin (4 Komponen Resmi) */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-dark flex items-center space-x-2">
          <span>📋</span>
          <span>Uraian Lengkap Profil Peran (Standar Resmi Belbin SPI)</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Kartu Peran Utama */}
          {roleUtama && (
            <div className="bg-white rounded-2xl p-6 border-2 border-forest/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-8 h-8 rounded-lg bg-forest text-white font-extrabold flex items-center justify-center text-xs">
                    {roleUtama.kode}
                  </span>
                  <div>
                    <h3 className="font-bold text-dark text-base">
                      {roleUtama.nama}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium">Peran Utama Terpilih</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-forest-light text-forest border border-forest-border">
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
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-8 h-8 rounded-lg bg-zinc-700 text-white font-extrabold flex items-center justify-center text-xs">
                    {roleSekunder.kode}
                  </span>
                  <div>
                    <h3 className="font-bold text-dark text-base">
                      {roleSekunder.nama}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium">Peran Sekunder (Pendukung)</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
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
