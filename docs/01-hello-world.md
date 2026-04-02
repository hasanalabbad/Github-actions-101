# 01 — Hello World

> **Goal:** Understand the absolute minimum needed to create a GitHub Actions workflow.

## What This Workflow Does

It prints "Hello, GitHub Actions!" and then dumps useful context variables every time someone pushes to `main` — or clicks the **Run workflow** button in the Actions tab.

## Key Concepts

### The `on:` block — Triggers

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

- **`push`** — fires every time commits are pushed to the listed branches.
- **`workflow_dispatch`** — adds a "Run workflow" button in the GitHub UI so you can trigger it manually. Very handy for testing.

You can combine as many triggers as you like.

### The `jobs:` block

```yaml
jobs:
  greet:                     # job ID — must be unique within the workflow
    runs-on: ubuntu-latest   # which runner to use
    steps: [...]
```

- A workflow has one or more **jobs**.
- Each job picks a **runner** (`ubuntu-latest`, `macos-latest`, `windows-latest`, or a self-hosted label).
- Steps inside a job run **sequentially**. Jobs themselves run **in parallel** unless you add `needs:`.

### Steps: `run` vs `uses`

| Keyword | Purpose | Example |
|---|---|---|
| `run:` | Execute a shell command | `run: echo "hello"` |
| `uses:` | Use a pre-built action from the Marketplace | `uses: actions/checkout@v4` |

### Context Variables

GitHub injects a rich set of [context objects](https://docs.github.com/en/actions/learn-github-actions/contexts):

| Expression | Value |
|---|---|
| `${{ github.event_name }}` | `push`, `pull_request`, `schedule`, etc. |
| `${{ github.ref }}` | `refs/heads/main` |
| `${{ github.actor }}` | The username that triggered the run |
| `${{ github.repository }}` | `owner/repo` |
| `${{ github.sha }}` | Full commit SHA |

## Try It

1. Push any change to `main` — the workflow will run automatically.
2. Go to **Actions > 01 - Hello World > Run workflow** to trigger it manually.
3. Click into the run and expand each step to see its output.

## Next Up

[02 — CI Pipeline](02-ci-pipeline.md) adds real build steps, caching, and artifact uploads.
