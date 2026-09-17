# Legacy atom projection

Repository-relative migration evidence for skills/adopt. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0020 — migration:SKILL.md:85-86

Source hash: sha256:9cdab205bf295ca3212c5f9342f18f977c1b64238b1d94db5c60dbf24f687b15

While comparing candidates, maintain the following internal evidence table only in the
conversation. Do not store it in a file, journal, or capability document.

## migration-a0021 — migration:SKILL.md:88-88

Source hash: sha256:0b490ae447cc99c0271f1ae5b7f7cf2bf4a2ef3895759f6c267dad3a41380569

| Candidate | Observation | Source/version | Interpretation | Remaining owner decision |

## migration-a0022 — migration:SKILL.md:91-94

Source hash: sha256:bdb0a6ea01f36b85697bbed05a29b0d7f5148733c02463d6d8da0718fa7fcd61

The main session confirms one exact coordinate or one capped query. For answer-only comparison across
multiple paths or external sources, use the planning evidence discipline's isolated-research branch, but
the main session directly follows and understands representative-flow code, document structure, and domain
context. A researcher returns only bounded sub-facts such as locations, usages, and pinned versions.

## migration-a0023 — migration:SKILL.md:96-99

Source hash: sha256:3ee645149535f90292ef8a23e4e420c3dd61afea88d0f8cc12797c94d3dcab1a

In a confirmation batch, separate `Observation` (code and the pinned-version contract),
`Interpretation` (what those facts mean for the current boundary), and `Decision preview`
(the future direction for the owner to confirm). Do not turn a current fact into future intent
or present an interpretation as an observation.

## migration-a0024 — migration:SKILL.md:101-103

Source hash: sha256:f6796d5662394b65ee8f9a207335db184ed2ed9bd71113ed69d308e7c238df04

Only when preserving current behavior and following the target direction produce actually different
outcomes, compare one alternative through the planning evidence discipline's pre-commitment review
before confirmation. With no substantive candidate, create no additional output, question, or research.

## migration-a0025 — migration:SKILL.md:105-114

Source hash: sha256:b1b7b2c446136507a064a1baced13c04dd85441450a91dd7e1b88efd20662504

Commit history is supporting evidence. Only when current
code and a document conflict, read the newest commit that touched the exact conflicting
path and the immediately preceding such commit. Do not scan repository-wide history.
The initial existing-document read set is the repository-root README files, files whose
exact paths the user or repository instructions name, and the file-path listing under
root directories whose lowercased names are `docs` or `specs`, or documentation roots named by repository
instructions. Except for a root README or an exactly named file, do not open the body of
a document unless this test passes: lowercase both the document filename stem and a
code-derived candidate name, remove every non-letter and non-digit, and require either
normalized string to contain the other. A test with either normalized string empty fails.

## migration-a0026 — migration:SKILL.md:116-116

Source hash: sha256:465e0a1e140308a556aed6f6f497e10f9bc3c088cede14835550c1af0cab6819

## Procedure — in exactly this order

## migration-a0027 — migration:SKILL.md:118-126

Source hash: sha256:ededfa736c6ea13b5cc3f2ca15703116f56041846daddf0b8e005a3093fb69e0

1. **Enumerate capability candidates and trace their flows.** First list code-derived
   candidates from external entry points and top-level code modules, then open documents
   that pass the filename test above. Add a candidate from an opened feature list or path
   name when it connects to a code flow; otherwise put it in the confirmation-question
   batch. Existing documents remain claims at this point. For each
   candidate, follow one representative execution from an external entry point to the end.
   Merge two candidates only when they have the same externally observable responsibility
   and the same code flow; put any candidate whose boundary remains unconfirmed into the
   confirmation-question batch.
