# Pizza Poll Lounge 🍕

A silly voting app for **cursed pizza debates** — built to teach **GitHub Actions CI** and **Vercel CD**.

Vote on pineapple, ranch dip, crust-first eating, and more. Each poll has a live **chaos meter** that spikes when votes are one-sided.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Vitest](https://vitest.dev/) for unit tests
- [GitHub Actions](.github/workflows/ci.yml) — lint, test, build on every PR
- [Vercel](https://vercel.com/) — preview deploys per branch, production on `main`

## Quick start (local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test      # unit tests
npm run lint
npm run build
```

## Connect to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Pizza Poll Lounge"
```

Create a new repo on GitHub (empty, no README), then:

```bash
git remote add origin git@github.com:YOUR_USER/pizza-poll-lounge.git
git branch -M main
git push -u origin main
```

## GitHub CI pipeline

Workflow file: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

On every push and pull request to `main`:

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`

**Recommended:** Settings → Branches → branch protection on `main` → require status check **test-and-build**.

## Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → **Import** your GitHub repo
2. Framework preset: **Next.js** (auto-detected)
3. Add environment variable (optional but great for demos):

   | Name | Preview | Production |
   |------|---------|------------|
   | `NEXT_PUBLIC_APP_ENV` | `preview` | `production` |

4. Deploy — every PR gets a **Preview URL**; merging to `main` updates **Production**

> **Note:** Votes are stored in memory on the server. They reset when serverless functions cold-start. Fine for workshops; use Vercel KV or a database for persistence later.

## Workshop follow-ups

See **[DEMO_CHANGES.md](./DEMO_CHANGES.md)** for five ready-made PR ideas (new poll, broken test, env badges, chaos formula, UI feature).

## Project layout

```
src/lib/polls.ts      # poll definitions + chaos math (tested)
src/lib/store.ts      # in-memory vote tallies
src/app/api/polls/    # GET all polls + results
src/app/api/vote/     # POST a vote
src/app/page.tsx      # voting UI
```
