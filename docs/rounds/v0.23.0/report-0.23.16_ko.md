# v0.23.16 구현 보고 — Adopt 지식 소유권 이전

날짜: 2026-09-08
시작 HEAD: `bfcbc7c`
범위: Adopt의 transient inventory, self-contained owner/K, optional strong Source basis, 기존 두 커밋 중단 복구, 직접 소비자와 릴리스 정합성

## 결과

Adopt의 전수 좌표·권위·처분·착지표는 제안과 독립 반증, 구속 확인까지만 쓰는 이관 입력으로
한정했다. 승인된 최종 Product·Architecture·해당 Design·code style·glossary·capability와 소유자별
K는 입력 문서를 다시 열지 않아도 목적, 도메인 의미, 결정과 기각 이유, 제약, 용어, modality,
불확실성을 이해하고 유지할 수 있는 현재 지식을 소유한다. 흡수된 입력 좌표는 최종 owner/K의
footer·본문 mark와 Architecture `Existing records` 어디에도 남지 않는다. 흡수 원문의 미해결 모순은
두 입장·근거·미결 상태를 machine mark가 아닌 자기완결 산문으로 보존한다.

K의 `Source basis`는 optional이다. footer가 없으면 self-contained current knowledge이고, 있을 때는
사용자가 명시적으로 유지한 live input 또는 기존 managed card evidence만 담는다. 빈 배열,
malformed 값, 존재하지 않는 경로, 잘못된 revision·줄 범위는 기존과 같은 강도로 실패한다.
project-state의 exact-card seam과 managed landing 규칙은 수정하지 않았다.

DD-97의 `adopt — layer 0` 뒤 `adopt — capabilities` 순서는 유지하되 staging을 self-reference 경계에
맞췄다. 첫 커밋은 `Design head: none`인 capability를 포함한 승인 owner/K 의미 전체를 착지한다.
Design-head command의 pathspec은 product·architecture·glossary만 이름 대므로 capability-only 둘째
커밋은 그 명령이 선택한 첫 커밋을 전진시키지 않는다. 둘째 커밋은 capability head 줄만 그 첫 커밋
ID로 바꾼다. 첫 커밋 뒤 중단되어도 의미는 이미
정본이고 `none`이 stale baseline을 만들어 Resume→Arch로 회복한다. uncommitted bytes를 복구 입력으로
쓰지 않았고 새 state, marker, predicate, ledger, commit-body mapping도 만들지 않았다.

## 변경 경계

- runtime authored 의미 변경: Adopt spec/body/workflow/output templates, Principles K contract와 한
  document-routing 문장, commit/writer/freshness 정책, 공통 Product/Design/Arch K template, 두
  Architecture template와 Arch schema 한 문장, canonical project-knowledge parser.
- generated: Skill Rails가 Adopt, Principles, Product, Design, Arch의 `.generated.json`을 authored
  source에서 다시 만들었다. 각 `.skill-rails/semantic-diff.json`은 해당 skill의 마지막 maintenance
  transaction 직전·직후만 기록하며 release 전체 receipt가 아니다. release-wide 변경 검토는 시작
  HEAD `bfcbc7c`에 대한 Git diff를 사용한다.
- diff 분리: runtime authored 19경로는 +100/-76줄, 표적 test source는 +20/-6줄,
  intent·obligation·authoring-card provenance는 +12/-12줄이다. generated manifest/transaction
  receipt 10경로와
  release/decision 문서는 이 의미 규모에 포함하지 않았다.
- unchanged: Direct, Work, Verify, Resume, project-state runtime, managed-card landing, journal grammar,
  commit message와 stage 수. Adopt commit 둘의 staging partition만 바뀌었다.

## 실행한 검증

- `node --check scripts/project-knowledge.mjs`
- `node --check skills/adopt/spec.mjs`
- `node skills/adopt/fixtures/make-scenarios.mjs`
- `node --test scripts/project-knowledge.test.js` — 46/46 통과
- 임시 K의 마지막 자유 본문 줄을 coordinate-shaped JSON 배열로 둔 표적 실행 — `Source basis`
  로 추론하지 않고 `valid=1` 통과; 임시 폴더는 실행 안에서 삭제
- `node skills/adopt/scripts/skill-rails/cli.mjs test --skill skills/adopt` — 통과
- 최종 grouped repair 뒤 Principles maintenance transaction과 기본 build — L0–L18, mutation
  20/20, fixture 10/10×200, format 11/11 통과; 배포 `test --skill` 재통과
- Product, Design, Arch의 Skill Rails `test --skill` — 앞선 통합 pass에서 모두 통과했고 최종
  grouped repair가 해당 package를 바꾸지 않아 재실행하지 않음
