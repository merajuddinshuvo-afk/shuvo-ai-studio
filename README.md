# Shuvo AI Studio — Mobile GitHub Upload Package

This is the first deployable project package for **Shuvo AI Studio**.

## What is included
- Branded landing page with image-to-video workspace
- Image upload and prompt form
- Server-side fal.ai image-to-video API route
- Dashboard, login, signup and admin UI starter pages
- Supabase starter SQL schema

## Important limitations
- The fal.ai API key is required for real video generation. Add it only as a Vercel Environment Variable named `FAL_KEY`; never put it in browser code or commit it to GitHub.
- AI video generation is paid by the provider; free hosting does not make generation free.
- Login/signup, admin permissions, persistent history, credits and payments are still starter UI/schema, not production-ready functionality. Do not advertise these as active until implemented and tested.
- The admin page is not protected yet. Do not store real customer data or accept payments until server-side authentication and authorization are completed.
- This starter uses the `fal-ai/ovi/image-to-video` model. Confirm current model availability, input requirements and pricing in your fal.ai account before production use.

## Deploy with GitHub + Vercel (Android phone)
1. Extract this ZIP on your phone.
2. Open your GitHub repository: `https://github.com/merajudd inshuvo-afk/shuvo-ai-studio`
3. Tap **Add file → Upload files**.
4. Select and upload the *contents* of the `shuvo-ai-studio` folder (not the outer ZIP and not an extra nested folder).
5. Commit the upload to the `main` branch.
6. In Vercel, choose **Add New → Project**, import `shuvo-ai-studio`, and deploy.
7. In Vercel Project → Settings → Environment Variables, add `FAL_KEY` only after you have created an account and obtained your own API key. Redeploy after adding it.

## Local development
Requires Node.js 20+.
- `npm install`
- copy `.env.example` to `.env.local`
- `npm run dev`

## Supabase
The SQL starter is at `supabase/schema.sql`. Authentication and server-side credit/admin logic still need implementation before public production launch.

## Security
Never share GitHub passwords, OTPs, Supabase service-role keys or fal.ai API keys in chat or screenshots.
