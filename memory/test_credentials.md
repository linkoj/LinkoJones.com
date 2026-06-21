# Test Credentials

No authentication in this app.

## Contact form
- Public endpoint: `POST {REACT_APP_BACKEND_URL}/api/contact`
  body: { "name": str, "email": str, "message": str }
- Submissions are stored in MongoDB (collection: `contacts`) and can be listed via
  `GET {REACT_APP_BACKEND_URL}/api/contact`.

## Debug URL flags (frontend)
- `?no3d`   — skip WebGL, show CSS fallback stage (useful for software-GL browsers).
- `?nointro`— skip the boot loader overlay.
