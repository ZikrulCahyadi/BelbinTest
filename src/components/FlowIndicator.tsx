interface FlowIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { step: 1, label: "Data Diri" },
  { step: 2, label: "Tes (7 Bagian)" },
  { step: 3, label: "Selesai" },
] as const;

export function FlowIndicator({ currentStep }: FlowIndicatorProps) {
  return (
    <nav aria-label="Alur Pengerjaan Tes" className="w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Garis penghubung di belakang lingkaran */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-200 -z-0" aria-hidden="true">
          <div
            className="h-full bg-forest transition-all duration-300"
            style={{
              width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
            }}
          />
        </div>

        {STEPS.map((s) => {
          const isDone = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <div key={s.step} className="flex flex-col items-center relative z-10">
              {/* Lingkaran Step */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-forest text-white ring-4 ring-forest-light shadow-2xs"
                    : isDone
                    ? "bg-forest text-white"
                    : "bg-zinc-200 text-zinc-500"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isDone ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.step
                )}
              </div>

              {/* Label di bawah lingkaran */}
              <span
                className={`text-[11px] sm:text-xs font-bold mt-2 transition-colors ${
                  isCurrent
                    ? "text-dark"
                    : isDone
                    ? "text-forest"
                    : "text-zinc-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
