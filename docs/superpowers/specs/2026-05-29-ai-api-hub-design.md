# AI API Hub - Design Spec

**Date:** 2026-05-29
**Status:** Approved

---

## What We Are Building

A publicly hosted web app + GitHub repo that lists AI and LLM APIs. Every entry is health-checked daily via GitHub Actions. Each API shows whether it is live, what the free tier looks like, and includes ready-to-copy code snippets in Python, JavaScript, and cURL. The repo is the source of truth and community members contribute new APIs via pull requests.

Target audience: developers looking for the right AI API for their project, especially ones with free tiers.

Goal: become the go-to bookmark for "which AI API should I use today and how do I call it."

---

## Architecture

```
ai-api-hub/
  data/
    apis.json              # all API entries, single source of truth
    history.json           # last 7 days of status per API id
  app/                     # Next.js 14 app router
    page.tsx               # homepage: search + filter + grid
    api/[id]/
      page.tsx             # detail page: full info + code snippets
    layout.tsx
    globals.css
  components/
    ApiCard.tsx
    SearchBar.tsx
    FilterChips.tsx
    CodeSnippet.tsx
    StatusBadge.tsx
  scripts/
    health-check.js        # run by GitHub Actions, pings each API
    generate-snippets.js   # run once when adding a new API entry
  .github/
    workflows/
      health-check.yml     # cron schedule: daily, commits status back
  public/
  package.json
  tailwind.config.ts
  next.config.ts
```

Data lives in `apis.json`. GitHub Actions runs `health-check.js` every 24 hours, updates the `status` field for each entry, and commits the result back to main. Vercel picks up the commit and redeploys in about 30 seconds. No external database needed.

---

## Data Model

Each entry in `apis.json` follows this shape:

```json
{
  "id": "groq",
  "name": "Groq",
  "description": "Ultra-fast LLM inference using LPU hardware.",
  "url": "https://console.groq.com",
  "docsUrl": "https://console.groq.com/docs",
  "category": "inference",
  "models": ["llama3-8b", "llama3-70b", "mixtral-8x7b", "gemma-7b"],
  "freeTier": {
    "available": true,
    "details": "14,400 req/day, 30 req/min"
  },
  "auth": "api_key",
  "status": {
    "alive": true,
    "lastChecked": "2026-05-29T06:00:00Z",
    "latencyMs": 210
  },
  "tags": ["llm", "inference", "fast", "open-weight"],
  "snippets": {
    "python": "from groq import Groq\n\nclient = Groq(api_key=\"YOUR_KEY\")\nres = client.chat.completions.create(\n    model=\"llama3-8b-8192\",\n    messages=[{\"role\": \"user\", \"content\": \"Hello\"}]\n)\nprint(res.choices[0].message.content)",
    "javascript": "import Groq from 'groq-sdk'\n\nconst groq = new Groq({ apiKey: process.env.GROQ_API_KEY })\nconst res = await groq.chat.completions.create({\n  model: 'llama3-8b-8192',\n  messages: [{ role: 'user', content: 'Hello' }]\n})\nconsole.log(res.choices[0].message.content)",
    "curl": "curl https://api.groq.com/openai/v1/chat/completions \\\n  -H 'Authorization: Bearer YOUR_KEY' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"model\":\"llama3-8b-8192\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}'"
  }
}
```

Categories: `inference`, `embeddings`, `image-gen`, `speech`, `code`, `multimodal`, `vision`

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, static export via `output: 'export'`; detail pages use `generateStaticParams` to pre-render all API routes at build time)
- **Styling:** Tailwind CSS + custom CSS variables for the Glass Premium theme
- **Fonts:** Plus Jakarta Sans (body), Manrope (display/headings), IBM Plex Mono (data and code)
- **Deployment:** Vercel (free tier, auto-deploy on push)
- **Automation:** GitHub Actions (health checks + auto-commit)
- **No database:** `apis.json` is the database

---

## Visual Design

**Theme:** Glass Premium
- Background: deep navy-black (`#07060f`) with three large blurred gradient orbs that slowly drift
- Cards: `rgba(255,255,255,0.04)` with `backdrop-filter: blur(12px)`, subtle border, gradient glow on hover
- Accent: purple (`#a855f7`) to cyan (`#06b6d4`) gradient used for headings, buttons, and active states
- Live indicator: pulsing green dot (`#34d399`) with `box-shadow` glow animation
- Down indicator: static red dot (`#f87171`)
- Free tier badge: soft purple tint
- No em dashes anywhere in UI copy, code comments, or docs

**Key UI sections:**
1. Sticky nav with live count pill
2. Hero with gradient headline, 4 stat counters, and search bar with keyboard shortcut hint
3. Filter chips row (category + free-tier toggle)
4. 3-column card grid, sorted free-first then by popularity
5. Each card shows: name, category, live/down status, description, free tier details, tags, latency, and snippet language buttons
6. Footer strip with last-check time and GitHub link

---

## GitHub Actions: Health Check

`.github/workflows/health-check.yml` runs on a cron schedule every day at 06:00 UTC.

Steps:
1. Checkout repo
2. Run `node scripts/health-check.js`
3. Script reads `data/apis.json`, pings a test endpoint for each API, records `alive`, `latencyMs`, and `lastChecked`
4. Script writes updated `apis.json` back to disk
5. Action commits the change with message `chore: daily health check [skip ci]`
6. Vercel deploys from the new commit

Health check logic: a simple `GET` or `OPTIONS` request to the API's base URL with a 5 second timeout. If it responds with any 2xx or 4xx (auth error counts as alive), the API is marked alive. 5xx or timeout marks it down.

---

## Code Snippet Generation

`scripts/generate-snippets.js` is run manually when a new API is added:

```
node scripts/generate-snippets.js --id groq
```

It reads the API entry from `apis.json`, calls the Groq API (llama3-70b) to generate Python, JavaScript, and cURL snippets, and writes them back into the entry. Snippets are stored statically in the JSON so the site has zero runtime AI cost.

---

## Pages

### Homepage (`/`)
- Search filters `apis.json` client-side (no server call needed at runtime)
- Filter chips narrow by category and free tier
- Grid of `ApiCard` components
- All data is static (loaded at build time from `apis.json`)

### Detail page (`/api/[id]`)
- Full description, all models, pricing notes
- Tabbed code snippet viewer (Python / JS / cURL)
- Status history (last 7 days from a small `history.json` file)
- Link to official docs

---

## Community Contributions

New APIs are added via pull requests. The contributor edits `apis.json` and adds a new entry without snippets (snippets are generated in CI or by maintainers). A PR template guides contributors on the required fields. The `generate-snippets.js` script is run before merge.

---

## Launch Plan

1. Seed with 30 to 50 well-known AI APIs
2. Push to GitHub with a good README (badges, screenshots, contribution guide)
3. Deploy to Vercel
4. Post on Reddit (r/MachineLearning, r/webdev, r/artificial), Hacker News Show HN, and X/Twitter
5. Submit to Product Hunt

---

## What Makes This Viral

- Live status checks: no other AI API list tells you if the API is actually working today
- Free tier focus: the most searched question among devs is "which AI API has a free tier"
- Copy-paste snippets: zero friction to try any API
- Community-driven: PRs feel meaningful because the data is useful and current
- Screenshot-worthy UI: the Glass Premium design looks great when shared
