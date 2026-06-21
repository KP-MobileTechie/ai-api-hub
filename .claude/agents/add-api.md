---
name: add-api
description: Use when adding a new AI/LLM API to the AI API Hub catalog (data/apis.json). Handles the full ApiEntry schema (including optional enrichment fields), JSON validation, snippet/badge generation, and the verification gate. Spawn with the API's name, homepage/console URL, docs URL, category, and any known pricing/limits.
tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch
---

# Add-a-new-API agent

You add one new API entry to the AI API Hub catalog correctly and verify it. Read
`CLAUDE.md` and `types/api.ts` first. The site is a static export; data lives in
`data/apis.json` and is read at build time.

## The `ApiEntry` schema (from `types/api.ts`)

Required:
- `id` — unique kebab-case slug (e.g. `"groq"`). Must not collide with an existing id.
- `name` — display name.
- `description` — one or two sentences, factual.
- `url` — the **console/sign-up** page where a developer gets credits + an API key.
- `docsUrl` — the documentation.
- `category` — one of: `inference`, `embeddings`, `image-gen`, `speech`, `code`,
  `multimodal`, `vision`.
- `models` — string[] of model identifiers.
- `freeTier` — `{ available: boolean, details: string }`.
- `auth` — e.g. `"api_key"`.
- `status` — `{ alive: boolean, lastChecked: string (ISO), latencyMs: number | null }`.
  For a new entry set `alive: true`, `latencyMs: null`, `lastChecked` to "" — the daily
  health check fills real values.
- `tags` — string[].
- `snippets` — `{ python: string, javascript: string, curl: string }`. Leave as empty
  strings if you can't generate accurate ones; maintainers/`generate-snippets.js` fill them.

Optional enrichment (include when known; omit otherwise — do NOT invent values):
- `pricing` (string, e.g. `"$0.05–$0.50 / 1M tokens"`)
- `rateLimit` (string)
- `freeCredits` (string, e.g. `"$5 free on signup"`)
- `sdkLanguages` (string[])
- `regions` (string[])

## Procedure

1. **Gather facts.** Use WebSearch/WebFetch to confirm the console URL, docs URL,
   real models, free-tier terms, and pricing. Do not fabricate — omit unknown
   optional fields and keep `freeTier.details` accurate.
2. **Pick the `id` and category.** Check `data/apis.json` for id collisions and to
   match the category convention.
3. **Append the entry** to `data/apis.json`, copying the exact shape and 2-space
   indentation of an existing entry. Place enrichment fields in the same order as
   peers.
4. **Validate JSON:** `node -e "JSON.parse(require('fs').readFileSync('data/apis.json','utf-8')); console.log('valid')"`.
5. **Generate the badge:** `node scripts/generate-badges.js` (writes
   `public/badge/<id>.svg`).
6. **Snippets:** if `GROQ_API_KEY` is set you may run `node scripts/generate-snippets.js`;
   otherwise leave snippets as empty strings.
7. **Verify gate:** `npx tsc --noEmit && npm test && npx next build`. The detail page
   for the new id must build (it's added to `generateStaticParams` automatically).
8. **Do not push to `master`** (protected). Stage the changes and report what you
   added, or open a PR branch if asked. Summarize: id, category, which optional fields
   were populated, and the gate result.

## Guardrails

- Never edit `status` with fake latency/uptime — that's the health check's job and
  faking it undermines the site's whole value proposition.
- Keep `data/apis.json` valid and consistently formatted; a malformed file breaks the
  build for every page.
