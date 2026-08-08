---
name: fohryu-homepage-maintainer
description: Maintain the Fohryu Website public homepage. Use when updating fohryu-website content, sections, project or activity data, visual styling, Ryuko/Fury assets or easter egg behavior, accessibility behavior, or documentation for the static fohryu.com homepage.
---

# Fohryu Homepage Maintainer

## Reference Order

1. Read `AGENTS.md` for repo rules, public/private boundaries and validation
   expectations.
2. Read `docs/homepage-architecture.md` when the change touches page structure,
   section ownership, visual direction, accessibility behavior or maintenance
   conventions.
3. Use `README.md` only for operational commands and deployment context.

Do not copy rules from those files into this skill. This skill is the workflow
entry point; the other files remain the source of truth.

## Execution Environment

- Treat WSL as the primary runtime for this repository.
- Run Git, Node, npm and project scripts from `/mnt/x/hub/projects/fohryu-website`.
- From a Windows-hosted shell, use
  `wsl.exe -e bash -lc "cd /mnt/x/hub/projects/fohryu-website && <command>"`.
- Prefer WSL Git so repository ownership, SSH configuration and remote access
  remain consistent.
- Treat GitHub CLI (`gh`) as optional. Prefer an available GitHub integration
  for pull request operations, and install no auxiliary CLI without a concrete,
  explained need and explicit user approval.
- Use PowerShell only for host-side tasks or tools that specifically require
  Windows.

## Workflow

1. Run `git status --short` through WSL.
2. Classify the request: content, rendering, styling, asset, documentation,
   deployment or a mix.
3. Edit the owning file group:
   - `src/data/` for structured content;
   - `src/render/` for DOM composition and behavior;
   - `src/styles/` for layout, tokens, responsive behavior and visual polish;
   - `index.html` for metadata and document-level fallbacks;
   - `public/` for served exports;
   - `assets/` for non-served source files.
4. Update `docs/homepage-architecture.md` if the change alters architecture,
   section responsibilities, accessibility behavior, responsive strategy or
   maintenance conventions.
5. Run `git diff --check`.
6. Run `npm run build` for TypeScript, rendering, style, asset or dependency
   changes.
7. For software or infrastructure work, create the branch, commit, push and open
   the pull request without requesting separate confirmation. Stop before merge.
8. After pushing any additional commit to an open pull request, reassess its
   title, description and validation notes. Update them without requesting
   confirmation when they no longer describe the current changes accurately.
9. For pure editorial work on `main`, require an explicit request before commit
   and push because the push deploys to production.
10. Require an explicit request before merging, creating or pushing a tag,
   deploying manually to production, force-pushing or rewriting history.

## Maintenance Heuristics

- Prefer changing data before changing rendering when the requested update is
  editorial.
- Prefer changing rendering before adding new abstractions when the requested
  update is structural.
- Prefer changing CSS tokens or existing component classes before introducing a
  parallel visual pattern.
- Keep social activity as native cards unless the user explicitly changes that
  direction.
- Keep public identity and private-space decisions aligned with `AGENTS.md`.
