import { describe, expect, it } from "vitest";
import { ROLES, SCORING_KEY, SECTION_KODE } from "./scoring-key";
import { SECTIONS } from "./questions";
import { validateJawaban, validateSection, type Jawaban } from "./validate";
import { hitungSkor, tentukanPeran } from "./score";

// Contoh jawaban dari gambar tabel Scoring Key (nomor pernyataan -> poin)
const CONTOH: Jawaban = {
  A: { 3: 6, 5: 4 },
  B: { 1: 3, 7: 5, 3: 2 },
  C: { 2: 6, 5: 4 },
  D: { 6: 5, 1: 5 },
  E: { 7: 6, 3: 4 },
  F: { 6: 7, 7: 3 },
  G: { 7: 3, 8: 7 },
};

describe("kunci skoring", () => {
  it("tiap section memetakan nomor 1-8 tepat satu kali", () => {
    for (const kode of SECTION_KODE) {
      const nomor = ROLES.map((r) => SCORING_KEY[kode][r]).sort((a, b) => a - b);
      expect(nomor).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    }
  });

  it("jumlah nomor per peran cocok dengan baris TOTAL pada tabel sumber", () => {
    const harapan = { SH: 30, CO: 36, PL: 33, RI: 31, ME: 25, IMP: 27, TW: 44, CF: 26 };
    for (const role of ROLES) {
      const jumlah = SECTION_KODE.reduce((s, k) => s + SCORING_KEY[k][role], 0);
      expect(jumlah).toBe(harapan[role]);
    }
  });

  it("tiap section punya 8 pernyataan bernomor 1-8", () => {
    for (const s of SECTIONS) {
      expect(s.pernyataan.map((p) => p.no)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    }
  });
});

describe("hitungSkor & tentukanPeran", () => {
  it("kasus uji dari contoh tabel", () => {
    const skor = hitungSkor(CONTOH);
    expect(skor).toEqual({ SH: 16, CO: 3, PL: 5, RI: 12, ME: 8, IMP: 14, TW: 12, CF: 0 });
    expect(Object.values(skor).reduce((a, b) => a + b, 0)).toBe(70);

    const peran = tentukanPeran(skor);
    expect(peran.utama).toBe("SH");
    expect(peran.sekunder).toBe("IMP");
    expect(peran.seri).toEqual(["IMP"]);
    expect(peran.utamaSeri).toBe(false);
  });

  it("menandai seri di posisi kedua", () => {
    const peran = tentukanPeran({ SH: 20, CO: 15, PL: 15, RI: 10, ME: 10, IMP: 0, TW: 0, CF: 0 });
    expect(peran.utama).toBe("SH");
    expect(peran.seri).toEqual(["CO", "PL"]);
  });
});

describe("validateSection", () => {
  it("valid: total 10 dari 3 pernyataan", () => {
    expect(validateSection({ 1: 5, 2: 3, 3: 2 }).valid).toBe(true);
  });
  it("kurang dari 10 -> peringatan kekurangan", () => {
    const h = validateSection({ 1: 4, 2: 3 });
    expect(h.valid).toBe(false);
    expect(h.pesan[0]).toBe("Total poin baru 7. Kurang 3 poin lagi agar genap 10.");
  });
  it("lebih dari 10 -> peringatan kelebihan", () => {
    const h = validateSection({ 1: 6, 2: 6 });
    expect(h.pesan[0]).toBe("Total poin 12, melebihi 10 sebanyak 2.");
  });
  it("lebih dari 3 pernyataan berpoin ditolak walau total 10", () => {
    const h = validateSection({ 1: 3, 2: 3, 3: 2, 4: 2 });
    expect(h.valid).toBe(false);
    expect(h.pesan).toContain("Maksimal 3 pernyataan yang boleh diberi poin.");
  });
  it("menolak poin negatif, desimal, dan nomor di luar 1-8", () => {
    expect(validateSection({ 1: -1, 2: 11 }).valid).toBe(false);
    expect(validateSection({ 1: 2.5, 2: 7.5 }).valid).toBe(false);
    expect(validateSection({ 9: 10 }).valid).toBe(false);
  });
});

describe("validateJawaban", () => {
  it("contoh tabel lolos semua section", () => {
    expect(validateJawaban(CONTOH).valid).toBe(true);
  });
  it("section yang belum diisi ditolak", () => {
    const { A, ...sisa } = CONTOH;
    expect(validateJawaban(sisa).valid).toBe(false);
  });
});
