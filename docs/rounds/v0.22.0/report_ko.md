# v0.22.0 구현 보고서 — 작업 지휘 단계의 direct 정체성

상태: 구현 완료 · 독립 반증 감사 완료

기준 커밋: `58ce907484a0`

## 요청과 판단

기존 `split`은 단순 분할보다 넓은 일을 이미 소유했다. 승인된 요청에서 필요한 기획 깊이와
실행 단위의 크기를 판단하고, 필요한 조사와 작업을 카드로 만들며, 의존성·순서·병렬성·모델
등급·사용자 승인을 보존해 Work에 넘긴다. 이름이 이 전체 목적을 드러내지 못하면 앞으로 같은
단계에 자연스럽게 들어올 지휘 책임을 다른 스킬로 오인하거나, 카드 쪼개기만 수행하고 끝낼 수
있다. 따라서 현재의 실제 책임에 맞춰 단계를 `direct`로 바꿨다.

사용 중인 구버전 프로젝트가 없다는 소유자 확인에 따라 이 변경은 완전 전환이다. `split` 별칭,
호환 shim, 이중 라우팅, 자동 이관은 만들지 않았다. 다만 `re-split pending`은 스킬 이름이 아니라
낡은 카드 경계를 다시 세분화하라는 좁은 수리 행위이므로 그대로 둔다. 과거 CHANGELOG, round,
blueprint, research와 이미 기록된 결정의 당시 좌표도 역사적 증거이므로 다시 쓰지 않는다.

## 적용한 경계

`skills/direct`, `devflow:direct`, `ROUTE:direct`, `external.direct`,
`project.direct-or-work`, `direct — ...`를 하나의 원자적 어휘로 맞췄다. 두 plugin manifest와
marketplace의 현재 스킬 목록, Principles·Product·Arch·Design·Adopt·Resume·Work·Verify의
라우팅·소유권·소비자 계약, 상태 도구의 현행 술어와 fixture, 설계 지도와 유지보수 문서도 같은
현재 좌표를 읽는다.

direct는 작업 지휘를 소유하지만 실행 프로세스를 감독하지 않는다. direct가 기획 깊이와 단위
경계, 조사 필요성, 카드, 의존성, 순서, 병렬성, 모델 등급, 승인과 Work 인계를 소유한다. Work는
승인된 한 카드를 실제 조사하거나 구현하고, Verify는 결과를 판정하며, 외부 coordinator만
에이전트 프로세스를 배정하고 감독한다. Resume은 디스크 상태에서 이 소유자들을 선택할 뿐 계획을
다시 만들지 않는다. 상위 지식으로 승격할 발견은 Work가 증거와 함께 남기고 기존 Arch/Adopt
지식 착지 경계가 소비하므로, 이름 변경이 지식 소유권을 direct로 끌어오지 않는다.

표시 제목의 `Direct`는 `Work`, `Verify`, `Resume`과 같은 문장·UI 표기이고 런타임 식별자가
아니다. 폴더명, 호출명, route, owner, commit receipt처럼 비교되는 모든 기능 좌표는 소문자
`direct`다. 보통 영어의 split 동사와 역사적 `split` 증거는 유지했다.

## Skill Rails 관점의 정리

강제할 것은 단일 식별자, route와 owner, 상태 술어, 승인된 카드 형식과 인계 증거다. 기획 깊이,
작업 단위, 조사 필요성, 병렬성·모델 선택은 요청과 프로젝트에 따라 direct가 판단하도록 목적과
경계를 먼저 제공한다. 이름 변경을 계기로 별도 감독 상태, 단계 자동 체인, 호환 분기, 반복되는
미세 절차를 추가하지 않았다. 아홉 P2 패키지는 정본 source와 intent 원자를 고친 뒤 Skill Rails
maintenance transaction으로 재생성했다.

## 생성·삭제·이동 경로

생성 5개는 `docs/rounds/v0.22.0/report_ko.md`,
`skills/direct/.skill-rails/intent.json`,
`skills/direct/.skill-rails/semantic-diff.json`, `skills/direct/agents/openai.yaml`,
`skills/direct/references/purpose.md`다. 삭제 4개는 각각의 퇴역 좌표인
`skills/split/.skill-rails/intent.json`,
`skills/split/.skill-rails/semantic-diff.json`, `skills/split/agents/openai.yaml`,
`skills/split/references/purpose.md`다. 이 네 파일은 새 identity 내용으로 재생성했으므로 이동으로
세지 않는다.

나머지 이동 55개는 아래 각 상대 경로를 `skills/split/<상대 경로>`에서
`skills/direct/<상대 경로>`로 옮겼다.

- package root: `.generated.json`, `.gitattributes`, `SKILL.md`, `authoring-card.md`,
  `body.md`, `spec.mjs`
