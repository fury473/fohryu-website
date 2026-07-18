# AGENTS.md

## Purpose

This repository contains the public static homepage for `fohryu.com`.

It is a standalone project, even when it lives under the parent `hub/projects/`
folder. Do not treat it as part of the parent repository and do not turn it into a
submodule.

Operational commands live in `README.md`. Page composition, section ownership and
visual architecture live in `docs/homepage-architecture.md`.

## Non-Negotiables

- Use `Fury` as the default public identity.
- Use `Fury473` only for account names, handles, URLs or platform identifiers.
- Avoid putting the real first name forward on the public page.
- Keep the public site in French unless a label is intentionally named in English.
- Do not expose private notes, private URLs, credentials, draft contact flows or
  implementation details that are not meant for the public homepage.
- Do not add official social widgets; public activity should remain native to the
  site.
- Keep Hub references protected and mark unavailable spaces as planned.

## Project Boundaries

- This is a static Vite + TypeScript site deployed through Cloudflare Workers
  Static Assets.
- Keep served static exports in `public/`.
- Keep heavy source files, PSD files and non-served working assets in `assets/`.
- Do not create secrets, tokens, `.dev.vars` or credential files.
- Do not modify `.gitignore` in a way that causes build output, dependencies or
  secrets to be tracked.

## Visual And Accessibility Direction

- Preserve the current dark, warm, technical palette.
- Use Ryuko assets as a restrained signature or easter egg, not as the dominant
  visual system.
- Keep the page sober, legible and scannable.
- Preserve semantic landmarks, visible focus states and `prefers-reduced-motion`
  support.
- For modal work, preserve focus management, Escape close, outside-click close,
  scroll locking and accessible labels/descriptions.
- Decorative images must use empty `alt` text and be hidden from assistive
  technologies when appropriate.

## Documentation Boundaries

- Keep `README.md` operational: install, dev, build, preview and deployment.
- Keep `docs/homepage-architecture.md` architectural: content ownership, section
  composition, visual system, accessibility model and maintenance conventions.
- Keep `AGENTS.md` focused on repo rules and public/private boundaries.
- Keep `.codex/skills/fohryu-homepage-maintainer/SKILL.md` focused on the agent
  workflow, not on duplicating every rule.

## Project Skill

This repository includes a local Codex skill at:

- `.codex/skills/fohryu-homepage-maintainer/`

Use it for homepage content, rendering, styling, asset, accessibility or
documentation maintenance. If repo-local skills are not auto-discovered, read its
`SKILL.md` manually before making those changes.

## Change Workflow

Use `docs/deployment-workflow.md` as the source of truth for contribution
workflow, SemVer tagging and Cloudflare deployment policy.

Before editing, classify the request as either:

- a software or infrastructure increment, which requires a dedicated branch from
  the latest default-branch commit and a pull request for manual user review;
- a pure editorial update, which may be committed directly on `main` unless the
  user asks for a branch or PR.

Do not merge pull requests locally or remotely unless the user explicitly asks
for it. Do not add a root `package.json` version; public software versioning is
derived from Git tags as documented in `docs/deployment-workflow.md`.

## Validation And Git

Before committing code or visual changes, run:

```bash
npm run build
git diff --check
```

For documentation-only changes, `git diff --check` is usually enough.

Commit from this repository, not from the parent `hub` repository. Stage only
files that belong to this project, and do not stage unrelated user changes.

Do not deploy to Cloudflare, push, force-push or rewrite history unless the user
explicitly asks for it.
