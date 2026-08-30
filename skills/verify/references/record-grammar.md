# Record grammar and state authority

`skills/principles/scripts/project-state.mjs` and its verification predicates are the only
authority for current state, revision freshness, pending events, transition recovery, and
reserved journal syntax. Read current-format verify records exactly: Product, Verification,
Code, and Capability revisions; executed evidence; verdict; new-entry count; failure history;
regression; Standards; Provisional; journal sweep; and Audit and Retrospective sections.

Legacy records missing revision fields are excluded from current pass reuse, failure routing,
and automatic-event derivation. Do not normalize NUL-bearing git revision inputs, invent a
missing event section except in the canonical pending-event transition, or treat a scalar
legacy Audit/Retrospective value as a current event.