- `.skill-rails/`: `eval-cases.json`, `obligation-ledger.json`, `profile-decision.json`
- `collectors/`: `index.mjs`, `project-research-contract.test.mjs`
- `fixtures/`: `card-contract-negatives.json`, `formats.json`, `lint/manifest.json`,
  `project-research-source-cases.json`, `scenarios.json`
- `schemas/`: `decision.schema.json`, `trace-event.schema.json`
- `scripts/skill-rails/`: `align.mjs`, `alignment.mjs`, `api.mjs`, `ast-policy.mjs`,
  `authoring-ledger.mjs`, `body.mjs`, `cli.mjs`, `collectors.mjs`, `constants.mjs`,
  `diagnostics.mjs`, `domains.mjs`, `dsl.mjs`, `evaluator.mjs`, `format-checks.mjs`,
  `guide.mjs`, `hash.mjs`, `lint.mjs`, `loader.mjs`, `manifest.mjs`, `observations.mjs`,
  `path-policy.mjs`, `run.mjs`, `scenario-checks.mjs`, `snapshot.mjs`, `templates.mjs`,
  `trace-core.mjs`, `trace-store.mjs`, `trace.mjs`, `validator.mjs`,
  `vendor/ACORN-LICENSE`, `vendor/ACORN-WALK-LICENSE`, `vendor/acorn-walk.mjs`,
  `vendor/acorn.mjs`
- `templates/`: `execution-proposal.md`, `research-card.md`, `result.md`, `task-card.md`

## 검증과 정지 경계

- 변경된 JavaScript와 P2 spec의 `node --check`: 최초 18/18, 최종 staged 집합 50/50 통과;
  Product 경계 수리 뒤 해당 spec도 다시 통과
- 아홉 P2 패키지 Skill Rails maintenance build: 각각 반복 5회 통과; Product 경계 수리 transaction도
  별도로 반복 5회 통과
- 한국어·영어 decision index: DD-99와 DD-69의 부분 교정 투영 확인, exit 0
- `git diff --check`: exit 0
- 현행 표면의 퇴역 좌표 및 광역 치환 훼손 탐색: 발견한 일반 영어 두 곳을 원복하고 Principles를
  다시 빌드함

소유자가 요청한 빠른 표적 검증 경계에 따라 `node --test "scripts/*.test.js"` 전체 실행은 하지
않았다. 따라서 전체 suite와 Gate A, 설치 뒤 실제 Codex·Claude 호출, 실제 project-state 전이와
사용자 시험 브랜치 동작은 **unverified**이며 통과로 세지 않는다. 검증 계약 자체는 바꾸지 않아
Gate B는 해당하지 않는다.

Fable xhigh의 첫 독립 감사는 누락·모순·간섭·과잉 기계화와 목적 달성을 나누어 검사했다. 채택한
소견은 Product의 조사 책임 문장과 이 보고서의 경로 열거 두 건이었다. Product는 이제 direct가
조사 카드의 기획·승인을, Work가 실행을, Product가 확정 증거의 제품 판단 종합을 소유한다고
명시한다. 두 수리는 같은 Fable이 한 번만 다시 감사해 수렴을 확인했다. 승인 뒤 direct의 `WAIT`는
승인된 모든 형제 카드를 디스크에서 ready로 만들고 다음 Resume이 Work를 선택하게 하므로,
여러 카드와 외부 coordinator의 프로세스 배정을 선점하지 않는 의도된 인계 경계로 판정했다.
Sol xhigh의 별도 현행 참조 추적은 런타임 식별자, route, owner, state, receipt, adapter, cleanup과
인접 스킬 간섭에서 차단 소견 0건을 보고했다.

audit-guideline §5 종료 조건을 모두 평가했다. 최종 규칙 충돌·소실 경로 소견은 0이고, 남은
“솔로 사용자에게 다음 Work를 한 줄 더 보일 수 있다”는 관찰은 두 구체적 오독을 제시하지 못한
표현 등급이라 회로 차단기에 따라 수리하지 않았다. 채택한 두 수리는 새 해석을 열지 않는
수렴형이며 수리 면을 한 번 재감사했다. 같은 문장을 세 번째 고친 곳, 앞 수리를 되돌린 곳,
이전 감사 소견만을 근거로 삼은 곳은 없다. 따라서 텍스트 감사를 종료하고 다음 검증 수단을
실전으로 넘긴다.

## 제한과 이월

설치 뒤 실제 사용성은 이 릴리스에서 대리하지 않는다. 최종 감사와 반증을 통과해 커밋·푸시·설치한
뒤 소유자가 새 시험 브랜치에서 직접 실행한다. 실행하지 않은 행동 증거는 다음 라운드에서도
`unverified`로 읽어야 한다.
