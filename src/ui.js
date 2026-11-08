// Semua urusan tampilan: pindah tab, baris mata kuliah, hasil, dan kartu riwayat
import { daftarMatkul, predikat } from './state.js';

const $ = (id) => document.getElementById(id);
const kurangiGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Pindah tampilan
let tampilan = 'kalkulator';
const judulTab = { kalkulator: 'Kalkulator IPK', riwayat: 'Riwayat IPK', tentang: 'Tentang Pembuat' };

export function getTampilan() { return tampilan; }

export function pindahKe(id) {
  if (id === tampilan) return;
  tampilan = id;
  document.querySelectorAll('.tab button').forEach((b) => {
    if (b.dataset.view === id) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.view').forEach((v) => {
    const aktif = v.id === id;
    if (aktif) {
      v.hidden = false;
      if (kurangiGerak()) {
        v.classList.add('aktif');
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (v.id === tampilan) v.classList.add('aktif');
        }));
      }
    } else {
      v.classList.remove('aktif');
      const tunda = kurangiGerak() ? 0 : 200;
      setTimeout(() => { if (v.id !== tampilan) v.hidden = true; }, tunda);
    }
  });
  document.title = judulTab[id];
}

// ---- Baris mata kuliah
const OPSI_NILAI =
  '<option value="">Pilih Nilai</option>' +
  '<option value="4">A</option><option value="3.5">AB</option>' +
  '<option value="3">B</option><option value="2.5">BC</option>' +
  '<option value="2">C</option><option value="1">D</option>' +
  '<option value="0">E</option>';

function opsiMatkul() {
  let html = '<option value="">Pilih Mata Kuliah</option>';
  daftarMatkul.forEach((m) => { html += '<option value="' + m + '">' + m + '</option>'; });
  return html;
}

function buatBaris() {
  const baris = document.createElement('div');
  baris.className = 'matkul';
  baris.innerHTML =
    '<select class="nama" aria-label="Mata kuliah">' + opsiMatkul() + '</select>' +
    '<input type="number" class="sks" aria-label="SKS" placeholder="SKS" min="1" max="6">' +
    '<select class="nilai" aria-label="Nilai">' + OPSI_NILAI + '</select>' +
    '<button type="button" class="hapus" aria-label="Hapus baris">🗑</button>';
  return baris;
}

const daftar = $('daftar-matkul');
const pesan = $('pesan');

export function setPesan(teks) { pesan.textContent = teks; }

export function tambahBaris(interaktif) {
  const baris = buatBaris();
  daftar.appendChild(baris);
  if (!interaktif) return;
  if (!kurangiGerak()) baris.animate(
    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
    { duration: 250, easing: 'ease-out' });
  baris.querySelector('.nama').focus();
}

