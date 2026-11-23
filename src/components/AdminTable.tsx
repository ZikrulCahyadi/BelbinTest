"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { deleteHasilBelbin } from "@/actions/admin-actions";
import { BELBIN_ROLES } from "@/lib/belbin/roles";
import { ROLES, Role } from "@/lib/belbin/scoring-key";
import { tentukanPeran, SkorPeran } from "@/lib/belbin/score";

export type BelbinRecord = {
  id: string;
  nama: string;
  departemen: string;
  jabatan: string;
  jawaban: Record<string, Record<string, number>>;
  skor_sh: number;
  skor_co: number;
  skor_pl: number;
  skor_ri: number;
  skor_me: number;
  skor_imp: number;
  skor_tw: number;
  skor_cf: number;
  peran_utama: string;
  peran_sekunder: string;
  versi_kunci: string;
  created_at: string;
};

interface AdminTableProps {
  initialData: BelbinRecord[];
}

export function AdminTable({ initialData }: AdminTableProps) {
  const router = useRouter();
  const [dataList, setDataList] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setDataList(initialData);
  }, [initialData]);

  const handleDelete = async (id: string, nama: string) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data peserta "${nama}"?\nData yang dihapus tidak dapat dipulihkan.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    const res = await deleteHasilBelbin(id);
    if (res.success) {
      setDataList((prev) => prev.filter((d) => d.id !== id));
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus data peserta.");
    }
    setDeletingId(null);
  };

  const departemenList = useMemo(() => {
    const set = new Set<string>();
    dataList.forEach((d) => {
      if (d.departemen) set.add(d.departemen);
    });
    return Array.from(set).sort();
  }, [dataList]);

  const processedData = useMemo(() => {
    return dataList.map((item) => {
      const skor: SkorPeran = {
        SH: item.skor_sh,
        CO: item.skor_co,
        PL: item.skor_pl,
        RI: item.skor_ri,
        ME: item.skor_me,
        IMP: item.skor_imp,
        TW: item.skor_tw,
        CF: item.skor_cf,
      };
      const peranInfo = tentukanPeran(skor);
      const isSeri = peranInfo.seri.length > 1 || peranInfo.utamaSeri;
      return {
        ...item,
        isSeri,
        seriList: peranInfo.seri,
        utamaSeri: peranInfo.utamaSeri,
      };
    });
  }, [dataList]);

  const filteredData = useMemo(() => {
    return processedData.filter((item) => {
      const matchSearch =
        search === "" ||
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.jabatan.toLowerCase().includes(search.toLowerCase()) ||
        item.departemen.toLowerCase().includes(search.toLowerCase());

      const matchDept =
        filterDept === "all" ||
        item.departemen.toLowerCase() === filterDept.toLowerCase();

      const matchRole =
        filterRole === "all" || item.peran_utama === filterRole;

      return matchSearch && matchDept && matchRole;
    });
  }, [processedData, search, filterDept, filterRole]);

  const isFiltered = search !== "" || filterDept !== "all" || filterRole !== "all";

  const handleResetFilter = () => {
    setSearch("");
    setFilterDept("all");
    setFilterRole("all");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-7">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest"></span>
            <span className="text-xs font-bold text-forest uppercase tracking-wider">
              Panel Pengelola
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-dark mt-1">
            Rekapitulasi Hasil Tes Belbin
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Data penilaian peran tim seluruh peserta secara komprehensif
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/api/export"
            download
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-hover active:bg-[#144731] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Ekspor Excel (.xlsx)</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white border border-zinc-300/90 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Angka / Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Total Peserta */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/90 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-forest-light text-forest flex items-center justify-center shrink-0 border border-forest-border">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Total Peserta
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark mt-0.5">
              {initialData.length}
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">
              Telah menyelesaikan tes
            </span>
          </div>
        </div>

        {/* Card 2: Departemen Terdaftar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/90 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0 border border-zinc-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Departemen Terdata
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark mt-0.5">
              {departemenList.length}
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">
              Unit kerja aktif
            </span>
          </div>
        </div>

        {/* Card 3: Hasil Filter */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/90 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-forest-light text-forest flex items-center justify-center shrink-0 border border-forest-border">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-forest uppercase tracking-wider block">
              Sesuai Filter
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-forest mt-0.5">
              {filteredData.length}
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">
              Data yang ditampilkan
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Pencarian Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Input Cari */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama peserta, departemen, atau jabatan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition placeholder:text-zinc-400 bg-white text-dark"
            />
            <svg className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Departemen */}
          <div className="sm:w-56">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition bg-white text-dark font-medium"
            >
              <option value="all">Semua Departemen</option>
              {departemenList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Peran Utama */}
          <div className="sm:w-64">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition bg-white text-dark font-medium"
            >
              <option value="all">Semua Peran Utama</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {BELBIN_ROLES[r].nama} ({r})
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Reset jika sedang filter */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition whitespace-nowrap cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Tabel Data Utama */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-dark">
              Daftar Peserta
            </h2>
            <span className="text-xs bg-forest-light text-forest px-2.5 py-0.5 rounded-full font-bold border border-forest-border">
              {filteredData.length} Data
            </span>
          </div>
          <span className="text-xs text-zinc-400">
            Klik &apos;Lihat Detail&apos; untuk visualisasi skor 8 peran
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Nama Peserta</th>
                <th className="py-3.5 px-4">Departemen</th>
                <th className="py-3.5 px-4">Jabatan</th>
                <th className="py-3.5 px-4">Peran Utama</th>
                <th className="py-3.5 px-4">Peran Sekunder</th>
                <th className="py-3.5 px-4">Tanggal Tes</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-zinc-400">
                    <p className="text-sm font-medium">Tidak ada catatan yang sesuai dengan filter.</p>
                    <p className="text-xs text-zinc-400 mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const roleUtama = BELBIN_ROLES[item.peran_utama as Role];
                  const roleSekunder = BELBIN_ROLES[item.peran_sekunder as Role];
                  const dateStr = new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr key={item.id} className="hover:bg-forest-light/15 transition-colors">
                      {/* Nama */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-dark text-sm">
                          {item.nama}
                        </div>
                        <div className="text-[11px] text-zinc-400 sm:hidden">
                          {item.departemen} • {item.jabatan}
                        </div>
                      </td>

                      {/* Departemen */}
                      <td className="py-4 px-4 text-zinc-700 font-medium">
                        <span className="bg-zinc-100 px-2.5 py-1 rounded-md text-xs inline-block border border-zinc-200/70">
                          {item.departemen || "-"}
                        </span>
                      </td>

                      {/* Jabatan */}
                      <td className="py-4 px-4 text-zinc-600 font-medium text-xs">
                        {item.jabatan || "-"}
                      </td>

                      {/* Peran Utama */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-forest bg-forest-light px-3 py-1 rounded-lg border border-forest-border text-xs inline-flex items-center space-x-1">
                          <span>{roleUtama?.nama || item.peran_utama}</span>
                          <span className="opacity-75 font-normal">({item.peran_utama})</span>
                        </span>
                      </td>

                      {/* Peran Sekunder */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className="font-semibold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200 text-xs inline-flex items-center space-x-1">
                            <span>{roleSekunder?.nama || item.peran_sekunder}</span>
                            <span className="opacity-60 font-normal">({item.peran_sekunder})</span>
                          </span>
                          {item.isSeri && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 inline-flex items-center"
                              title={
                                item.utamaSeri
                                  ? "Skor Utama dan Sekunder sama besar"
                                  : `Seri peran sekunder dengan ${item.seriList.join(", ")}`
                              }
                            >
                              Seri
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="py-4 px-4 text-zinc-500 text-xs whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-2">
                          <Link
                            href={`/admin/${item.id}`}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-forest-light text-forest hover:bg-forest hover:text-white border border-forest-border font-bold text-xs transition shadow-2xs"
                          >
                            <span>Lihat Detail</span>
                            <span>→</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.nama)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 font-bold text-xs transition shadow-2xs disabled:opacity-50 cursor-pointer"
                            title="Hapus data peserta ini"
                          >
                            <svg
                              className="w-3.5 h-3.5 shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span>
                              {deletingId === item.id ? "Menghapus..." : "Hapus"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
