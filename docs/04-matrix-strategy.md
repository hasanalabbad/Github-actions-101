# 04 — Matrix Strategy

> **Goal:** Test across multiple operating systems and language versions in a single workflow.

## What This Workflow Does

Runs the same build-and-test steps across **every combination** of:

- **OS:** Ubuntu, macOS, Windows
- **Node.js:** 18, 20, 22

That's 3 × 3 = 9 jobs running in parallel (minus one exclusion = 8 jobs).

## Key Concepts

### `strategy.matrix`

```yaml
strategy:
  fail-fast: false
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]
    node-version: ['18', '20', '22']
```

GitHub Actions creates **one job for every combination** of the matrix values. Each combination runs independently on its own runner.

### `fail-fast`

```yaml
fail-fast: false
```

| Value | Behavior |
|---|---|
| `true` (default) | Cancel all remaining matrix jobs as soon as one fails |
| `false` | Let all jobs finish regardless of individual failures |

Set to `false` when you want to see the full picture (which OS/version combos pass and which don't).

### `exclude` and `include`

```yaml
exclude:
  - os: macos-latest
    node-version: '18'
```

- **`exclude`** removes specific combinations from the matrix.
- **`include`** adds extra combinations (or extra variables to existing ones):

```yaml
include:
  - os: ubuntu-latest
    node-version: '22'
    experimental: true
```

### Referencing Matrix Values

```yaml
runs-on: ${{ matrix.os }}

- uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node-version }}
```

Inside steps, `matrix.<key>` gives you the value for that specific job.

### Why Matrix Is Powerful

Without matrix, you'd need to copy-paste the same job 8 times. With matrix, you write it once and GitHub fans it out. If you later add Node 23, you just add one value to the array.

## Visualization

When a matrix workflow runs, the Actions UI shows each combination as a separate job:

```
✅ test (ubuntu-latest, 18)
✅ test (ubuntu-latest, 20)
✅ test (ubuntu-latest, 22)
❌ test (macos-latest, 20)      ← easy to spot which combo failed
✅ test (macos-latest, 22)
✅ test (windows-latest, 18)
✅ test (windows-latest, 20)
✅ test (windows-latest, 22)
```

## Try It

1. Push to `main` and watch 8 parallel jobs spin up.
2. Try adding `node-version: '16'` to the matrix and see a 9th combination appear.
3. Set `fail-fast: true`, intentionally break one combo, and watch the others cancel.

## Next Up

[05 — Reusable Workflow](05-reusable-workflow.md) shows how to define a workflow once and call it from other workflows.
