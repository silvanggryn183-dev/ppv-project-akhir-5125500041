# Kalkulator IPK — Tugas 4 PPV TB033109

Prototipe 3 tampilan: **Kalkulator** (hitung IPK), **Riwayat** (hasil tersimpan
di `localStorage` + rata-rata), **Tentang** (pembuat + media).

## Menjalankan

Buka `index.html` di Chrome/Firefox (klik dua kali cukup). Tanpa build,
tanpa koneksi internet.

## Animasi

- A-01 pindah tampilan — pemicu: klik tab — properti: opacity, transform —
  200 ms — fungsi: menandai tampilan aktif berpindah.
- A-02 baris salah bergetar — pemicu: Hitung/Simpan dengan isian tak lengkap —
  properti: transform — 300 ms — fungsi: menunjuk baris yang harus dilengkapi.
- A-03 hasil muncul + angka mencacah — pemicu: Hitung valid — properti:
  opacity, transform (`scaleX` untuk bilah) — 250/400 ms — fungsi: menegaskan
  hasil baru dan posisinya terhadap 4,00.
- Semua memakai `element.animate()` / `requestAnimationFrame`, hanya
  `transform`/`opacity`, dan langsung tanpa gerak bila
  `prefers-reduced-motion: reduce`.

## Aset

- `assets/ilustrasi.svg` — gambar ilustrasi, dibuat sendiri untuk tugas ini.
- `assets/jingle.wav` — jingle nada E5–G5–C6, disintesis sendiri (sine 8 kHz).
- Ikon navigasi — SVG inline di `index.html`, digambar sendiri.
- Gambar punya `alt` + cadangan `onerror`; audio punya `controls` + pesan
  bila berkas tidak termuat.

## Catatan teknik

- Satu `addEventListener` per daftar (delegation), tidak didaftarkan ulang
  tiap render.
- Teks pengguna tidak pernah ditempel via `innerHTML` (judul riwayat lewat
  `textContent`).


# Kalkulator IPK

Aplikasi web untuk menghitung dan menyimpan IPK mahasiswa agar perkembangannya mudah dipantau.

Masalah: mahasiswa sering salah hitung IPK dan tidak punya catatan hasil yang rapi dari semester ke semester.

## Cara Menjalankan
1. Unduh atau clone repositori ini.
2. Buka index.html di peramban (Chrome atau Edge).
3. Butuh koneksi internet untuk memuat pustaka UI dari CDN.

## Struktur Folder
* index.html : halaman utama
* src/ : kode (app.js, style.css)
* assets/ : gambar dan audio
* docs/ : charter, roadmap, dan dependensi

## Dokumen
* [Project Charter](docs/CHARTER.md)
* [Roadmap](docs/ROADMAP.md)

## Pembuat
Silva Vicky Eka Anggrainy (NRP 5125500041), D3 Teknologi Multimedia dan Broadcasting, PENS.
