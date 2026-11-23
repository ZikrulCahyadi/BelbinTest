/**
 * Daftar departemen/divisi standar untuk tes peran tim Belbin.
 * CATATAN: Sesuaikan daftar ini dengan struktur organisasi atau divisi di perusahaan Anda.
 */
export const DAFTAR_DEPARTEMEN = [
  "Operasional",
  "HR",
  "Finance",
  "IT",
  "Produksi",
  "Lainnya",
] as const;

export type Departemen = (typeof DAFTAR_DEPARTEMEN)[number];

