# MODULE_MAP — Sprint 3 (Kalkulator IPK)

## Peta modul (A → B artinya A mengimpor B, satu arah)

```
main.js
├─> state.js ──> storage.js
├─> ui.js ──> state.js
└─> ui-pustaka.js
```

## Tanggung jawab per modul

| Modul | Tanggung jawab (satu kalimat) |
|---|---|
| `main.js` | Titik masuk yang memasang semua event listener (addEventListener, termasuk delegasi) dan menghubungkan modul lain. |
| `state.js` | Menyimpan daftar mata kuliah, aturan hitung IPK, dan operasi riwayat tanpa menyentuh DOM. |
| `storage.js` | Satu-satunya modul yang membaca dan menulis localStorage. |
| `ui.js` | Mengurus semua tampilan: pindah tab, baris mata kuliah, hasil IPK, dan kartu riwayat. |
| `ui-pustaka.js` | Satu-satunya modul yang memanggil API Bootstrap (toast dan modal konfirmasi). |

## Bagian yang belum dimodulkan

| Bagian | Alasan |
|---|---|
| `bootstrap.bundle.min.js` | Dimuat dari CDN sebagai skrip klasik di `index.html`; hanya `ui-pustaka.js` yang memakainya, jadi cukup satu titik itu. |
| Isi `ui.js` (tab, baris, hasil, riwayat) | Masih satu modul agar perilaku tidak berubah; bisa dipecah per komponen di sprint berikutnya. |
