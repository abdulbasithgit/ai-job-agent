# AI Job Agent

A local AI agent that (once all phases are done) runs every day at 9:00 AM, searches for software jobs
(Angular / React / TypeScript / JavaScript / Node.js / Full Stack / AI), asks an LLM how well each job fits
your profile, picks the top 5 and emails them to you — all running on your Windows 11 machine with Docker.
No AWS, no paid cloud.

We build this in 10 phases. **This repository currently contains Phase 1 only.**

---

## Phase roadmap

| Phase | What we add | Status |
|-------|-------------|--------|
| 1 | Node.js + TypeScript skeleton, config, user profile, logger | ✅ done |
| 2 | Mock job data + `JobSearchService` abstraction | ✅ done |
| 3 | Deterministic ranking + duplicate detection | pending |
| 4 | LLM integration (`AI_PROVIDER=mock \| openai`, later `ollama`) | pending |
| 5 | Agent workflow (`runJobAgent()`) | pending |
| 6 | PostgreSQL storage (jobs, evaluations, agent runs) | pending |
| 7 | Email service (SMTP) | pending |
| 8 | Cron scheduler (`JOB_AGENT_CRON=0 9 * * *`) | pending |
| 9 | Dockerfile + docker-compose (job-agent + postgres) | pending |
| 10 | Run the full system locally | pending |

---

## Phase 1 — a working TypeScript app with configuration and logging

### 1. What Phase 1 does

It starts a TypeScript program that:

1. loads environment variables from `.env` (falling back to sensible defaults),
2. loads and **validates** your user profile from `config/profile.json`,
3. prints a structured, timestamped log of what it loaded,
4. exits cleanly — and with a clear error message if something is misconfigured.

No jobs, no AI, no database yet. That is intentional.

### 2. Why we need it

Every later phase depends on two boring things: *configuration* and *logging*.

- The agent must know **who you are** (skills, locations, experience) before it can judge a job. That data lives in
  one JSON file so it is never hardcoded across services.
- The agent will run **unattended at 9 AM inside a Docker container**. You will not be watching it. Logs are the only
  way to see what it did, so they exist from line one.
- Doing this first means when we add the AI in Phase 4, we only debug the AI — not the plumbing.

### 3. How it works

```text
.env  +  config/profile.json
            │
            ▼
   src/config/config.ts        loadConfig() reads env + file
            │                  and validates the profile shape
            ▼
   src/models/userProfile.ts   UserProfile type + parseUserProfile()
            │
            ▼
   src/index.ts                entry point: load config, log it
            │
            ▼
   src/utils/logger.ts         timestamped INFO/WARN/ERROR output
```

File by file:

- **`package.json`** — project manifest: dependencies and the `npm run` commands.
  `dev` (watch mode), `agent` (run once), `build` (compile TS → JS in `dist/`), `start` (run compiled JS),
  `typecheck` (compile without emitting, i.e. "is my code type-correct?").
- **`tsconfig.json`** — TypeScript compiler settings. `strict: true` catches most bugs before you run anything;
  `rootDir: src`, `outDir: dist` keeps source and compiled output separate (Docker will only ship `dist/` later).
- **`.env.example`** — the *documented template* of environment variables. You copy it to `.env` and fill in secrets.
  `.env` is gitignored so passwords and API keys never reach GitHub.
- **`config/profile.json`** — your profile: skills, preferred locations, years of experience, preferred roles, search
  keywords. Change this file and the whole agent's behaviour changes; no code edits.
- **`src/models/userProfile.ts`** — the `UserProfile` TypeScript interface plus `parseUserProfile()`, which checks the
  JSON actually has the right fields. JSON from disk is untrusted input, so we validate instead of trusting it.
- **`src/config/config.ts`** — the single place that reads `process.env` and the profile file. Nothing else in the app
  touches `process.env`, which makes testing easy later.
- **`src/utils/logger.ts`** — a tiny leveled logger (`debug`/`info`/`warn`/`error`) with timestamps, honouring
  `LOG_LEVEL`. Errors and warnings go to stderr, everything else to stdout — which is exactly what Docker expects.
