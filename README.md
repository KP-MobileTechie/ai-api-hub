# AI API Hub

**Live:** https://ai-api-hub.vercel.app

Live-tested directory of AI and LLM APIs. Free tiers highlighted. Code snippets in Python, JS, and cURL included.

Status badges are updated daily via GitHub Actions.

## Stack

- Next.js 14 with static export
- Tailwind CSS
- GitHub Actions for daily health checks
- Vercel for hosting

## Contributing

To add a new API:

1. Fork the repo
2. Add your entry to `data/apis.json` (copy the shape of an existing entry)
3. Leave `snippets` as empty strings, maintainers will generate them
4. Open a pull request

The PR template will guide you through the required fields.

## Running locally

```bash
npm install
npm run dev
```

## Generating code snippets

```bash
GROQ_API_KEY=your_key node scripts/generate-snippets.js --id <api-id>
```

## Health checks

The health check runs daily at 06:00 UTC via GitHub Actions. To run it manually:

```bash
node scripts/health-check.js
```

## License

MIT
