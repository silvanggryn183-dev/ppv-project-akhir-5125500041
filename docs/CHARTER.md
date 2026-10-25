# Project Charter - Kalkulator IPK

## 1. Masalah
Mahasiswa D3 menghitung IPK dengan kalkulator atau spreadsheet yang harus disusun ulang setiap semester. Perhitungan mudah salah, hasil lama tidak tersimpan rapi, sehingga mereka sulit melihat perkembangan IPK dari waktu ke waktu.

## 2. Pengguna Sasaran dan Persona
* Pengguna: mahasiswa D3 mmb semester 2-6 yang mengisi KRS dan memantau IPK sendiri.
* Persona: KIKY (21 tahun), mahasiswi D3 semester 3.
* Keseharian: kuliah dan praktikum, lalu membuka ponsel di sela jadwal. Setelah nilai keluar, ia menghitung IPK di kalkulator ponsel dan mencatatnya di buku.
* Masalah Rani: sering salah hitung bobot SKS, catatannya tercecer, dan ia tidak tahu apakah IPK-nya naik atau turun.

## 3. Fitur MVP (Prioritas MoSCoW)
1. Must: Hitung IPK dari daftar mata kuliah (SKS dan nilai huruf).
2. Must: Simpan hasil dan lihat riwayat beserta rata-ratanya.
3. Should: Tampilan nyaman di ponsel (± 400 px) dan laptop dengan komponen pustaka UI.
4. Could: Target IPK dan selisihnya terhadap hasil terbaru.
5. Won't: Akun dan login, karena belum menguji nilai utama dan data cukup disimpan di peramban.

## 4. Kriteria Sukses
1. Kecepatan: pengguna baru menghitung dan menyimpan IPK 5 mata kuliah dalam ≤ 2 menit tanpa bantuan.
2. Ketepatan: hasil perhitungan sama dengan hitungan manual pada 5 dari 5 contoh uji.
3. Tampilan ponsel: di lebar 400 px tidak ada gulir horizontal.
4. Kemudahan: 3 dari 3 penguji dapat menyelesaikan alur utama tanpa dibantu.

## 5. Risiko dan Antisipasi
1. Riwayat hilang saat data peramban dihapus atau ganti perangkat. Antisipasi: penyimpanan berversi dan ekspor JSON di Sprint 4 (P12).
2. Gaya pustaka UI menimpa tema pink buatan sendiri. Antisipasi: gaya sendiri dimuat sesudah pustaka, tema diubah lewat variabel CSS, dan diuji di 400 px tiap perubahan.
3. Waktu sprint habis sebelum fitur selesai. Antisipasi: fitur Could hanya dikerjakan bila semua Must dan Should sudah selesai.
4. Rumus konversi nilai tidak sesuai aturan kampus. Antisipasi: tabel konversi nilai dicantumkan di README dan diuji dengan contoh.