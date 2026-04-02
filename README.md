# GitHub Actions 101

A hands-on guide to GitHub Actions — from zero to confident. Each example builds on the last, introducing one new concept at a time.

---

## What Are GitHub Actions?

GitHub Actions is a **CI/CD and automation platform** built directly into GitHub. It lets you run workflows in response to events that happen in your repository — like pushing code, opening a pull request, creating a release, or even on a schedule.

### Core Concepts

| Concept | What It Is |
|---|---|
| **Workflow** | A YAML file in `.github/workflows/` that defines an automated process. A repo can have many workflows. |
| **Event (Trigger)** | The thing that starts a workflow — `push`, `pull_request`, `schedule`, `workflow_dispatch` (manual), etc. |
| **Job** | A set of steps that run on the same runner (virtual machine). Jobs run in **parallel** by default. |
| **Step** | A single task inside a job — either a shell command (`run:`) or a reusable action (`uses:`). |
| **Action** | A reusable unit of code you can plug into a step. Published on the [GitHub Marketplace](https://github.com/marketplace?type=actions). |
| **Runner** | The server that executes your job. GitHub provides hosted runners (`ubuntu-latest`, `macos-latest`, `windows-latest`) or you can self-host. |
| **Artifact** | A file produced by a workflow (test reports, binaries) that you can download or pass between jobs. |
| **Secret** | An encrypted variable stored in your repo/org settings, accessed via `${{ secrets.NAME }}`. |

### Workflow File Anatomy

```yaml
name: My Workflow              # Display name in the Actions tab

on:                            # Event triggers
  push:
    branches: [main]

jobs:                          # One or more jobs
  build:
    runs-on: ubuntu-latest     # Runner
    steps:                     # Ordered list of steps
      - uses: actions/checkout@v4       # Reusable action
      - run: echo "Hello, World!"       # Shell command
```

---

## Sample Workflows

This repo contains **seven progressively complex** workflow examples. Each one lives in `.github/workflows/` and has a matching explanation doc in `docs/`.

| # | Workflow | What You'll Learn | File |
|---|---|---|---|
| 01 | [Hello World](docs/01-hello-world.md) | Minimal workflow, events, steps | `01-hello-world.yml` |
| 02 | [CI Pipeline](docs/02-ci-pipeline.md) | Multi-step builds, caching, artifacts | `02-ci-pipeline.yml` |
| 03 | [Scheduled Cron](docs/03-scheduled-cron.md) | `schedule` trigger, cron syntax | `03-scheduled-cron.yml` |
| 04 | [Matrix Strategy](docs/04-matrix-strategy.md) | Testing across multiple OS/versions | `04-matrix-strategy.yml` |
| 05 | [Reusable Workflow](docs/05-reusable-workflow.md) | `workflow_call`, DRY patterns | `05-reusable-workflow.yml` |
| 06 | [Docker Build & Push](docs/06-docker-build-push.md) | Building images, pushing to GHCR | `06-docker-build-push.yml` |
| 07 | [Environments & Secrets](docs/07-environment-secrets.md) | Deployment environments, approvals | `07-environment-secrets.yml` |

---

## How to Use This Repo

1. **Read** — Start with `docs/01-hello-world.md` and work your way up.
2. **Fork** — Fork this repo so you can experiment with your own workflows.
3. **Trigger** — Push changes, open PRs, or use the "Run workflow" button to see workflows in action.
4. **Break things** — Intentionally introduce failures to see how Actions reports errors.

---

## Quick Reference

### Common Triggers

```yaml
on:
  push:                              # Every push
    branches: [main, develop]        # Only specific branches
    paths: ['src/**']                # Only when certain files change
  pull_request:                      # PR opened/updated
    types: [opened, synchronize]
  schedule:
    - cron: '0 8 * * 1'             # Every Monday at 08:00 UTC
  workflow_dispatch:                  # Manual trigger from UI
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'
  release:
    types: [published]               # When a release is published
```

### Useful Expressions

```yaml
# Conditionals
if: github.ref == 'refs/heads/main'
if: contains(github.event.head_commit.message, '[skip ci]') == false
if: success()    # previous steps succeeded
if: failure()    # previous step failed
if: always()     # run regardless

# Context variables
${{ github.sha }}              # Commit SHA
${{ github.actor }}            # User who triggered
${{ github.repository }}       # owner/repo
${{ github.event_name }}       # push, pull_request, etc.
${{ secrets.MY_SECRET }}       # Encrypted secret
${{ env.MY_VAR }}              # Environment variable
```

### Cron Syntax

```
┌───────────── minute (0–59)
│ ┌───────────── hour (0–23)
│ │ ┌───────────── day of month (1–31)
│ │ │ ┌───────────── month (1–12)
│ │ │ │ ┌───────────── day of week (0–6, Sun=0)
│ │ │ │ │
* * * * *
```

---

## Further Reading

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Security Hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
