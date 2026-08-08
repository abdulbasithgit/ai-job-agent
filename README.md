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
| 3 | Job matching against the profile + duplicate detection | pending |
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

## Phase 2 — mock job data and the job search service

### 1. What Phase 2 does

The app can now **find jobs**. On top of Phase 1 it adds:

- a `Job` model and a `JobSearchCriteria` model,
- a `JobSearchService` **interface** — the contract any job source must satisfy,
- `MockJobSearchService` — searches 12 sample postings by keyword and location,
- a small factory that picks the provider from `JOB_PROVIDER`,
- a console formatter and 12 unit tests.

No real job site, no scraping, no AI, no database, no email yet — those are later phases.

```text
User profile (config/profile.json)
          ↓  keywords + locations
   JobSearchService (interface)
          ↓
   MockJobSearchService  →  src/data/mockJobs.ts
          ↓
        Job[]  →  printed to the console
```

### 2. Why we need it

- **Testability.** Real job boards need API keys, rate-limit you, change their markup, and scraping most of them
  breaks their terms. If the agent depended on one now, you could never run it 50 times in an afternoon while
  learning. The mock provider makes the whole agent runnable offline, instantly, for free, with *the same data every
  time* — exactly what you want when debugging ranking and prompts later.
- **Replaceability.** The rest of the agent depends on the **interface**, never on the mock (see section 10).

### 3. Project structure after Phase 2

```text
src/
├── config/config.ts                     env + profile loading (Phase 1)
├── models/
│   ├── job.ts                           Job, JobSearchCriteria, helpers
│   └── userProfile.ts                   UserProfile (Phase 1)
├── data/
│   └── mockJobs.ts                      12 sample jobs (data only)
├── services/
│   ├── jobSearchService.ts              the interface
│   ├── mockJobSearchService.ts          the mock implementation
│   └── jobSearchServiceFactory.ts       JOB_PROVIDER → concrete class
├── utils/
│   ├── logger.ts                        logging (Phase 1)
│   └── jobFormatter.ts                  turns Job[] into readable text
└── index.ts                             coordinates: load → search → print

tests/
└── mockJobSearchService.test.ts         12 unit tests
```

**`models/job.ts` — what is a model/interface?**
A model describes the *shape* of your data: a `Job` always has a `title`, a `company`, a `url`, and so on. A
TypeScript `interface` is a compile-time description only — it produces no JavaScript. Its value is that the compiler
now rejects `job.tittle` or a job missing `company` *before* you run anything. One shared model means the search
service, the AI service, the database and the email template all agree on what a job is.

This file also holds two tiny helpers:

- `normalizeJobUrl()` — lowercases the host and strips `https://`, `www.`, the query string and any trailing slash,
  so `https://EXAMPLE.com/job/2/?utm_source=news` and `https://example.com/job/2` produce the same key. That key
  becomes the unique index in Postgres (Phase 6) that guarantees a job is never emailed twice.
- `formatSalary()` — returns `"Salary information unavailable"` when a salary is missing. The rule "never invent
  missing information" is enforced in **code**, not left to the LLM's good behaviour.

**`data/mockJobs.ts` — why fake jobs?**
So the agent has something to work on without the internet. Data lives in `data/`, separate from `services/`, because
it is *just data* — no logic. The 12 postings are a deliberate mixture: Angular, React, TypeScript, JavaScript,
Node.js, Full Stack, AI/LLM, plus a Java/Spring Boot role and a Python ML role that **should not** match well, and
locations across Riyadh, Jeddah, Dammam, Dhahran and Remote. Fake companies, `https://example.com/job/N` URLs, no
real personal data.

**`services/jobSearchService.ts` — why a service?**
A service holds behaviour ("how do I find jobs?"), keeping it out of both the data and the entry point. This file is
only the **interface** — the promise that any job source will expose `searchJobs(criteria): Promise<Job[]>`.

**`MockJobSearchService` — why a class?**
Because a job source has *identity and state*: which list of jobs it searches (`constructor(jobs = MOCK_JOBS)`), and
later an API key, a base URL, an HTTP client, a rate limiter. A class bundles that state with its behaviour and lets
us say `implements JobSearchService`, so the compiler verifies the contract. The injectable constructor is also why
the tests can search a tiny custom job list instead of the real fixture.

**`index.ts` — why only coordination?**
`index.ts` is the *wiring*, not the *work*: load config → create the service → call it → print. All the real logic
sits in testable modules. If business logic lived in `index.ts` you could not unit-test it (it runs on import), you
could not reuse it from the scheduler in Phase 8, and the file would grow forever. The scheduler will call the same
services without touching `index.ts` at all.

### 4. How the search works

```ts
matches(job) = matchesAnyKeyword(job, criteria.keywords) && matchesAnyLocation(job, criteria.locations)
```

- **Keywords** are OR-ed and checked against `title + description + skills`, case-insensitively.
- **Locations** are OR-ed and matched as substrings of `job.location`, so `"Saudi Arabia"` matches
  `"Riyadh, Saudi Arabia"` and `"Remote"` matches `"Remote"`.
