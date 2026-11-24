import { createClient } from "@/lib/supabase/server";
import { tentukanPeran, type SkorPeran } from "@/lib/belbin/score";
import { BELBIN_ROLES } from "@/lib/belbin/roles";
import { Role } from "@/lib/belbin/scoring-key";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized: Harap login sebagai admin." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: rows, error } = await supabase
      .from("hasil_belbin")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: "Gagal mengambil data peserta." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const excelData = (rows ?? []).map((r, index) => {
      const skor: SkorPeran = {
        SH: r.skor_sh,
        CO: r.skor_co,
        PL: r.skor_pl,
        RI: r.skor_ri,
        ME: r.skor_me,
        IMP: r.skor_imp,
        TW: r.skor_tw,
        CF: r.skor_cf,
      };

      const hasilPeran = tentukanPeran(skor);
      const isSeri = hasilPeran.seri.length > 1 || hasilPeran.utamaSeri;
      const statusSeri = isSeri
        ? hasilPeran.utamaSeri
          ? "Seri (Utama = Sekunder)"
          : `Seri Posisi 2 (${hasilPeran.seri.filter((s) => s !== r.peran_sekunder).join(", ")})`
        : "Tidak";

      const totalSkor = Object.values(skor).reduce((a, b) => a + b, 0);
      const namaUtama = BELBIN_ROLES[r.peran_utama as Role]?.nama || r.peran_utama;
      const namaSekunder = BELBIN_ROLES[r.peran_sekunder as Role]?.nama || r.peran_sekunder;

      const dateStr = new Date(r.created_at).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        No: index + 1,
        "Nama Peserta": r.nama,
        Departemen: r.departemen,
        Jabatan: r.jabatan,
        "Peran Utama": `${namaUtama} (${r.peran_utama})`,
        "Peran Sekunder": `${namaSekunder} (${r.peran_sekunder})`,
        "Status Seri": statusSeri,
        "Shaper (SH)": r.skor_sh,
        "Co-ordinator (CO)": r.skor_co,
        "Plant (PL)": r.skor_pl,
        "Resource Investigator (RI)": r.skor_ri,
        "Monitor Evaluator (ME)": r.skor_me,
        "Implementer (IMP)": r.skor_imp,
        "Teamworker (TW)": r.skor_tw,
        "Completer Finisher (CF)": r.skor_cf,
        "Total Skor": totalSkor,
        "Versi Kunci": r.versi_kunci,
        "Tanggal Pengisian": dateStr,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-fit column widths
    worksheet["!cols"] = [
      { wch: 6 },  // No
      { wch: 24 }, // Nama Peserta
      { wch: 18 }, // Departemen
      { wch: 20 }, // Jabatan
      { wch: 22 }, // Peran Utama
      { wch: 22 }, // Peran Sekunder
      { wch: 16 }, // Status Seri
      { wch: 13 }, // SH
      { wch: 16 }, // CO
      { wch: 14 }, // PL
      { wch: 24 }, // RI
      { wch: 20 }, // ME
      { wch: 16 }, // IMP
      { wch: 14 }, // TW
      { wch: 14 }, // CF
      { wch: 11 }, // Total Skor
      { wch: 12 }, // Versi Kunci
      { wch: 22 }, // Tanggal Pengisian
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Tes Belbin");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    const filename = `hasil-belbin-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Terjadi kesalahan internal server." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
