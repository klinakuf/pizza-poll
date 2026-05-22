# Demo changes for your CI/CD workshop

Use these small PRs to show the full GitHub → Vercel loop. Each one is self-contained.

## 1. Add a new poll (easy — always green CI)

**Branch:** `feature/deep-dish-poll`

In `src/lib/polls.ts`, add a sixth poll:

```ts
{
  id: "deep-dish-is-pizza",
  question: "Is deep dish actually pizza?",
  yesLabel: "It's pizza 🏙️",
  noLabel: "It's lasagna 🍝",
  emoji: "🥧",
},
```

Update the `PollId` union type with `"deep-dish-is-pizza"`.

**What to say:** “We changed product logic → tests still pass → preview deploy shows the new card.”

---

## 2. Break a test on purpose (show CI blocking merge)

**Branch:** `demo/broken-chaos-test`

In `src/lib/polls.test.ts`, change one assertion to fail:

```ts
expect(chaosLevel(100, 0)).toBe(0); // was 100
```

**What to say:** “Red CI on the PR → fix before merge → branch protection stops bad code.”

---

## 3. Preview vs production banner (environment variables)

**Branch:** `feature/env-banner`

Already wired: `NEXT_PUBLIC_APP_ENV` drives the badge on the homepage.

1. In Vercel, set `NEXT_PUBLIC_APP_ENV` = `preview` for **Preview**
2. Set `NEXT_PUBLIC_APP_ENV` = `production` for **Production**
3. Open a PR → preview URL shows “Preview Slice”
4. Merge → production shows “Production Oven”

---

## 4. Raise the chaos cap (logic change + test update)

**Branch:** `feature/mega-chaos`

Change `chaosLevel` in `src/lib/polls.ts` to multiply split by `2.5` instead of `2`, cap at 100.

Update the test `expect(chaosLevel(75, 25)).toBe(50)` to the new expected value.

**What to say:** “Business rule changed → we updated the test → CI proves we didn’t break math.”

---

## 5. Add a “most chaotic poll” headline (UI-only)

**Branch:** `feature/chaos-winner`

On the homepage, above the list, show which poll currently has the highest `chaos` score.

No API changes needed — compute from existing `polls` state.

**What to say:** “Frontend-only change still runs lint + build in CI; Vercel preview for designers/stakeholders.”

---

## Suggested live demo script (15 min)

1. Show local app: `npm run dev`
2. Push repo to GitHub, connect Vercel (import project)
3. Enable branch protection: require `CI` status on `main`
4. PR #1 (new poll) → green checks → Vercel preview link → merge → production
5. PR #2 (broken test) → red CI → fix → green → merge
6. Optional: show Vercel deployment dashboard vs GitHub Actions tab side by side