- **`src/index.ts`** — the entry point. Loads config, logs a summary, and wraps everything in `try/catch` so a bad
  config produces a readable message instead of a stack-trace crash.

### 4. Where it fits in the agent architecture

This is the agent's **memory of you** plus its **voice**. In the target architecture:

```text
Windows 11 → Docker Desktop
   ├── AI Job Agent
   │      ├── config      ← Phase 1 (this)
   │      ├── logger      ← Phase 1 (this)
   │      ├── scheduler         (Phase 8)
   │      ├── jobSearchService  (Phase 2)
   │      ├── aiEvaluationService (Phase 4)
   │      └── emailService      (Phase 7)
   └── PostgreSQL               (Phase 6)
```

### 5. Prerequisites

- Node.js 20+ (`node -v`)
- Git
- Docker Desktop — **not needed until Phase 9**, but install it now if you like

### 6. Installation and how to run it

```bash
git clone <your-repo-url>
cd ai-job-agent
npm install
copy .env.example .env      # Windows PowerShell/cmd;  cp .env.example .env on Linux/macOS
npm run agent
```

Other commands:

```bash
npm run dev        # same thing, but restarts automatically when you edit a file
npm run typecheck  # type-check only
npm run build      # compile to dist/
npm start          # run the compiled dist/index.js
```

### 7. Expected output

```text
2026-01-01T09:00:00.000Z [INFO] AI Job Agent starting (Phase 1)
2026-01-01T09:00:00.001Z [INFO] Environment: development
2026-01-01T09:00:00.001Z [INFO] Profile loaded from: C:\...\ai-job-agent\config\profile.json
2026-01-01T09:00:00.001Z [INFO] User: Abdul Basith (8 years experience)
2026-01-01T09:00:00.001Z [INFO] Skills: Angular, React, TypeScript, JavaScript, Node.js, HTML, CSS, REST API, Docker
2026-01-01T09:00:00.001Z [INFO] Preferred locations: Saudi Arabia, Remote
2026-01-01T09:00:00.001Z [INFO] Preferred roles: Senior Software Engineer, Senior Frontend Developer, Full Stack Developer, AI Full Stack Developer
2026-01-01T09:00:00.001Z [INFO] Phase 1 complete: config, profile and logging are working
```

### 8. How to test it (manually, for now)

1. `npm run agent` → you should see the log above.
2. Break the profile on purpose: delete the `"skills"` line from `config/profile.json` and run again.
   Expected: `[ERROR] Startup failed: User profile field "skills" must be an array of strings` and exit code 1
   (check with `echo $LASTEXITCODE` in PowerShell). Then put it back.
3. Set `LOG_LEVEL=warn` in `.env` and run again → the INFO lines disappear. Set it back to `info`.

Automated tests arrive in Phase 3, once there is real logic worth asserting on.

---

## Your Phase 1 exercise

Add a **`minimumSalaryUsd`** number field to the profile, end to end:

1. add `"minimumSalaryUsd": 60000` to `config/profile.json`;
2. add it to the `UserProfile` interface;
3. validate it in `parseUserProfile()` — it must be a number (reuse `requireNumber`);
4. log it from `src/index.ts` as `Minimum salary: 60000 USD`;
5. run `npm run typecheck` then `npm run agent`.

Bonus: make it **optional** (`minimumSalaryUsd?: number`) and log `Minimum salary: not specified` when it is absent.
That is the pattern we will need for the optional `salary` field on the `Job` model in Phase 2.

You will know you understand Phase 1 when you can answer: *why does the profile live in a JSON file instead of
`config.ts`?*

---

## Phase 2 — the `Job` model and the job search abstraction

### 1. What Phase 2 does

The app now **fetches jobs**. On top of Phase 1 it adds:

- a `Job` type (the shape of one posting) and a `JobSearchCriteria` type (what we are looking for),
- a `JobSearchService` **interface** — the contract any job source must satisfy,
- `MockJobSearchService` — 20 sample postings, returned asynchronously,
- a small factory that picks the provider from `JOB_PROVIDER`,
- two helpers: `normalizeJobUrl()` (for Phase 3 duplicate detection) and `formatSalary()`.

Running `npm run agent` now prints all 20 jobs. No AI, no filtering, no database yet.

