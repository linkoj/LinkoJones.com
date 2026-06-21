# PRD — "Atelier" · Cinematic 3D UX Designer Portfolio

## Original problem statement
Premium portfolio for a senior UX designer that feels like a cinematic interactive
experience: a horizontal museum-like 3D journey through a futuristic corridor,
controlled by vertical mouse-wheel scrolling. Camera tied to scroll. Sections:
About, Experience Timeline, Case Studies, Process, Skills, Contact. Each project is
a floating exhibit. Glassmorphism, depth, premium motion. Desktop/tablet/mobile,
accessible, keyboard nav, 60fps. Storytelling of UX work (decisions → outcomes) is
the star; the 3D is the stage.

## Stack
- Frontend: React (CRA), Three.js, @react-three/fiber, @react-three/drei,
  @react-three/postprocessing, GSAP ScrollTrigger, Framer Motion, Tailwind.
  Fonts: Clash Display (display) + Satoshi (body) via Fontshare.
- Backend: FastAPI + Motor (MongoDB) — contact form storage.
- Note: Next.js was requested; environment runs CRA on port 3000 via supervisor.
  All requested 3D/scroll tech (R3F + Three + GSAP) is delivered in CRA.

## Architecture
- `state/scroll.js`: module store {target, progress, hasRenderLoop} read at 60fps
  outside React render.
- `components/Overlay.jsx`: GSAP ScrollTrigger scrub timeline pinned to
  `#scroll-spacer` (height = sections*110vh). Cross-fades section panels and writes
  scroll progress. Mirrors `progress` when no 3D loop (fallback/no-WebGL).
- `three/Scene.jsx` + `Corridor`, `Exhibit`, `CameraRig`: dark unlit corridor
  (cheap fill), emissive light battens/strips, glass exhibits, entry portal, finale
  monolith, Sparkles. CameraRig moves camera down corridor from scroll progress.
  Bloom enabled only on hardware GPUs (software renderers skip it for stability).
- `components/FallbackStage.jsx`: premium CSS corridor shown when WebGL is
  unavailable or `?no3d`.
- Data in `data/content.js` (PROFILE, SECTIONS, CASES, EXPERIENCE, PROCESS, SKILLS).

## Implemented (2026-06-21)
- 9-station scroll journey: Intro → About → Experience → Case 01/02/03 → Process →
  Skills → Contact, camera tied to scroll.
- Case studies with Problem / Decision / 3 impact metrics + generated UI images.
- Right-side nav dots (active tracking, click-to-jump), keyboard nav
  (Arrows/PageUp-Down/Home/End), step controls, scroll hint, boot loader.
- Contact form → POST /api/contact (MongoDB). Header with availability + CTA.
- Graceful no-WebGL CSS fallback; GPU-detection for bloom; reduced-motion support;
  responsive desktop/tablet/mobile.
- Backend: GET /api/, /api/health, POST/GET /api/contact.

## Verified
- Testing agent iteration_1: backend 100% (7/7), frontend 3D path 100%
  (scrollable ~10692px, all sections cross-fade, nav/keyboard/steps, case content +
  images, contact POST 200, responsive). Fixed: fallback nav reading stale progress.

## URL debug flags
- `?no3d` — render CSS fallback instead of WebGL canvas.
- `?nointro` — skip the boot loader.

## Backlog / Next
- P1: Per-case detail view (deep dive: process artifacts, before/after).
- P1: Real content + headshot/resume PDF; replace placeholder "Maya Chen".
- P2: Audio ambience toggle; minimap of the corridor; share/OG images.
- P2: Admin view of contact submissions; spam protection (honeypot/rate-limit).
- P2: EmailStr validation on backend contact endpoint.
