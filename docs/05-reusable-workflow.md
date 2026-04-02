# 05 — Reusable Workflows

> **Goal:** Define a workflow once, call it from multiple places — DRY for CI/CD.

## What This Workflow Does

Two files work together:

| File | Role |
|---|---|
| `05-reusable-workflow.yml` | The **callee** — defines a reusable build job with inputs, secrets, and outputs |
| `05-caller-workflow.yml` | The **caller** — invokes the reusable workflow and uses its outputs |

## Key Concepts

### `workflow_call` Trigger (Callee)

```yaml
on:
  workflow_call:
    inputs:
      environment:
        type: string
        required: true
      node-version:
        type: string
        default: '20'
    secrets:
      deploy-token:
        required: false
    outputs:
      build-sha:
        value: ${{ jobs.build.outputs.sha }}
```

`workflow_call` turns a workflow file into a **callable function**:

- **`inputs`** — typed parameters the caller passes in.
- **`secrets`** — the caller forwards secrets explicitly (they're not inherited by default).
- **`outputs`** — values the callee sends back to the caller.

### Calling a Reusable Workflow (Caller)

```yaml
jobs:
  call-build:
    uses: ./.github/workflows/05-reusable-workflow.yml
    with:
      environment: staging
      node-version: '20'
    secrets:
      deploy-token: ${{ secrets.DEPLOY_TOKEN }}
```

- **`uses:`** on a job (not a step!) points to the reusable workflow.
- **`./.github/workflows/...`** for same-repo workflows, or `owner/repo/.github/workflows/file.yml@ref` for cross-repo.
- **`with:`** maps to the callee's `inputs`.
- **`secrets:`** forwards specific secrets, or use `secrets: inherit` to pass all.

### Consuming Outputs

```yaml
post-build:
  needs: call-build
  steps:
    - run: echo "${{ needs.call-build.outputs.build-sha }}"
```

Use `needs.<job-id>.outputs.<name>` to access values returned by the reusable workflow.

### Setting Outputs from Steps

```yaml
- id: info
  run: echo "sha=${{ github.sha }}" >> "$GITHUB_OUTPUT"
```

Steps write to `$GITHUB_OUTPUT` (a special file), and the job maps step outputs to job outputs:

```yaml
jobs:
  build:
    outputs:
      sha: ${{ steps.info.outputs.sha }}
```

### `workflow_dispatch` with `choice` Input

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
```

This creates a **dropdown** in the GitHub UI when you manually trigger the workflow.

## When to Use Reusable Workflows

- You have the same CI steps in multiple repos → extract into a shared repo.
- You want staging and production to use identical build logic but different inputs.
- You want to enforce a standard CI pipeline that teams can't accidentally modify.

## Try It

1. Go to **Actions > 05b - Call Reusable Build > Run workflow**.
2. Pick an environment from the dropdown and watch it call the reusable workflow.
3. Check the `post-build` job to see the SHA output from the callee.

## Next Up

[06 — Docker Build & Push](06-docker-build-push.md) builds a container image and pushes it to GitHub Container Registry.
