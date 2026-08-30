# Executed evidence boundary

Read the selected record only from `state.compatibility.evaluated.verify.records`. `project-state` marks it current only when all four recorded revisions exactly equal the canonical current revisions. Its execution evidence is current only when that same record is current, has a nonempty `executed` value, and has a `pass` verdict. Every other execution-evidence state is `missing`; model-supplied freshness, verdict, and closure values cannot replace these observations.

This is the strongest existing observable, not cryptographic or harness proof that the external steps actually ran. Without trusted execution evidence, that fact remains unproven; the package neither invents an `Executed:` sub-grammar nor claims more authority than the canonical record provides.
