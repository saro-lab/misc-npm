import type { Messages } from './index'

export const id: Messages = {
  label: 'Indonesia',
  lang: 'id',
  link: '/id/',
  description: 'Open source dari SARO Lab — sistem terdistribusi, alat pengembang, dan pustaka. Berlisensi MIT.',

  menu_docs: 'Dokumentasi',
  menu_projects: 'Proyek',
  menu_tool: 'Alat',
  nav_prev: 'Sebelumnya',
  nav_next: 'Berikutnya',
  page_not_found: 'Halaman tidak ditemukan',
  open_site: 'Kunjungi situs',
  open_github: 'GitHub',
  open_npm: 'npm',
  external_link: 'Terbuka di tab baru',
  copy_code: 'Salin',

  home_tagline: 'Open source dari SARO Lab',
  home_projects: 'Proyek',
  home_tools: 'Alat',

  proj_dat_tag: 'Distributed Access Token',
  proj_dat_desc:
    'Sistem token akses terdistribusi untuk layanan HTTP tanpa status. Layanan penerbitan kunci yang terpisah menghapus masalah kunci tetap, enkripsi data tersedia sejak awal, dan format biner alih-alih JSON membuat token seringan dan secepat yang bisa dicapai.',

  proj_ticketing_tag: 'Server kunci terdistribusi',
  proj_ticketing_desc:
    'Layanan kunci terdistribusi sumber terbuka berkinerja tinggi yang mengendalikan urutan eksekusi server dan proses secara presisi. Ia menutup rapat kegagalan konkurensi yang muncul begitu seluruh trafik datang sekaligus: penjualan melebihi jumlah terbatas, kursi yang sama diberikan dua kali, satu kupon dipakai di dua tempat.',

  proj_nabi_tag: 'Editor WYSIWYG',
  proj_nabi_desc:
    'Editor WYSIWYG yang ketergantungan frameworknya dihilangkan sepenuhnya, sehingga sama mudahnya dipasang di JavaScript murni maupun di React, Vue, atau Svelte. Penyuntingan teks, unggah berkas, dan perataan tabel sudah ada sejak awal, sementara fitur buatan sendiri dan penataan gaya hingga detail terkecil sepenuhnya di tangan Anda.',

  proj_unixtime_tag: 'Waktu Unix tanpa batas',
  proj_unixtime_desc:
    'Pustaka tanggal dan zona waktu yang menangani seluruh rentang waktu secara tepat, dari sebelum Masehi hingga masa depan tanpa batas. Setiap objek tetap tak berubah sehingga waktu rata-rata lokal (LMT) tidak menyimpangkan tanggal lama, dan dukungan penguraian format serta zona waktu membuatnya sama luwesnya dipakai dari npm maupun dari bundel biasa.',

  live: 'Langsung',
  now: 'Sekarang',
  year: 'Tahun',
  month: 'Bulan',
  day: 'Hari',
  hour: 'Jam',
  minute: 'Menit',
  second: 'Detik',
  seconds: 'Detik',
  millisecond: 'Milidetik',

  doc_reference: 'Referensi API',
  doc_install: 'Instalasi',

  unixtime_timezone: 'Offset zona waktu',
  unixtime_timezone_note:
    'Tidak ada basis data zona waktu. Setiap API menerima offset tetap dalam menit dengan tanda yang sama seperti Date.prototype.getTimezoneOffset — sehingga waktu rata-rata lokal tidak menyusup ke tanggal lama.',
  unixtime_create: 'Membuat',
  unixtime_parse: 'Mengurai',
  unixtime_parse_note:
    'Penguraian mengikuti format yang sama dengan pemformatan. Bila formatnya tidak cocok, ia melempar galat alih-alih menebak.',
  unixtime_read: 'Unixtime',
  unixtime_read_note: 'Nilainya dikembalikan sebagai bigint secara bawaan; getter berawalan $ mengembalikan number.',
  unixtime_detail: 'Tanggal-waktu, waktu',
  unixtime_detail_note:
    'Gunakan ini alih-alih getter satu per satu saat Anda butuh beberapa bidang sekaligus — perhitungan naiknya diselesaikan sekali, sehingga stempel waktu negatif pun tetap benar.',
  unixtime_format: 'Format',
  unixtime_relative: 'Waktu relatif',
  unixtime_relative_note:
    'toRelative mengembalikan waktu relatif terhadap saat ini.',
  unixtime_date: 'Tanggal',
  unixtime_date_note: 'Setiap nilai menerima offset sebagai argumen terakhir, dan bila dilewatkan akan memakai zona waktu peramban.',
  unixtime_week: 'Hari dan pekan',
  unixtime_week_note:
    'Fungsi pekan biasa dimulai pada hari Minggu dan butuh satu hari dalam pekan itu; yang ISO dimulai pada hari Senin dan butuh empat.',
  unixtime_time: 'Waktu',
  unixtime_move: 'Berpindah',
  unixtime_move_note: 'Setiap instans bersifat tak berubah — tiap pemanggilan menghasilkan nilai baru. Perpindahan bulan dan tahun mempertahankan tanggalnya, lalu menyesuaikannya ke hari terakhir bulan itu bila tanggal tersebut tidak ada.',
  unixtime_compare: 'Membandingkan',
  unixtime_compare_note: 'Perbandingan menerima apa pun yang diterima factory, jadi Date atau angka biasa tidak perlu dikonversi.',
  unixtime_types: 'Tipe',
}