export function getar(el) {
  if (kurangiGerak()) return;
  el.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
     { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' },
     { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
    { duration: 300, easing: 'ease-out' });
}

export function hilangkan(el, selesai) {
  if (kurangiGerak()) { selesai(); return; }
  el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in' })
    .finished.then(selesai);
}

export function hapusBaris(tombol) {
  const baris = tombol.closest('.matkul');
  if (document.querySelectorAll('.matkul').length <= 1) {
    setPesan('Minimal tersisa 1 baris mata kuliah.');
    getar(baris);
    return;
  }
  setPesan('');
  hilangkan(baris, () => baris.remove());
}

// Baca semua baris: yang valid dihitung, yang setengah diisi ditandai
export function bacaBaris() {
  const valid = [], bermasalah = [];
  document.querySelectorAll('.matkul').forEach((baris) => {
    baris.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    const nama = baris.querySelector('.nama').value;
    const sks = parseFloat(baris.querySelector('.sks').value);
    const nilai = parseFloat(baris.querySelector('.nilai').value);
    if (!nama && isNaN(sks) && isNaN(nilai)) return;
    const sksOk = !isNaN(sks) && sks >= 1 && sks <= 6;
    if (nama && sksOk && !isNaN(nilai)) {
      valid.push({ nama, sks, nilai });
      baris.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    } else {
      bermasalah.push(baris);
      if (!nama) baris.querySelector('.nama').setAttribute('aria-invalid', 'true');
      if (!sksOk) baris.querySelector('.sks').setAttribute('aria-invalid', 'true');
      if (isNaN(nilai)) baris.querySelector('.nilai').setAttribute('aria-invalid', 'true');
    }
  });
  return { valid, bermasalah };
}

// ---- Hasil IPK
const nilaiEl = $('nilai-ipk');
const isiProgres = $('isi-progres');
const bilah = document.querySelector('#kalkulator .progres');
let ipkTampil = 0;

export function tampilkanHasil(ipk) {
  const hasil = $('hasil');
  const pertama = hasil.hidden;
  hasil.hidden = false;
  if (!kurangiGerak() && pertama) hasil.animate(
    [{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'scale(1)' }],
    { duration: 250, easing: 'ease-out' });
  $('predikat').textContent = predikat(ipk);
  cacahKe(ipk);
}

function cacahKe(target) {
  const tulis = (v) => {
    ipkTampil = v;
    nilaiEl.textContent = v.toFixed(2);
    isiProgres.style.transform = 'scaleX(' + (v / 4) + ')';
  };
  if (kurangiGerak()) {
    tulis(target);
  } else {
    const awal = ipkTampil, mulai = performance.now();
    const langkah = (w) => {
      const p = Math.min((w - mulai) / 400, 1);
      tulis(awal + (target - awal) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(langkah);
    };
    requestAnimationFrame(langkah);
  }
  bilah.setAttribute('aria-valuenow', String(Math.round((target / 4) * 100)));
}

export function resetTampilan() {
  $('form-ipk').reset();
  setPesan('');
  document.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  $('hasil').hidden = true;
  ipkTampil = 0;
  nilaiEl.textContent = '0.00';
  $('predikat').textContent = '';
  isiProgres.style.transform = 'scaleX(0)';
}

// ---- Riwayat
const daftarRiwayat = $('daftar-riwayat');

function buatKartu(item, animasi) {
  const li = document.createElement('li');
  li.dataset.id = item.id;
  const skor = document.createElement('span');
  skor.className = 'skor';
  skor.textContent = item.ipk.toFixed(2);
  const meta = document.createElement('span');
  meta.className = 'meta';
  meta.textContent = item.totalSKS + ' SKS · ' + item.tanggal;
  const hapus = document.createElement('button');
  hapus.type = 'button';
  hapus.className = 'hapus-kecil';
  hapus.textContent = 'Hapus';
  hapus.setAttribute('aria-label', 'Hapus riwayat IPK ' + item.ipk.toFixed(2));
  li.append(skor, meta, hapus);
  if (animasi && !kurangiGerak()) li.animate(
    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
    { duration: 250, easing: 'ease-out' });
  return li;
}

export function tampilRiwayat(data, idBaru) {
  daftarRiwayat.replaceChildren(...data.map((item) => buatKartu(item, item.id === idBaru)));
  $('riwayat-kosong').hidden = data.length > 0;
  const ringkasan = $('ringkasan');
  ringkasan.hidden = data.length === 0;
  if (data.length > 0) {
    const rata = data.reduce((j, x) => j + x.ipk, 0) / data.length;
    $('jum-simpan').textContent = data.length;
    $('rata-rata').textContent = rata.toFixed(2);
    $('isi-rata').style.transform = 'scaleX(' + (rata / 4) + ')';
    document.querySelector('#riwayat .progres').setAttribute('aria-valuenow', String(Math.round((rata / 4) * 100)));
  }
}

// ---- Tentang: cadangan bila media gagal dimuat
export function fotoGagal() {
  $('foto').hidden = true;
  $('foto-cadangan').hidden = false;
}

export function audioGagal() {
  $('audio-gagal').hidden = false;
}
