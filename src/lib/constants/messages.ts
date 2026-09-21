export const ERROR_MESSAGES = {
  KODE_SESI_TIDAK_DITEMUKAN:
    'Kode sesi tidak ditemukan. Periksa kembali kode dari instruktur.',
  NAMA_SUDAH_DIGUNAKAN:
    'Nama sudah digunakan. Silakan pilih nama lain.',
  SESI_TELAH_BERAKHIR: 'Sesi permainan telah berakhir.',
  QUIZ_SEDANG_AKTIF:
    'Quiz sedang berlangsung, tidak dapat dihapus.',
  JAWABAN_SALAH:
    'Jawaban salah. Coba lagi atau lewati soal ini.',
  FIELD_WAJIB: 'Field ini wajib diisi.',
  EMAIL_TIDAK_VALID: 'Format email tidak valid.',
  PASSWORD_PENDEK: 'Password minimal 8 karakter.',
  EMAIL_SUDAH_TERDAFTAR: 'Email sudah terdaftar.',
  PASSWORD_SALAH: 'Email atau password salah.',
  TERJADI_KESALAHAN: 'Terjadi kesalahan. Silakan coba lagi.',
} as const;

export const SUCCESS_MESSAGES = {
  QUIZ_BERHASIL_DIBUAT: 'Quiz berhasil dibuat!',
  QUIZ_BERHASIL_DIUBAH: 'Quiz berhasil diubah!',
  QUIZ_BERHASIL_DIHAPUS: 'Quiz berhasil dihapus.',
  BERHASIL_LOGIN: 'Berhasil masuk!',
  BERHASIL_REGISTER: 'Pendaftaran berhasil!',
  BERHASIL_LOGOUT: 'Berhasil keluar.',
  BERHASIL_JOIN: 'Berhasil bergabung!',
  KODE_DISALIN: 'Kode sesi berhasil disalin!',
  SESI_DIMULAI: 'Sesi permainan dimulai!',
  SESI_BERAKHIR: 'Sesi permainan telah berakhir.',
} as const;

export const LOADING_MESSAGES = {
  UMUM: 'Memuat...',
  LOGIN: 'Masuk...',
  REGISTER: 'Mendaftar...',
  SIMPAN: 'Menyimpan...',
  JOIN: 'Bergabung...',
  MENGHAPUS: 'Menghapus...',
} as const;

export const EMPTY_MESSAGES = {
  BELUM_ADA_QUIZ: 'Belum ada quiz. Buat quiz pertamamu!',
  BELUM_ADA_SESI: 'Belum ada sesi permainan.',
  BELUM_ADA_PESERTA: 'Belum ada peserta yang bergabung.',
  STATISTIK_KOSONG: 'Belum ada data statistik.',
} as const;

export const PLACEHOLDER_MESSAGES = {
  NAMA_QUIZ: 'Masukkan nama quiz...',
  EMAIL: 'Masukkan email...',
  PASSWORD: 'Masukkan password...',
  NAMA_PESERTA: 'Masukkan nama kamu...',
  KODE_SESI: 'Masukkan kode sesi...',
  TEKS_SOAL: 'Masukkan pertanyaan...',
  JAWABAN_BENAR: 'Masukkan jawaban yang benar...',
  PILIHAN_KIRI: 'Pilihan sisi kiri...',
  PILIHAN_KANAN: 'Pilihan sisi kanan...',
  NAMA_LENGKAP: 'Masukkan nama lengkap...',
} as const;
