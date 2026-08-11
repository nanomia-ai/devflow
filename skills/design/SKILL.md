---
name: design
description: Design planning (optional stage). Chooses the UI base, translates style intent into design tokens, and sets the design-system build strategy, producing devflow/project/design.md. Use for design systems, UI style, or component-library decisions.
---

# design — Design Planning (optional)

First read the canonical rules (`../principles/SKILL.md`), `devflow/project/product.md`,
and all of `devflow/project/arch.md`. If present, read all of
`devflow/project/design.md`, `devflow/project/glossary.md`, and `devflow/journal.md`.

**Gate:** if arch.md says `frontend: none`, this skill does not run — answer so and end.
Even with `needed`, the user may skip it: first ask "shall we plan the design, or go with
default styling?"

Purpose: design the process of taking a UI plugin and **turning it into a system**. The
real output is not a document — it is the token file and the preview page.

## Procedure

### 1. Choose the base

| | Traits | When |
|---|---|---|
| Owned source (shadcn/Radix family) | Component source lives in your repo, so AI edits it directly. No ceiling on customization | **Default recommendation** |
| Complete kit (MUI family) | Fast. Customization only within the theme API | When polish is urgent or the team knows it well |
| Utility-only (Tailwind alone) | Maximum freedom, build everything yourself | When design IS the product's identity |

### 2. Style direction — translate words into tokens
One batched question round (with defaults):

```
References (2–3)  : "this kind of feel" (URLs or service names)
Tone              : trustworthy/professional · friendly/playful · minimal/restrained · bold/expressive
Density           : dense (information-packed) · airy (whitespace)
Character         : roundness / shadows / borders / contrast strength
Brand color       : hex if you have one; otherwise I propose from the tone
```

### 3. Systematize — outputs

- **One token file** (`theme.ts` or `tokens.css`) — the single source of truth for color,
  typography, spacing, radius. **Never write hex values into documents.** Documents only
  point at this file.
- **Component inventory** — reverse-derived from product.md's screen list. Name +
  exists / to-build.
- **One `/preview` page** — every component on a single screen. This page is the
  completion signal of this stage and the regression detector afterward. Open and check
  it with the browser-control tool recorded in arch.md's verify channel.

### 4. Build strategy — the user chooses (this changes split's decomposition axis)

| | Approach | Good when | Cost |
|---|---|---|---|
| A Mock-first | Finish all screens with mock data → derive the API contract from the UI → backend | UX is the heart of the product | Rework if backend reality diverges |
| **B Vertical slice** | Complete one feature front-to-back, repeat | **Default recommendation.** High technical risk | Whole-UX picture arrives late |
| C Contract-first | Fix the API schema → frontend & backend in parallel | Using parallel people/agents | Schema changes are expensive |

## Output — devflow/project/design.md

```markdown
# Design

Base: <choice> — <1-line reason>
Tokens: <token file path>            <!-- no hex; path only -->
Build strategy: A | B | C
Preview: <path or route>

## Component inventory
| Name | Status (exists / to-build) |
```

On completion: one line — "next is split."
