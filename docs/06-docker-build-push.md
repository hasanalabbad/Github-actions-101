# 06 — Docker Build & Push

> **Goal:** Build a Docker image and push it to GitHub Container Registry (GHCR).

## What This Workflow Does

On every push to `main` or when a version tag (`v*`) is created, it:

1. Logs in to GitHub Container Registry
2. Extracts smart tags from git metadata (branch name, semver, SHA)
3. Builds the Docker image
4. Pushes it to `ghcr.io/<owner>/<repo>`

## Key Concepts

### GitHub Container Registry (GHCR)

GitHub provides a built-in container registry at `ghcr.io`. It's free for public repos and included in your Actions minutes for private repos.

### `permissions` Block

```yaml
permissions:
  contents: read
  packages: write
```

The default `GITHUB_TOKEN` has limited permissions. To push packages, you must explicitly grant `packages: write`. This follows the principle of least privilege.

### `docker/login-action@v3`

```yaml
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

- `GITHUB_TOKEN` is automatically available in every workflow — no manual secret setup needed.
- It authenticates as the user who triggered the workflow.

### `docker/metadata-action@v5` — Smart Tagging

```yaml
- uses: docker/metadata-action@v5
  with:
    images: ghcr.io/${{ github.repository }}
    tags: |
      type=ref,event=branch     # → ghcr.io/owner/repo:main
      type=semver,pattern={{version}}  # v1.2.3 → ghcr.io/owner/repo:1.2.3
      type=sha,prefix=          # → ghcr.io/owner/repo:abc1234
```

This action reads git context and generates appropriate Docker tags automatically. No more hand-crafting tag logic.

### `docker/build-push-action@v5`

```yaml
- uses: docker/build-push-action@v5
  with:
    context: .
    push: ${{ github.event_name != 'pull_request' }}
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
```

- **`context: .`** — build context is the repo root.
- **`push`** — conditionally push. For PRs, just build (validates the Dockerfile) without pushing.
- Tags and labels come from the metadata step.

### Workflow-Level Environment Variables

```yaml
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
```

Variables defined at the workflow level are available in all jobs and steps.

### Triggering on Tags

```yaml
on:
  push:
    tags: ['v*']
```

When you `git tag v1.0.0 && git push --tags`, this trigger fires and the metadata action generates semver-based image tags.

## Sample Dockerfile

For this workflow to actually build, you need a `Dockerfile` in the repo root. Here's a minimal example:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY src/package*.json ./
RUN npm ci --production
COPY src/ .
EXPOSE 3000
CMD ["node", "index.js"]
```

## Try It

1. Add a `Dockerfile` to the repo root.
2. Push to `main` — the workflow builds and pushes to GHCR.
3. Create a tag: `git tag v1.0.0 && git push --tags` — you'll get a `1.0.0` tagged image.
4. View your packages at `https://github.com/<you>/<repo>/pkgs/container/<repo>`.

## Next Up

[07 — Environments & Secrets](07-environment-secrets.md) adds deployment environments with approval gates and scoped secrets.
