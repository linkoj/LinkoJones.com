# PRD — Linko Jones · Cinematic 3D UX Designer Portfolio (linkojones.com)

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

## Deep-dives, headshot & CV (2026-06-21)
- About now shows Linko's real headshot (`public/linko.jpg`, cropped from CV PG9)
  with a monogram fallback, plus a "Download CV" button. PROFILE.cv + a "Read CV"
  link wired to the uploaded CV PDF; linkojones.com/LinkedIn links live.
- Each case study has a "View case study" button → deep-dive MODAL
  (`components/CaseModal.jsx` + `state/caseModal.js`): overview → "The work"
  (3 process steps each with a generated brand-blue artifact image) → highlights →
  outcome → tags. Closes via button / Escape / backdrop; locks body scroll.
- Verified (testing iteration_3): 16/16 after the PROFILE.photo fix — modal opens/
  closes (all 3 ways), step images load, About photo renders, CV/Read CV links,
  nav + horizontal motion + tunnel scrub + contact POST all pass.

## Navigation & horizontal feel (2026-06-21)
- Sections now animate HORIZONTALLY: GSAP slides each panel in from the right
  (xPercent +18) and out to the left (-18) instead of vertical — gives a
  "scrolling sideways" feel while the page still scrolls vertically.
- Replaced the right-side dot rail with: a blue brand BOTTOM BAR
  (`components/Nav.jsx`) holding the LINKO JONES wordmark + condensed section
  links (Prelude/About/Career/Work/Process/Skills/Contact, each jumps to a
  section), plus large left/right ARROW buttons on the screen edges for
  sequential prev/next. Mobile shows wordmark + arrows + an NN/NN indicator.
- Removed ScrollHint/StepControls; keyboard nav (arrows/Home/End) retained.

## Theme (2026-06-21, updated to brand light theme)
- Switched to Linko's brand palette from linkojones.com/new/: primary blue
  `#004bc8` (`ice`), navy `#000826`/text `#0a1230` (`ink`/`night`), red accent
  `#f05454` (`gold`), sky `#5f8ce7`, slate muted `#5a6b86` (`mist`), light bg #eef3fb.
- Added a translucent WHITE scrim over the tunnel canvas (TunnelBackground.jsx) so
  copy sits on a legible light background; panels are now WHITE frosted glass with
  navy copy. Loader is light. 3D embers retinted to brand blues.
- NOTE: Tailwind token KEYS are reused (`ice`,`gold`,`ink`) but now hold brand
  hues to minimise class churn.

## Background: scroll-scrubbed tunnel (2026-06-21)
- `components/TunnelBackground.jsx` draws a 180-frame JPEG sequence
  (`public/zonda/frame_000..179.jpg`, ~3.2MB total, extracted from the client GIF)
  to a 2D canvas; an rAF loop maps `scrollState.target` → frame index, so scrolling
  scrubs the Pagani Zonda forward through the tunnel. Works without WebGL.
  ZOOM/ORIGIN crop hides the source GIF watermark.
- Verified (testing iteration_2): canvas fingerprints differ across scroll
  positions (scrubbing works); sections/nav/keyboard/contact all regression-pass.

## Content (2026-06-21, updated)
- Real identity applied from CV: Linko Jones (Samuel Olutola), Senior UX Designer /
  UX Consultant, Kingswood Surrey · London, info@linkojones.com,
  linkedin.com/in/linkojones, linkojones.com. For linkojones.com.
- Case studies are his real projects: Bank of Ireland (mobile banking + chatbot),
  QBE (NorthStar underwriting platform), Vanguard (Dynamics 365 professionals + CPD
  portal). NOTE: CV had no hard numeric metrics, so the three "impact" chips per case
  use factual project highlights (platform/scope/validation), not invented numbers.
- Experience (6 roles), Process (his 6-step Learn→Evaluate), Skills (Research/Design/
  Tools/Development) all sourced from the CV.