- `node --test --test-name-pattern="K knowledge landing" scripts/project-state.test.js` — 3/3 통과
- `node --test scripts/repository-invariants.test.js` — 21/21 통과
- `node scripts/decision-index.mjs --lang ko` — 한·영 결정 ID·순서 정합 통과
- Adopt, Principles, Product, Design, Arch `maintain.mjs` rebuild — 실행
- Adopt intent 변경 전에 exact source coordinate와 새 requirement text를 가진 다섯 atom을
  실제 spec/body/workflow/fixture locator에 검토 투영한 뒤 `update-intent` 한 transaction을
  실행했다. merge 뒤 118 atoms, 임시 ID 0, `review-required` 0, intent hash 일치를 확인했고
  generated manifest는 ledger를 생성물로 소유하지 않고 authoring evidence hash로 기록한다.
- `complete.adoption`의 committed `Design head: none` 경로를 한 번 대조했고 기존
  stale-baseline→Arch 우선순위와 충돌하지 않아 project-state/reporting은 변경하지 않았다.
- staging 전 `git diff --check bfcbc7c`는 tracked working-copy 경로의 LF→CRLF 변환 경고로
  exit 1이었다. 명시 경로를 staging한 뒤 index bytes에 대한 `git diff --cached --check bfcbc7c`가
  `skills/adopt/body.md` 끝의 추가 빈 줄 하나를 진단해 그 literal 형식 결함만 제거했고, 같은 staged
  검사는 exit 0으로 통과했다.
- Completion gate 전체 suite `rtk node --test 'scripts/*.test.js' 'skills/**/*.test.mjs'`는 한 번
  실행해 exit 1, 577 total, 576 pass, 1 fail, 0 skipped, 0 todo, duration
  `1714478.9914 ms`로 끝났다. 유일한 실패는 `T4 glossary projections match Product and a rendered
  glossary is canon`의 기존 harness가 유효한 template-less Design-head mutation까지 `.template`으로
  투영해 끝에 `undefined`를 만든 stale assertion이었다.
- harness correction은 `scripts/project-state.test.js`에서 명시적 template을 가진 creation `WRITE`
  여덟 개만 순서대로 비교하도록 filter 조건 하나를 좁힌 것이다. Adopt의 17-effect scenario는 유일한
  head-only mutation과 그 `COMMIT → RUN → WRITE → COMMIT` 위치를 이미 소유하므로 product behavior,
  mutation, template에는 손대지 않았다.
- correction 뒤 target-only
  `rtk node --test --test-name-pattern='T4 glossary projections match Product and a rendered glossary is canon' scripts/project-state.test.js`는
  한 번 실행해 exit 0, 1 total, 1 pass, 0 fail, 0 skipped, 0 todo, duration `8830.2954 ms`로 통과했다.

## 감사 guideline §5 종료 판정

두 독립 감사와 후속 동일-context 재판정은 footer 밖 absorbed 좌표, 옛 형식 예시, Arch ledger
주석, commit owner drift, live-input disposition, 그리고 미커밋 draft를 권위처럼 설명한 복구 이론을
같은 인과의 잔여로 확인했다. 통합 수리는 mark/footer 삭제독립성과 committed semantic-set staging으로
그 원인을 교체했다. 마지막 coordinate-shaped JSON 배열을 `Source basis`로 추론하는 검사는 자유 본문을
금지하는 과잉으로 확인해 제거했고, 실제 head가 있을 때의 강한 검사는 유지했다. optional-coordinate
grammar·새 recovery state·추가 refuter rule·knowledge-landing 변경은 과잉 또는 반증된 안으로 기각했다.
최종 독립 재감사 두 건은 blocker 0, audit stop class 0으로 수렴했다.

§5 종료 조항은 모두 평가했다. 같은 문장의 세 번째 수정은 없고, workflow의 live-input
destination/disposition은 두 문서가 같은 두 열을 직접 정해 구체적인 양갈래 독해가 없어 수정하지
않았다. bare-array guard 제거는 앞선 수리의 단순 진자 복귀가 아니라 현재 자유 본문 실패를 재현해
검사 전제를 반증한 결과이며, 근거도 앞선 소견이 아니라 실제 parser와 실행이다. 수정 경로의 유계
재독·금지 문구 sweep·정적/표적 실행에서는 새 규칙 충돌이나 소실 경로가 0이었지만, 독립 재감사와
실사용 검증 전에는 텍스트 감사 종료를 선언하지 않는다.

## 제한과 carry-forward

test-harness correction 뒤 전체 completion suite 재실행, 실제 대형 brownfield Adopt,
입력 삭제 전후의 동일 질문 cold Codex/Claude 비교는 실행하지 않았으며 통과로 기록하지 않는다.
전체 suite의 유일한 stale-harness 실패는 target-only로 교정 확인했지만 전체 pass로 승격하지 않는다.
장시간 suite 재실행과 실사용 재관측은 감독자가 최종 범위를 결정한다.
