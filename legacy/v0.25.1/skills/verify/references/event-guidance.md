# Audit and retrospective events

Audit and Retrospective are post-verdict findings events, not verification verdicts or
status gates. Use the canonical event key, duplicate suppression, target record, priority
order, pending/result/decision/routing transitions, and user adoption route; process one
event at a time and preserve an interrupted pending event for resumption.

An auditor receives only the bounded description, channel, and exact current scope, executes
before limited scope reading, returns concrete confirmed-or-presumed findings or `no
findings`, and never fixes or judges a verdict. A retrospector receives only its declared
devflow artifacts, grounds each alternative in project strain evidence and a presumed
switching cost, returns findings or `no findings`, and never opens code, fixes, or judges a
verdict. Automatic Audit additionally requires its clean integration-boundary precondition;
an unresolved event scope completes as explicitly not run, not as a fabricated finding.
