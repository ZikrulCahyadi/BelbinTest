import type { Role } from "./scoring-key";

export type RoleCategory = "Action" | "Social" | "Thinking";

export type RoleDefinition = {
  kode: Role;
  nama: string;
  kelompok: RoleCategory;
  deskripsi: string;
  karakteristik: string;
  fungsi: string;
  kekuatan: string;
  kelemahan: string;
};

/**
 * 8 Peran Tim Belbin Standar Resmi Internasional (Dr. Meredith Belbin - Self-Perception Inventory)
 */
export const BELBIN_ROLES: Record<Role, RoleDefinition> = {
  SH: {
    kode: "SH",
    nama: "Shaper",
    kelompok: "Action",
    deskripsi:
      "Sangat termotivasi dengan energi dinamis dan dorongan pencapaian yang tinggi. Menyukai tantangan, memimpin serta mendorong orang lain untuk terus bergerak maju mengatasi rintangan.",
    karakteristik: "Tangguh, ekstrover, dinamis, kompetitif, berorientasi hasil, dan berkembang di bawah tekanan.",
    fungsi: "Sebagai penggerak aksi nyata yang handal di dalam tim. Efektif menyuntikkan energi saat situasi stagnan dan tidak gentar mengambil keputusan yang berani.",
    kekuatan: "Memiliki dorongan kepemimpinan yang kuat, keberanian menantang inersia, ketidakefektifan, kepuasan semu (complacency), serta pantang menyerah.",
    kelemahan: "Cenderung tidak sabaran, mudah terprovokasi, dan terkadang melukai perasaan rekan tim dalam situasi frustrasi.",
  },
  CO: {
    kode: "CO",
    nama: "Co-ordinator",
    kelompok: "Social",
    deskripsi:
      "Pemimpin yang matang, tenang, dan percaya diri. Mampu mengklarifikasi tujuan bersama, memfasilitasi pengambilan keputusan, serta mendelegasikan tugas secara efektif.",
    karakteristik: "Tenang, percaya diri, terkontrol, berpikiran terbuka, dan menghargai potensi orang lain.",
    fungsi: "Memandu tim dengan beragam keterampilan dan kepribadian menuju sasaran bersama dengan moto konsultasi terkendali (consultation with control).",
    kekuatan: "Mampu menyatukan tim tanpa prasangka, memanfaatkan bakat setiap anggota, dan menjaga fokus pada tujuan utama.",
    kelemahan: "Terkadang dinilai manipulatif atau cenderung mendelegasikan pekerjaan pribadi ke anggota lain.",
  },
  PL: {
    kode: "PL",
    nama: "Plant",
    kelompok: "Thinking",
    deskripsi:
      "Inovator dan pemikir bebas yang sangat kreatif. Gemar memecahkan masalah-masalah rumit dengan ide-ide orisinil dan solusi terobosan.",
    karakteristik: "Individualis, berpikiran serius, tidak konvensional, imajinatif, dan mandiri.",
    fungsi: "Sumber utama gagasan dan proposal baru. Sangat dibutuhkan pada tahap awal proyek atau saat tim menghadapi jalan buntu.",
    kekuatan: "Kecerdasan intelektual tinggi (genius), imajinatif, orisinil, dan berwawasan luas.",
    kelemahan: "Bisa terlalu asyik dalam ide sendiri (up in the clouds), cenderung mengabaikan detail kepraktisan atau kesulitan berkomunikasi pada frekuensi yang sama.",
  },
  RI: {
    kode: "RI",
    nama: "Resource Investigator",
    kelompok: "Social",
    deskripsi:
      "Ekstrover, antusias, dan komunikatif. Ahli dalam menggali peluang eksternal, membangun jejaring kontak, dan membawa sumber daya baru ke dalam tim.",
    karakteristik: "Mudah bergaul, ingin tahu, penuh antusiasme, dan luwes bernegosiasi.",
    fungsi: "Membuka dan mengeksploitasi peluang di luar organisasi. Menemukan ide, tren baru, dan sumber daya dari pihak luar untuk kepentingan tim.",
    kekuatan: "Kapasitas tinggi dalam menemukan orang-orang kunci, peluang menjanjikan, dan menjadi sumber energi serta vitalitas tim.",
    kelemahan: "Cepat kehilangan antusiasme begitu kebaruan atau ketertarikan awal mulai memudar.",
  },
  ME: {
    kode: "ME",
    nama: "Monitor Evaluator",
    kelompok: "Thinking",
    deskripsi:
      "Kritis, bijaksana, dan objektif. Mampu menganalisis semua opsi yang ada secara rasional dan memberikan penilaian akurat sebelum keputusan diambil.",
    karakteristik: "Rasional, tenang (sober), analitis, tidak mudah terbawa emosi, dan berhati-hati.",
    fungsi: "Menganalisis masalah dan mengevaluasi ide atau saran dari anggota lain. Menimbang pro dan kontra secara objektif agar tim mengambil keputusan terbaik.",
    kekuatan: "Pertimbangan yang tajam, berkepala dingin (hard-headedness), berwawasan luas, dan jarang salah menilai situasi.",
    kelemahan: "Kurang memiliki kemampuan untuk menginspirasi atau memotivasi orang lain, dan terkadang terkesan terlalu kritis atau dingin.",
  },
  IMP: {
    kode: "IMP",
    nama: "Implementer",
    kelompok: "Action",
    deskripsi:
      "Disiplin, teratur, dan dapat diandalkan. Mengubah konsep dan rencana kerja menjadi prosedur serta tindakan praktis yang efisien.",
    karakteristik: "Terorganisasi dengan baik, menikmati keteraturan, memiliki akal sehat praktis, tertib, dan berdisiplin tinggi.",
    fungsi: "Eksekutor handal yang memastikan pekerjaan berjalan sistematis sesuai jadwal dan rencana yang disepakati.",
    kekuatan: "Kemampuan organisasi yang kuat, praktis, pekerja keras, berintegritas tinggi, dan sangat dapat diandalkan.",
    kelemahan: "Kurang fleksibel dan lambat merespons perubahan rencana kerja yang mendadak.",
  },
  TW: {
    kode: "TW",
    nama: "Team Worker",
    kelompok: "Social",
    deskripsi:
      "Kooperatif, lembut, dan peka. Pendengar yang baik yang selalu memelihara harmoni, mencegah gesekan antarpribadi, dan mendukung keutuhan tim.",
    karakteristik: "Berorientasi sosial, suportif, peka terhadap perasaan rekan kerja, dan diplomatis.",
    fungsi: "Mencegah konflik antarpribadi dan memastikan semua anggota tim dapat bekerja sama secara efektif. Menjadi pelumas kebersamaan dalam situasi tegang.",
    kekuatan: "Kemampuan tinggi dalam beradaptasi dengan beragam karakter, menjaga moral tim, dan menumbuhkan iklim kerja yang positif.",
    kelemahan: "Ragu-ragu atau enggan mengambil keputusan tegas dalam situasi genting demi menghindari konflik.",
  },
  CF: {
    kode: "CF",
    nama: "Completer Finisher",
    kelompok: "Action",
    deskripsi:
      "Tekun, teliti, dan berstandar tinggi. Memeriksa pekerjaan hingga ke detail terkecil untuk mencegah kesalahan dan memastikan hasil kerja selesai tepat waktu.",
    karakteristik: "Cermat (painstaking), tertib, bertanggung jawab, dan memiliki dorongan kuat untuk menyelesaikan pekerjaan tanpa cela.",
    fungsi: "Pemeriksa akhir yang tak ternilai untuk tugas-tugas yang menuntut konsentrasi tinggi dan presisi. Memastikan standar kualitas terpenuhi dengan sempurna.",
    kekuatan: "Kapasitas luar biasa dalam menepati janji, memastikan akurasi, dan mempertahankan standar kerja terbaik.",
    kelemahan: "Cenderung terlalu cemas akan hal-hal kecil (worries about small things), enggan mendelegasikan tugas, dan sulit melepaskan kontrol.",
  },
};
