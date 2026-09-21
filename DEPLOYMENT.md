# Deployment Guide - IBIKGAMES
## Netlify Deployment

**Repository:** https://github.com/faizkacu/ibikgames
**Framework:** Next.js 16.3.5
**Database:** Supabase

---

## Langkah 1: Deploy ke Netlify

### 1.1 Login ke Netlify
1. Buka [app.netlify.com](https://app.netlify.com)
2. Login dengan akun GitHub Anda

### 1.2 Import Repository
1. Klik **"Add new site"** → **"Import an existing project"**
2. Pilih **GitHub** sebagai Git provider
3. Cari dan pilih repository **`faizkacu/ibikgames`**
4. Klik **"Deploy site"**

### 1.3 Konfigurasi Build Settings
Netlify akan otomatis mendeteksi pengaturan dari `netlify.toml`:
- **Build command:** `pnpm build`
- **Publish directory:** `.next`
- **Node version:** 20

Jika diminta, pastikan pengaturan sudah sesuai.

---

## Langkah 2: Konfigurasi Environment Variables

Setelah site berhasil dibuat di Netlify:

1. Buka **Site configuration** → **Environment variables**
2. Tambahkan variabel berikut:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://sklyanimrenmbfueblax.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_5HKcyO6JFPhhEM9UTp6CPg_D6Xf_QMp` |
| `NEXT_PUBLIC_APP_URL` | `https://[nama-site-anda].netlify.app` |

**Catatan:** Ganti `[nama-site-anda]` dengan nama site yang diberikan Netlify (misal: `ibikgames-abc123`).

---

## Langkah 3: Update Supabase Auth URLs

Setelah deployment berhasil dan Anda mendapatkan URL Netlify:

1. Buka **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Update pengaturan berikut:

| Setting | Value |
|---------|-------|
| **Site URL** | `https://[nama-site-anda].netlify.app` |
| **Redirect URLs** | `https://[nama-site-anda].netlify.app/dashboard` |

3. Klik **Save changes**

---

## Langkah 4: Trigger Redeploy

1. Kembali ke **Netlify Dashboard** → **Deploys**
2. Klik **"Trigger deploy"** → **"Deploy site"**
3. Tunggu hingga deployment selesai (biasanya 2-3 menit)

---

## Langkah 5: Verifikasi Deployment

Setelah deployment selesai:

1. Buka URL Netlify Anda (misal: `https://ibikgames-abc123.netlify.app`)
2. Verifikasi:
   - [ ] Halaman home berfungsi
   - [ ] Login/Register berfungsi
   - [ ] Dashboard dapat diakses setelah login
   - [ ] Games CRUD berfungsi
   - [ ] Join session berfungsi
   - [ ] Choose Your Side game berfungsi

---

## Troubleshooting

### Build Error: "Module not found"
- Pastikan semua dependencies terinstall dengan benar
- Jalankan `pnpm install` di local dan commit ulang

### Environment Variables Tidak Terbaca
- Pastikan variabel diawali dengan `NEXT_PUBLIC_`
- Restart deployment setelah menambah variabel

### Auth Error di Production
- Pastikan URL di Supabase Auth Configuration sudah benar
- Site URL harus sesuai dengan URL Netlify Anda

### Realtime Tidak Berfungsi
- Pastikan koneksi WebSocket tidak diblokir
- Cek browser console untuk error

---

## Custom Domain (Opsional)

Jika ingin menggunakan domain sendiri:

1. Buka **Netlify Dashboard** → **Domain management**
2. Klik **"Add custom domain"**
3. Ikuti instruksi untuk konfigurasi DNS
4. Update `NEXT_PUBLIC_APP_URL` di environment variables
5. Update Supabase Auth URLs dengan domain baru

---

## Monitoring

### Netlify Analytics
- Buka **Netlify Dashboard** → **Analytics** untuk melihat traffic

### Supabase Dashboard
- Monitor penggunaan database di **Supabase Dashboard** → **Reports**
- Cek auth logs di **Authentication** → **Logs**

---

**Deployment selesai!** 🚀

Jika ada pertanyaan atau masalah, silakan hubungi tim development.
