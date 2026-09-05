# v0.23.9 결과 보고 — 지식은 의미 소유자를 따른다

기준 commit: `b9917bf0e154779b27182eaf84ad7ff918511380`
배포 version: Claude·Codex manifest 모두 `0.23.9`
상태: 구현·표적 검증·독립 Opus 전체 diff 검토 APPROVE 완료, 사용자 실사용 테스트 미검증

## 목적과 관측된 실패

DD-92와 프로젝트 지식 도구는 Product·Architecture·Design·Capability 문서 각각의 같은 stem 아래
재귀 K를 이미 허용했다. 그러나 공용 Principles의 K 경로·색인·작성자·커밋 문구와 Adopt의 판단·효과는
구체적인 능력 문서만 반복해서 가리켰다. 실제 차가운 Adopt 실행은 이 더 구체적인 문구를 따라
Product·Architecture·Design K를 만들지 않고 지식을 능력 문서와 그 K에 집중시켰다.

이는 새 분류기나 상태가 부족해서가 아니라 공용 문서 체계의 일반 규칙과 소비 절차의 구체적 문구가
충돌한 문제였다. 기존 `project-knowledge.mjs`와 project-state는 소유자 모양을 이미 구현하므로
바꾸지 않았다.

## 구현한 경계

- Principles는 소유자 문서를 항상 읽는 지도, K를 필요할 때 여는 깊이로 정의한다. Product,
  Architecture, Design, Capability 중 가장 가까운 의미 소유자를 고르고, 짧고 항상 필요한 지식은
  그 문서에 남기며 독립적으로 재사용할 깊이만 같은 stem K로 내린다.
- 유계 발견의 정본 명령은 `project --under <owner-document-or-K-node-path>`다.
  `--capability`는 능력 소유자용 단축형이고 수동 색인은 만들지 않는다.
- K는 소유자 문서의 승인·커밋 경계를 따른다. 최초 Adopt에서는 Product·Architecture·Design 소유 K를
  Layer 0 문서와 함께 첫 커밋에, 능력 소유 K를 능력 문서와 함께 둘째 커밋에 둔다.
- Adopt의 기존 clean-context 의미 반증에는 workflow 5단계가 이미 연 동일 공통 기준선·지식 절을
  입력한다. 그 절에서 벗어난 문서 구조는 승인 전 차단된다. 새 단계·체크리스트·검증기는 추가하지 않았다.
- 승인 뒤 기존 효과 순서가 Layer 0 소유 K 작성·`project-knowledge validate`·첫 commit, 능력 문서와
  능력 소유 K 작성·validate·둘째 commit을 명시한다. `product.md`는 Layer 0 소유자 문서 중 마지막에
  쓴다. 작성 후에는 기존 validate, own-path staging, 상태 관찰 경계가 각각 형식·출처·소유자 인접성,
  커밋 경계, 다음 진입의 구조 이상을 맡는다.

DD-97 영문·한글에는 DD-92 뒤에도 남았던 능력 전용 문장을 소유자 종류별 동일 커밋 규칙으로
직접 정정했다. 새 결정은 없고 decision-index 행 이동도 0이다. Product·Arch·Design 런타임에는 현재
관측된 잘못된 행동이 없으며 공용 계약을 소비하는 기존 경계를 바꿀 이유도 없어 수정하지 않았다.

## Skill Rails와 생성 범위

Principles와 Adopt를 설치된 Skill Rails로 다시 빌드했다. 두 패키지 모두 L0–L18, mutation 20/20,
구조 검사를 통과했다. Principles fixture는 10/10, format은 11/11, Adopt fixture는 11/11이고 각각
deterministic repeat 200회 mismatch 0이었다.

생성 변경은 `skills/principles/.generated.json`과 `skills/adopt/.generated.json` 두 manifest뿐이다.
생성 `SKILL.md`는 byte가 같아 diff에 들어오지 않았다. Adopt의 기존 scenario 생성기가 현행
refutation fixture를 덮어쓰는 낡은 투영을 드러내 기존 생성기와 `scenarios.json`만 같은 현재 효과로
맞췄고 새 harness나 fixture 파일은 만들지 않았다.

실행 의미 작성 범위는 10파일 `+70/-65`, 순증가 5줄이다. 그중 공통 Principles 4파일과 Adopt의
spec·body·workflow 3파일인 핵심 7파일은 `+57/-54`, 순증가 3줄이다. P2 obligation ledger는
`+6/-6`, fixture projection은 `+2/-0`, 두 generated manifest는 `+15/-15`다. 배포·결정·매트릭스
기록은 기존 파일 6개 `+51/-24`와 이 결과 보고 78줄로 분리되며 런타임 의미 규모에 합산하지 않는다.

## 표적 검증

- `node skills/adopt/fixtures/project-simulations.mjs`: 6/6 통과.
- `node --test scripts/project-knowledge.test.js`: 45/45 통과. 네 소유자, 재귀 K,
  `--under`, `--capability`, validation과 opening budget의 기존 동작을 확인했다.
- `node --test scripts/decision-index.test.js`: 12/12 통과.
- `node scripts/decision-index.mjs` 및 `--lang ko`: 양 언어 투영 성공, 행 이동 0.
- `node --test scripts/repository-invariants.test.js`: 20/20 통과. 기존 semantic advisory인
  Adopt provenance fan-in 1과 Principles duplicate-target-locators 28은 hard failure가 아니다.
- `git diff --check`: 통과.

## 자기 재검수와 limitations / carry-forward

공용 정의→유계 개봉→writer/commit 규율→Adopt 판단→승인 전 반증→작성·validate·commit 순서를
한 축으로 다시 읽었다. 차가운 런타임 소비 경로에는 능력만 소유자로 오해하게 만드는 구체 문구가
남지 않았고, DD-76의 과거 문구는 뒤의 DD-97 정정이 명시적으로 대체한다. `owner document`와 사람인
`owner`의 의미도 분리했다. 같은 사실을 새 정책·index·marker·validator에
복제하지 않았으며 project-knowledge, project-state, Skill Rails, 다른 단계 패키지와 JZ Note sample은
수정하지 않았다.

감사 가이드라인 §5의 규칙 충돌, 조용한 소실, 잘못된 행동, 출구 없는 정지, 비용 조건을 평가했다.
현재 정적 계약과 표적 실행에서 blocking finding은 0이고, 독립 Opus 전체 diff 검토도
**APPROVE**로 끝났다. 인계 지시대로 장시간 전체 suite와 실제 Adopt는 다시 실행하지 않았다.
Verify 계약을 바꾸지 않아 수동 Gate B 대상은 아니다. 남은 수용 증거는 설치 뒤 사용자가 수행할
실사용 테스트이며, 그 결과만 **미검증**이다.
