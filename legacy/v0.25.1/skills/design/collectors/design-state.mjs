export async function calculateState() {
  const raw = "2026-08-30T00:00:00Z maintenance routing pending: request-json: design";
  return {
    schema: "devflow/project-state/2",
    route: {},
    zones: {
      ready: { entries: [{ file: ".devflow/tree/00-project/00.1-research.md", origin: `journal:${raw}`, approval: "pending" }] },
      claim: { entries: [] }
    },
    facts: { existingRequests: [raw] },
    metadata: {}
  };
}
