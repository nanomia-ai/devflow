import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ledgerPath = fileURLToPath(new URL("../../.skill-rails/obligation-ledger.json", import.meta.url));
const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));

const homes = [
  { match: /knowledge landing|knowledge-landing|recursive|same-stem|source basis|owner-adjacent|\bK\d|지식/i, target: "spec:STAGES/knowledge-landing", evidence: "fixture:multi-owner-mixed-landing" },
  { match: /glossary|term: definition|용어/i, target: "spec:STAGES/glossary-term", evidence: "fixture:glossary-capability-alignment" },
  { match: /design note|design open item|설계 메모|설계 열린/i, target: "spec:STAGES/design-marker", evidence: "fixture:design-marker-binding" },
  { match: /brownfield|existing code|adopt|기존 코드|브라운필드/i, target: "spec:DECLARATIONS/managedProjectWriter", evidence: "fixture:managed-brownfield-design-refresh" },
  { match: /verification channel|verify channel|read probe|interaction probe|검증 채널|검증.*수단/i, target: "spec:STAGES/verify-channel", evidence: "fixture:verification-channel-probe" },
  { match: /capability design|design zone|concept model|invariants|non-goals|binding ADR|verified state|capability document|역량.*설계|개념 모델|불변식/i, target: "spec:TEMPLATES/capabilityDesign", evidence: "fixture:capability-docs-route-design" },
  { match: /code-style|code style|trust posture|trust boundar|코드 스타일/i, target: "spec:TEMPLATES/codeStyle", evidence: "fixture:initial-architecture-creation" },
  { match: /architecture\.md|arch\.md|Layer 0|work server|integration branch|merge strategy|아키텍처 문서|레이어 0/i, target: "spec:TEMPLATES/architecture", evidence: "fixture:initial-architecture-creation" },
  { match: /ADR|decision record|discarded alternative|결정 기록/i, target: "spec:TEMPLATES/adr", evidence: "fixture:refresh-architecture-commit" },
  { match: /code structure|folder structure|screen-heavy|under 20|three or more capabilities|구조 A|구조 B|구조 C|코드 구조/i, target: "spec:TABLES/structureChoice/recommend-a", evidence: "fixture:structure-capability-first" },
  { match: /stack|framework|database|storage|dependency|스택|데이터베이스|프레임워크/i, target: "spec:STAGES/stack-and-derived", evidence: "fixture:stack-proposal" },
  { match: /research|candidate.*surviv|external contract|execution fact|조사|후보/i, target: "spec:STAGES/candidate-research", evidence: "fixture:candidate-research-blocked" },
  { match: /component|boundary.*surviv|컴포넌트|구성 요소/i, target: "spec:STAGES/component-derivation", evidence: "fixture:derive-components" },
  { match: /proposal|approval|confirm|provisional|승인|제안|확정/i, target: "spec:STAGES/approval", evidence: "fixture:approval-refusal" },
  { match: /refresh|contradiction|re-run|갱신|모순/i, target: "spec:STAGES/refresh-check", evidence: "fixture:refresh-product-contradiction" },
  { match: /route|next stage|design.*direct|resume|라우팅|다음 단계/i, target: "spec:TABLES/capabilityRoute/approve-direct", evidence: "fixture:route-after-commit-direct" },
  { match: /prerequisite|entry|product\.md|journal|input|시작|전제|입력/i, target: "spec:STAGES/read-inputs", evidence: "fixture:read-product-glossary-inputs" },
  { match: /interrupt|failure|blocked|unavailable|중단|실패|차단/i, target: "spec:STAGES/proposal", evidence: "fixture:interrupted-proposal" },
  { match: /description:|name: arch|development planning|architecture design|개발 기획/i, target: "file:SKILL.md", evidence: "fixture:initial-architecture-creation" }
];

function behavioralHome(atom) {
  if (atom.id === "description-001") return { target: "file:SKILL.md", evidence: "fixture:initial-architecture-creation" };
  if (atom.id === "problem-001") return { target: "spec:DECLARATIONS/migrationEvidence", evidence: "fixture:initial-architecture-creation" };
  if (atom.id === "state-dependent-behaviors-001") return { target: "spec:DECLARATIONS/workflowOrder", evidence: "fixture:interrupted-proposal" };
  if (atom.id === "judgment-points-001") return { target: "body:why: purpose", evidence: "fixture:architecture-approval-request" };
  const source = /^migration:(SKILL(?:_ko)?\.md):(\d+)-/.exec(atom.source);
  if (source) {
    const line = Number(source[2]);
    const korean = source[1] === "SKILL_ko.md";
    const before = (limit) => line < limit;
    if (before(7)) return { target: "file:SKILL.md", evidence: "fixture:initial-architecture-creation" };
    if (before(13)) return { target: "spec:STAGES/glossary-term", evidence: "fixture:glossary-capability-alignment" };
    if (before(korean ? 30 : 33)) return { target: "spec:STAGES/read-inputs", evidence: "fixture:read-product-glossary-inputs" };
    if (before(korean ? 49 : 52)) return { target: "spec:STAGES/repair-layer0-fields", evidence: "fixture:repair-layer0-commit" };
    if (before(korean ? 74 : 83)) return { target: "spec:STAGES/component-derivation", evidence: "fixture:derive-components" };
    if (before(korean ? 91 : 101)) return { target: "spec:STAGES/stack-and-derived", evidence: "fixture:stack-proposal" };
    if (before(korean ? 103 : 114)) return { target: "spec:TABLES/structureChoice/recommend-a", evidence: "fixture:structure-capability-first" };
    if (before(korean ? 118 : 128)) return { target: "spec:STAGES/verify-channel", evidence: "fixture:verification-channel-probe" };
    if (before(korean ? 134 : 148)) return { target: "body:role: channel-verifier", evidence: "fixture:verification-channel-probe" };
    if (before(korean ? 162 : 176)) return { target: "spec:TEMPLATES/architecture", evidence: "fixture:initial-architecture-creation" };
    if (before(korean ? 193 : 212)) return { target: "spec:ARTIFACTS/architecture", evidence: "fixture:initial-architecture-creation" };
    if (before(korean ? 228 : 253)) return { target: "spec:DECLARATIONS/legacySchemas", evidence: "fixture:refresh-architecture-commit" };
    if (before(korean ? 264 : 295)) return { target: "spec:TEMPLATES/codeStyle", evidence: "fixture:initial-architecture-creation" };
    return { target: "spec:TEMPLATES/capabilityDesign", evidence: "fixture:capability-docs-route-design" };
  }
  const haystack = `${atom.source}\n${atom.text}`;
  return homes.find(({ match }) => match.test(haystack)) ?? {
    target: "spec:DECLARATIONS/workflowOrder",
    evidence: "fixture:initial-architecture-creation"
  };
}

for (const atom of ledger.atoms) {
  const home = behavioralHome(atom);
  atom.disposition = "projected";
  atom.targets = [home.target];
  atom.evidence = [home.evidence];
}

ledger.migration = {
  ...ledger.migration,
  source_root: "skills/arch",
  source_files: ["SKILL.md", "SKILL_ko.md"],
  atom_count: ledger.atoms.filter((atom) => atom.id.startsWith("migration-")).length,
  evidence_root: "fixtures/scenarios.json",
  locator_base: ".skill-rails-migration/arch"
};
ledger.source_root = "skills/arch";

await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
