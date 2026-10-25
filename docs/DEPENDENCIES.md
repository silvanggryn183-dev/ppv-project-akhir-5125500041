# Laporan Dependensi Pustaka UI - Kalkulator IPK

## 1. Informasi Pustaka
* Nama pustaka: Bootstrap
* Versi terkunci: 5.3.3
* Sumber pemuatan: CDN jsDelivr
  * https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
  * https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js

## 2. Ukuran Transfer (Tab Network)
* bootstrap.min.css: ± 33,7 kB
* bootstrap.bundle.min.js: ± 24,6 kB
* Pengukuran: DevTools Edge, tab Network, Disable cache aktif, muat ulang dengan Ctrl+Shift+R. Kedua berkas berstatus 200.

## 3. Komponen yang Dipakai
1. Card: kotak hasil IPK di menu Kalkulator dan kotak ringkasan di menu Riwayat.
2. Toast: notifikasi setelah hasil IPK disimpan atau semua riwayat dihapus.
3. Modal: konfirmasi sebelum menghapus semua riwayat.

## 4. Alasan Memilih Bootstrap
Modal dan toast sudah aksesibel (fokus dan tombol Esc diatur pustaka), sehingga tidak perlu ditulis dari nol. Dokumentasinya lengkap, dan tema dapat diubah lewat variabel CSS tanpa menimpa aturan internal pustaka.

## 5. Jawaban Empat Pertanyaan Sebelum Memasang Pustaka
1. Masalah apa yang diselesaikan, dan apakah bisa tanpa pustaka?
   Aplikasi butuh modal konfirmasi, toast, dan card yang rapi serta aksesibel. Semuanya bisa dibuat manual, tetapi mengatur fokus keyboard, tombol Esc, dan animasi modal memakan waktu dan mudah salah. Bootstrap menyediakannya sudah teruji.
2. Berapa biayanya (ukuran dan performa)?
   Total transfer ± 58 kB (CSS ± 33,7 kB dan JS ± 24,6 kB). Ukuran ini wajar untuk aplikasi kecil, dan berkas dari CDN bisa disimpan peramban di cache.
3. Apakah pustakanya terawat, berlisensi jelas, dan versinya terkunci?
   Bootstrap 5.3.3 adalah rilis resmi yang dikelola aktif dan berlisensi MIT. Pustaka dimuat dari CDN jsDelivr dengan nomor versi pasti (5.3.3), bukan @latest, sehingga tampilan tidak berubah sendiri saat ada rilis baru.
4. Bagaimana kalau suatu hari harus diganti?
   Semua panggilan JavaScript pustaka ada di satu berkas, src/ui-pustaka.js, sehingga app.js tidak perlu diubah. Yang perlu diganti hanya berkas itu dan class di HTML. Gaya sendiri ada di style.css dan dimuat sesudah pustaka.

## 6. Catatan Teknis
* style.css dimuat sesudah CSS Bootstrap agar gaya sendiri tidak kalah.
* Tema pink diubah lewat variabel CSS Bootstrap (--bs-primary, --bs-btn-*, --bs-card-border-color).
* Semua panggilan API JavaScript Bootstrap ada di satu berkas: src/ui-pustaka.js.