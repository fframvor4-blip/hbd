# Website Ucapan Ulang Tahun — Rani Pradiyanti

## Sekarang 1 halaman (single-page app)
Website ini sekarang cuma **1 file `index.html`** yang berpindah-pindah "layar" pakai JavaScript
(bukan reload/pindah file .html seperti sebelumnya). Ini sengaja dibuat begitu supaya musik latar
di setiap section bisa langsung bunyi otomatis tanpa perlu disentuh dulu — triknya, ke-5 musik
diputar dalam kondisi diam (mute) sejak halaman dibuka, lalu tinggal di-"nyalakan suaranya" satu
per satu saat section itu aktif. Trik ini yang bikin transisi antar section jadi mulus bersuara,
termasuk transisi otomatis di galeri (setelah 30 detik) yang sebelumnya suka butuh disentuh dulu.

## Alur section (di dalam index.html)
1. **PIN** — wajib masukkan PIN yang benar dulu
2. **Lilin** — tiup lilin, otomatis lanjut
3. **Surat** — amplop dibuka → surat ucapan
4. **Galeri** — 3 video + 18 foto yang terbang menyebar, otomatis lanjut setelah 30 detik
5. **Penutup** — taman bunga mekar + tombol "Kirim Pelukan Virtual"

## Cara menambahkan isi kamu sendiri

**PIN** — cari baris berikut di `index.html` (dekat awal skrip section PIN):
```javascript
const PIN = "22032026";
```

**Foto** — taruh 18 file di folder `foto/`, dinamai persis: `foto1.jpeg`, `foto2.jpeg`, ... `foto18.jpeg`.

**Video** — taruh 3 file video di folder `video/` dengan nama:
- `video1.mp4` — landscape
- `video2.mp4` — potrait, di tengah
- `video3.mp4` — landscape

**Musik tiap section** — taruh 5 file mp3 di folder `sound/` dengan nama persis:
| Section | Nama file |
|---|---|
| PIN (tampilan pertama) | `sound2.mp3` |
| Lilin | `sound1.mp3` |
| Surat | `sound3.mp3` |
| Galeri | `sound4.mp3` |
| Penutup | `sound5.mp3` |

Semua otomatis diputar begitu section itu aktif — tidak ada tombol mute lagi, musiknya memang didesain untuk selalu ada suaranya.

## Menjalankan
Cukup buka `index.html` di browser (double-click juga bisa, karena sekarang cuma 1 file HTML).
Untuk hosting online, upload seluruh folder ini ke layanan seperti Netlify, Vercel, atau GitHub Pages
supaya folder css/js/foto/video/sound ikut terbawa.
