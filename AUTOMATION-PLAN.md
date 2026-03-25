# AnnoyingKids.com — Automation Plan

> Last updated: 2026-03-24

---

## Active Scheduled Tasks (Cloud — run while laptop is off)

### ✅ Nightly Dependency Audit
- **Schedule:** Every night at 2:00am
- **What it does:** Runs `npm audit` + `npm outdated`. If critical/high vulnerabilities found, auto-fixes non-breaking ones and opens a PR. Major version bumps flagged for human review only.
- **Output:** PR on branch `deps/nightly-audit-YYYY-MM-DD` (only if issues found)
- **Managed at:** claude.ai/code/scheduled

### ✅ Weekly Build Health Check
- **Schedule:** Every Monday at 7:00am
- **What it does:** Runs `npm install` → `tsc --noEmit` → `npm run build`. If anything fails, opens a GitHub issue with full error output and root cause diagnosis.
- **Output:** GitHub issue labeled `bug` + `automated` (only if build fails)
- **Managed at:** claude.ai/code/scheduled

---

## Planned Automation (To Be Set Up)

### Hourly Printify Stock Sync
- **Schedule:** Every hour
- **What it does:** Fetches Printify product stock levels via API. Compares against cached snapshot. Creates a GitHub issue if any product drops below 5 units. Updates cache.
- **Requires:** Printify API key in repo secrets
- **Output:** GitHub issue `stock: low inventory alert — [product name]` when triggered
- **Status:** ⏳ Waiting for Printify API key to be added to repo env vars

### Pre-Deploy Checklist (Desktop Local — manual trigger)
- **Type:** Desktop local task, manual trigger only
- **What it does:** Before any production deploy, verifies: TypeScript clean, build passes, no console.errors, env vars present, no TODO/FIXME in changed files
- **Output:** Commit `chore: pre-deploy verification passed` + Slack/email summary
- **Status:** ⏳ Set up when Desktop app is configured

### Weekly 4-Week Plan Progress Review
- **Schedule:** Every Monday at 8:00am (after build check)
- **What it does:** Reads `4-WEEK-PLAN.md`, checks how many tasks are complete, identifies overdue items, posts a progress summary
- **Output:** GitHub issue or comment with progress report
- **Status:** ⏳ To be set up — low priority, set up after first week of plan execution

### Deploy Monitoring Loop (Session-scoped `/loop`)
- **Type:** `/loop` — run manually during deploys, not persistent
- **Usage:** `ask claude: /loop 5m check if the Vercel deployment for AnnoyingKids finished`
- **What it does:** Polls Vercel deployment status every 5 minutes, notifies when done or failed
- **Status:** 📝 Ad-hoc — run manually when needed, no setup required

---

## How to Manage Active Tasks

**View all scheduled tasks:**
Ask Claude: "list my scheduled tasks" or visit claude.ai/code/scheduled

**Pause a task:**
Ask Claude: "pause the nightly dependency audit"

**Delete a task:**
Ask Claude: "delete the weekly build health check"

**Trigger manually:**
Ask Claude: "run the nightly dependency audit now"

---

## Notes

- Cloud tasks always work against a **fresh git clone** — they cannot access local/uncommitted changes
- Cloud tasks have a **minimum interval of 1 hour**
- Tasks cost tokens like any API call — monitor usage at claude.ai/settings/usage
- PRs created by automated tasks go to branch `claude/*` by default — review before merging
- If a task fails silently, check the task run history at claude.ai/code/scheduled
