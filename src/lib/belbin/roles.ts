import type { Role } from "./scoring-key";

export type RoleCategory = "Action" | "Social" | "Thinking";

export type RoleDefinition = {
  kode: Role;
  nama: string;
  kelompok: RoleCategory;
  hewan: string;
  hewanEmoji: string;
  gambar: string;
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
    hewan: "Badak",
    hewanEmoji: "🦏",
    gambar: "/animals/badak.png",
    deskripsi:
      "Mengarahkan dan mengendalikan anggota tim. Memastikan tim mengerjakan tugasnya dengan cara kerja yang benar dan sesuai dengan tujuan yang ingin dicapai. Sangat berfokus pada penetapan tujuan dan prioritas kerja. Memastikan segala sesuatu berjalan sesuai dengan standar yang telah ditetapkan.",
    karakteristik: "Tangguh, ekstrover, dinamis, kompetitif, berorientasi hasil, dan berkembang di bawah tekanan.",
    fungsi: "Sebagai penggerak aksi nyata yang handal di dalam tim. Efektif menyuntikkan energi saat situasi stagnan dan tidak gentar mengambil keputusan yang berani.",
    kekuatan: "Memiliki dorongan kepemimpinan yang kuat, keberanian menantang inersia, ketidakefektifan, kepuasan semu (complacency), serta pantang menyerah.",
    kelemahan: "Cenderung tidak sabaran, mudah terprovokasi, dan terkadang melukai perasaan rekan tim dalam situasi frustrasi.",
  },
  CO: {
    kode: "CO",
    nama: "Co-ordinator",
    kelompok: "Social",
    hewan: "Singa",
    hewanEmoji: "🦁",
    gambar: "/animals/singa.png",
    deskripsi:
      "Mengambil peran sebagai pemimpin dengan cara mengkoordinir pembagian peran serta kontribusi apa saja yang harus diberikan masing-masing anggota tim. Membuat keputusan strategis dari hasil pembagian peran dan kontribusi tersebut. Ia mendelegasikan tugas ke orang-orang yang tepat berdasarkan bakat, kelemahan maupun kelebihan yang dimiliki mereka untuk mencapai tujuan tim. Dia juga memastikan setiap potensi anggota tim diberdayakan.",
    karakteristik: "Tenang, percaya diri, terkontrol, berpikiran terbuka, dan menghargai potensi orang lain.",
    fungsi: "Memandu tim dengan beragam keterampilan dan kepribadian menuju sasaran bersama dengan moto konsultasi terkendali (consultation with control).",
    kekuatan: "Mampu menyatukan tim tanpa prasangka, memanfaatkan bakat setiap anggota, dan menjaga fokus pada tujuan utama.",
    kelemahan: "Terkadang dinilai manipulatif atau cenderung mendelegasikan pekerjaan pribadi ke anggota lain.",
  },
  PL: {
    kode: "PL",
    nama: "Plant",
    kelompok: "Thinking",
    hewan: "Semut",
    hewanEmoji: "🐜",
    gambar: "/animals/semut.png",
    deskripsi:
      "Sumber utama gagasan dan inovasi dalam tim. Bisa memainkan peran strategis berkaitan dengan inovasi dan perencanaan ke depan. Memunculkan ide serta strategi baru, dengan perhatian khusus pada isu-isu utama. Mencari cara kreatif dalam mengatasi masalah yang dihadapi tim.",
    karakteristik: "Individualis, berpikiran serius, tidak konvensional, imajinatif, dan mandiri.",
    fungsi: "Sumber utama gagasan dan proposal baru. Sangat dibutuhkan pada tahap awal proyek atau saat tim menghadapi jalan buntu.",
    kekuatan: "Kecerdasan intelektual tinggi (genius), imajinatif, orisinil, dan berwawasan luas.",
    kelemahan: "Bisa terlalu asyik dalam ide sendiri (up in the clouds), cenderung mengabaikan detail kepraktisan atau kesulitan berkomunikasi pada frekuensi yang sama.",
  },
  RI: {
    kode: "RI",
    nama: "Resource Investigator",
    kelompok: "Social",
    hewan: "Anjing",
    hewanEmoji: "🐕",
    gambar: "/animals/anjing.png",
    deskripsi:
      "Mencari peluang dan koneksi dari pihak luar yang mungkin berguna bagi tim. Bertindak sebagai sumber informasi dari luar lingkup perusahaan dan mengeksplorasi serta melaporkan gagasan, perkembangan dan sumber daya lainnya dari pihak luar. Membangun dan menjaga hubungan baik dengan pihak eksternal yang mungkin bermanfaat di masa yang akan datang. Termasuk bernegosiasi dengan pihak luar jika diperlukan.",
    karakteristik: "Mudah bergaul, ingin tahu, penuh antusiasme, dan luwes bernegosiasi.",
    fungsi: "Membuka dan mengeksploitasi peluang di luar organisasi. Menemukan ide, tren baru, dan sumber daya dari pihak luar untuk kepentingan tim.",
    kekuatan: "Kapasitas tinggi dalam menemukan orang-orang kunci, peluang menjanjikan, dan menjadi sumber energi serta vitalitas tim.",
    kelemahan: "Cepat kehilangan antusiasme begitu kebaruan atau ketertarikan awal mulai memudar.",
  },
  ME: {
    kode: "ME",
    nama: "Monitor Evaluator",
    kelompok: "Thinking",
    hewan: "Burung Hantu",
    hewanEmoji: "🦉",
    gambar: "/animals/burung-hantu.png",
    deskripsi:
      "Mengkritisi gagasan dan saran yang ditawarkan oleh anggota tim lainnya. Sangat bermanfaat dalam mengevaluasi rencana-rencana baru. Mampu menganalisa masalah secara objektif. Dan dengan mudah mengevaluasi gagasan dan saran yang diberikan sehingga tim bisa mengambil keputusan yang terbaik dan lebih seimbang.",
    karakteristik: "Rasional, tenang (sober), analitis, tidak mudah terbawa emosi, dan berhati-hati.",
    fungsi: "Menganalisis masalah dan mengevaluasi ide atau saran dari anggota lain. Menimbang pro dan kontra secara objektif agar tim mengambil keputusan terbaik.",
    kekuatan: "Pertimbangan yang tajam, berkepala dingin (hard-headedness), berwawasan luas, dan jarang salah menilai situasi.",
    kelemahan: "Kurang memiliki kemampuan untuk menginspirasi atau memotivasi orang lain, dan terkadang terkesan terlalu kritis atau dingin.",
  },
  IMP: {
    kode: "IMP",
    nama: "Implementer",
    kelompok: "Action",
    hewan: "Kuda",
    hewanEmoji: "🐎",
    gambar: "/animals/kuda.png",
    deskripsi:
      "Tulang punggung tim dalam mencapai hasil yang terperinci dan praktis. Ia bisa dipercaya dengan sejumlah tanggung jawab dan peran penting lainnya dalam menjalankan keputusan tim. Mengubah konsep dan rencana menjadi prosedur kerja praktis dan spesifik. Melakukan rencana yang disepakati secara sistematis dan efisien.",
    karakteristik: "Terorganisasi dengan baik, menikmati keteraturan, memiliki akal sehat praktis, tertib, dan berdisiplin tinggi.",
    fungsi: "Eksekutor handal yang memastikan pekerjaan berjalan sistematis sesuai jadwal dan rencana yang disepakati.",
    kekuatan: "Kemampuan organisasi yang kuat, praktis, pekerja keras, berintegritas tinggi, dan sangat dapat diandalkan.",
    kelemahan: "Kurang fleksibel dan lambat merespons perubahan rencana kerja yang mendadak.",
  },
  TW: {
    kode: "TW",
    nama: "Team Worker",
    kelompok: "Social",
    hewan: "Lebah",
    hewanEmoji: "🐝",
    gambar: "/animals/lebah.png",
    deskripsi:
      "Menjaga keharmonisan, kepuasan serta spirit tim agar tim berfungsi efektif. Biasanya memposisikan diri sebagai support atau di belakang layar, di dalam tim. Memberi support kepada anggota tim lewat kekuatan mereka, misalnya mengembangkan saran yang mereka berikan. Berusaha untuk mengembangkan apa yang jadi kekuatan anggota tim dan menyokong kekurangan mereka. Meningkatkan komunikasi dan menumbuhkan semangat tim.",
    karakteristik: "Berorientasi sosial, suportif, peka terhadap perasaan rekan kerja, dan diplomatis.",
    fungsi: "Mencegah konflik antarpribadi dan memastikan semua anggota tim dapat bekerja sama secara efektif. Menjadi pelumas kebersamaan dalam situasi tegang.",
    kekuatan: "Kemampuan tinggi dalam beradaptasi dengan beragam karakter, menjaga moral tim, dan menumbuhkan iklim kerja yang positif.",
    kelemahan: "Ragu-ragu atau enggan mengambil keputusan tegas dalam situasi genting demi menghindari konflik.",
  },
  CF: {
    kode: "CF",
    nama: "Completer Finisher",
    kelompok: "Action",
    hewan: "Laba-laba",
    hewanEmoji: "🕷️",
    gambar: "/animals/laba-laba.png",
    deskripsi:
      "Memberikan perhatian terhadap detail, melakukan follow up serta menanamkan rasa urgensi ke para anggota tim. Sangat cocok berperan sebagai pemeriksa terakhir hasil kerja tim. Biasanya kehadirannya sangat berguna di kondisi darurat untuk melindungi tim dari kesalahan dan kelalaian. Mampu mencari aspek-aspek pekerjaan yang membutuhkan perhatian khusus. Mempertahankan rasa urgensi tim sehingga pekerjaan bisa selesai tepat waktu.",
    karakteristik: "Cermat (painstaking), tertib, bertanggung jawab, dan memiliki dorongan kuat untuk menyelesaikan pekerjaan tanpa cela.",
    fungsi: "Pemeriksa akhir yang tak ternilai untuk tugas-tugas yang menuntut konsentrasi tinggi dan presisi. Memastikan standar kualitas terpenuhi dengan sempurna.",
    kekuatan: "Kapasitas luar biasa dalam menepati janji, memastikan akurasi, dan mempertahankan standar kerja terbaik.",
    kelemahan: "Cenderung terlalu cemas akan hal-hal kecil (worries about small things), enggan mendelegasikan tugas, dan sulit melepaskan kontrol.",
  },
};
