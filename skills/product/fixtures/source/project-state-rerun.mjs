export async function calculateState() {
  return {
    schema: "devflow/project-state/2", route: {},
    zones: { marker: { entries: [{ kind: "product-rerun", marker: "fixture" }] } },
    facts: {}, metadata: {}
  };
}
