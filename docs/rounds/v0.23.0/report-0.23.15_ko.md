# v0.23.15 구현 보고 — 확인된 프로젝트 작업 언어

날짜: 2026-09-07
시작 HEAD: `da8795aefcdf2f06d2047c54edf3b1825446a2f3`
범위: Principles 공통 정책, Product 단일 상태값, Adopt 사전 추론, 표적 검증, 배포 거버넌스

## 확정 원인과 정본 경계

실제 Adopt 결과에서 한국어와 영어 의미 문장이 섞였지만 어느 언어를 계속 유지할지 owner에게
드러내는 결정이 없었다. 기존 glossary는 프로젝트 용어의 정본이지 문서 문장 언어의 정본이 아니므로,
희소하거나 동률인 corpus, 다국어 corpus, 명시적인 owner 선호를 한 값으로 보존하지 못했다. 반대로
identifier·경로·schema key까지 번역하면 기계 계약을 훼손한다.

`product.md`의 정확한 `Working language: <owner-confirmed description>` 한 줄을 이 사실의 유일한
지속 정본으로 선택했다. Product는 새 프로젝트 대화에서 값을 제안하고 기존 write-free `ask`에서
확인 또는 교정을 받는다. Adopt는 maintained documentation, code comment, specification, 운영 문서처럼
의미 있는 사람 문장을 근거로 제안하되 identifier 빈도를 표로 세지 않고, canonical 문서를 쓰기 전에
그 제안과 불확실성을 드러낸다. owner 교정은 승인 자체가 아니며, Adopt는 수정된 전체 제안에 새 독립
의미 반증을 거친 뒤에만 기존 write-free `prepare` fallback으로 돌아간다.

Principles는 확인된 값이 이후 작성·수정되는 의미 문장에 적용된다는 공통 정책만 소유한다. 고정 schema
heading과 key, path·slug, command, API·code identifier, provenance literal, exact canonical term, 인용
원문은 필요한 형태를 보존한다. glossary는 terminology canon으로 유지한다. 새 scanner, registry,
crawler, state predicate, global semantic gate, 문서별 언어 metadata, 닫힌 언어 목록은 만들지 않았다.
새 상태가 없는 legacy managed project는 계속 유효하며 migration만을 위한 rewrite를 요구하지 않는다.

## 반증과 최소화

독립 Fable 사전 반증은 언어를 glossary·identity에서 매번 추론해 Product field를 두지 않는 대안을
제시했다. 그 대안은 동률·희소·다국어 corpus와 corpus와 다른 명시적 owner 언어를 지속할 수 없고
하위 consumer마다 다시 추론하게 하므로 기각했다. 반대로 Product의 별도 correct-language action과
fixture는 기존 `ask`가 이미 REPORT/ASK만 실행하고 re-entry에서 다시 판정하므로 제거했다.

Adopt에도 별도 correct-language branch가 필요하지 않았다. 기존 `prepare` fallback은 REPORT/ASK만
실행하며 write·commit하지 않고, 교정된 제안은 동일 단계 재진입으로 다시 보고할 수 있다. 따라서
신규 action·scenario는 되돌렸다. 다만 교정된 전체 산문을 생산자 스스로 “language only”라고 판정하면
DD-102·DD-106의 독립성이 사라지므로, 모든 Adopt 언어 교정 뒤 새 독립 semantic refutation을 거치게
했다. Principles 문장도 공통 값·consumer·고정 token과 legacy fallback만 남기고 inference 세부는
Adopt, greenfield·교정은 Product로 돌렸다.

## 변경 경로 — runtime, generated, test, governance 분리

- shared runtime: `skills/principles/authoring-card.md`,
  `skills/principles/references/authoring/prompt-principles.md`,
  `skills/principles/references/knowledge/capsules-and-provenance.md`.
- Product runtime: `skills/product/authoring-card.md`, `skills/product/body.md`,
  `skills/product/spec.mjs`, `skills/product/templates/product-proposal.md`,
  `skills/product/templates/product-confirmed.md`.
- Adopt runtime: `skills/adopt/authoring-card.md`, `skills/adopt/body.md`,
  `skills/adopt/spec.mjs`, `skills/adopt/references/workflow.md`,
  `skills/adopt/templates/adoption-proposal.md`, `skills/adopt/templates/product.md`.
