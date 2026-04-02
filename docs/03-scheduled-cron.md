# 03 — Scheduled Cron

> **Goal:** Run workflows on a timer using cron syntax.

## What This Workflow Does

Every weekday at 08:00 UTC, it runs a health check on the repository and produces a report artifact. You can also trigger it manually for testing.

## Key Concepts

### The `schedule` Trigger

```yaml
on:
  schedule:
    - cron: '0 8 * * 1-5'
```

GitHub uses standard cron syntax (5 fields):

```
┌───────────── minute (0–59)
│ ┌───────────── hour (0–23)
│ │ ┌───────────── day of month (1–31)
│ │ │ ┌───────────── month (1–12)
│ │ │ │ ┌───────────── day of week (0–6, Sunday=0)
│ │ │ │ │
* * * * *
```

Common examples:

| Cron | Meaning |
|---|---|
| `0 0 * * *` | Midnight UTC every day |
| `0 8 * * 1-5` | 08:00 UTC, weekdays only |
| `30 2 * * 0` | 02:30 UTC every Sunday |
| `0 */6 * * *` | Every 6 hours |
| `0 12 1 * *` | Noon on the 1st of each month |

### Important Caveats

1. **Minimum interval** — GitHub won't run scheduled workflows more often than every 5 minutes.
2. **Not guaranteed exact** — During heavy load, scheduled runs can be delayed by minutes (sometimes longer).
3. **Inactive repos** — If a repo has no activity for 60 days, scheduled workflows are **automatically disabled**. Push a commit to re-enable them.
4. **Default branch only** — Scheduled workflows only run on the **default branch** (usually `main`).

### Multi-line `run` Blocks

```yaml
- run: |
    echo "Line 1"
    echo "Line 2"
```

The pipe (`|`) lets you write multi-line shell scripts inside a step. Each line runs in sequence in the same shell session.

### Dynamic Artifact Names

```yaml
name: health-report-${{ github.run_number }}
```

`github.run_number` auto-increments per workflow, so each artifact gets a unique name.

## Try It

1. Use **workflow_dispatch** (manual trigger) since you don't want to wait for the cron schedule.
2. After the run completes, download the `health-report-*` artifact from the summary page.

## Next Up

[04 — Matrix Strategy](04-matrix-strategy.md) runs tests across multiple OS and language versions simultaneously.
