// ui-pustaka.js - SATU-SATUNYA berkas yang memanggil API JavaScript Bootstrap.
// Bila pustaka diganti suatu hari nanti, cukup berkas ini yang diubah; app.js tidak perlu disentuh.

function tampilToast(pesan) {
  const el = document.querySelector('#toastInfo');
  el.querySelector('[data-pesan]').textContent = pesan;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 2500 }).show();
}

let aksiKonfirmasi = null;

function konfirmasiHapusSemua(aksi) {
  aksiKonfirmasi = aksi;
  bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalHapusSemua')).show();
}

document.querySelector('#konfirmasiHapus').addEventListener('click', () => {
  bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalHapusSemua')).hide();
  if (aksiKonfirmasi) aksiKonfirmasi();
  aksiKonfirmasi = null;
});