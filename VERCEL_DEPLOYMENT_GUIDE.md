# 🚀 Panduan Deployment Vercel (Lengkap)

Panduan ini akan membantu anda memuat naik aplikasi **AramNiaga (Social Media Business Trainer)** ke Vercel. Aplikasi ini menggunakan struktur **Monorepo** (Frontend + Backend dalam satu repository), dan konfigurasi `vercel.json` telah disediakan untuk menyokongnya.

---

## 📋 Prasyarat

1.  **Akaun GitHub**: Pastikan anda mempunyai akaun GitHub.
2.  **Akaun Vercel**: Daftar di [vercel.com](https://vercel.com) menggunakan akaun GitHub anda.
3.  **MongoDB Atlas**: Pastikan anda mempunyai database MongoDB yang aktif (anda perlukan `MONGO_URI`).
4.  **Google Gemini API Key**: Anda perlukan API Key untuk fungsi AI.

---

## 🛠️ Langkah 1: Persiapan Kod (Sudah Selesai)

Kami telah melakukan konfigurasi berikut untuk anda:
1.  **`vercel.json`**: Fail konfigurasi di root folder untuk memberitahu Vercel cara build frontend dan backend serentak.
2.  **API Configuration**: Frontend kini menggunakan *relative path* (`/api/...`) apabila di production, supaya ia boleh bercakap dengan backend dalam domain yang sama.
3.  **CORS & Ports**: Backend telah dilaraskan untuk berfungsi dalam persekitaran serverless Vercel.

---

## 🚀 Langkah 2: Push ke GitHub

Pastikan semua perubahan terkini telah disimpan ke GitHub repository anda.

```bash
git add .
git commit -m "Persiapan deployment Vercel"
git push origin main
```

---

## 🌐 Langkah 3: Import Projek ke Vercel

1.  Pergi ke **Dashboard Vercel** (https://vercel.com/dashboard).
2.  Klik butang **"Add New..."** > **"Project"**.
3.  Di bahagian **Import Git Repository**, cari repo `bh2025` (atau nama repo anda) dan klik **Import**.

---

## ⚙️ Langkah 4: Konfigurasi Projek (PENTING)

Di skrin "Configure Project":

1.  **Project Name**: Boleh biarkan default atau tukar (contoh: `aramniaga-app`).
2.  **Framework Preset**: Pilih **Other** (kerana kita guna custom `vercel.json`).
3.  **Root Directory**: Biarkan kosong (`./`). **JANGAN** ubah ke `client` atau `server`.
4.  **Build and Output Settings**: Biarkan default (Vercel akan baca dari `vercel.json`).

---

## 🔑 Langkah 5: Environment Variables (SANGAT PENTING)

Anda **WAJIB** memasukkan Environment Variables di Vercel supaya backend berfungsi. Fail `.env` **TIDAK** akan di-upload ke Vercel atas sebab keselamatan.

Buka bahagian **Environment Variables** dan masukkan satu per satu:

| Key | Value (Contoh / Arahan) |
| :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` (Copy dari `.env` server anda) |
| `JWT_SECRET` | `sabah_digital_coach_2025_secret_key` (Atau secret anda) |
| `GEMINI_API_KEY` | `AIzaSy...` (Copy dari `.env` server anda) |
| `GEMINI_MODEL` | `gemini-3-pro-preview` |
| `GEMINI_VISION_MODEL` | `gemini-2.5-flash-image` |
| `GEMINI_FAST_MODEL` | `gemini-2.5-flash` |

> **Nota:** Anda TIDAK perlu set `VITE_API_URL` atau `PORT`. Sistem akan uruskan secara automatik.

Klik **Deploy**.

---

## ✅ Langkah 6: Verifikasi & Testing

Tunggu sehingga deployment selesai (biasanya 1-2 minit). Apabila siap:

1.  Klik pada **Domain** yang diberikan oleh Vercel (contoh: `https://aramniaga-app.vercel.app`).
2.  Anda patut melihat skrin **Splash** atau **Login**.
3.  Cuba **Login** atau **Register**.
    *   Jika berjaya masuk Dashboard, bermakna Frontend & Backend berhubung dengan baik.
    *   Jika keluar error "Route not found", pastikan anda tidak mengubah struktur folder.

---

## 🐛 Troubleshooting (Masalah Lazim)

### 1. "Route not found" semasa Login
*   **Sebab:** Frontend cuba panggil URL salah (contoh: `.../api/api/...`).
*   **Solusi:** Kami sudah betulkan ini dalam `client/src/config/api.js`. Pastikan anda sudah push code terkini.

### 2. "Network Error" atau "500 Server Error"
*   **Sebab:** Database tak bersambung atau API Key salah.
*   **Solusi:** Periksa **Environment Variables** di Vercel. Pastikan `MONGO_URI` betul dan IP Whitelist di MongoDB Atlas membenarkan "Allow Access from Anywhere" (0.0.0.0/0).

### 3. Gambar tidak keluar (Uploads)
*   **Sebab:** Vercel adalah *serverless* dan tidak mempunyai sistem fail kekal (persistent storage) untuk simpan gambar upload.
*   **Solusi:** Untuk versi ini, kami menggunakan Base64 untuk simpan gambar kecil terus ke database. Untuk gambar besar di masa depan, anda perlu integrasi Cloudinary atau AWS S3.

---

**Tahniah! Aplikasi anda kini live! 🎉**
