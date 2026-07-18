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

Classify each request before editing:

- Software or infrastructure increments include features, hotfixes, architecture
  changes, rendering/component changes, styling systems, data model changes,
  scripts, build configuration, deployment configuration and process changes.
- Pure editorial updates include text corrections, link updates, content data
  changes and status changes in existing sections such as `Maintenant`, as long
  as they do not require rendering, CSS, model, build or infrastructure changes.

For software or infrastructure increments, start from the latest commit of the
default branch. Fetch the remote, fast-forward the local default branch when
needed, then create a dedicated branch from that commit before editing files.

Use an intent-based branch prefix such as `feature/`, `hotfix/` or `docs/`. Keep
related work as one or more successive commits on that branch. Open a pull
request for manual user review and merge. Do not merge pull requests locally or
remotely unless the user explicitly asks for it.

Pure editorial updates may be committed directly on `main` without a branch or
pull request, unless the user explicitly asks for a branch/PR. They remain
versioned by Git, but they are not software increments and must not by themselves
trigger a new SemVer version.

The application uses SemVer tags on the default branch for software releases.
During feature work, plan the next minor version; during hotfix work, plan the
next patch version; for breaking or major shifts, plan the next major version. If
the current commit has no exact SemVer tag, the app falls back to displaying the
short commit ref.

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
