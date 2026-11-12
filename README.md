# Forever Together — Mama & Papa Anniversary Website ❤️

A complete, responsive Next.js App Router + TypeScript anniversary website. No database, login, or paid services required.

## 1. Get started (Windows / VS Code)

Install Node.js 20.9 or newer from https://nodejs.org/ and open this folder in VS Code. Open Terminal:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## 2. Customize the website

Edit `app/content.ts`:
- `parents`: Parent names or "Mama & Papa"
- `anniversaryDate`: celebration date
- `from`: your preferred signature
- `letter`: your personal letter paragraphs
- `dua`, `milestones`, and gallery captions

## 3. Add real family photos

Put four JPEG photos in `public/photos/` with these exact filenames:

- `memory-1.jpg`
- `memory-2.jpg`
- `memory-3.jpg`
- `memory-4.jpg`

If these files are missing, the website shows decorative placeholder cards instead. Keep photos compressed (ideally ~200–500 KB each) so the page loads smoothly on mobile data. Use photos only if everyone pictured is comfortable with them being on the site.

## 4. Optional background music

Background music is currently disabled because no audio file is supplied. To add it later, provide `public/family-song.mp3` and add an accessible play/pause control in `app/page.tsx`.

## 5. Test before publishing

```bash
npm run build
npm run start
```

Then test:
- On mobile and desktop
- Open and close letter
- Gallery photos are loaded
- "Open your surprise" popup works
- Text, names and date are accurate

## 6. Free deploy with Vercel

1. Create a new GitHub repository.
2. Push this folder to that repository (exclude `node_modules`, already in `.gitignore`).
3. Sign in at https://vercel.com/ with GitHub.
4. Select **Add New → Project → Import repository → Deploy**.
5. After deployment, test the public link on a phone and share it on WhatsApp on November 19.

Vercel normally detects the Next.js framework automatically. If you make changes and push them, Vercel deploys again.

### Privacy note

The website is not password-protected. Its metadata requests search engines not to index it, but that is **not** a privacy guarantee. Anyone with the URL may be able to view the photos. Use only photos you are willing to share this way. For private family photos, consider using non-identifiable images, or configure authenticated access separately.

### Design details

- Dreamy Memories: ivory, champagne, blush, warm gold and midnight accents; layered real-photo composition and cinematic lighting
- Interactive story chapters, responsive 3D gallery, fullscreen photo viewer, keyboard/swipe controls, animated envelope and original letter, dua, surprise and local QR sharing
- Motion for React plus lightweight CSS 3D; no WebGL required
- `prefers-reduced-motion` support for accessibility

Made especially for Awais's parents' 19 November 2026 anniversary.

See `AUDIT.md` for gallery loading fixes, verification results and remaining visual checks. Production checks: `node scripts/verify-production.mjs` after starting the server on port 3100.

### Dreamy Memories development

`npm ci` installs the locked dependencies. `npm run build` prepares responsive WebP photos locally, then builds Next.js. `npm run typecheck` checks TypeScript. `npm run test:ui` runs the production browser suite (installed Windows Chrome, or Playwright Chromium on other systems).

The original writing and JPEGs remain in `app/content.ts` and `public/photos/`. The interactive experience is in `app/components/DreamyMemories.tsx`; `MemoryImage.tsx` handles responsive images and recovery. `app/page.tsx` generates the QR locally at build time. No external image/QR service is used.

The existing GitHub `main` branch is linked to Vercel. Use the Next.js preset, Node 22, and the default build command. The npm `prebuild` hook generates the local photo variants automatically. No environment variables are required. Complete verification details and remaining cross-browser limits are in `AUDIT.md`.
