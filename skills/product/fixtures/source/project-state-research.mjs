export async function calculateState() {
  const raw = "2026-08-30T00:00:00Z maintenance routing pending: request-json: product";
  const origin = `journal:${raw}`;
  return {
    schema: "devflow/project-state/2", route: {},
    zones: { marker: { entries: [] }, ready: { entries: [{ file: "devflow/tree/00-project/00.1-research.md", origin, approval: "effective" }] }, claim: { entries: [] } },
    facts: { existingRequests: [raw] }, metadata: {}
  };
}
