# Character Forge AI

A polished, fully-static web app that turns a single character concept into a
**vivid 3-sentence backstory** and a **cinematic portrait**, generated live by
[Pollinations.ai](https://pollinations.ai). Built for the Pollinations
"Flower Tier" app program and hosted with **zero build steps** on GitHub Pages.

> **Powered by Pollinations.ai**

---

## What it does

1. The user types a character concept (e.g. *"Cyberpunk Witch"*).
2. The app calls the **Pollinations Text API** to write a 3-sentence backstory.
3. In parallel, it calls the **Pollinations Image API** to render a 512×512
   cinematic portrait.
4. Both results render side-by-side with loading spinners and graceful error
   handling.

The UI is dark-themed and modern, with example chips, a "Surprise me" button,
and clear status messaging — designed to avoid the "low-effort generator" look
that gets Flower Tier submissions rejected.

---

## Pollinations APIs used

### Text API
- **Free tier (no token):** `GET https://text.pollinations.ai/{prompt}?model=openai`
  - Returns **plain text** (no JSON parsing).
- **BYOP tier (token present):** `POST https://gen.pollinations.ai/v1/chat/completions`
  - Header `Authorization: Bearer <token>` + standard OpenAI chat JSON body.
  - Returns JSON; the app reads `data.choices[0].message.content`.

### Image API
- `https://image.pollinations.ai/prompt/{prompt}?width=512&height=512&nologo=true`
- With a BYOP token, `&token={token}` is appended to the URL.
- Both the prompt and the token are passed through `encodeURIComponent()` so
  special characters never break the request.

### Bring Your Own Pollen (BYOP)
An optional input field lets the user paste their Pollinations API token.
- **Token empty** → free public GET endpoints.
- **Token present** → authenticated POST chat endpoint for text + token appended
  to the image URL for higher rate limits.

---

## CORS / hosting notes
All Pollinations endpoints are **CORS-enabled**, so the app works directly from a
static site on GitHub Pages — **no proxy or backend server required**.

---

## Deploy to GitHub Pages

1. Create a GitHub repository and push these files (`index.html`, `README.md`)
   to the `main` (or `master`) branch.
   ```bash
   git init
   git add index.html README.md
   git commit -m "Add Character Forge AI"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source = "Deploy from a branch"**.
4. Choose your branch (`main`) and the `/ (root)` folder, then **Save**.
5. Wait ~1 minute, then open the published URL
   (`https://<you>.github.io/<repo>/`).

No build step, no environment variables, no server — the app is 100% static.

---

## Privacy
No data is stored or transmitted anywhere except to Pollinations.ai to fulfill
the generation request. The optional token lives only in the page's input field
and is sent only to Pollinations endpoints.