- generated evidence: 세 skill의 `.generated.json`과 `.skill-rails/semantic-diff.json`은 Skill Rails
  정본 maintenance/build가 갱신했다. semantic diff는 release 누계가 아니라 마지막 실제 transaction
  수령증이며, Opus 수렴 패스의 Principles reference, Product declarations, Adopt spec/body/workflow 변화를
  정확히 기록한다. 생성 `SKILL.md`와 수령증을 손으로 편집하지 않았다.
- tests: `scripts/repository-invariants.test.js`, `scripts/project-state.test.js`.
- release governance: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `CHANGELOG.md`,
  `docs/design.md`, `docs/design_ko.md`, `docs/design-decisions.md`,
  `docs/design-decisions_ko.md`, `docs/maintenance-protocol.md`,
  `docs/maintenance-protocol_ko.md`, `docs/usecase-matrix_ko.md`, 이 보고서다.

이 보고서만 최종 새 경로다. `.tmp-skill-rails-adopt-language.json`,
`.tmp-skill-rails-principles-language.json`, `.tmp-skill-rails-principles-resource.json`,
`.tmp-skill-rails-product-language.json`은 작업 중 생성했다가 supervisor 지시에 따라 모두 삭제했으며
남아 있지 않다. 다른 경로의 생성·삭제·이동은 없다.

## 표적 build·eval·behavior 검증

- Principles Skill Rails build: L-full pass, mutation 20/20, fixtures 10/10, deterministic repeats
  200, 최종 build id `sha256:000aae7a4dd6bb654ade732a76e2ecebb965a7a0cb8a0526fc163fac5a60e42f`.
- Product Skill Rails build: exit 0, build id
  `sha256:b38fc24c382bfeef05e21de81afd22fd6dd2af3274158a739c00cc895766ff83`.
- Adopt Skill Rails build: exit 0, build id
  `sha256:2cceca046470fa7ee9c44c3265302a32a87b64f871699255aa2d9cf23736736d`.
- 세 eval은 각각 Principles 10/10, Product 19/19, Adopt 12/12였고 모두 200 repeats와 mismatch
  0이었다. 이는 deterministic fixture 결과이며 fresh-agent 의미 품질을 대신하지 않는다.
- Principles·Product source package test는 pass 2/2, Adopt project simulation은 project fixture
  3개·simulation 6개 pass였다.
- `scripts/repository-invariants.test.js`의 표적 실행은 pass였다. 단일 owner, pre-write disclosure,
  기존 ask/prepare의 no-write 효과, schema heading·key 보존, legacy fallback을 검사한다.
- `scripts/project-state.test.js` 전체 단일 파일 실행은 새 assertion 수정 전에 385/386 pass였다.
  유일한 실패는 raw `term=결제` 출력을 JSON 인용 형태로 잘못 기대한 신규 test였고 기대값을 교정했다.
  교정 뒤 `--test-name-pattern=non-ASCII` 표적 실행은 pass 1/1이었다. 전체 단일 파일은 교정 뒤 다시
  실행하지 않았으므로 전체 결과를 pass로 주장하지 않는다.
- state tool과 predicate는 변경하지 않았다. 신규 state test는 비ASCII exact canonical domain term이
  identifier로 번역되지 않고 기존 glossary lookup에서 보존되는 회귀 대조다.

사용자가 금지한 canonical top-level suite
`node --test scripts/*.test.js skills/**/*.test.mjs`와 이를 내부 실행하는 helper는 실행하지 않았다.
따라서 그 suite와 함께 타는 Gate A는 `unverified`다. verification contract는 바뀌지 않아 Gate B는
적용 대상이 아니며, entry system도 바뀌지 않아 clean Claude/Codex before/after 비교 대상이 아니다.

## 감사 지침 §5와 미검증 경계

독립 Opus whole-diff 감사는 blocking F1 한 건, Tier-2 F2·F3·F4, Tier-3 F5–F11을 보고했다. 원문과
current source를 대조해 F1·F2·F4·F5를 수렴형으로 고쳤다. F6의 기존 scenario는 줄 부재를 관측하지
못하므로 그 행동을 증명한다는 assertion을 제거했고, 상시 정책 계약만 고정한 채 실제 legacy 행동은
`unverified`로 좁혔다. F3의 영어 worked capsule 압력은 fresh-model 실측으로 넘겼고 예시 문장을
늘리지 않았다. F10·F11은 direct owner evidence 없는 비차단 관찰로 유지했다.

