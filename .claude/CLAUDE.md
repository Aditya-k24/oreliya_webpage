# Oreliya — Project Instructions

## Design System

When building any UI component, **always** follow `.claude/skills/design/SKILL.md`.

Key rules at a glance:

- Colors: `#1E240A` (brand-green), `#F6EEDF` (cream), `#FFFFFF` (white) — nothing else
- Fonts: Playfair Display for headings, Inter for body — never swapped
- Buttons: use `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-white-outline` classes from `globals.css`
- Spacing: 8px grid — `p-2/4/6/8`, `py-20`, `gap-6/16` only
- Images: `SignedImage` for product images, `next/image` for static assets — never `<img>`

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v3 + PostCSS
- Supabase (storage + DB), Prisma ORM, NextAuth
- pnpm workspaces monorepo — app lives in `apps/web-next/`

## Conventions

- Run dev: `pnpm run dev` from repo root
- All API routes under `src/app/api/`
- Feature components: `src/features/<feature>/components/`
- Shared components: `src/components/`
- Commit messages: conventional commits, all-lowercase subject (`fix:`, `feat:`, `chore:`)
