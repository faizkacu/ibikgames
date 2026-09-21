IBIKGAMES — Platform Game Edukasi Interaktif

## Getting Started

Jalankan development server:

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Deploy ke Netlify

Project ini dikonfigurasi untuk deploy ke **Netlify**.

1. Push kode ke GitHub repository.
2. Buka [Netlify](https://app.netlify.com) dan import repository.
3. Netlify akan otomatis mendeteksi `netlify.toml` dan menjalankan build.
4. Set environment variables di **Site configuration** → **Environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (isi dengan domain Netlify, misal: `https://ibikgames.netlify.app`)
5. Update Supabase Auth URLs (Site URL & Redirect URLs) ke domain Netlify.

Lihat [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) untuk panduan lengkap.