F7은 Skill Rails 공식 producer가 semantic diff를 release 누계가 아니라 transaction 변화로 만든다는
계약에 따라 수령증을 손으로 고치지 않고 세 package의 실제 수렴 transaction으로 교체했다. F8을
정본 intent로 올리려는 중간 시도에서 `skills/adopt/.skill-rails/obligation-ledger.json`을 직접 편집한
것은 생성 소유권 위반이었다. 즉시 중단하고 intent·ledger·eval-cases 세 경로를 pre-pass HEAD byte로
복원해 최종 diff를 0으로 만들었으며 Adopt structural lint로 확인했다. 공식 `update-intent`가 새 atom의
검토 완료 locator를 함께 표현하지 못하므로 F8은 provenance를 발명하지 않고 carry-forward한다. F9의
두 Product schema declaration은 공식 spec replacement transaction으로 정확한 Working language 줄을
포함시켰다.

수렴 패스 뒤 fresh Claude Opus xhigh 유계 재감사는 F1·F2·F4·F5·F6·F7의 after 측·F9을 모두
폐쇄했다. 최종 판정은 blocking 0, 1계층 0, 2계층 0, 규칙 충돌 0, 소실 경로 0,
patch-on-patch 0이다. F1의 무조건 새 독립 의미 반증, F2의 상시 legacy 분기, F4의 관측 1:1,
F5의 실제 state tool guard, F6의 미실행 행동에 대한 과장 제거, F7의 현재 byte·hash 일치,
F9의 schema 선언을 current source·수령증·재감사 실행 근거로 직접 닫았다.

재감사는 수리하지 않는 비차단 3계층 관찰 세 건을 기록했다. R1은 비배포
`skills/adopt/authoring-card.md`에서 `correction`이 반증 루프 교정과 owner language correction을 함께
가리키는 이름 모호성이다. R2는 공식 생성기의 중간 transaction을 반영한 수령증 `before`
값이 착지 commit의 parent byte와 이어지지 않는 정밀도 관찰이며, `after`와 현재 배포 byte·hash는 전량
일치한다. R3는 CHANGELOG의 `field`가 정본 `line`과 다른 역사 문구다. 세 건 모두 이번 범위에서
패치하지 않았다.

F3의 영어 worked capsule 압력, F8의 intent·ledger·eval 생성 출처 갱신, F10의 terminology
canon과 project-language canon 이원화, F11의 package별 deterministic repeat 수 차이는 새 차단
근거 없이 carry-forward한다.

감사 지침 §5 종료 절은 다음처럼 평가했다. 규칙 충돌·소실 경로 0은 참이고, 남은 항목은
이름 단일화·기록 정밀도·표현 등급의 3계층뿐이다. 재감사가 수리를 만들지 않아 수렴형
수리 절은 `판정 대상 없음`이며, 개인 회로 차단기는 하나도 걸리지 않았다. 따라서 §5 종료 조건을
충족했고 텍스트 감사를 멈춘다.

Gate A, canonical top-level suite, 신규 assertion 교정 뒤의 `scripts/project-state.test.js` 전체,
실제 multilingual·tied·sparse Adopt corpus에서의 fresh language 추론과 owner 교정 뒤 새 독립 반증,
확정 언어의 Direct·Work·Verify·Resume 후속 상속, 영어 worked capsule이 비영어 선택에 주는
압력, 줄 부재 legacy artifact의 언어 보존, 양 플랫폼 install channel은 `unverified`다. 표적 fixture,
정적 계약, 유계 재감사를 이 실제 동작의 pass로 바꾸어 말하지 않는다.

## 배포 경계

두 plugin manifest의 정본 version은 `0.23.15`로 맞췄고 CHANGELOG와 matrix를 갱신했다.
`.claude-plugin/marketplace.json`은 version field가 없어 바꾸지 않았다. commit, push, install, publish,
cache 변경, stage는 하지 않았다. 금지된 sample project는 열거나 읽거나 수정하거나 test하지 않았다.
