# PRD — Sistem Tes Peran Tim Belbin

Draf 1.0 · 23 November 2026

## 1. Ringkasan

Aplikasi web simpel untuk tes Belbin Self-Perception Inventory. Peserta mengisi identitas (nama, departemen, jabatan), mengerjakan 7 section tes, lalu sistem menghitung skor 8 peran tim secara otomatis. Admin membuka halaman admin untuk melihat setiap peserta masuk ke kategori peran yang mana.

## 2. Tujuan dan Non-Tujuan

**Tujuan**

- Peserta mengisi tes secara online lewat link, tanpa membuat akun.
- Skor, peran utama, dan peran sekunder dihitung otomatis dan konsisten dengan kunci skoring.
- Admin dapat melihat, memfilter, dan mengekspor hasil seluruh peserta.

**Non-tujuan (versi 1)**

- Observer Assessment (penilaian dari rekan kerja).
- Peran Specialist, karena tidak diukur oleh kuesioner ini.
- Laporan tim ala Belbin resmi, login peserta, notifikasi email, multi-bahasa.

## 3. Pengguna

- **Peserta**: mengisi identitas dan tes satu kali.
- **Admin**: login, melihat hasil, memfilter per departemen atau peran, mengekspor data.

## 4. Alur Peserta

1. Halaman awal: isi Nama, Departemen, Jabatan (semua wajib), lalu tekan Mulai.
2. Halaman tes: 7 section (A sampai G), satu section per layar, dengan indikator progres.
3. Setiap section memakai aturan input pada bagian 5.
4. Setelah section G, peserta menekan Kirim. Data dikirim ke server dan dihitung di sana.
5. Halaman selesai berisi ucapan terima kasih. Apakah peserta boleh melihat hasilnya ada di bagian 11.

## 5. Aturan Input per Section

- Tiap section berisi 8 pernyataan (catatan khusus Section E dan G ada di bagian 11).
- Peserta membagi tepat 10 poin.
- Maksimal 3 pernyataan yang diberi poin per section. Pernyataan terpilih mendapat bilangan bulat minimal 1, sisanya 0.
- Penghitung total tampil real-time, misalnya "Terpakai 7 dari 10". Selama total belum tepat 10, peringatan merah tampil di bawah section: "Total poin baru 7. Kurang 3 poin lagi agar genap 10." Jika lebih dari 10: "Total poin 12, melebihi 10 sebanyak 2." Jika lebih dari 3 pernyataan berpoin: "Maksimal 3 pernyataan yang boleh diberi poin." Tombol Lanjut (dan Kirim di section G) nonaktif sampai total tepat 10 dan jumlah pernyataan berpoin 3 atau kurang.
- Semua validasi diulang di server. Input yang tidak valid ditolak.

## 6. Kunci Skoring

Kunci diambil dari tabel Scoring Key pada lembar tes. Setiap sel berisi **nomor pernyataan** yang poinnya dijumlahkan ke peran di kolom tersebut. Tiap section memetakan nomor 1 sampai 8 tepat satu kali ke 8 peran.

| Section | SH | CO | PL | RI | ME | IMP | TW | CF |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | 3 | 7 | 4 | 6 | 5 | 1 | 8 | 2 |
| B | 1 | 6 | 5 | 8 | 4 | 7 | 3 | 2 |
| C | 7 | 4 | 6 | 2 | 3 | 5 | 8 | 1 |
| D | 2 | 3 | 6 | 4 | 5 | 1 | 8 | 7 |
| E | 6 | 5 | 1 | 7 | 3 | 4 | 2 | 8 |
| F | 6 | 4 | 5 | 1 | 3 | 8 | 7 | 2 |
| G | 5 | 7 | 6 | 3 | 2 | 1 | 8 | 4 |

**Rumus**

- Skor peran = jumlah poin pada pernyataan yang dipetakan ke peran itu di 7 section.
- Total semua peran selalu 70 (7 section × 10 poin).
- Peran utama = skor tertinggi. Peran sekunder = skor tertinggi kedua.

**Nama peran**

| Kode | Nama di sistem | Nama Belbin asli | Kelompok |
| --- | --- | --- | --- |
| SH | Driver | Shaper | Action |
| IMP | Implementer | Implementer | Action |
| CF | Finisher | Completer Finisher | Action |
| CO | Co-ordinator | Co-ordinator | Social |
| RI | Resource Investigator | Resource Investigator | Social |
| TW | Supporter | Team Worker | Social |
| PL | Originator | Plant | Thinking |
| ME | Monitor Evaluator | Monitor Evaluator | Thinking |

Deskripsi tiap peran memakai teks dari lembar "Keterangan Team-Role Belbin".

## 7. Halaman Admin

