# Anniversary website audit

## Findings and fixes

- All four `/photos/memory-N.jpg` references resolve to real, unique JPEG files. Paths and filenames are case-correct for Linux/Vercel. The original photographs and `app/content.ts` remain unchanged.
- The previous gallery hid each image with `opacity: 0` until `onLoad` set client state. This made visibility dependent on successful hydration and load-event delivery. Removed the visibility gate and indefinite loading placeholder entirely. Photos now render visibly in server HTML and load through normal browser behavior.
- Actual image errors display an honest message with retry and an original-photo link. A completed-image check catches errors that happened before hydration. Retry remounts the image with a fresh request URL. No remote placeholder image dependencies.
- Replaced the pink layout with black, warm gold, serif typography, cinematic lighting, a floating perspective photo frame, restrained gold borders and pointer-responsive 3D album cards. Full photos use `object-fit: contain`.
- Added an enlarged gallery with sequential previous/next buttons, wraparound, arrow-key navigation, Escape/backdrop close, modal focus containment and focus restoration. The hero intentionally repeats the first photo; album order remains 1-4.
- Rebuilt the letter using native `details`/`summary` with an animated envelope and paper reveal, so the personal letter remains usable without JavaScript.
- Preserved the dedication, letter paragraphs, prayer, milestones, captions, date, signature and surprise message. Added responsive desktop/tablet/mobile layouts, visible focus states, touch targets, skip navigation and reduced-motion support.
- Removed external Google Fonts CSS imports; system serif/sans fallbacks work without third-party requests. Added npm's lockfile for reproducible deployments.

## Validation

- `npm run build`: passed, including TypeScript and static page generation (Next.js 16.4.6).
- `node scripts/verify-production.mjs`: passed against `next start` on port 3100. Checks server-rendered image visibility, content/caption preservation, letter markup, anchor targets, JPEG MIME types and byte-for-byte original asset integrity.
- Browser automation is unavailable in this session. Desktop/mobile screenshots, lightbox key interactions, visual animation quality and simulated image failures have not been browser-verified.

## Recheck

Run `npm ci`, `npm run build`, then `npm run start -- --port 3100`. In another terminal, run `node scripts/verify-production.mjs`. An optional URL argument checks the deployed site, including image byte integrity.
