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

- Rose/cream palette, editorial serif type, decorative circles and flowers
- Fully responsive gallery, timeline, letter-envelope interaction, Dua, final animated surprise
- CSS only for animations: no paid library needed
- `prefers-reduced-motion` support for accessibility

Made especially for Awais's parents' 19 November 2026 anniversary.