- Login admin memakai Supabase Auth (email dan password).
- Tabel peserta: Nama, Departemen, Jabatan, Peran Utama, Peran Sekunder, Tanggal isi.
- Filter per departemen dan per peran, plus pencarian nama.
- Detail peserta: skor 8 peran (bar sederhana) dan deskripsi peran utama dan sekunder.
- Export ke CSV atau Excel.
- Hapus data peserta.

## 8. Model Data

Satu tabel `hasil_belbin`:

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| id | uuid | primary key |
| nama | text | wajib |
| departemen | text | wajib |
| jabatan | text | wajib |
| jawaban | jsonb | jawaban mentah, contoh `{"A":{"3":6,"5":4}}` |
| skor\_sh, skor\_co, skor\_pl, skor\_ri, skor\_me, skor\_imp, skor\_tw, skor\_cf | int | total per peran |
| peran\_utama, peran\_sekunder | text | kode peran |
| versi\_kunci | text | versi kunci skoring yang dipakai |
| created\_at | timestamptz | default now() |

Jawaban mentah disimpan supaya skor bisa dihitung ulang jika kunci skoring ternyata perlu dikoreksi.

## 9. Arsitektur Teknis

- Next.js (App Router) dengan TypeScript.
- Supabase (Postgres dan Auth), di-deploy di Vercel.
- Kunci skoring disimpan sebagai satu file konfigurasi, misalnya `scoring-key.ts`, berbentuk `{ A: { SH: 3, CO: 7, ... }, ... }`.
- Fungsi hitung skor berupa fungsi murni dan dijalankan di server (server action atau route handler).
- Row Level Security aktif. Peserta tidak punya akses baca. Hanya admin yang sudah login yang boleh membaca dan menghapus.
- Catatan Supabase free tier: project yang tidak aktif sekitar 7 hari bisa di-pause. Cek dan restore sebelum hari pelaksanaan tes.

## 10. Kriteria Penerimaan

**Kasus uji dari contoh pada tabel Scoring Key**

Jawaban (nomor pernyataan = poin):

- A: 3 = 6, 5 = 4
- B: 1 = 3, 7 = 5, 3 = 2
- C: 2 = 6, 5 = 4
- D: 6 = 5, 1 = 5
- E: 7 = 6, 3 = 4
- F: 6 = 7, 7 = 3
- G: 7 = 3, 8 = 7

Hasil yang harus keluar: SH 16, CO 3, PL 5, RI 12, ME 8, IMP 14, TW 12, CF 0 (total 70). Peran utama Driver (SH), peran sekunder Implementer (IMP).

**Validasi**

- Total poin section kurang atau lebih dari 10: ditolak, dan peringatan menyebut berapa poin yang kurang atau berlebih.
- Lebih dari 3 pernyataan berpoin dalam satu section: ditolak.
- Poin negatif, desimal, atau kosong untuk section yang belum selesai: ditolak.
- Admin yang belum login tidak bisa membaca data peserta.
- Kirim ganda (klik dua kali) tidak membuat data ganda.

## 11. Pertanyaan Terbuka dan Risiko

1. **Section E**: lembar tes hanya memuat 7 pernyataan dan nomor 6 hilang, padahal kunci memetakan E6 ke Shaper (SH). Teks aslinya perlu dicari dari sumber Belbin.
2. **Section G**: lembar tes memuat 9 pernyataan (nomor 6 muncul dua kali), sedangkan kunci hanya punya 8 slot. Usulan sementara: pakai 8 pernyataan bernomor 1 sampai 8 sesuai kunci, dan pernyataan "keputusan tidak populer" tidak dipakai. Perlu konfirmasi ke sumber asli.
3. **Sumber soal**: memakai lembar "Persepsi tentang Diri" karena kunci skoringnya mengacu ke nomor pernyataan di lembar ini. Kuesioner Teguh (versi modifikasi) tidak dipakai karena tidak punya kunci skoring.
4. **Seri skor**: jika dua peran seri di posisi kedua, usulan awal adalah menampilkan keduanya dan menandai "seri" di halaman admin.
5. **Hasil untuk peserta**: usulan awal peserta hanya melihat konfirmasi, hasil hanya untuk admin.
6. **Data pribadi**: nama, departemen, dan jabatan adalah data peserta. Batasi akses hanya untuk admin dan beri tahu peserta tujuan pengumpulan datanya.
7. **Batas makna hasil**: hasil tes ini berbasis persepsi diri tanpa penilaian observer, jadi sebaiknya dipakai sebagai gambaran, bukan satu-satunya dasar keputusan.

## 12. Tahapan Pengerjaan

1. Rapikan sumber soal (selesaikan E dan G), buat file kunci skoring, fungsi hitung skor, dan unit test dari kasus uji.
2. Skema Supabase dan aturan RLS.
3. Halaman peserta (form identitas, 7 section, validasi, kirim).
4. Halaman admin (login, tabel, filter, detail, export).
5. Deploy ke Vercel dan uji coba dengan beberapa peserta.
