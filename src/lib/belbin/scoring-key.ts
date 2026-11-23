export const ROLES = ["SH", "CO", "PL", "RI", "ME", "IMP", "TW", "CF"] as const;
export type Role = (typeof ROLES)[number];

export const SECTION_KODE = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type SectionKode = (typeof SECTION_KODE)[number];

export const VERSI_KUNCI = "v1";

// Nilai = NOMOR pernyataan di section tsb yang poinnya dijumlahkan ke peran itu.
// Sumber: tabel "Scoring Key for Self Perception Inventory" (kolom kiri tiap peran).
export const SCORING_KEY: Record<SectionKode, Record<Role, number>> = {
  A: { SH: 3, CO: 7, PL: 4, RI: 6, ME: 5, IMP: 1, TW: 8, CF: 2 },
  B: { SH: 1, CO: 6, PL: 5, RI: 8, ME: 4, IMP: 7, TW: 3, CF: 2 },
  C: { SH: 7, CO: 4, PL: 6, RI: 2, ME: 3, IMP: 5, TW: 8, CF: 1 },
  D: { SH: 2, CO: 3, PL: 6, RI: 4, ME: 5, IMP: 1, TW: 8, CF: 7 },
  E: { SH: 6, CO: 5, PL: 1, RI: 7, ME: 3, IMP: 4, TW: 2, CF: 8 },
  F: { SH: 6, CO: 4, PL: 5, RI: 1, ME: 3, IMP: 8, TW: 7, CF: 2 },
  G: { SH: 5, CO: 7, PL: 6, RI: 3, ME: 2, IMP: 1, TW: 8, CF: 4 },
};
