// Satu-satunya modul yang membaca dan menulis localStorage
const KUNCI = 'riwayat-ipk';

export function baca() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI)) || [];
  } catch (err) {
    return [];
  }
}

export function tulis(data) {
  localStorage.setItem(KUNCI, JSON.stringify(data));
}
