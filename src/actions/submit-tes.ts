"use server";

import { z } from "zod";
import { SECTIONS } from "@/lib/belbin/questions";
import { validateJawaban, type Jawaban } from "@/lib/belbin/validate";
import { hitungSkor, tentukanPeran } from "@/lib/belbin/score";
import { VERSI_KUNCI } from "@/lib/belbin/scoring-key";
import { createAdminClient } from "@/lib/supabase/server-admin";

const IdentitasSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi"),
  departemen: z.string().trim().min(1, "Departemen wajib diisi"),
  jabatan: z.string().trim().min(1, "Jabatan wajib diisi"),
});

export type SubmitResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Server action untuk validasi dan penyimpanan tes Belbin.
 * Semua validasi diulang di server. Data peserta tidak dicatat ke log.
 */
export async function submitTes(
  identitasRaw: unknown,
  jawabanRaw: unknown
): Promise<SubmitResult> {
  try {
    // 1. Cek apakah ada pernyataan berstatus TODO di questions.ts
    const hasTodo = SECTIONS.some((s) => s.pernyataan.some((p) => p.todo));
    if (hasTodo) {
      return {
        success: false,
        error:
          "Kuesioner belum lengkap: terdapat pernyataan yang berstatus TODO (Section E nomor 6). Pengiriman ditolak.",
      };
    }

    // 2. Validasi identitas dengan Zod
    const identitasParse = IdentitasSchema.safeParse(identitasRaw);
    if (!identitasParse.success) {
      const errorMsg = identitasParse.error.issues.map((i) => i.message).join(", ");
      return {
        success: false,
        error: errorMsg || "Identitas peserta tidak valid.",
      };
    }
    const identitas = identitasParse.data;

    // 3. Validasi seluruh jawaban dengan validateJawaban
    const jawaban = (jawabanRaw ?? {}) as Partial<Jawaban>;
    const hasilValidasi = validateJawaban(jawaban);
    if (!hasilValidasi.valid) {
      return {
        success: false,
        error:
          "Validasi jawaban gagal. Pastikan seluruh 7 section telah diisi tepat 10 poin dengan maksimal 3 pernyataan berpoin.",
      };
    }

    // 4. Hitung skor dan tentukan peran
    const skor = hitungSkor(jawaban);
    const peran = tentukanPeran(skor);

    // 5. Simpan ke database menggunakan service role client (server-side only)
    const supabase = createAdminClient();

    // Pencegahan kirim ganda: cek apakah sudah ada submission identik dalam 60 detik terakhir
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from("hasil_belbin")
      .select("id")
      .eq("nama", identitas.nama)
      .eq("departemen", identitas.departemen)
      .eq("jabatan", identitas.jabatan)
      .gte("created_at", sixtySecondsAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      // Submission ganda terdeteksi, anggap berhasil tanpa menduplikasi data
      return { success: true };
    }

    const { error: insertError } = await supabase.from("hasil_belbin").insert({
      nama: identitas.nama,
      departemen: identitas.departemen,
      jabatan: identitas.jabatan,
      jawaban: jawaban,
      skor_sh: skor.SH,
      skor_co: skor.CO,
      skor_pl: skor.PL,
      skor_ri: skor.RI,
      skor_me: skor.ME,
      skor_imp: skor.IMP,
      skor_tw: skor.TW,
      skor_cf: skor.CF,
      peran_utama: peran.utama,
      peran_sekunder: peran.sekunder,
      versi_kunci: VERSI_KUNCI,
    });

    if (insertError) {
      return {
        success: false,
        error: "Gagal menyimpan jawaban ke database. Silakan coba lagi.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Terjadi kesalahan internal pada server saat memproses jawaban.",
    };
  }
}
