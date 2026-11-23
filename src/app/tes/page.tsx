"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS } from "@/lib/belbin/questions";
import { SECTION_KODE } from "@/lib/belbin/scoring-key";
import { validateSection, type SectionAnswer, type Jawaban } from "@/lib/belbin/validate";
import { PointCounter } from "@/components/PointCounter";
import { FlowIndicator } from "@/components/FlowIndicator";
import { submitTes } from "@/actions/submit-tes";

export default function TesPage() {
  const router = useRouter();

  const [identitas, setIdentitas] = useState<{
    nama: string;
    departemen: string;
    jabatan: string;
  } | null>(null);
  const [identitasChecked, setIdentitasChecked] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [jawaban, setJawaban] = useState<Jawaban>(() => {
    const initial = {} as Jawaban;
    for (const kode of SECTION_KODE) {
      initial[kode] = {};
    }
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("belbin_identitas");
      if (!stored) {
        router.replace("/");
        return;
      }
      const parsed = JSON.parse(stored);
      if (!parsed.nama || !parsed.departemen || !parsed.jabatan) {
        router.replace("/");
        return;
      }
      setIdentitas(parsed);

      const savedJawaban = sessionStorage.getItem("belbin_jawaban");
      if (savedJawaban) {
        setJawaban(JSON.parse(savedJawaban));
      }
    } catch {
      router.replace("/");
    } finally {
      setIdentitasChecked(true);
    }
  }, [router]);

  const handleUpdatePoin = (no: number, valInt: number) => {
    const currentKode = SECTION_KODE[currentIndex];
    const parsed = isNaN(valInt) || valInt < 0 ? 0 : valInt;

    const currentSection = { ...(jawaban[currentKode] || {}) };
    const currentVal = currentSection[no] || 0;
    const isCurrentlySelected = currentVal > 0;

    // Hitung berapa banyak pernyataan yang sedang aktif (>0)
    const activeSelectedCount = Object.values(currentSection).filter((v) => v > 0).length;

    // KETAT: Jika pernyataan ini sebelumnya belum dipilih (0) dan kuota 3 pernyataan sudah penuh, tolak
    if (!isCurrentlySelected && parsed > 0 && activeSelectedCount >= 3) {
      return;
    }

    // Batasi nilai agar total poin pada section ini tidak melebihi 10
    const currentTotal = Object.values(currentSection).reduce((s, v) => s + v, 0);
    const maxForThis = currentVal + (10 - currentTotal);
    const validVal = Math.max(0, Math.min(parsed, maxForThis));

    if (validVal === 0) {
      delete currentSection[no];
    } else {
      currentSection[no] = validVal;
    }

    const updated = {
      ...jawaban,
      [currentKode]: currentSection,
    };

    setJawaban(updated);
    try {
      sessionStorage.setItem("belbin_jawaban", JSON.stringify(updated));
    } catch {
      // fail-safe
    }
  };

  const currentSection = SECTIONS[currentIndex];
  const currentKode = currentSection?.kode;
  const currentAnswers: SectionAnswer = jawaban[currentKode] || {};
  const hasilValidasi = validateSection(currentAnswers);

  const isFirstSection = currentIndex === 0;
  const isLastSection = currentIndex === SECTIONS.length - 1;

  const handleNext = () => {
    if (!hasilValidasi.valid) return;
    if (currentIndex < SECTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!hasilValidasi.valid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    const res = await submitTes(identitas, jawaban);

    if (res.success) {
      try {
        sessionStorage.removeItem("belbin_jawaban");
        sessionStorage.removeItem("belbin_identitas");
        if (res.hasil) {
          localStorage.setItem("belbin_hasil_tes", JSON.stringify(res.hasil));
        }
      } catch {
        // safe clear
      }
      router.push("/selesai");
    } else {
      setSubmitError(res.error || "Gagal menyimpan jawaban. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  if (!identitasChecked) {
    return (
      <div className="py-24 text-center text-xs text-zinc-400">
        Memuat lembar tes...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
      {/* Indikator Alur Reusable */}
      <FlowIndicator currentStep={2} />

      {/* Kartu Header Bagian & Stepper A-G */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-7 space-y-4">
        {/* Info Peserta Ringkas */}
        <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-100 pb-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-forest"></span>
            <span className="text-zinc-600 font-medium">Peserta:</span>
            <strong className="text-dark font-bold">{identitas?.nama}</strong>
            <span className="text-zinc-400 hidden sm:inline">({identitas?.departemen} - {identitas?.jabatan})</span>
          </div>
          <span className="text-forest font-bold bg-forest-light px-2.5 py-0.5 rounded-full text-[11px] border border-forest-border">
            Bagian {currentIndex + 1} dari 7
          </span>
        </div>

        {/* Stepper Bagian A sampai G */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {SECTIONS.map((sec, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const secAns = jawaban[sec.kode] || {};
            const isValidFilled = validateSection(secAns).valid;

            return (
              <button
                key={sec.kode}
                type="button"
                onClick={() => {
                  if (idx <= currentIndex || hasilValidasi.valid) {
                    setCurrentIndex(idx);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all text-center cursor-pointer ${
                  isCurrent
                    ? "bg-forest text-white ring-2 ring-forest/30"
                    : isDone || isValidFilled
                    ? "bg-forest-light text-forest border border-forest-border hover:bg-forest-light/80"
                    : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200/70"
                }`}
              >
                {sec.kode}
              </button>
            );
          })}
        </div>

        {/* Judul Bagian */}
        <div className="pt-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest mb-1">
            Bagian {currentSection.kode}
          </div>
          <h2 className="text-sm sm:text-base font-bold text-dark leading-snug">
            {currentSection.judul}
          </h2>
        </div>
      </div>

      {/* Point Counter Widget */}
      <PointCounter hasil={hasilValidasi} />

      {/* Daftar 8 Pernyataan */}
      <div className="space-y-3">
        {currentSection.pernyataan.map((item) => {
          const currentVal = currentAnswers[item.no] ?? 0;
          const isSelected = currentVal > 0;
          const isLimitReached = !isSelected && hasilValidasi.terisi >= 3;
          const isTotalReached = hasilValidasi.total >= 10;
          const isAddDisabled = isLimitReached || isTotalReached;

          return (
            <div
              key={item.no}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                isSelected
                  ? "border-forest border-l-4 bg-forest-light/20 shadow-xs"
                  : isLimitReached
                  ? "border-zinc-200/60 bg-zinc-50/60 opacity-60"
                  : "border-zinc-200/90 hover:border-zinc-300 bg-white"
              }`}
            >
              <div className="flex items-start space-x-3 flex-1">
                <span
                  className={`shrink-0 w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center mt-0.5 ${
                    isSelected
                      ? "bg-forest text-white"
                      : isLimitReached
                      ? "bg-zinc-200 text-zinc-400"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                  }`}
                >
                  {item.no}
                </span>
                <p
                  className={`text-xs sm:text-sm leading-relaxed font-medium ${
                    isLimitReached ? "text-zinc-500" : "text-dark"
                  }`}
                >
                  {item.teks}
                </p>
              </div>

              {/* Kontrol Stepper Angka */}
              <div
                className={`flex items-center space-x-1.5 self-end sm:self-center rounded-lg p-1 border ${
                  isLimitReached ? "bg-zinc-100 border-zinc-200" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleUpdatePoin(item.no, Math.max(0, currentVal - 1))}
                  disabled={currentVal <= 0}
                  className="w-8 h-8 rounded-md bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                  aria-label="Kurangi poin"
                >
                  −
                </button>

                <input
                  type="number"
                  min={0}
                  max={currentVal + Math.max(0, 10 - hasilValidasi.total)}
                  step={1}
                  disabled={isLimitReached}
                  value={currentVal === 0 ? "" : currentVal}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10);
                    handleUpdatePoin(item.no, isNaN(parsed) ? 0 : parsed);
                  }}
                  placeholder="0"
                  className={`w-12 h-8 text-center font-extrabold text-sm rounded-md border transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    isLimitReached
                      ? "bg-zinc-100/90 text-zinc-400 border-zinc-200 cursor-not-allowed"
                      : isSelected
                      ? "bg-white text-forest border-forest ring-1 ring-forest/20"
                      : "bg-white text-dark border-zinc-300 focus:outline-none focus:border-forest"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => handleUpdatePoin(item.no, currentVal + 1)}
                  disabled={isAddDisabled}
                  className="w-8 h-8 rounded-md bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                  aria-label="Tambah poin"
                  title={
                    isLimitReached
                      ? "Maksimal 3 pernyataan per bagian. Kurangi salah satu pernyataan lain terlebih dahulu."
                      : isTotalReached
                      ? "Total poin sudah pas 10."
                      : "Tambah poin"
                  }
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {submitError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
          {submitError}
        </div>
      )}

      {/* Navigasi Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirstSection || isSubmitting}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold border transition ${
            isFirstSection || isSubmitting
              ? "border-zinc-200 text-zinc-300 cursor-not-allowed bg-zinc-50"
              : "border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 cursor-pointer"
          }`}
        >
          ← Bagian Sebelumnya
        </button>

        {isLastSection ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasilValidasi.valid || isSubmitting}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
              !hasilValidasi.valid || isSubmitting
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                : "bg-forest hover:bg-forest-hover active:bg-[#144731] text-white cursor-pointer"
            }`}
          >
            {isSubmitting ? "Menyimpan Data..." : "Selesai & Kirim Jawaban ✓"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={!hasilValidasi.valid}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
              !hasilValidasi.valid
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                : "bg-forest hover:bg-forest-hover active:bg-[#144731] text-white cursor-pointer"
            }`}
          >
            Lanjut ke Bagian Berikutnya →
          </button>
        )}
      </div>
    </div>
  );
}
