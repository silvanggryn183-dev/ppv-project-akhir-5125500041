// Kalkulator IPK — Tugas 4 PPV TB033109
const $ = (id) => document.getElementById(id);
const kurangiGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pindah tampilan
let tampilan = 'kalkulator';
const judulTab = { kalkulator: 'Kalkulator IPK', riwayat: 'Riwayat IPK', tentang: 'Tentang Pembuat' };
function pindahKe(id) {
  if (id === tampilan) return;
  tampilan = id;
  document.querySelectorAll('.tab button').forEach((b) =>
    b.toggleAttribute('aria-current', b.dataset.view === id));
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
document.querySelector('.tab').addEventListener('click', (e) => {
  const tombol = e.target.closest('button[data-view]');
  if (tombol) pindahKe(tombol.dataset.view);
});

// Daftar mata kuliah
const daftarMatkul = [
  'Sistem Pemancar', 'Animasi 2D', 'Praktikum Pemrograman Visual',
  'Praktikum Animasi 2D', 'Workshop UI/UX', 'Praktikum Jaringan Komputer',
  'Workshop Jurnalistik', 'Workshop Produksi Konten Digital',
  'Praktikum Teknik Penyiaran', 'Praktikum Sistem Pemancar',
  'Pemrograman Visual', 'Teknik Penyiaran', 'Jaringan Komputer'
];
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
daftar.appendChild(buatBaris());

$('tambah').addEventListener('click', () => {
  const baris = buatBaris();
  daftar.appendChild(baris);
  if (!kurangiGerak()) baris.animate(
    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
    { duration: 250, easing: 'ease-out' });
  baris.querySelector('.nama').focus();
});

// Getar: umpan balik isian salah (pakai transform, bukan left)
function getar(el) {
  if (kurangiGerak()) return;
  el.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
     { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' },
     { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
    { duration: 300, easing: 'ease-out' });
}

// Hapus baris (satu listener untuk semua baris, sekarang dan nanti)
daftar.addEventListener('click', (e) => {
  const tombol = e.target.closest('.hapus');
  if (!tombol) return;
  const baris = tombol.closest('.matkul');
  if (document.querySelectorAll('.matkul').length <= 1) {
    pesan.textContent = 'Minimal tersisa 1 baris mata kuliah.';
    getar(baris);
    return;
  }
  pesan.textContent = '';
  if (kurangiGerak()) { baris.remove(); return; }
  baris.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in' })
    .finished.then(() => baris.remove());
});

// Baca semua baris: yang valid dihitung, yang setengah diisi ditandai
function bacaBaris() {
  const valid = [], bermasalah = [];
  document.querySelectorAll('.matkul').forEach((baris) => {
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

// Hitung IPK
const nilaiEl = $('nilai-ipk');
const isiProgres = $('isi-progres');
const bilah = document.querySelector('#kalkulator .progres');
let ipkTampil = 0;
let hasilTerakhir = null;

function predikat(ipk) {
  if (ipk >= 3.5) return 'Dengan Pujian 🌟';
  if (ipk >= 3.0) return 'Sangat Baik 🙂';
  if (ipk >= 2.5) return 'Baik 👍';
  if (ipk >= 2.0) return 'Cukup, tingkatkan lagi 💪';
  return 'Perlu ditingkatkan 📚';
}

function tampilkanHasil(ipk) {
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

function hitungIPK() {
  const { valid, bermasalah } = bacaBaris();
  bermasalah.forEach(getar);
  if (bermasalah.length > 0) {
    pesan.textContent = 'Lengkapi baris yang bergetar: pilih mata kuliah, SKS 1–6, dan nilai.';
    return null;
  }
  if (valid.length === 0) {
    pesan.textContent = 'Isi minimal 1 mata kuliah dulu, lalu tekan Hitung.';
    return null;
  }
  pesan.textContent = '';
  let totalSKS = 0, totalMutu = 0;
  valid.forEach((m) => { totalSKS += m.sks; totalMutu += m.sks * m.nilai; });
  const ipk = totalMutu / totalSKS;
  tampilkanHasil(ipk);
  hasilTerakhir = { ipk, totalSKS, tanggal: new Date().toLocaleString('id-ID') };
  return hasilTerakhir;
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

$('reset').addEventListener('click', () => {
  $('form-ipk').reset();
  pesan.textContent = '';
  document.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  $('hasil').hidden = true;
  ipkTampil = 0;
  hasilTerakhir = null;
  nilaiEl.textContent = '0.00';
  $('predikat').textContent = '';
  isiProgres.style.transform = 'scaleX(0)';
});

// Riwayat tersimpan
const KUNCI = 'riwayat-ipk';
const daftarRiwayat = $('daftar-riwayat');
function bacaSimpanan() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI)) || [];
  } catch (err) {
    return [];
  }
}
function tulisSimpanan(data) {
  localStorage.setItem(KUNCI, JSON.stringify(data));
}

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

function tampilRiwayat(idBaru) {
  const data = bacaSimpanan();
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

daftarRiwayat.addEventListener('click', (e) => {
  const tombol = e.target.closest('.hapus-kecil');
  if (!tombol) return;
  const li = tombol.closest('li');
  const id = Number(li.dataset.id);
  const buang = () => {
    tulisSimpanan(bacaSimpanan().filter((x) => x.id !== id));
    li.remove();
    tampilRiwayat(null);
  };
  if (kurangiGerak()) { buang(); return; }
  li.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in' })
    .finished.then(buang);
});

$('simpan').addEventListener('click', () => {
  const hasil = hitungIPK();
  if (!hasil) {
    if (tampilan !== 'kalkulator') pindahKe('kalkulator');
    return;
  }
  const data = bacaSimpanan();
  const item = { id: Date.now(), ipk: hasil.ipk, totalSKS: hasil.totalSKS, tanggal: hasil.tanggal };
  data.unshift(item);
  tulisSimpanan(data);
  tampilRiwayat(item.id);
  pindahKe('riwayat');
});

$('hapus-semua').addEventListener('click', () => {
  if (bacaSimpanan().length === 0) return;
  if (!confirm('Hapus semua riwayat tersimpan?')) return;
  tulisSimpanan([]);
  tampilRiwayat(null);
});

tampilRiwayat(null);

// Tentang: cadangan bila media gagal dimuat
function fotoGagal() {
  $('foto').hidden = true;
  $('foto-cadangan').hidden = false;
}
(function () {
  const jingle = $('jingle');
  if (!jingle) return;
  jingle.addEventListener('error', () => { $('audio-gagal').hidden = false; });
  window.addEventListener('load', () => {
    if (jingle.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) $('audio-gagal').hidden = false;
  });
})();
