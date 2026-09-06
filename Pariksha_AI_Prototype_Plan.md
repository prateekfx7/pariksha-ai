# Pariksha AI — Prototype Implementation Plan
**SIH26101 | Team Aura Farmers | Built on Google Antigravity**

*Diagnose the Gap. Personalize the Path.*

---

## 1. What We're Building (Recap)

**Problem:** Officers across India's Official Statistical System have to keep pace with survey design, GIS, data science and AI — but no one can see which specific skills a given officer is missing. Training on iGOT Karmayogi stays generic, and every quiz has to be handwritten by a trainer.

**Solution:** Pariksha AI sits on top of iGOT Karmayogi. It scores each officer against a statistics-specific skill framework, recommends the exact courses that close their biggest gaps, and turns any uploaded PDF/PPT into a ready-to-use quiz.

**Prototype scope:** A clickable/working demo of 5 features — not the full product. Auth/SSO, real iGOT API integration, and production security are mocked with dummy data so build time goes into the visible AI features.

---

## 2. Top 5 Features to Build

| # | Feature | Why it's in the demo |
|---|---------|----------------------|
| 1 | **Competency Gap Dashboard** | Visual proof the AI "sees" the gap — radar/bar chart, current vs. required skill level |
| 2 | **Personalized Course Recommendations** | Shows gaps → iGOT courses, ranked by relevance |
| 3 | **AI Quiz/MCQ Generator** | Upload a PDF/PPT → auto-generated MCQs with difficulty tags — the signature feature named directly in the PS |
| 4 | **Take Quiz → Instant Score → Profile Update** | Closes the loop: score feeds back into the competency dashboard live |
| 5 | **Admin Analytics View** | Department/cadre-wide skill-gap heatmap — the org-level payoff, not just individual UX |

---

## 3. Implementation Plan on Google Antigravity

Antigravity is agent-first (Gemini 3, Manager View for parallel agents, Nano Banana for instant UI, built-in browser preview). The plan below leans on delegating whole features to separate agents rather than hand-coding everything.

### Phase 1 — Scaffold (Day 1, ~1 hr)

Open **Manager View** → spawn one agent:

```
Scaffold a Next.js + Tailwind frontend and a FastAPI backend.
Pages: /dashboard, /recommendations, /quiz-generator, /quiz/[id], /admin-analytics.
Use dummy JSON for user, course, and quiz data for now.
```

Let this agent finish and commit before spawning any others — avoids merge conflicts.

### Phase 2 — UI First, with Nano Banana (Day 1, ~2 hrs)

Prompt Nano Banana **one screen at a time** (easier to review/regenerate a single screen than all five at once):

```
Generate a clean, government-dashboard-style UI for a Competency Gap
Dashboard showing a radar chart of skills vs. required level.
Color scheme: navy, teal, gold.
```

```
Generate a UI for a Personalized Course Recommendations screen —
a ranked list of course cards, each tagged with the skill gap it closes.
Same navy/teal/gold theme.
```

```
Generate a UI for a Quiz Generator screen: PDF/PPT upload zone,
a "Generate Quiz" button, and a preview list of generated MCQs
with difficulty tags (Easy/Medium/Hard).
```

```
Generate a UI for a quiz-taking screen: one MCQ per screen,
progress bar, and a results/score screen at the end.
```

```
Generate a UI for an Admin Analytics screen: a department-wise
heatmap of skill gaps plus a summary stats row at the top.
```

### Phase 3 — Parallel Feature Agents (Day 2)

Run these **simultaneously** in separate Workspaces:

**Agent A — Competency Scoring**
```
Build rule-based competency scoring logic. Compare a mock officer
skill JSON against a required-skills JSON per role. Output a
per-skill gap score (0-100) and an overall priority ranking of gaps.
```

**Agent B — Quiz Generator**
```
Build a quiz generator endpoint: accept a PDF upload, extract text,
call the Gemini API to generate 5 MCQs with difficulty tags, and
return them as JSON with question, options, correct answer, and tag.
```

**Agent C — Recommendation Engine**
```
Build a recommendation engine: take Agent A's gap-score output,
match it against a mock iGOT course catalog (JSON), and return
courses ranked by relevance to the officer's top 3 gaps.
```

**Agent D — Admin Analytics**
```
Build an admin analytics aggregator: take mock data for 20-30
officers and aggregate their gap scores into a department-wise
heatmap dataset (department x skill, average gap score).
```

Check each agent's **artifact/walkthrough doc** as it finishes — that's the validation step before merging any of them into main.

### Phase 4 — Wire It Together (Day 2, evening)

```
Connect the quiz score output (from the quiz-taking flow) back into
the Competency Gap Dashboard so a completed quiz updates that
officer's skill profile in real time.
```

### Phase 5 — Test + Deploy (Day 3)

1. Use Antigravity's built-in browser to click through all 5 flows end-to-end.
2. Fix anything that breaks by re-prompting the relevant agent with the specific error.
3. Deploy:
   ```
   Set up a Vercel deployment config for this project and push it live.
   ```
4. **Take the live URL from this deployment and use it as the actual "Prototype Link" on the References slide** — do not use a placeholder link.

---

## 4. Suggested 3-Day Timeline

| Day | Focus |
|-----|-------|
| Day 1 | Scaffold + all 5 UI screens generated via Nano Banana |
| Day 2 | Parallel agents (A–D) build the logic; wire quiz → dashboard feedback loop |
| Day 3 | End-to-end testing, bug fixes, deploy, grab live link, record demo video as backup |

---

## 5. Notes for the Team

- Keep every "AI" feature backed by a **real, working call** (even if it's a small one) — judges can tell the difference between a real Gemini API call and a hardcoded response.
- Mock data should still look realistic (real-sounding officer names/roles, real iGOT-style course titles) — it reads as more credible on stage.
- If Phase 3 slips, cut **Admin Analytics** first — it's the least essential to prove the core "diagnose → recommend → assess" loop.