### 2. Why we need it

Two reasons, and both are about **not getting stuck later**.

- **Testability.** Real job boards are rate-limited, need API keys, change their HTML, and are often off-limits
  to scrapers. If the agent depended on one now, you could never run it 50 times in an afternoon while learning.
  A mock provider makes the whole agent runnable offline, instantly, for free, with *the same data every time* —
  which is exactly what you want when debugging ranking and prompts.
- **Replaceability.** The agent will depend on the **interface**, never on the mock. Swapping in a real provider
  later is one new class plus one line in the factory. This is dependency inversion, and it's the single most
  useful design idea in this project.

The sample data is deliberately **messy**, because clean data teaches you nothing:

- 4 of the 20 are duplicates of earlier postings — same job, different URL (tracking query string, `www.`,
  uppercase host, trailing slash). Phase 3 must catch all four.
- Several are bad matches on purpose (Java/Spring, WordPress/PHP, Python ML, on-site Dubai). A good agent must
  *reject* jobs, not just rank them.

### 3. How it works

```text
config.jobProvider ("mock")
        │
        ▼
createJobSearchService()            ← factory: config value → concrete class
        │ returns JobSearchService   ← interface, the only thing index.ts knows about
        ▼
MockJobSearchService.searchJobs(criteria)
        │  (50ms fake latency, then a deep copy of MOCK_JOBS)
        ▼
   Job[]  →  logged by index.ts
```

New files:

- **`src/models/job.ts`** — `Job`, `JobSearchCriteria`, plus:
  - `normalizeJobUrl()` — strips protocol, `www.`, query string and trailing slash, lowercases the host, so
    `https://JOBS.example.com/a/b/?utm_source=x` and `https://jobs.example.com/a/b` become the same key. This is
    the unique identifier we will use in Postgres to guarantee a job is never emailed twice.
  - `formatSalary()` — returns `"Salary information unavailable"` when salary is missing. The rule "never invent
    missing information" is enforced in **code**, not left to the LLM's good behaviour.
- **`src/services/jobSearchService.ts`** — the interface. ~5 lines, and the most important file in the phase.
- **`src/services/mockJobs.ts`** — the 20 sample postings (data, not logic).
- **`src/services/mockJobSearchService.ts`** — the mock implementation. It is `async` and adds 50 ms of fake
  latency so callers must treat job search as real I/O; it returns **copies** so no caller can mutate the fixture.
  It intentionally does **not** filter — a real board also hands you junk; filtering is the agent's job.
- **`src/services/jobSearchServiceFactory.ts`** — maps `JOB_PROVIDER` to a class. The `never` assignment in the
  `default` branch makes TypeScript fail the build if you add a provider to the union and forget to handle it here.

Changed files: `config.ts` gains `jobProvider` and `maxJobsPerSearch`; `index.ts` is now `async` and performs a
search; `.env.example` documents the two new variables.

### 4. Where it fits in the agent architecture

`JobSearchService` is the agent's first **tool** — its way of perceiving the outside world. Later phases add more
tools (database, LLM, SMTP). The agent code will only ever talk to interfaces, which is why we can start with a mock
and a `mock` LLM and still end up with a real system.

### 5. How to run it

```bash
git pull
npm install
npm run agent
```

### 6. Expected output

```text
... [INFO] AI Job Agent starting (Phase 2)
... [INFO] Searching jobs via "mock" provider...
... [INFO] Found 20 jobs
... [INFO] - Senior Frontend Engineer (Angular) | Nour Tech | Riyadh, Saudi Arabia | SAR 25,000 - 32,000 / month
... [INFO] - Full Stack Developer (React + Node.js) | Cloudline | Remote | Salary information unavailable
... (18 more, including 4 duplicates at the end)
... [INFO] Phase 2 complete: job model and job search provider are working
```

Note the second line: the job has no salary, and the output says so instead of guessing.

### 7. How to test it

1. `npm run agent` → 20 jobs listed, the last four repeating earlier titles.
2. `MAX_JOBS_PER_SEARCH=5` in `.env` → `Found 5 jobs`.
3. `JOB_PROVIDER=indeed` in `.env` → `[ERROR] Agent failed: Unsupported JOB_PROVIDER "indeed". Supported values: mock`.
   Bad configuration fails loudly and early.
