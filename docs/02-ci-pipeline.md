# 02 — CI Pipeline

> **Goal:** Build a realistic continuous integration workflow — checkout, install, lint, test, and upload artifacts.

## What This Workflow Does

On every push to `main` or any pull request targeting `main`, it:

1. Checks out the repository code
2. Sets up Node.js 20 with npm caching
3. Installs dependencies
4. Runs the linter
5. Runs the test suite
6. Uploads test results as an artifact (even if tests fail)

## Key Concepts

### `actions/checkout@v4`

```yaml
- uses: actions/checkout@v4
```

Almost every workflow starts with this. Without it, the runner has an **empty workspace** — it doesn't automatically have your code.

### `actions/setup-node@v4` with Caching

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

- Installs the specified Node.js version.
- `cache: 'npm'` automatically caches the npm global cache directory. On subsequent runs, `npm ci` skips downloading packages that haven't changed — **massive speedup**.

### `npm ci` vs `npm install`

| Command | Behavior |
|---|---|
| `npm install` | Updates `package-lock.json` if something drifts |
| `npm ci` | Strictly follows `package-lock.json`, deletes `node_modules` first — **deterministic & faster** |

Always use `npm ci` in CI.

### `working-directory`

```yaml
- run: npm ci
  working-directory: src
```

If your `package.json` isn't in the repo root, set `working-directory` on the step.

### Uploading Artifacts

```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-results
    path: src/test-results/
    retention-days: 7
```

- **`if: always()`** — upload even if tests fail, so you can diagnose failures.
- **`retention-days`** — how long GitHub keeps the artifact (default 90).
- Artifacts appear in the workflow run's summary page as downloadable zip files.

### Trigger: `pull_request`

```yaml
on:
  pull_request:
    branches: [main]
```

Runs when a PR is opened, updated (new commits pushed), or reopened against `main`. The workflow checks out the **merge commit** (your branch merged into the target), not just your branch HEAD.

## Try It

1. Create a branch, make a change in `src/`, and open a PR to `main`.
2. Watch the CI workflow run on the PR — the status check appears directly in the PR timeline.
3. Download the test-results artifact from the workflow run summary.

## Next Up

[03 — Scheduled Cron](03-scheduled-cron.md) shows how to run workflows on a timer.
