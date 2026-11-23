import type { SectionKode } from "./scoring-key";

export type Pernyataan = {
  no: number;
  teks: string;
  /** true = teks belum ada di sumber, WAJIB diisi sebelum dipakai ke peserta */
  todo?: boolean;
};

export type Section = {
  kode: SectionKode;
  judul: string;
  pernyataan: Pernyataan[];
};

export const SECTIONS: Section[] = [
  {
    kode: "A",
    judul: "Jika Anda bergabung dalam sebuah team untuk mengerjakan project",
    pernyataan: [
      { no: 1, teks: "Saya bisa diandalkan bahwa pekerjaan akan selesai secara terorganisir/teratur" },
      { no: 2, teks: "Saya mampu melihat beberapa kesalahan yang orang lain tidak melihat." },
      { no: 3, teks: "Saya akan bereaksi keras jika meeting mulai melenceng dari tujuan utama" },
      { no: 4, teks: "Saya mengusulkan saran yang orisinil" },
      { no: 5, teks: "Saya menganalisa ide orang lain secara obyektif, kebaikan dan keburukannya" },
      { no: 6, teks: "Saya tertarik untuk mencari ide paling mutakhir dan perkembangan terbaru." },
      { no: 7, teks: "Saya memiliki kemampuan untuk mengorganisasi orang." },
      { no: 8, teks: "Saya selalu siap untuk mendukung saran terbaik untuk menyelesaikan masalah" },
    ],
  },
  {
    kode: "B",
    judul: "Untuk mencari kepuasan dalam pekerjaan",
    pernyataan: [
      { no: 1, teks: "Saya senang jika mempunyai pengaruh dalam membuat keputusan." },
      { no: 2, teks: "Saya senang jika pekerjaan membutuhkan perhatian dan konsentrasi tinggi." },
      { no: 3, teks: "Saya senang membantu kolega dalam mengatasi masalah." },
      { no: 4, teks: "Saya suka membuat pemisahan obyektif diantara beberapa pilihan solusi." },
      { no: 5, teks: "Saya cenderung mempunyai pendekatan kreatif dalam memecahkan masalah." },
      { no: 6, teks: "Saya senang jika mampu mendamaikan beberapa perbedaan pendapat." },
      { no: 7, teks: "Saya lebih tertarik dalam hal yang bersifat praktis dibanding ide baru." },
      { no: 8, teks: "Saya menikmati melihat beberapa perbedaan pandangan dan pendapat." },
    ],
  },
  {
    kode: "C",
    judul: "Jika team mencoba menyelesaikan masalah yang sangat kompleks",
    pernyataan: [
      { no: 1, teks: "Saya mengawasi area dimana kesulitan akan timbul." },
      { no: 2, teks: "Saya mencari ide yang memiliki aplikasi lebih luas dibanding tugas yang cepat dilakukan" },
      { no: 3, teks: "Saya suka menimbang dan mengevaluasi beberapa saran secara menyeluruh sebelum menentukan" },
      { no: 4, teks: "Saya bisa mengkoordinasi dan menggunakan secara produktif kemampuan dan bakat orang lain" },
      { no: 5, teks: "Saya tetap menggunakan pendekatan sistematis, meskipun tekanannya berat." },
      { no: 6, teks: "Saya sering membuat pendekatan baru untuk masalah berat yang berlangsung terus." },
      { no: 7, teks: "Saya ingin pendapat pribadi saya didengar meskipun dengan cara memaksa." },
      { no: 8, teks: "Saya siap membantu kapanpun saya bisa" },
    ],
  },
  {
    kode: "D",
    judul: "Dalam melakukan pekerjaan sehari-hari",
    pernyataan: [
      { no: 1, teks: "Saya ingin memastikan semuanya sangat jelas mengenai tugas saya dan tujuannya" },
      { no: 2, teks: "Saya siap menekankan pendapat saya dalam meeting" },
      { no: 3, teks: "Saya dapat bekerja dengan segala macam orang asalkan mereka dapat membantu" },
      { no: 4, teks: "Saya suka melakukan follow up untuk ide menarik" },
      { no: 5, teks: "Saya biasanya mencari argument untuk mengalahkan usulan yang kurang bagus" },
      { no: 6, teks: "Saya cenderung melihat pola hubungan meskipun orang lain melihatnya tidak ada hubungannya" },
      { no: 7, teks: "Menjadi sangat sibuk memberikan saya kepuasan" },
      { no: 8, teks: "Saya tertarik untuk mengenal orang lebih dalam" },
    ],
  },
  {
    kode: "E",
    judul: "Jika saya diberi tugas sulit dengan waktu yang sangat terbatas dengan orang yang baru dikenal",
    pernyataan: [
      { no: 1, teks: "Saya sering frustasi bekerja dengan kelompok" },
      { no: 2, teks: "Saya mempunyai kemampuan untuk mendapatkan persetujuan kelompok" },
      { no: 3, teks: "Perasaan saya jarang bertentangan dengan keputusan saya" },
      { no: 4, teks: "Saya berusaha membuat struktur kelompok yang efektif" },
      { no: 5, teks: "Saya bisa bekerja dengan berbagai macam orang dengan kemampuan dan pandangan berbeda" },
      { no: 6, teks: "Saya cenderung langsung mengambil inisiatif dan memimpin tindakan jika situasi terasa macet" },
      { no: 7, teks: "Saya biasanya mengetahui orang yang memiliki pengetahuan dan kemampuan yang sesuai" },
      { no: 8, teks: "Saya sering membangun sense of urgency di dalam kelompok" },
    ],
  },
  {
    kode: "F",
    judul: "Jika tiba-tiba diminta untuk mengerjakan sebuah project baru",
    pernyataan: [
      { no: 1, teks: "Saya langsung mencoba mencari ide yang mungkin bisa dilakukan" },
      { no: 2, teks: "Saya khawatir untuk menyelesaikan project secara sempurna, bahkan sebelum project dimulai" },
      { no: 3, teks: "Saya melakukan pendekatan analitis terhadap masalah" },
      { no: 4, teks: "Saya bersikap assertive untuk mendorong orang lain untuk ikut bergabung jika perlu" },
      { no: 5, teks: "Saya mampu membuat pandangan bebas dan inovasi pada kebanyakan situasi" },
      { no: 6, teks: "Saya senang memimpin jika sudah waktunya action" },
      { no: 7, teks: "Saya meresponse secara positif terhadap kolega dan initiatif mereka" },
      { no: 8, teks: "Saya sulit menerima pekerjaan jika tujuan tidak jelas didefinisikan" },
    ],
  },
  {
    kode: "G",
    judul: "Untuk membantu team mengerjakan project, secara umum",
    // CATATAN: PDF memuat 9 pernyataan (nomor 6 ganda), kunci hanya 8 slot.
    // Pernyataan ke-9 "Saya merasa layak untuk membuat keputusan tidak populer jika itu
    // membantu membuat pendapat seseorang didengar oleh yang lain" belum dipakai.
    // Konfirmasi ke sumber asli sebelum dipakai ke peserta.
    pernyataan: [
      { no: 1, teks: "Saya mempunyai bakat untuk memilah langkah nyata yang diperlukan jika gambarannya jelas" },
      { no: 2, teks: "Keputusan saya mungkin agak lama tapi umumnya mendekati keputusan terbaik" },
      { no: 3, teks: "Interaksi dengan berbagai macam orang adalah penting buat saya" },
      { no: 4, teks: "Saya mampu membuat semua detil dengan benar" },
      { no: 5, teks: "Saya berusaha membuat dikenal dan dilihat dalam meeting" },
      { no: 6, teks: "Saya bisa melihat bagaimana ide dan teknik bisa dipakai dalam penyelesaian masalah" },
      { no: 7, teks: "Saya bisa melihat dua sisi masalah dan mengambil keputusan yang bisa diterima semua" },
      { no: 8, teks: "Saya bisa bekerja sama dengan yang lain dan bekerja keras untuk team" },
    ],
  },
];
