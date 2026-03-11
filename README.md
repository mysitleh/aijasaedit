# 🎨 AI Jasa Edit - Premium AI Transformation Platform

![AI Jasa Edit Banner](https://aijasaedit.vercel.app/og-image.png)

AI Jasa Edit adalah platform layanan modifikasi foto dan video berbasis kecerdasan buatan (AI) yang dirancang untuk memberikan hasil profesional, artistik, dan berkualitas tinggi. Sistem ini mengintegrasikan alur kerja otomatisasi modern dengan antarmuka yang elegan dan pengelolaan mandiri bagi pemilik bisnis.

---

## 🚀 Teknologi Inti (Tech Stack)

Aplikasi ini dibangun menggunakan teknologi mutakhir untuk menjamin kecepatan, keamanan, dan skalabilitas:

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Actions, Dynamic Rendering).
- **Frontend Logic**: React.js dengan TypeScript untuk keamanan kode.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan pendekatan Mobile-First & Dark Mode.
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore untuk Database NoSQL & Storage untuk Asset Management).
- **Autentikasi**: Sistem Token JWT (JSON Web Token) kustom dengan HTTP-Only Cookies untuk Dashboard Admin yang sangat aman.
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) untuk optimasi gambar otomatis (konversi massal ke WebP generasi terbaru).
- **Deployment**: [Vercel](https://vercel.com/) (Edge Runtime untuk performa global yang cepat).
- **UI Components**: Radix UI & Shadcn UI yang dimodifikasi untuk estetika premium.

---

## 🌟 Fitur Utama

### 1. 📱 Progressive Web App (PWA)
Situs ini dapat diinstal di perangkat Android, iOS, atau PC tanpa melalui App Store, memberikan pengalaman navigasi yang mulus layaknya aplikasi *native*.

### 2. ⚡ Massive Performance Optimization
- **WebP Conversion**: Seluruh aset gambar berat otomatis dikompresi turun hingga 90% tanpa kehilangan kualitas visual HD.
- **Lazy Loading**: Komponen dimuat hanya saat dibutuhkan, meningkatkan skor performa Google Lighthouse.
- **Dynamic Caching**: Menggunakan teknologi caching terbaru Next.js untuk data yang diambil dari database.

### 3. 🔐 Dashboard Admin Profesional
Panel kontrol eksklusif untuk pemilik bisnis yang mencakup:
- **Real-Time Order Monitor**: Pantau pesanan masuk secara langsung.
- **Service Management**: Tambah, hapus, atau ubah jenis layanan dan harga langsung dari dashboard.
- **Dynamic Site Settings**: Ubah nomor WhatsApp admin, detail rekening bank, dan gambar QRIS secara instan tanpa menyentuh kode.

### 4. 🔔 Smart Notification System
Sistem notifikasi canggih untuk Admin yang mendeteksi pesanan baru melalui:
- **Audio Alerts**: Suara "Ding" otomatis saat ada pesanan masuk.
- **Visual Toasts**: Notifikasi melayang dengan detail nama pelanggan.
- **Background Polling**: Memeriksa database secara otomatis setiap beberapa detik.

### 5. 💳 Elegant Order & Payment Flow
- **Multi-step Form**: Alur pengisian data yang intuitif (Pilih Layanan -> Data Diri -> Unggah Foto -> Pembayaran).
- **WhatsApp Integration**: Integrasi pesan otomatis ke WhatsApp untuk konfirmasi pembayaran dan pengiriman file resolusi tinggi (HD).
- **Interactive Pricing**: Kartu daftar harga yang dinamis dengan efek animasi premium.

---

## 🛠 Instalasi & Pengembangan

Jika ingin menjalankan secara lokal:

```bash
# 1. Clone repository
git clone https://github.com/mysitleh/aijasaedit

# 2. Masuk ke direktori
cd aijasaedit

# 3. Instal dependensi
npm install

# 4. Atur Environment Variables (.env)
# Masukkan Firebase Config & Admin Credentials Anda

# 5. Jalankan mode pengembangan
npm run dev
```

---

## 📈 Roadmap & Pengembangan Depan
- [ ] Integrasi otomatisasi langsung ke API Midjourney/Stable Diffusion.
- [ ] Sistem tracking status pesanan untuk pelanggan.
- [ ] Payment Gateway otomatis (Midtrans/Xendit).

---

© 2026 **AI Jasa Edit** - Wujudkan Imajinasi Anda dengan Keajaiban AI.
