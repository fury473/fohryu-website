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

## Workflow

1. Run `git status --short`.
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
7. Commit, push, deploy or rewrite history only after an explicit user request.

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
