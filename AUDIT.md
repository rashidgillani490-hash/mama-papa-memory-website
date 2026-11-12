# Dreamy Memories: implementation and audit

## Preservation and findings

- Preserved all four real JPEG photographs, original `/photos/memory-1.jpg` through `/photos/memory-4.jpg` paths, captions, memories, complete personal letter, dua, anniversary date and signature. `app/content.ts` retains its original SHA-256 checksum (`247331b9ccf4458b7056736d33e009e7fb041fdd51d31e4a2679f6c449d0429c`).
- The former indefinite-loading bug came from hiding photographs until an `onLoad` state change. Images remain visible in server HTML; no pending/opacity gate has been reintroduced. Failed responsive requests automatically fall back to the original file, then offer retry and an original-photo link if necessary. Cached pre-hydration failures are checked explicitly.
- Exact wedding/milestone dates were not supplied. No dates have been invented: story chapters retain their original descriptions, with the confirmed 19 November 2026 anniversary on the final chapter.
- The previous site had a static timeline, no QR sharing and a dark visual style. These have been rebuilt as the ivory/champagne/blush Dreamy Memories experience.

## Implemented experience

- Cinematic introduction with layered real-photo composition, perspective, subtle particles, warm lighting, grain and Explore Memories navigation.
- Interactive story chapters with roving keyboard focus, arrow/Home/End controls, selection state, associated photo and original milestone writing.
- Responsive floating album frames, pointer-driven tilt, full-screen viewer, previous/next wraparound, direct photo selectors, arrow keys and touch swipe. Native dialog supplies focus containment, Escape close and restored trigger focus.
- Native `details`/`summary` love letter, animated envelope flap and wax seal, Motion for React paper reveal, complete original letter and readable paper layout. Opens even with JavaScript disabled.
- Original dua and anniversary surprise preserved, with gentle celebration particles and reduced-motion support.
- Native share sheet where available, clipboard fallback, selectable URL and downloadable QR PNG. QR is generated locally during the server build; photos are never sent to image/QR services.
- Motion for React entrance/reveal/progress effects plus lightweight CSS 3D; no WebGL dependency. Text never starts transparent. Responsive layouts, focus outlines, skip link, touch targets and reduced-motion handling.
- Local Sharp pipeline generates responsive WebP copies and a dimensions/srcSet manifest before dev/build. Original files are not overwritten. No external font or stock-photo dependencies.

## Modified and added files

- `app/page.tsx`: server page and local QR generation.
- `app/components/DreamyMemories.tsx`: complete interactive experience.
- `app/components/MemoryImage.tsx`: visible-by-default, responsive, recoverable photo loading.
- `app/globals.css`: full responsive visual system and motion fallbacks.
- `app/layout.tsx`: Dreamy Memories page title; original privacy metadata retained.
- `app/photo-manifest.json`, `scripts/prepare-photos.mjs`: original dimensions/checksums and local responsive pipeline.
- `package.json`, `package-lock.json`: Motion, QR generation, Sharp, TypeScript types and test tooling; reproducible dependency versions.
- `playwright.config.ts`, `tests/experience.spec.ts`: isolated headless Chrome production tests.
- `scripts/verify-production.mjs`: HTTP, original-content/asset checksum and responsive-asset checks.
- `.gitignore`, `README.md`, `AUDIT.md`: test-output exclusions, setup, deployment and audit instructions.

## Validation

- Production build and TypeScript: passed on Next.js 16.4.6.
- Browser suite covers story selection, keyboard gallery navigation, modal dismissal/focus restoration, complete letter, surprise, 320/390/768/1440px overflow checks, loaded real photographs, reduced motion, swipe behavior, clipboard sharing, local QR PNG, blocked-image recovery and JavaScript-disabled rendering.
- Desktop/mobile screenshots inspected; mobile intro note repositioned to avoid overlapping the portrait caption.
- HTTP verifier checks original JPEG bytes and content checksum, all responsive WebP paths, valid anchor targets, server-visible photographs and native letter markup.
- Automated checks use desktop Chrome; physical iPhone/Android and Safari have not been tested. Native share-sheet UI depends on the visitor's browser; clipboard fallback is covered.

## Build and deployment

1. `npm ci`
2. `npm run build` (runs local photo preparation first)
3. `npm run typecheck`
4. `npm run test:ui` (uses installed Windows Chrome, otherwise install Playwright Chromium)
5. `npm run start -- --port 3100`, then `node scripts/verify-production.mjs` in a second terminal.

Push to the linked GitHub repository's `main` branch. Vercel uses the Next.js preset and Node 22, runs the prebuild/production build and publishes the existing production URL. `node scripts/verify-production.mjs https://mama-papa-memory-website.vercel.app` validates the deployed assets/content. No environment variables or third-party image credentials are required.
