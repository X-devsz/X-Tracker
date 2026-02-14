# DevOps & CI/CD — Practical Setup for a Small Team (or Solo)

**Last updated:** 2026-02-10

## 1) Environments
- dev (local)
- staging (test builds)
- prod (store builds)

Each must have separate:
- Firebase project config (if using)
- API endpoints (Phase 2)
- analytics keys (if any)

## 2) CI pipeline (minimum)
- Lint + format
- Type checks
- Unit tests
- Integration tests (SQLite)
- Build artifact
- Security scans:
  - dependency scan
  - secrets scan

## 3) CD (recommended)
- Auto build staging on merge to main
- Manual approval for production builds
- Release notes generation from commits/tags

## 4) Branching and PR rules
- main protected
- PR required
- Small PRs; reviewers can actually review

## 5) Release versioning
- Semantic versioning:
  - MAJOR.MINOR.PATCH
- Store version code increments automatically in CI

## 6) Secrets management
- Never store secrets in repo
- Use CI secret vault
- Rotate on compromise
