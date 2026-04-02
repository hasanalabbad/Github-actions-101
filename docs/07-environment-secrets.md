# 07 — Environments & Secrets

> **Goal:** Use GitHub Environments for staged deployments with approval gates, scoped secrets, and deployment URLs.

## What This Workflow Does

1. Runs tests
2. Deploys to **staging** (with staging-specific secrets)
3. Deploys to **production** (can require manual approval)

You can also skip staging and deploy directly to production via a manual input.

## Key Concepts

### GitHub Environments

Environments are configured in **Settings > Environments**. Each environment can have:

| Feature | What It Does |
|---|---|
| **Protection rules** | Required reviewers, wait timers, branch restrictions |
| **Secrets** | Secrets scoped to this environment only (e.g., different API keys for staging vs production) |
| **Variables** | Non-secret config values scoped to the environment |
| **Deployment URL** | Shown in the PR/commit deployment status |

### Using Environments in a Workflow

```yaml
jobs:
  deploy-staging:
    environment:
      name: staging
      url: https://staging.example.com
```

When a job references an `environment`, GitHub:
- Applies that environment's protection rules **before** the job starts.
- Makes that environment's secrets available via `${{ secrets.NAME }}`.
- Records a deployment visible in the repo's **Deployments** tab.

### Protection Rules: Required Reviewers

In **Settings > Environments > production > Protection rules**, you can add required reviewers. When a workflow reaches a job with that environment, it **pauses and waits** for an approved reviewer to click "Approve."

This is the standard pattern for production deployments.

### Conditional Jobs with `needs` and `if`

```yaml
deploy-production:
  needs: [test, deploy-staging]
  if: always() && needs.test.result == 'success'
```

- **`needs`** — this job waits for `test` and `deploy-staging` to complete.
- **`if: always()`** — by default, if a needed job is skipped, downstream jobs are also skipped. `always()` overrides this.
- **`needs.test.result == 'success'`** — but we still require tests to have passed.

### Secrets Best Practices

1. **Never echo secrets** in logs. GitHub automatically masks known secrets, but don't rely on it.
2. **Scope secrets to environments** when possible — a staging secret compromise shouldn't affect production.
3. **Use `GITHUB_TOKEN`** for GitHub API calls instead of creating personal access tokens.
4. **Rotate secrets regularly**, especially after team changes.

### `workflow_dispatch` Boolean Input

```yaml
inputs:
  skip-staging:
    type: boolean
    default: false
```

This creates a checkbox in the GitHub UI. Access it with `${{ inputs.skip-staging }}`.

## Setting Up Environments

1. Go to **Settings > Environments > New environment**.
2. Create `staging` and `production`.
3. On `production`, add a required reviewer (yourself or a team).
4. Add environment-specific secrets if needed.

## Deployment Flow Visualization

```
push to main
     │
     ▼
  ┌──────┐
  │ test │
  └──┬───┘
     │ ✅ passed
     ▼
  ┌───────────────┐
  │deploy-staging │──── uses staging secrets
  └──────┬────────┘
         │ ✅ deployed
         ▼
  ┌──────────────────┐
  │deploy-production │──── ⏸ waits for approval
  └──────────────────┘     then uses production secrets
```

## Try It

1. Create `staging` and `production` environments in your repo settings.
2. Add a required reviewer to `production`.
3. Push to `main` — staging deploys automatically, production waits for approval.
4. Approve the production deployment from the Actions run page.

## Congratulations!

You've completed all seven GitHub Actions examples. You now know how to:

- Create basic workflows with triggers and steps
- Build CI pipelines with caching and artifacts
- Schedule workflows with cron
- Test across platforms with matrix strategies
- Share logic with reusable workflows
- Build and push Docker images
- Deploy with environment protection rules

Go build something!