## URL debug flags
- `?no3d` — render CSS fallback instead of WebGL canvas.
- `?nointro` — skip the boot loader.

## Bottom-nav logo (2026-06-22)
- Replaced the text wordmark in the bottom bar (`components/Nav.jsx`) with the brand
  logo: compact **LJ mark** (`public/logo-mark-t.png`) shown by default, cross-fades/
  expands into the full **"LINKO JONOO"** wordmark (`public/logo-full.png`) on hover.
- `logo-mark.png` shipped with a solid `#004bc8` background; pre-processed via Pillow
  into `logo-mark-t.png` (white LJ on transparent) so it stays clean on the bar blue
  and the darker hover-blue. Logo still jumps to intro on click.
- Verified via screenshot tool: default (compact LJ) and hover (full wordmark) states.

## LinkoJones UX Audit Tool (2026-06-25)
- New lead-gen feature: a URL input under the hero tagline (`components/AuditForm.jsx`,
  with an optional "Add context" toggle for industry + business goal) generates a
  professional UX audit via AI.
- Backend (`backend/audit.py` + `/api/audit` routes): server-side fetches the page
  (httpx + BeautifulSoup → title, headings, nav, forms, alt-text gaps, word count,
  body excerpt) and feeds those grounding signals to **Claude Sonnet 4.6**
  (emergentintegrations, EMERGENT_LLM_KEY, streaming) with a strict consultancy
  system prompt covering the proprietary 10-step framework (Evidence→Execution).
  Returns strict JSON (10 steps each with findings/issues/opportunities + confidence
  & priority, executive summary, impact map, suggested next action).
- Async pattern: POST /api/audit creates a `audits` Mongo doc (status=processing) +
  BackgroundTask; GET /api/audit/{id} polled by the client every 2.5s. Generation
  takes ~85-90s. Saved + shareable via deep-link `/?audit=<id>` (App.js opens modal).
- `components/AuditModal.jsx`: cinematic loading stepper (10 framework chips pulse),
  full report render, error state; "Discuss this with LinkoJones" CTA scrolls to
  contact. Tone = senior consultancy using AI as accelerator (never "as an AI").
- Verified manually: form + context toggle render; loading modal; full report
  (airbnb.com — grounded findings on alt-text/H1/hydration/social-proof); deep-link
  share loads a saved report; backend via external URL returns 200.
- NOTE: in preview, editing backend files hot-reloads uvicorn and kills in-flight
  audit BackgroundTasks; not an issue in production (no --reload).

## Home/mobile polish + ambient audio (2026-06-26)
- Removed "AI" wording from the hero audit CTA ("Free UX audit" + new consultancy
  subline) per request — the tool's AI use stays behind the scenes.
- About photo is now a clean circle (`rounded-full`, no border).
- Ambient background music: `components/AudioToggle.jsx` autoplays
  linkojones.com/audio/Weathermix.(ogg|mp3) on load; browsers block autoplay-with-
  sound, so it falls back to the first user gesture (pointer/key/wheel/touch). A
  speaker button in the header toggles play/mute (Volume2/VolumeX). Audio is
  referenced from the external URLs (not bundled — files are ~33MB each).
- Mobile layout fix: `.overlay-section` now uses `align-items: safe center` +
  `overflow-y:auto` + `pointer-events:auto`, so tall sections start at the TOP and
  scroll vertically (like the modal) instead of being centred and clipped at the top.
  Edge prev/next arrows are hidden on mobile (`hidden md:grid`); compact prev/next
  buttons added around the NN/NN indicator in the bottom bar for mobile nav.
- Verified at 390px: edge arrows hidden, bottom-bar prev/next visible, About section
  scrollTop=0 with scrollH(1019)>clientH(560) — top no longer cut off.