4. `LOG_LEVEL=debug` → you also see the criteria the provider received.

Automated tests for duplicate detection and ranking arrive with Phase 3.

### Your Phase 2 exercise

Write a throwaway script `scratch.ts` in the project root and run it with `npx tsx scratch.ts`:

```ts
import { normalizeJobUrl } from './src/models/job';

console.log(normalizeJobUrl('https://JOBS.example.com/cloudline/fullstack-react-node/'));
console.log(normalizeJobUrl('https://jobs.example.com/cloudline/fullstack-react-node'));
console.log(normalizeJobUrl('https://www.jobs.example.com/marsad-ai/lead-fullstack-ai'));
```

1. Confirm the first two print **the same** string.
2. Now count how many *unique* jobs the mock returns: import `MOCK_JOBS`, map every job through `normalizeJobUrl`,
   put them in a `new Set(...)` and print `set.size`. You should get **16**.
3. Question to answer for yourself: `index.ts` never imports `MockJobSearchService`. Why is that a good thing, and
   what exactly would you have to change to add a real job board in Phase 4+?

Delete `scratch.ts` afterwards — Phase 3 replaces it with real automated tests.

---

## Docker mental model (preview — we actually use it in Phase 9)

```text
Dockerfile      a recipe: "start from node:20, copy these files, run npm ci, run node dist/index.js"
   ↓ docker build
Docker Image    the cake, baked and frozen: a read-only snapshot of OS + Node + your code
   ↓ docker run
Container       a running slice of that cake: an isolated process with its own filesystem and network
   ↓
Docker Compose  the party planner: one YAML file that starts several containers together
                (job-agent + postgres), wires their network, and keeps Postgres data in a volume
```

Simple analogy: the **Dockerfile** is the recipe, the **image** is the frozen meal, the **container** is the meal
being eaten, and **Compose** is the menu that serves several dishes at once. A **volume** is the fridge — it survives
after the meal is finished, which is why `docker compose down` will not erase your database.

---

## Learning goal: normal AI app vs AI agent

**Normal AI application** — one shot, the human drives:

```text
User → prompt → LLM → response → User
```

The human decides what to ask, when to ask, and what to do with the answer.

**AI agent** — a goal, and a loop that the software drives:

```text
Goal ("email me the 5 best jobs today")
  ↓
decide what to do next
  ↓
use a tool (job search API, database, LLM, SMTP)
  ↓
observe the result
  ↓
decide again / repeat
  ↓
goal complete — without a human in the loop
```

Why **this** project is an agent:

- It has a **standing goal**, not a single question: "every day, find and deliver the 5 best jobs for this profile."
- It is **triggered by time, not by a human** (the 9 AM cron in Phase 8).
- It **uses tools**: a job search provider, a PostgreSQL database, the LLM, an SMTP server.
- It has **memory**: previously processed jobs are stored, so the same job is never emailed twice. Memory across runs
  is what makes it an agent rather than a script.
- It **acts on the world** on its own: it sends you an email; nobody clicks "send".
- It **degrades gracefully**: if the LLM fails on one job it continues with the rest, and keeps working toward the goal.

Which parts are which:

| Part | Kind |
|------|------|
| config loading, logging, TypeScript types, Docker setup | ordinary application code |
| job search HTTP calls, SQL queries, SMTP send | tools the agent uses |
| the LLM judging fit and returning a structured score + `APPLY` recommendation | AI reasoning |
| `runJobAgent()` orchestrating goal → search → dedupe → evaluate → rank → store → email, with memory and recovery | agent behaviour |

A useful honest note: this will be a **workflow-style agent** — we define the steps and the LLM does the judging inside
them. A fully *autonomous* agent would let the LLM choose which tool to call next. Workflow agents are far easier to
debug, cheaper, and are what most production "AI agents" actually are. We can add LLM-chosen tool calling later.

---

## Next

Say **"Next"** and we move to **Phase 3: duplicate detection and deterministic job ranking** (still no LLM — first
we build a baseline ranking we can compare the AI against, plus the first automated tests).
