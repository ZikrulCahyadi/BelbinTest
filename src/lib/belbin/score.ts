import { ROLES, SCORING_KEY, SECTION_KODE, type Role } from "./scoring-key";
import type { Jawaban } from "./validate";

export type SkorPeran = Record<Role, number>;

/** Jumlahkan poin per peran dari 7 section memakai kunci skoring. */
export function hitungSkor(jawaban: Partial<Jawaban>): SkorPeran {
  const skor = Object.fromEntries(ROLES.map((r) => [r, 0])) as SkorPeran;
  for (const kode of SECTION_KODE) {
    const ans = jawaban[kode] ?? {};
    for (const role of ROLES) {
      skor[role] += ans[SCORING_KEY[kode][role]] ?? 0;
    }
  }
  return skor;
}

export type HasilPeran = {
  /** semua peran, dari skor tertinggi ke terendah */
  urut: Role[];
  utama: Role;
  sekunder: Role;
  /** peran lain (selain utama) yang skornya sama dengan sekunder; panjang > 1 = seri di posisi kedua */
  seri: Role[];
  /** true jika skor utama sama dengan skor sekunder */
  utamaSeri: boolean;
};

/** Peran utama = skor tertinggi, sekunder = tertinggi kedua. Skor sama diurutkan sesuai urutan ROLES. */
export function tentukanPeran(skor: SkorPeran): HasilPeran {
  const urut = [...ROLES].sort(
    (a, b) => skor[b] - skor[a] || ROLES.indexOf(a) - ROLES.indexOf(b),
  );
  const utama = urut[0];
  const sekunder = urut[1];
  const seri = urut.slice(1).filter((r) => skor[r] === skor[sekunder]);
  return { urut, utama, sekunder, seri, utamaSeri: skor[utama] === skor[sekunder] };
}
