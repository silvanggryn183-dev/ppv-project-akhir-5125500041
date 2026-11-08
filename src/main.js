// Titik masuk: memasang semua event dan menghubungkan modul
import { hitung, semuaRiwayat, tambahRiwayat, hapusRiwayat, kosongkanRiwayat } from './state.js';
import {
  getTampilan, pindahKe, tambahBaris, hapusBaris, bacaBaris, getar, setPesan,
  tampilkanHasil, resetTampilan, tampilRiwayat, hilangkan, fotoGagal, audioGagal
} from './ui.js';
import { tampilToast, konfirmasiHapusSemua } from './ui-pustaka.js';

const $ = (id) => document.getElementById(id);

// Tab
document.querySelector('.tab').addEventListener('click', (e) => {
  const tombol = e.target.closest('button[data-view]');
  if (tombol) pindahKe(tombol.dataset.view);
});

// Baris mata kuliah
tambahBaris(false);
$('tambah').addEventListener('click', () => tambahBaris(true));
$('daftar-matkul').addEventListener('click', (e) => {
  const tombol = e.target.closest('.hapus');
  if (tombol) hapusBaris(tombol);
});

// Hitung IPK
function hitungIPK() {
  const { valid, bermasalah } = bacaBaris();
  bermasalah.forEach(getar);
  if (bermasalah.length > 0) {
    setPesan('Lengkapi baris yang bergetar: pilih mata kuliah, SKS 1–6, dan nilai.');
    return null;
  }
  if (valid.length === 0) {
    setPesan('Isi minimal 1 mata kuliah dulu, lalu tekan Hitung.');
    return null;
  }
  setPesan('');
  const hasil = hitung(valid);
  tampilkanHasil(hasil.ipk);
  return hasil;
}

$('form-ipk').addEventListener('submit', (e) => {
  e.preventDefault();
  hitungIPK();
});
$('form-ipk').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('input, select')) {
    e.preventDefault();
    $('form-ipk').requestSubmit();
  }
});
$('reset').addEventListener('click', resetTampilan);

// Riwayat
$('daftar-riwayat').addEventListener('click', (e) => {
  const tombol = e.target.closest('.hapus-kecil');
  if (!tombol) return;
  const li = tombol.closest('li');
  const id = Number(li.dataset.id);
  hilangkan(li, () => {
    hapusRiwayat(id);
    li.remove();
    tampilRiwayat(semuaRiwayat(), null);
  });
});

$('simpan').addEventListener('click', () => {
  const hasil = hitungIPK();
  if (!hasil) {
    if (getTampilan() !== 'kalkulator') pindahKe('kalkulator');
    return;
  }
  const item = tambahRiwayat(hasil);
  tampilRiwayat(semuaRiwayat(), item.id);
  pindahKe('riwayat');
  tampilToast('Hasil IPK tersimpan.');
});

$('hapus-semua').addEventListener('click', () => {
  if (semuaRiwayat().length === 0) return;
  konfirmasiHapusSemua(() => {
    kosongkanRiwayat();
    tampilRiwayat(semuaRiwayat(), null);
    tampilToast('Semua riwayat dihapus.');
  });
});
tampilRiwayat(semuaRiwayat(), null);

// Tentang: cadangan bila media gagal dimuat
const foto = $('foto');
foto.addEventListener('error', fotoGagal);
if (foto.complete && foto.naturalWidth === 0) fotoGagal();
const jingle = $('jingle');
if (jingle) {
  jingle.addEventListener('error', audioGagal);
  addEventListener('load', () => {
    if (jingle.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) audioGagal();
  });
}
