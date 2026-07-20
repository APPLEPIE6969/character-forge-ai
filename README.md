# Character Forge AI

A polished, fully-static web app that turns a single character concept into a
**vivid 3-sentence backstory** and a **cinematic portrait**, generated live by
[Pollinations.ai](https://pollinations.ai). Hosted with **zero build steps**
on GitHub Pages.

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
and clear status messaging.

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
The app uses the **Pollinations BYOP App flow** (legacy fragment flow), which
works with no backend server:

1. Click **Connect with Pollinations**. You're sent to the Pollinations consent
   screen, authorized with this app's publishable **App Key (`pk_...`)**.
2. After approving, Pollinations redirects back with a scoped, user-authorized
   key (`sk_...`) in the URL **fragment** (`#api_key=...`). The fragment never
   hits server logs.
3. The app captures that key, attributes usage to the app, and spends the user's
   own Pollen balance. The key is kept in `sessionStorage` for the session and
   can be cleared with **Disconnect**.

**Security:** a random `state` value (generated with `crypto.getRandomValues`
and stored in `sessionStorage`) is sent on the redirect and verified against the
echoed value on return, protecting against CSRF. A check also ensures the page is
served over `http(s)` before starting the flow. No secret or client secret is
ever stored in the static client.

If connected (or a token is pasted manually):
- Text uses the authenticated `POST https://gen.pollinations.ai/v1/chat/completions`
  with `Authorization: Bearer <key>`.
- The image URL gets `&token=<key>` appended for higher rate limits.

If not connected, the app falls back to the free public GET endpoints.

**Configuration:** set your `pk_...` App Key in the `APP_KEY` constant near the
top of the `<script>` in `index.html` (create one at enter.pollinations.ai).
The App Key is publishable and safe to ship in static client code.

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
