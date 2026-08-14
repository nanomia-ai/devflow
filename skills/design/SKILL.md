---
name: design
description: Design planning (optional stage). Decides the UI approach, source, token and component strategies, decomposition axis, and review surface, and creates devflow/project/design.md. Use for design systems, UI style, or component-library decisions.
---

# design — Design Planning (optional)

First read the canonical rules (`../principles/SKILL.md`), `devflow/project/product.md`,
and all of `devflow/project/arch.md`. If present, read all of
`devflow/project/design.md`, `devflow/project/glossary.md`, and `devflow/journal.md`.

**Gate:** if arch.md says `frontend: none`, this skill does not run — say so and end.
Even with `needed`, the user may skip it or return later. If design was not explicitly requested,
ask "shall we plan the design, or continue with the current or default style?" Skipping is not a state;
create no file, marker, or commit, and continue to split.

When the tree already exists, recording comes first for design's first run or a direction-change
request. If no unresolved `maintenance routing pending` line corresponds to the request, do not
change design.md; send it through split's maintenance routing so the line and the
`<id> boundary — request recorded` commit land first. Proceed after split returns it through 2a
or when the same unresolved line exists. design does not delete that line — after confirmation and
the commit, split consumes it when planning build cards from the same source.

Purpose: decide the direction and boundary of the UI build and record them in
`devflow/project/design.md`. This stage does not build token, theme, component, or preview code.
The real artifacts belong to the cards split opens after reading this document.

## Procedure

### 1. Six Decisions

Ask in one batch at a time, with a recommendation, only for decisions that are not yet unique.

| Field | What to decide |
|---|---|
| Approach | How to implement the design direction through approaches such as handoff transfer, library + styling, custom development, or a mix |
| Design source | Which external artifact, library default, or repository asset is canonical for which scope, and which side to update on conflict |
| Token strategy | What to tokenize, the source→code conversion and synchronization direction, and the planned Destination |
| Component strategy | The boundary and shared scope of reuse, theme customization, wrappers, and custom development |
| Decomposition axis | One sentence defining the boundary by which split divides task cards |
| Review surface | What the owner will inspect in the build result and the planned way to run it |

The approaches above are open examples, not a closed list. The six fields are free-form sentences;
**`not used` or `none`, with the reason, is also a valid value**. Do not ask again when
product, arch, an existing design, glossary, or an exact source named by the user already answers
the question. design does not search the whole repository or become a new consumer of the planning
evidence discipline. When more implementation facts are needed, split's bounded comparison or a
research card produces the answer.

If applying the decomposition axis still cannot settle one `Destination` from the source, do not
guess. Ask the user only for that Destination through split's existing mapping question.

### 2. Output

Derive the `devflow/project/design.md` bundle to be confirmed in memory in this form.

```markdown
# Design

Approach: <free-form sentence>
Design source: <exact external artifact, existing path, or none + authority direction by scope>
Token strategy: <canon, conversion/synchronization direction, planned path, or not used + reason>
Component strategy: <reuse, theme/wrapper, custom-development boundary, or not used + reason>
Decomposition axis: <one sentence that sets card boundaries>
Review surface: <result to inspect and planned way to run it, or none + reason>

## Build scope
| Item | Disposition | Source or planned Destination | How to check |
|---|---|---|---|
| <scope> | <free sentence such as reuse, theme, custom, transfer, or defer> | <exact reference> | <review surface> |
```

`Disposition` is a decision sentence, not a progress-state token. Do not write card progress in design.md.

### 3. Confirm, Land, and Build

Completion requires that the six fields and build scope are unique for the current scope and that
the user has confirmed the whole document. Do not change a core path before confirmation. Once
confirmed, land only design.md in the canonical rules' existing Layer 0 commit
`design — design.md`. Code output or running a preview is not a completion condition of this stage.

split is next. It applies the build scope and decomposition axis through the existing source mapping,
one-layer opening, and size judgment, creates cards, and gets the execution proposal approved. A shared
build that several capabilities depend on is a foundation-card candidate, while a build for one capability
is a card candidate in that capability; existing rules decide placement. Keep compatible existing cards,
and send only cards that cannot stay true with the new direction through the existing `.stale.` and re-split procedure.

When build results confirm a planned path, name, or command, replace only the exact one line in design.md
through the canonical discovery→update row. When the direction of any of the six decisions changes, re-run
design through the record-first path above. The owner confirms the direction document here, then approves
the actual cards, order, and completion signals in split's execution proposal.
