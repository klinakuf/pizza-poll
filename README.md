# Pizza Poll Lounge 🍕

A silly voting app for **cursed pizza debates** — built to teach **GitHub Actions CI** and **Vercel CD**.

Vote on pineapple, ranch dip, crust-first eating, and more. Each poll has a live **chaos meter** that spikes when votes are one-sided.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Vitest](https://vitest.dev/) for unit tests
- [GitHub Actions](.github/workflows/) — tests on PRs, deploy to Vercel on merge to `main`
- [Vercel](https://vercel.com/) — production hosting (deployed by GitHub Actions)

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

## GitHub pipelines

Two workflows in [`.github/workflows/`](.github/workflows/):

| Workflow | When | What it does |
|----------|------|----------------|
| [`pr.yml`](.github/workflows/pr.yml) | Pull request → `main` | `npm ci` → `npm test` |
| [`deploy.yml`](.github/workflows/deploy.yml) | Push to `main` (after merge) | Build + deploy to Vercel production |

**Branch protection (recommended):** Settings → Branches → `main` → require status check **test** before merge.

### One-time: GitHub secrets for Vercel deploy

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret | Value |
|--------|--------|
| `VERCEL_TOKEN` | [Create token](https://vercel.com/account/tokens) (scope: full account or deploy) |
| `VERCEL_ORG_ID` | `team_HJwQZF2wUvaoArR5vL7mNbTv` |
| `VERCEL_PROJECT_ID` | `prj_FDa4SWFrcCK394DEhtGIq30v6dJs` |

Org/project IDs are in [`.vercel/project.json`](.vercel/project.json) after `npm run vercel:link`.

> If Vercel **Git integration** is also connected to this repo, turn off auto-deploy on push in Vercel → Project → Settings → Git, or you may get **two** production deploys per merge.

**Production URL:** https://project-cicd-example.vercel.app

### Manual deploy (optional)

```bash
npm run vercel:deploy
```

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
