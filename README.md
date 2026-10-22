# ابشر | Absher

موقع وتطبيق ابشر لخدمات التوصيل في مادبا، الأردن.
Website and mobile app for Absher, a delivery service in Madaba, Jordan.

## شو في بالمشروع

| المجلد | شو هو |
| --- | --- |
| `apps/web` | الموقع، مبني بـ Next.js، ونازل تلقائياً على GitHub Pages |
| `apps/mobile` | تطبيق أندرويد وآيفون، مبني بـ React Native (Expo) |
| `packages/shared` | البيانات المشتركة: مناطق التوصيل، الأقسام، أرقام وحسابات الشركة، ورسالة الطلب |
| `supabase/migrations` | قاعدة البيانات: الطلبات، الكباتن، المطاعم والمتاجر، المناطق |

لتعديل رقم الواتساب أو روابط الحسابات أو مناطق التوصيل، عدّل `packages/shared/src/index.ts` بس، وبتتغير بالموقع والتطبيق مع بعض.

## Development

```bash
npm install
npm run web:dev        # website on http://localhost:3000
npm run mobile:start   # Expo dev server, open with the Expo Go app
npm run typecheck
```

## Deploying the website

Every push to `main` builds the site and publishes it to GitHub Pages via `.github/workflows/deploy-web.yml`.
One-time setup: repository **Settings → Pages → Source: GitHub Actions**.

## Connecting Supabase (optional for now)

1. Create a Supabase project and run `supabase/migrations/0001_init.sql` in its SQL editor.
2. In GitHub, add repository **variables** (not secrets, the anon key is public by design) `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

Until then, orders go to the company WhatsApp only. Never commit a Supabase `service_role` key: this repository is public.