- An empty array means "no filter" — `{ keywords: [], locations: [] }` returns every job.
- Matching is **whole-word**, not plain `includes`, so `"AI"` does not match `"m-ai-ntain"` and `"Java"` does not
  match `"JavaScript"`.
- `searchJobs` is `async` with 50 ms of fake latency, so callers are forced to treat job search as real I/O, and it
  returns **copies** so no caller can corrupt the fixture.

An honest limitation you will see in the output: the Java role matches, because its description contains the
sentence "does not involve frontend or JavaScript work" — and `JavaScript` is one of your keywords. Keyword search
has no idea what a sentence *means*. That is precisely the gap the LLM closes in Phase 4, and why Phase 3 adds
scoring instead of a simple yes/no filter.

### 5. How to run it

Use the scripts that already exist from Phase 1 — no new tooling:

```bash
git pull
npm install
npm run agent     # run once
npm run dev       # run and restart on file changes
npm test          # run the unit tests (node:test via tsx)
npm run typecheck # type-check only
```

### 6. Expected output

```text
... [INFO] 🤖 AI Job Agent starting...
... [INFO] 👤 Profile: Abdul Basith (8 years experience)
... [INFO] 🔎 Searching mock jobs via "mock" provider...
... [INFO] 🔍 Keywords: Angular, React, TypeScript, JavaScript, Node.js, Full Stack, AI
... [INFO] 📍 Locations: Saudi Arabia, Remote
... [INFO] ✅ Found 11 jobs
... [INFO] 📋 Jobs found:

1. Senior Angular Developer
   Company: Nour Technologies
   Location: Riyadh, Saudi Arabia
   Skills: Angular, TypeScript, RxJS, REST API
   Salary: SAR 22,000 - 28,000 / month
   URL: https://example.com/job/1

2. Full Stack Developer (React + Node.js)
   Company: Cloudline Solutions
   Location: Remote
   Skills: React, Node.js, TypeScript, PostgreSQL, Docker
   Salary: USD 4,500 - 6,000 / month
   URL: https://example.com/job/2

... 9 more
```

11 of 12, because the Python ML role in Remote matches no keyword. The criteria come from
`config/profile.json`, not from hardcoded values in `index.ts` — change the profile and the search changes.

### 7. Tests

`npm test` runs 12 tests in `tests/mockJobSearchService.test.ts`, using Node's built-in test runner (`node:test`) —
no Jest or Vitest dependency needed:

| Test | Checks |
|------|--------|
| keyword matching | searching `Angular` returns only jobs mentioning Angular |
| case-insensitive | `angular` and `ANGULAR` return identical results |
| location matching | `Saudi Arabia` returns only Saudi jobs |
| multiple keywords | `React` OR `Node.js` returns jobs matching either |
| no results | `COBOL_XYZ` returns `[]` |
| keyword AND location | `Angular` + `Remote` never returns an on-site job |
| whole-word matching | `Java` does not match `JavaScript` |
| empty criteria | returns all 12 jobs |
| immutability | mutating a returned job does not affect later searches |
| constructor injection | a custom job list can be searched |
| `normalizeJobUrl()` | casing / `www.` / query / trailing slash collapse to one key |
| `formatSalary()` | a missing salary never gets invented |

### 8. The important concept: why the interface exists

```ts
interface JobSearchService {
  searchJobs(criteria: JobSearchCriteria): Promise<Job[]>;
}
```

Today:

```text
index.ts → JobSearchService (interface) → MockJobSearchService → src/data/mockJobs.ts
```

Later:

```text
index.ts → JobSearchService (interface) → RealJobSearchService  → HTTP → job API
```

Nothing above the interface changes. To add a real provider you write one new class that implements
`searchJobs()`, add one `case` to `jobSearchServiceFactory.ts`, and set `JOB_PROVIDER=real` in `.env`. The agent
workflow, the AI evaluation, the database and the email code never learn where jobs come from. (The `default` branch
of the factory assigns to `never`, so if you extend the provider union and forget to handle it, the build fails
instead of failing at 9 AM.)

This is the same trick we will use for the LLM (`AI_PROVIDER=mock | openai | ollama`) and for email — it is how you
keep a system testable without paying for API calls.

### Your Phase 2 exercise

1. Search only Riyadh: temporarily set `"preferredLocations": ["Riyadh"]` in `config/profile.json` and run
   `npm run agent`. How many jobs come back? Put the value back afterwards.
2. Add a 13th job to `src/data/mockJobs.ts` — a "Vue.js Developer" in Jeddah. Run `npm run agent`: it should **not**
   appear (Vue is not in your keywords). Now add `"Vue"` to `keywords` in the profile and confirm it appears.
3. Add one test to `tests/mockJobSearchService.test.ts`: searching `["Spring Boot"]` returns exactly one job. Run
   `npm test`.
4. Question to answer for yourself: `index.ts` never imports `MockJobSearchService`. Why is that good, and exactly
   which files would you change to plug in a real job API?

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

Phase 2 completed.

Next phase: **Phase 3 — Job Matching and User Profile** (deterministic scoring against the profile plus duplicate
detection, still with no LLM, so we have a baseline to compare the AI against in Phase 4).

Say **"Next"** when you are ready.
