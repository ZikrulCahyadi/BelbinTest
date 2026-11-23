import { SECTION_KODE, type SectionKode } from "./scoring-key";

export const TOTAL_POIN = 10;
export const MAKS_PERNYATAAN_BERPOIN = 3;
export const JUMLAH_PERNYATAAN = 8;

/** nomor pernyataan (1-8) -> poin. Pernyataan yang tidak diisi boleh tidak ada. */
export type SectionAnswer = Record<number, number>;
export type Jawaban = Record<SectionKode, SectionAnswer>;

export type HasilValidasi = {
  valid: boolean;
  total: number;
  terisi: number;
  /** peringatan yang ditampilkan ke peserta; kosong jika valid */
  pesan: string[];
};

export function validateSection(answer: SectionAnswer): HasilValidasi {
  const pesan: string[] = [];
  let total = 0;
  let terisi = 0;
  let nomorSalah = false;
  let poinSalah = false;

  for (const [k, v] of Object.entries(answer ?? {})) {
    const no = Number(k);
    if (!Number.isInteger(no) || no < 1 || no > JUMLAH_PERNYATAAN) {
      nomorSalah = true;
      continue;
    }
    if (typeof v !== "number" || !Number.isInteger(v) || v < 0) {
      poinSalah = true;
      continue;
    }
    total += v;
    if (v > 0) terisi++;
  }

  if (nomorSalah) pesan.push("Nomor pernyataan tidak valid.");
  if (poinSalah) pesan.push("Poin harus berupa bilangan bulat 0 atau lebih.");

  if (total < TOTAL_POIN) {
    pesan.push(`Total poin baru ${total}. Kurang ${TOTAL_POIN - total} poin lagi agar genap ${TOTAL_POIN}.`);
  } else if (total > TOTAL_POIN) {
    pesan.push(`Total poin ${total}, melebihi ${TOTAL_POIN} sebanyak ${total - TOTAL_POIN}.`);
  }

  if (terisi > MAKS_PERNYATAAN_BERPOIN) {
    pesan.push(`Maksimal ${MAKS_PERNYATAAN_BERPOIN} pernyataan yang boleh diberi poin.`);
  }

  return { valid: pesan.length === 0, total, terisi, pesan };
}

/** Validasi seluruh jawaban (7 section). Dipakai ulang di server. */
export function validateJawaban(jawaban: Partial<Jawaban>): {
  valid: boolean;
  perSection: Record<SectionKode, HasilValidasi>;
} {
  const perSection = {} as Record<SectionKode, HasilValidasi>;
  let valid = true;
  for (const kode of SECTION_KODE) {
    const hasil = validateSection(jawaban[kode] ?? {});
    perSection[kode] = hasil;
    if (!hasil.valid) valid = false;
  }
  return { valid, perSection };
}
