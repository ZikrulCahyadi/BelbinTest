# Sistem Tes Peran Tim Belbin

Aplikasi web berbasis Next.js (App Router), TypeScript, Tailwind CSS, dan Supabase untuk memetakan peran alami anggota tim menggunakan **Belbin Self-Perception Inventory**.

---

## Fitur Utama

- **Alur Peserta Mandiri**: Peserta mengisi identitas (Nama, Departemen, Jabatan) lalu mengerjakan 7 bagian kuesioner (Section A hingga G) tanpa perlu mendaftar akun.
- **Validasi Real-time**: Pembagian tepat 10 poin per section dengan batasan maksimal 3 pernyataan berpoin. Pesan peringatan interaktif dan validasi ketat diulang di sisi server.
- **Skoring Otomatis**: Menghitung 8 peran tim resmi Belbin (Shaper/SH, Co-ordinator/CO, Plant/PL, Resource Investigator/RI, Monitor Evaluator/ME, Implementer/IMP, Team Worker/TW, Completer Finisher/CF) serta menentukan peran utama dan sekunder sesuai kunci skoring Belbin SPI.
- **Panel Administrator**:
  - Autentikasi aman melalui Supabase Auth (hanya login admin terdaftar, tanpa registrasi publik).
  - Middleware proteksi untuk rute `/admin/*`.
  - Tabel rekapitulasi dengan filter departemen, filter peran, pencarian nama/jabatan, dan penanda skor seri.
  - Halaman detail peserta dengan grafik batang distribusi skor 8 peran dan deskripsi mendalam.
  - Fitur ekspor seluruh data ke file CSV.
  - Fitur penghapusan data peserta.

---

## 1. Menjalankan secara Lokal

1. **Clone & Masuk ke Direktori**:
   ```bash
   cd belbin-test
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Salin Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   Isi ketiga variabel di `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```

4. **Jalankan Server Pengembang**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

5. **Menjalankan Pengujian Unit**:
   ```bash
   npm test
   ```

---

## 2. Menyiapkan Supabase

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Buka menu **SQL Editor** pada dashboard Supabase Anda.
3. Buka file migrasi `supabase/migrations/001_hasil_belbin.sql`, salin seluruh isinya, lalu jalankan di SQL Editor.
   - Perintah ini akan membuat tabel `hasil_belbin`, mengaktifkan Row Level Security (RLS), dan menambahkan policy `SELECT` & `DELETE` khusus untuk pengguna terautentikasi (`authenticated`).
   - Tidak ada policy `INSERT` untuk `anon`; pengiriman tes peserta dilakukan dengan aman melalui Server Action menggunakan `SUPABASE_SERVICE_ROLE_KEY`.

---

## 3. Membuat Akun Admin

Untuk mencegah akses publik yang tidak diinginkan, pendaftaran akun publik sengaja dinonaktifkan.

1. Pada dashboard Supabase, buka tab **Authentication** -> **Users**.
2. Klik **Add user** -> **Create user**.
3. Masukkan **Email** dan **Password** untuk admin.
4. Pastikan opsi **Auto Confirm User** dicentang / aktif agar admin dapat langsung login tanpa verifikasi email.
5. Login di aplikasi melalui halaman `/admin/login`.

---

## 4. Deploy ke Vercel

1. Push kode proyek ke repository GitHub / GitLab / Bitbucket.
2. Buka [Vercel Dashboard](https://vercel.com) dan buat **New Project** mengarah ke repository tersebut.
3. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Klik **Deploy**.
5. Pastikan proyek Supabase tetap aktif sebelum sesi tes massal berlangsung (proyek gratis Supabase dapat terjeda otomatis jika tidak ada aktivitas selama 7 hari).

---

## Catatan Khusus Soal & Kunci Skoring

- **Section E Nomor 6**: Masih memiliki flag `todo: true` pada `src/lib/belbin/questions.ts`. Halaman `/tes` dan server action secara ketat menampilkan peringatan dan menolak pemrosesan tes selama teks resmi belum dilengkapi.
- **Section G**: Sengaja disetel tepat 8 pernyataan sesuai 8 slot kunci skoring Belbin.
