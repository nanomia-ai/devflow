# RelayBox fixture entry

This directory is a disposable, document-only virtual project. It has no UI and no implementation or
Git state to inspect. Do not inspect its parent experiment directory. Do not invoke any installed
Devflow, Skill Rails, or other skill: this preflight tests the fixture documents alone.

For every project question:

1. Start with `.devflow/index.md`.
2. Use its question routes and each candidate document's `summary` and `read_when` to open only the
   documents needed for the question.
3. When a conditional child is selected, read its nearest parent first. Do not scan sibling documents.
4. Treat `.devflow/` as the complete project-knowledge boundary. `../README.md` and `../cases.md` are
   experiment controls, not project sources.
5. Do not implement or edit anything. Answer the question and report every `.devflow/` file you
   actually opened, the canonical or coordination home used, and one next action.
