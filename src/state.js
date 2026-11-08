// Data mata kuliah, aturan hitung IPK, dan riwayat (tanpa menyentuh DOM)
import { baca, tulis } from './storage.js';

export const daftarMatkul = [
  'Sistem Pemancar', 'Animasi 2D', 'Praktikum Pemrograman Visual',
  'Praktikum Animasi 2D', 'Workshop UI/UX', 'Praktikum Jaringan Komputer',
  'Workshop Jurnalistik', 'Workshop Produksi Konten Digital',
  'Praktikum Teknik Penyiaran', 'Praktikum Sistem Pemancar',
  'Pemrograman Visual', 'Teknik Penyiaran', 'Jaringan Komputer'
];

export function predikat(ipk) {
  if (ipk >= 3.5) return 'Dengan Pujian 🌟';
  if (ipk >= 3.0) return 'Sangat Baik 🙂';
  if (ipk >= 2.5) return 'Baik 👍';
  if (ipk >= 2.0) return 'Cukup, tingkatkan lagi 💪';
  return 'Perlu ditingkatkan 📚';
}

export function hitung(valid) {
  let totalSKS = 0, totalMutu = 0;
  valid.forEach((m) => { totalSKS += m.sks; totalMutu += m.sks * m.nilai; });
  return { ipk: totalMutu / totalSKS, totalSKS, tanggal: new Date().toLocaleString('id-ID') };
}

export function semuaRiwayat() {
  return baca();
}

export function tambahRiwayat(hasil) {
  const data = baca();
  const item = { id: Date.now(), ipk: hasil.ipk, totalSKS: hasil.totalSKS, tanggal: hasil.tanggal };
  data.unshift(item);
  tulis(data);
  return item;
}

export function hapusRiwayat(id) {
  tulis(baca().filter((x) => x.id !== id));
}

export function kosongkanRiwayat() {
  tulis([]);
}