## Real case imagery — Bank of Ireland (2026-06-26)
- Replaced generated artifacts in CASES[0] (`data/content.js`, `BOI` constant) with
  Linko's real BOI work: isometric phone collage as the case hero, the loan/insight
  Account screen for "Discover", and the two "Freeze card" wireframe iterations for
  "Define & design" and "Validate". Verified in the case-study modal.
- QBE & Vanguard still use placeholder ART artifacts — awaiting real images from user.

## Vanguard imagery + landing autoplay (2026-06-26)
- CASES[2] (`VANGUARD` constant) now uses real shots: Company1Summary as hero, the
  V360 flow/sitemap for Discover, the Preference Centre for Design, the Dynamics 365
  services screen for Deliver. All three case studies (BOI/QBE/Vanguard) now use real work.
- TunnelBackground.jsx: on landing the Zonda sequence now AUTO-PLAYS the full drive
  (time-based loop, ~6.5s) so the page feels alive immediately; on first interaction
  (wheel/touch/key/pointer) or any scroll it switches to the original scroll-scrubbed
  mode. Verified motion via canvas pixel sampling.

## Audit PDF + email capture + mailing list (2026-06-26)
- New lead-gen flow on the UX audit report (`AuditModal.jsx` `LeadCapture`): visitor
  enters email → POST `/api/audit/{id}/lead` saves them to the `leads` mailing list,
  generates a PDF (`audit_pdf.py`, fpdf2), emails it via **Resend** (PDF attached + live
  report link), and reveals a "Download / print PDF" button (opens `/api/audit/{id}/pdf`).
- Endpoints: `GET /api/audit/{id}/pdf` (on-the-fly PDF), `POST /api/audit/{id}/lead`,
  `GET /api/leads` (unprotected admin list/export of captured emails).
- Resend key in backend/.env (RESEND_API_KEY, SENDER_EMAIL). NOTE: sender is the test
  address `onboarding@resend.dev` → in test mode Resend only delivers to verified
  addresses. To email real visitors, verify a domain in Resend and set SENDER_EMAIL
  (e.g. hello@linkojones.com).
- Verified: PDF 200 (14.8KB valid), lead saved, email_sent=true, leads list populated,
  and the full UI capture→success→download flow.

## Audit rate-limiting (2026-06-26)
- IP-based rate limit on `POST /api/audit` to protect the Universal Key budget:
  default 3/hour and 10/day per IP (env: `AUDIT_MAX_PER_HOUR`, `AUDIT_MAX_PER_DAY`),
  respecting the ingress `x-forwarded-for`. Returns 429 with a friendly message that the
  audit modal now surfaces (state/audit.js parses `detail`). `ip` stored on audit docs.
- ROOT CAUSE of "We couldn't finish that audit" was the Emergent Universal Key budget
  cap ($1.40) being exceeded — user must top up via Profile → Universal Key → Add Balance
  (or enable auto top-up). Each audit ≈ $0.05–0.12 (Claude Sonnet 4.6).

## Favicon + verified Resend sender (2026-06-26)
- Favicon: generated full icon set from `LinkoJonesFormiaTransparent.png` (glassy blue
  mark) placed on a deep-navy (#060914) square for contrast on light tabs: favicon.ico
  (16/32/48), favicon-16/32.png, apple-touch-icon.png (180), android-chrome-192/512,
  site.webmanifest. Wired into public/index.html; theme-color set to #004bc8. All 200.
- Resend sender switched to verified `hello@linkojones.com` (SENDER_EMAIL in backend/.env)
  now that the user verified the linkojones.com domain — real visitor delivery enabled.

## Backlog / Next
- P1: Per-case detail view (deep dive: process artifacts, before/after).
- P1: Real content + headshot/resume PDF; replace placeholder "Maya Chen".
- P2: Audio ambience toggle; minimap of the corridor; share/OG images.
- P2: Admin view of contact submissions; spam protection (honeypot/rate-limit).
- P2: EmailStr validation on backend contact endpoint.
