"use client";

import { useState, useId, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FlowIndicator } from "@/components/FlowIndicator";

export default function HomePage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [departemen, setDepartemen] = useState("");
  const [jabatan, setJabatan] = useState("");

  // Cek apakah peserta sudah pernah menyelesaikan tes sebelumnya
  useEffect(() => {
    try {
      const saved = localStorage.getItem("belbin_hasil_tes");
      if (saved) {
        router.replace("/selesai");
      }
    } catch {
      // safe check
    }
  }, [router]);

  const [touched, setTouched] = useState<{
    nama?: boolean;
    departemen?: boolean;
    jabatan?: boolean;
  }>({});

  const namaId = useId();
  const departemenId = useId();
  const jabatanId = useId();

  // Validasi nilai
  const trimNama = nama.trim();
  const trimDept = departemen.trim();
  const trimJabatan = jabatan.trim();

  const isNamaValid = trimNama.length > 0;
  const isDeptValid = trimDept.length > 0;
  const isJabatanValid = trimJabatan.length > 0;

  const isFormValid = isNamaValid && isDeptValid && isJabatanValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tandai semua field telah disentuh
    setTouched({
      nama: true,
      departemen: true,
      jabatan: true,
    });

    if (!isFormValid) return;

    try {
      sessionStorage.setItem(
        "belbin_identitas",
        JSON.stringify({
          nama: trimNama,
          departemen: trimDept,
          jabatan: trimJabatan,
        })
      );
      router.push("/tes");
    } catch {
      // Fallback peramban jika storage dibatasi
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gelombang Organik Dekoratif di sudut atas (kiri & kanan) */}
      <div
        className="pointer-events-none fixed top-0 left-0 -z-10 w-72 sm:w-96 h-72 sm:h-96 opacity-40 select-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <circle cx="100" cy="50" r="280" fill="#C8E6C9" opacity="0.45" />
          <circle cx="50" cy="0" r="200" fill="#A5D6A7" opacity="0.55" />
          <circle cx="0" cy="0" r="130" fill="#81C784" opacity="0.65" />
        </svg>
      </div>
      <div
        className="pointer-events-none fixed top-0 right-0 -z-10 w-72 sm:w-96 h-72 sm:h-96 opacity-40 select-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <circle cx="300" cy="50" r="280" fill="#C8E6C9" opacity="0.45" />
          <circle cx="350" cy="0" r="200" fill="#A5D6A7" opacity="0.55" />
          <circle cx="400" cy="0" r="130" fill="#81C784" opacity="0.65" />
        </svg>
      </div>

      <div className="space-y-6 sm:space-y-7 max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* 1. Indikator Alur */}
        <div className="pt-1">
          <FlowIndicator currentStep={1} />
        </div>

        {/* 2. Hero Header */}
        <section aria-labelledby="hero-title" className="space-y-2 text-center pt-2">
          <h1
            id="hero-title"
            className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight leading-tight"
          >
            Kenali Peran Anda dalam Tim
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto">
            Tes ini membantu mengenali peran yang biasa Anda ambil saat bekerja dalam tim.
            <br className="hidden sm:inline" /> Tidak ada jawaban benar atau salah.
          </p>
        </section>

        {/* 3. Kartu "Cara Mengisi Kuesioner" */}
        <section
          aria-labelledby="petunjuk-title"
          className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden relative"
        >
          {/* Header Tab Hijau Kiri Atas */}
          <div className="inline-flex items-center space-x-2 bg-[#13583B] text-white px-5 py-2.5 rounded-br-2xl font-bold text-xs sm:text-sm shadow-xs">
            <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h2 id="petunjuk-title" className="tracking-tight">
              Cara Mengisi Kuesioner
            </h2>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              {/* 3 Poin Aturan Pengisian */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#13583B] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    Ada <strong>7 bagian</strong>, tiap bagian berisi <strong>8 pernyataan</strong>.
                  </p>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#13583B] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    Bagikan tepat <strong>10 poin</strong> ke maksimal <strong>3 pernyataan</strong> yang paling menggambarkan Anda, sisanya 0.
                  </p>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#13583B] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    Estimasi waktu pengerjaan sekitar <strong>10 menit</strong>.
                  </p>
                </div>
              </div>

              {/* Ilustrasi Clipboard dengan Checkmark & Sparkle */}
              <div className="hidden md:flex shrink-0 items-center justify-center pl-2">
                <div className="relative w-16 h-20">
                  <div className="absolute inset-0 bg-[#EAF5EF] rounded-xl border-2 border-[#81C784] shadow-2xs rotate-3 flex flex-col items-center pt-4 px-2 space-y-1.5">
                    <div className="w-full flex items-center space-x-1">
                      <span className="text-[#2E7D32] font-extrabold text-[9px]">✓</span>
                      <span className="h-1 flex-1 bg-[#A5D6A7] rounded-full"></span>
                    </div>
                    <div className="w-full flex items-center space-x-1">
                      <span className="text-[#2E7D32] font-extrabold text-[9px]">✓</span>
                      <span className="h-1 flex-1 bg-[#A5D6A7] rounded-full"></span>
                    </div>
                    <div className="w-full flex items-center space-x-1">
                      <span className="text-[#2E7D32] font-extrabold text-[9px]">✓</span>
                      <span className="h-1 flex-1 bg-[#A5D6A7] rounded-full"></span>
                    </div>
                  </div>
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-[#13583B] rounded-sm flex items-center justify-center">
                    <div className="w-3 h-1 bg-white/70 rounded-full"></div>
                  </div>
                  <div className="absolute -top-2 -right-1 text-xs select-none">
                    ✨
                  </div>
                </div>
              </div>
            </div>

            {/* Strip Contoh Alokasi */}
            <div className="bg-[#EAF5EF] rounded-2xl px-4 py-2.5 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-700">
              <span className="text-zinc-600 font-medium">Contoh alokasi:</span>
              <span className="w-6 h-6 rounded-md bg-white border border-zinc-200/90 font-bold text-dark flex items-center justify-center shadow-2xs">
                6
              </span>
              <span className="text-zinc-400 font-bold">+</span>
              <span className="w-6 h-6 rounded-md bg-white border border-zinc-200/90 font-bold text-dark flex items-center justify-center shadow-2xs">
                3
              </span>
              <span className="text-zinc-400 font-bold">+</span>
              <span className="w-6 h-6 rounded-md bg-white border border-zinc-200/90 font-bold text-dark flex items-center justify-center shadow-2xs">
                1
              </span>
              <span className="text-zinc-400 font-bold">=</span>
              <span className="font-extrabold text-[#13583B] text-sm tracking-tight">
                10 poin
              </span>
            </div>
          </div>
        </section>

        {/* 4. Form Data Diri Peserta */}
        <section
          aria-labelledby="form-title"
          className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden"
        >
          {/* Header Banner Hijau Penuh dengan Aksen Gelombang */}
          <div className="bg-[#13583B] text-white px-6 py-3.5 flex items-center space-x-2.5 font-bold text-sm sm:text-base relative overflow-hidden">
            <svg
              className="absolute right-0 top-0 h-full w-48 text-[#1b6d4b] pointer-events-none opacity-60"
              preserveAspectRatio="none"
              viewBox="0 0 200 60"
              fill="currentColor"
            >
              <path d="M0,0 C70,40 120,10 200,60 L200,0 Z" />
            </svg>

            <div className="relative z-10 flex items-center space-x-2.5">
              <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 id="form-title" className="tracking-tight font-bold">
                Data Diri Peserta
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-7 space-y-4 sm:space-y-4.5">
            {/* Field Nama Lengkap */}
            <div>
              <label
                htmlFor={namaId}
                className="block text-xs font-bold text-dark uppercase tracking-wider mb-1.5"
              >
                Nama Lengkap <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <svg
                  className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  id={namaId}
                  name="nama"
                  type="text"
                  autoComplete="name"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, nama: true }))}
                  aria-invalid={touched.nama && !isNamaValid ? "true" : undefined}
                  aria-describedby={touched.nama && !isNamaValid ? `${namaId}-error` : undefined}
                  placeholder="Masukkan nama lengkap Anda"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    touched.nama && !isNamaValid
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-zinc-300 focus:border-[#13583B] focus:ring-[#13583B]/20"
                  }`}
                />
              </div>
              {touched.nama && !isNamaValid && (
                <p
                  id={`${namaId}-error`}
                  role="alert"
                  aria-live="polite"
                  className="text-xs text-red-600 mt-1.5 font-medium flex items-center space-x-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Nama lengkap wajib diisi.</span>
                </p>
              )}
            </div>

            {/* Field Departemen (Input Teks Bebas) */}
            <div>
              <label
                htmlFor={departemenId}
                className="block text-xs font-bold text-dark uppercase tracking-wider mb-1.5"
              >
                Departemen / Divisi <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <svg
                  className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  id={departemenId}
                  name="departemen"
                  type="text"
                  required
                  value={departemen}
                  onChange={(e) => setDepartemen(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, departemen: true }))}
                  aria-invalid={touched.departemen && !isDeptValid ? "true" : undefined}
                  aria-describedby={
                    touched.departemen && !isDeptValid ? `${departemenId}-error` : undefined
                  }
                  placeholder="Contoh: Downstream"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition bg-white text-dark placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    touched.departemen && !isDeptValid
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-zinc-300 focus:border-[#13583B] focus:ring-[#13583B]/20"
                  }`}
                />
              </div>
              {touched.departemen && !isDeptValid && (
                <p
                  id={`${departemenId}-error`}
                  role="alert"
                  aria-live="polite"
                  className="text-xs text-red-600 mt-1.5 font-medium flex items-center space-x-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Departemen / divisi wajib diisi.</span>
                </p>
              )}
            </div>

            {/* Field Jabatan */}
            <div>
              <label
                htmlFor={jabatanId}
                className="block text-xs font-bold text-dark uppercase tracking-wider mb-1.5"
              >
                Jabatan <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <svg
                  className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 3l-1.5 5.5l2 8.5l-3.5 3l-3.5 -3l2 -8.5l-1.5 -5.5z" />
                </svg>
                <input
                  id={jabatanId}
                  name="jabatan"
                  type="text"
                  autoComplete="organization-title"
                  required
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, jabatan: true }))}
                  aria-invalid={touched.jabatan && !isJabatanValid ? "true" : undefined}
                  aria-describedby={
                    touched.jabatan && !isJabatanValid ? `${jabatanId}-error` : undefined
                  }
                  placeholder="Contoh: Staff, Supervisor, atau Manager"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    touched.jabatan && !isJabatanValid
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-zinc-300 focus:border-[#13583B] focus:ring-[#13583B]/20"
                  }`}
                />
              </div>
              {touched.jabatan && !isJabatanValid && (
                <p
                  id={`${jabatanId}-error`}
                  role="alert"
                  aria-live="polite"
                  className="text-xs text-red-600 mt-1.5 font-medium flex items-center space-x-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Jabatan wajib diisi.</span>
                </p>
              )}
            </div>

            {/* Tombol Utama */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full h-12 min-h-[48px] rounded-xl font-bold text-sm sm:text-base text-white transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#13583B] focus:ring-offset-2 ${
                  isFormValid
                    ? "bg-[#13583B] hover:bg-[#0f442e] active:bg-[#0a3121] cursor-pointer shadow-xs"
                    : "bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-90"
                }`}
              >
                <span>Mulai Mengerjakan Tes</span>
                <span>→</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
