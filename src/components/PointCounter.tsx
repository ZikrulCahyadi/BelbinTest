import { HasilValidasi, TOTAL_POIN } from "@/lib/belbin/validate";

interface PointCounterProps {
  hasil: HasilValidasi;
}

export function PointCounter({ hasil }: PointCounterProps) {
  const isPerfect = hasil.total === TOTAL_POIN && hasil.valid;
  const isOver = hasil.total > TOTAL_POIN;
  const isOverCount = hasil.terisi > 3;

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all ${
        isPerfect
          ? "bg-forest-light/60 border-forest-border ring-1 ring-forest/20"
          : isOver || isOverCount
          ? "bg-rose-50/80 border-rose-200 ring-1 ring-rose-200/50"
          : "bg-white border-zinc-200/90"
      }`}
    >
      <div className="flex items-center justify-between text-xs mb-2.5">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-dark">
            Alokasi Poin Bagian Ini
          </span>
          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            (Total harus pas 10 poin, maks. 3 pernyataan)
          </span>
        </div>

        <span
          className={`font-bold px-2.5 py-0.5 rounded-full text-xs transition ${
            isPerfect
              ? "bg-forest text-white"
              : isOver || isOverCount
              ? "bg-rose-600 text-white"
              : "bg-zinc-100 text-dark border border-zinc-200"
          }`}
        >
          {hasil.total} / {TOTAL_POIN} Poin
        </span>
      </div>

      {/* Progress Bar Dinamis */}
      <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden border border-zinc-200/60">
        <div
          className={`h-2.5 rounded-full transition-all duration-200 ${
            isPerfect
              ? "bg-forest"
              : isOver
              ? "bg-rose-500"
              : "bg-forest"
          }`}
          style={{ width: `${Math.min(100, (hasil.total / TOTAL_POIN) * 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2.5">
        <span>
          Pernyataan dipilih:{" "}
          <strong
            className={
              isOverCount
                ? "text-rose-600 font-bold"
                : hasil.terisi === 3
                ? "text-forest font-bold"
                : "text-dark font-bold"
            }
          >
            {hasil.terisi} dari maks. 3
          </strong>
        </span>
        <span>
          Sisa poin:{" "}
          <strong className="text-dark font-bold">
            {Math.max(0, TOTAL_POIN - hasil.total)} poin
          </strong>
        </span>
      </div>

      {!hasil.valid && hasil.pesan.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-rose-100 text-xs text-rose-700 space-y-1">
          {hasil.pesan.map((pesan, idx) => (
            <p key={idx} className="font-medium flex items-center space-x-1.5">
              <span className="text-rose-500 font-bold">•</span>
              <span>{pesan}</span>
            </p>
          ))}
        </div>
      )}

      {isPerfect && (
        <div className="mt-2.5 pt-2 border-t border-forest-border text-xs text-forest font-semibold flex items-center space-x-1.5">
          <span>✓</span>
          <span>Alokasi tepat 10 poin pada {hasil.terisi} pernyataan. Anda dapat melanjutkan.</span>
        </div>
      )}
    </div>
  );
}
