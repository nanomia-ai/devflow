# devflow 저장소 유지보수 규약

이 문서는 devflow **저장소 자체**를 고치는 절차의 상세 정본이다. 새 세션은 이 문서를
통째로 읽지 않는다. `AGENTS.md`의 배선표가 요청·경로·산출물에 맞는 절을 정확히 지정한다.
런타임 규칙의 정본은 계속 `skills/principles/`에 있으며, 이 문서는 스킬 동작을 재정의하지 않는다.

## 1. 범위와 영향 경계

조건별 읽기 배선은 자동 진입점인 `AGENTS.md`의 표 한 곳만 소유한다. 이 절은 그 표가 여기로
보낸 작업의 범위를 정한다. 진입 게이트가 지정한 파일을 읽은 뒤 영향 파일을 추가로 열기 전에
변경 범위를 경로로 고정하고, 관련성이라는 판단어로 줄이지 않는다. 경로·행위·산출물이 배선표의
다른 조건과 만나면 그 읽기 집합도 합친다.
조건 적용이 불확실하면 읽기를 늘리고, 조용히 줄이지 않는다.

`skills/**`를 바꾸지 않는 유지보수 구조 작업은 스킬의 결함을 발견해도 고치지 않는다. 정확한
경로·실패 장면·관련 결정을 보고하고 별도 요청으로 넘긴다. CHANGELOG 전체, 여러 라운드,
blueprint 전부는 새 세션의 기본 온보딩 집합이 아니다. 필요한 좌표가 생겼을 때만 연다.

## 2. 이중 언어와 문서 정합성

**소유자 대면 문서와 Codex adapter는 한국어로 설계하고 영어로 배포한다.** 아래에 선언된
`_ko.md`는 소유자가 검토하는 설계 원본이고 영어 쌍은 AI 소비용 배포물이다. 살아 있는 선언 쌍은
다음뿐이다.

```
codex/AGENTS-devflow_ko.md ↔ AGENTS-devflow.md
docs/{design,design-decisions,design-backlog,maintenance-protocol}_ko.md ↔ 같은 이름의 .md
docs/rounds/v0.10.0/proposal_ko.md ↔ proposal.md
docs/rounds/v0.11.0/report_ko.md ↔ report.md
docs/rounds/v0.9.21/report_ko.md ↔ report.md
```

P2 런타임 스킬은 의도한 예외다. 영문 `spec.mjs`와 `body.md`가 실행 작성 정본이고,
`SKILL.md`와 `.generated.json`은 생성 배포물과 영수증이다. `references/legacy-atoms/`의 한글
원자는 이관 출처만 보존하며 살아 있는 쌍이나 수정 원본이 아니다.

영어 전용 작성 파일은 `AGENTS.md`, `CHANGELOG.md`, `CLAUDE.md`, P2의 `spec.mjs`와 `body.md`다.
`CLAUDE.md`는 이 저장소에서 `@AGENTS.md` 한 줄만 유지한다. 역할 계약은 등록 에이전트가 아니라
깨끗한 컨텍스트에 원문으로 전달하는 동반 파일이다. predicate 동반 자료와 역할 계약을 섞지 않는다.

선언된 한영 쌍의 수정 순서는 고정한다.

1. `_ko` 원본을 먼저 수정하고 소유자 검토를 받는다.
2. §9의 고정 용어를 사용해 영어 쌍에 번역한다. 같은 개념에 다른 영어를 만들지 않는다.
3. 제목 수, 번호 목록 수, 표 행, diagram 수, 의미를 갖는 수치·비율·버전을 1:1로 확인한다.
4. 배포 artifact를 바꿨다면 §7의 설치·CHANGELOG·버전 절차를 끝낸다.

외부 기여자는 선언 쌍의 영어를 먼저 고칠 수 있으나, 관리자가 다음 릴리스 전에 한국어 원본을
역동기화한다. 작성 중인 한국어는 `_ko.md`, 두 한국어 전용 상시 수단, 쌍이 없는 라운드 기록,
그리고 이 문서의 용어표에만 산다. P2 이관 출처는 `references/legacy-atoms/`에 원문 한글을 보존할
수 있지만 런타임 안내가 아니다. 영어 배포 안내에는 한국어가 한 줄도 없어야 한다.
`node --test "scripts/*.test.js"`가 위 선언 쌍의 구조·기계 수치 대응과 영어 배포 안내의 한국어
0건을 검사하고, legacy atom은 이관 출처로만 명시적으로 제외한다.

## 3. 설계 의도와 기록의 착지

새 정보를 아무 문서에나 쌓지 않는다. 수명이 같은 정보만 같은 곳에 둔다.

| 정보 | 유일한 착지점 | 기록할 내용 |
|---|---|---|
| 정체성·불변식·전체 구조 | `docs/design_ko.md` | 모든 미래 변경이 알아야 할 짧은 정본 |
| 구속 결정과 설계 의도 | `docs/design-decisions_ko.md` | 문제·원하는 동작·경계·이유·재검토 조건. 결정의 유일한 집이고, 색인은 `node scripts/decision-index.mjs --lang ko`가 여기서 투영한다 — 손으로 유지하는 색인 표를 어디에도 만들지 않는다 |
| 미채택 관찰·후보 | `docs/design-backlog_ko.md` | 증거·긴장·다시 볼 조건 |
| 한 라운드의 측정·판정 | `docs/rounds/<version>/report_ko.md` | 실행 증거·한계·미착지 항목 |
| 실제 배포 결과 | `CHANGELOG.md` | 무엇·왜·파일 |
| 런타임 규칙 | `skills/**` | 별도 명시적 스킬 변경에서만 |

수동 `CURRENT.md`, 자유 형식 메모층, 종합 요약 파일은 만들지 않는다. 현재 위치는 Git, manifest,
최신 숫자 버전 라운드의 제한된 후속 절에서 복구한다. 의도는 다음 중 하나일 때만 기록한다.

- 미래 AI가 중복·비효율로 오인해 제거할 수 있다.
- 현재 동작만 보아서는 존재 이유가 드러나지 않는다.
- 여러 구현 중 하나만 원래 목적을 지킨다.
- 실제 실패 때문에 추가된 경계다.
- 반복 제안될 대안을 기각했다.
- 테스트가 통과해도 잘못된 방향으로 구현될 수 있다.

그때에는 `관찰된 문제 / 원하는 동작 / 선택한 경계 / 필요한 이유 / 기각한 대안(있을 때만) /
영향 좌표 / 다시 검토할 조건`을 남긴다. 오탈자, 경로, 일자, 검사 개수처럼 스스로 완결되는 사실에는
붙이지 않는다. 같은 뜻을 라운드·결정·CHANGELOG에 반복하지 않고 각 문서는 자기 수명만 소유한다.

## 4. 검증과 감리

스킬 문장은 문자 그대로 실행되므로 검증은 적대적인 실행 시뮬레이션이다. 소견의 채택 기준,
렌즈, 종료 조건, 보고 형식은 `docs/audit-guideline_ko.md`만 소유한다.

1. 설계 → 독립 반증 → 적용 → 적용 후 감리 → 수정분 재감리 순서를 지킨다.
2. 오탈자·서식은 해당 절의 문자 재읽기, 규칙 문구는 독립 반증 1회 이상, 구조·다중 파일은 전체
   절차와 좌표 훑기를 적용한다.
3. 보고를 먼저 하고 승인 뒤 적용한다. 명백한 규칙 충돌은 직접 수리할 수 있지만 판단거리는
   선택지로 분리한다.
4. 수리한 문장도 새 변경이므로 다시 감리한다.
5. 심각도는 조용한 데이터 소실 → 구조 분리 → 잘못된 행동 → 출구 없는 정지 → 비용 순으로 본다.
6. 보고 전 감사 지침 §2·§5·§6을 읽고, §5의 각 종료 조건 결과를 적는다. 보고만 하는 패스는
   수리 판정 항목을 적용 불가라고 명시한다.

0건도 유효한 결과다. 결함을 찾으라는 압력 때문에 소견을 제조하지 않는다. 같은 렌즈로 같은 경로를
반복하지 않는다. 독립 패스에는 구현 배경을 주지 않고 변경 파일과 감사 지침 §8 브리핑만 전달한다.
정본 규칙의 허가된 예외는 `skills/principles/` 안에서만 선언할 수 있다.

외부 기여자에게는 이 등가 PR 증명이 두 한국어 전용 상시 수단을 직접 여는 의무를 대신한다.
PR 설명에 무엇을 깨뜨리려 했고, 건드린 각 단계에서 문자적 독자가 무엇을 하는지 적는다.

AI 진입 체계를 바꾸는 라운드는 Claude와 Codex의 깨끗한 읽기 전용 세션에서 같은 질문을 전후로
실행한다. 전체 흐름, 구성요소의 존재 이유, 권위 차이, 삭제 유도 입력, 영향 경로, 최근 상태,
불확실성 보고를 검사한다. 핵심 불변식·관련 소비자·설계 이유 누락과 원문 확인 전 삭제 제안은
각각 0이어야 하며, 이해도가 기존보다 낮으면 토큰이 줄어도 채택하지 않는다.

## 5. 라운드 기록

자체 버전을 가질 만큼 큰 변경은 라운드이고, 라운드는 `docs/rounds/<version>/`에 기록을 남긴다.
버전 구현을 요청하면서 라운드 문서 역할을 따로 지정하지 않았다면 `report_ko.md` 하나가 배포·검증·
한계를 남기는 기본 기록이다. 그 밖에는 소유자가 요청한 역할의 문서만 만든다. plan 요청이
handoff·report·audit까지 만들라는 뜻은 아니다. 파일명은 `request_ko.md`, `handoff_ko.md`,
`plan_ko.md`, `report_ko.md`, `audit_ko.md`, 계획 자체의 감사인 `plan-audit_ko.md`다. 별도
폴더가 없는 repair release의 기록은 직전 라운드 안에서 `report-<repair version>_ko.md`를 쓰며,
그 버전은 폴더와 major·minor가 같고 patch가 더 커야 한다.

그 밖의 기존 비표준 이름은 당시 기록으로 보존하되 새 역할의 선례가 되지 않는다.
`v0.15.0/progress-review_ko.md`는 소유자가 요청한 중간 진행 리뷰라는 유일한 역사적 예외이며,
재사용할 수 있는 라운드 역할 이름이 아니다.

라운드 문서는 소유자가 그 문서의 개정을 요청할 때만 고친다. 잘못된 다른 역할 문서는 대화에서
보고하며 대신 수정하지 않는다. 같은 역할의 개정은 이전 파일에 `-r1`부터 시작하는 선행 0 없는 양의
순번을 붙이고 새 문서가 기본 이름을 갖는다. 병존하는 추가 기록은 `request2_ko.md`처럼 `_ko` 앞에
선행 0 없는 2 이상의 순번을 붙인다.

request는 소유자의 말로 원하는 것을 남기고 handoff는 다음 설계 세션이 알아야 할 것을 남긴다.
둘은 같은 문서의 다른 이름이 아니며 대부분의 라운드에는 둘 다 없다. request는 plan의 입력이라
직접 정본으로 승격하지 않는다. 쓰이지 않은 역할은 누락 작업이 아니고, 문서 하나만 있는 라운드도
완전할 수 있다.

직전 라운드는 디렉터리 문자열 순서가 아니라 버전 숫자를 정수로 비교해 현재보다 낮은 최대 버전을
고른다. 별도 폴더 없이 앞 라운드에 기록된 수리 릴리스는 새 라운드가 아니다.

plan은 네 가지를 말한다.

1. 왜 — 측정·현장 보고·소유자 결정처럼 라운드를 만든 관찰.
2. 무엇 — 파일과 문장 수준의 정확한 변경.
3. 무엇을 얻는가 — 닫는 실패 경로나 사는 속성.
4. 기대 결과 — 구현자가 자기 해석을 대조할 관찰 가능한 상태.

모든 review·report의 소견은 원문 인용과 위치, 그렇게 되는 인과, 구체적 예상 장면, 발생 조건의
교집합과 닿지 않는 경계를 갖는다. 세부 형식은 감사 지침 §6을 따른다.

| 라운드 산출물 | 올라오는 것 | 착지점 |
|---|---|---|
| plan | 반박을 갖춘 번복·새 결정·유지된 기각 | `docs/design-decisions_ko.md` |
| report | plan 밖 판단·측정이 뒤집은 규칙·건드리지 않을 것 | `docs/design-decisions_ko.md`; 불변식은 `docs/design_ko.md` |
| audit | 불가능 판정·설계 긴장·채택됐으나 미수리 소견 | `docs/design-backlog_ko.md`; 불변식은 `docs/design_ko.md` |
| 어떤 역할이든 | 새 사용 형태 | `docs/usecase-matrix_ko.md` |
| 어떤 역할이든 | 감사 지침 §2에 없는 결함 클래스 | `docs/audit-guideline_ko.md` §2 |
| 어떤 역할이든 | 새 정본 용어 | 이 문서 §9 |
| 어떤 역할이든 | 새 문서 역할 | `docs/design_ko.md` 문서 지도 |

audit의 채택 소견은 그 라운드가 끝나기 전에 승격하거나 각 미승격 이유를 기록한다. 다음 라운드의
구제 배선은 한 라운드만 뒤로 닿는다. 새 report에는 `실제 배포 / 새 구속 결정 / 미수리 소견
(없음 또는 ID·경로) / 남은 제한 / 다음 재검증`의 짧은 후속 절을 둘 수 있다. 이것은 과거를
재서술하는 현재 정본이 아니라 그 라운드가 남기는 경계 출력이다.

## 6. README

README는 사람의 문서이고, 이 프로토콜에는 그것을 다루는 절차가 없다. 문체 규칙도 전후 개수도
CHANGELOG 연동도 AI가 실행할 일이 아니다 — 무엇을 언제 쓸지는 소유자가 직접 정한다. 경계 자체는
`docs/design_ko.md`가 진다.

## 7. 릴리스와 설치

- 정본 버전은 `.claude-plugin/plugin.json`이다. 동작이 바뀌는 배포 artifact는 버전을 올리고 두
  manifest를 맞춘다. 문서만 바뀌면 버전과 CHANGELOG를 만들지 않는다.
- 사용자는 GitHub에서 설치하고 이 저장소는 디스크에서 설치한다. 로컬 검증은 `codex/install.ps1`
  또는 `install.sh`로 이 폴더를 marketplace로 등록하고 snapshot을 갱신한다.
- SessionStart hook은 두 플랫폼에서 플러그인 안에 배포된다. Claude는 `hooks/hooks.json`을 자동으로
  찾고 Codex는 `.codex-plugin/plugin.json`의 `hooks` 선언을 사용한다.
- `codex/install.ps1`의 UTF-8 BOM을 지킨다. PowerShell 5.1은 BOM 없는 파일을 ANSI로 읽는다.
- Claude는 `claude plugin install devflow@nanomia`, Codex는 로컬 installer로 재설치해 확인한다.
- 생성된 `~/.codex/prompts/` 채널은 DD-57 이후 없다. installer는 과거 devflow가 만든 정확한
  이름만 청소한다.

배포 artifact는 `skills/`, `codex/`, `hooks/`, `scripts/`, 플러그인 manifest다. 하나라도 바뀌면
CHANGELOG 맨 위에 날짜·무엇·왜·파일을 적는다. 약 60줄 안에서 끝내고 감리 과정·측정·소견 판정은
라운드 report에 둔다. 0.10.0 이전 이력은 `docs/changelog-archive.md`에 있다.

## 8. 사전 점검표

- [ ] `node --test "scripts/*.test.js"` 통과
- [ ] 그 실행 안에서 관문 A — 정경 예약 줄 열세 종을 배포본 파서에 먹이는 시험 — 이 초록.
      별도 명령이 아니다
- [ ] 검증 계약을 바꾸는 릴리스면 관문 B를 한 번 지났다 — 실제 프로젝트에서 능력 하나를
      split → work → verify → 폐쇄까지 끌고 간다
- [ ] `docs/design.md` 전문과 생성된 결정 색인(`node scripts/decision-index.mjs`) 확인, 움직인 주제 절의 이유 확인
- [ ] `skills/**` 변경 시 matrix 셀 재판정과 새 사용 형태 확인
- [ ] `_ko` 먼저 수정, 고정 용어 적용, 한영 구조·수치 대응 확인
- [ ] audit가 있었다면 채택 소견 승격 또는 미승격 이유 확인
- [ ] 감사 지침 §2 기준과 §5 종료 조건으로 비례 검증 보고
- [ ] skill·hook·installer 변경 시 Codex 로컬 설치 snapshot 갱신 여부 기록
- [ ] 두 플랫폼의 현재 네이티브 skills·plugins·hooks 채널 재확인
- [ ] 배포 artifact 변경 시 CHANGELOG와 버전, 문서만이면 둘 다 없음
- [ ] 생성·삭제·이동 시 문서 지도·참조·테스트·installer 좌표 훑기
- [ ] `skills/**`가 범위 밖이면 기준 commit 대비 diff 0

관문 B는 검증 계약을 바꾸는 릴리스마다 한 번, 사람 손으로 한다. **자동화하지 않는다** —
자동화하면 그것이 다시 자기 자신을 검사하는 하네스가 되고, 0.18.8까지 스물여섯 릴리스가
시험 초록만으로 지나가는 동안 신규 프로젝트는 첫 split에서 멈춰 있었다. 관문 B의 사양과
원시 증거는 그 릴리스의 라운드 기록이 소유한다.

## 9. 고정 용어표

표에 있는 개념은 다른 영어를 쓰지 않는다. 표가 새 개념을 막는 것은 아니며, 새 정본 용어는 같은
변경에서 행을 추가한다.

| 한국어 | 영어 | | 한국어 | 영어 |
|---|---|---|---|---|
| 규칙 정본 | canonical rules | | 능력 | capability |
| 작업 카드 | task card | | 골조 | foundation |
| 목적지 | Destination | | 왜 | Why |
| 금지 | Forbidden | | 완료 신호 | completion signal |
| 의존 | Depends | | 읽을 것 | Read first |
| 등급 T-상/중/하 | Tier T-high/T-mid/T-low | | 좌표 | Coordinates |
| 정체성 | Identity | | 검증 창구 | verify channel |
| 조사 카드 | research card | | 실행 제안 | execution proposal |
| 정합성 점검 | integrity check | | 문서 계층 | document hierarchy |
| 실패 사다리 | failure ladder | | 진행 로그 | progress log |
| 승격 | promotion | | 사고량 | reasoning effort |
| 지향 | Values | | 이 프로젝트의 선택 | Project choices |
| 신뢰 경계 | Trust boundary | | 하지 않는 것 | Non-goals |
| 미검증 | unverified | | 통과/실패 | pass/fail |
| 잠정값 | Provisional | | 증거 대기 | evidence-wait |
| 경계 정리 커밋 | boundary commit | | 환류 | upper-document feedback |
| 신선도 | freshness | | (journal) 정리 | sweep |
| 은퇴 | retired | | 성공 판정 | success criteria |
| 다중 모드 | multi mode | | 솔로 모드 | solo mode |
| 방 | room | | 점유 | claim |
| 해제 | release | | 소화 | digest |
| 마커 | marker | | 구속 결정 | binding decision |
| 통합 브랜치 | integration branch | | 무주 점유 | ownerless claim |
| 배정 | assignment | | 전환 미완 | incomplete transition |
| 무기명 | bare | | 발견→갱신 표 | discovery→update table |
| 도입 | adoption | | 브라운필드 | brownfield |
| 미발급 | unminted | | 해소 카드 | settling card |
| 고착 탈출 | stuck-escape | | 원인 가설 | cause hypothesis |
| 감리 | audit | | 소견 | finding |
| 회고 | retrospective | | 긴장 증거 | strain evidence |
| 증거 마감 | evidence-finalizing | | 원격 증거 점검 | remote evidence check |
| 적대 입력 | hostile input | | 능력 코드 범위 | capability code scope |
| 유지보수 라우팅 대기 | maintenance routing pending | | 재분할 대기 | re-split pending |
| 상태 판정 정본 | canonical state predicates | | 검증 판정 정본 | canonical verification predicates |
| 정본 경로 순서 | canonical path order | | 정본 카드 번호 순서 | canonical card-number order |
| 라우팅 준비 | routing prepared | | 능력 지식 기준선 | capability knowledge baseline |
| 가설 | hypothesis | | 설계 구역 | design zone |
| 검증 구역 | verified zone | | 능력 문서 | capability document |
| 경량 변경 | tweak | | 게시 | publish |
| 상태 도구 | state tool | | 구역 | zone |
| 묘비 | tombstone | | 닫힌 폴더 투영 | closed-folder projection |
| 구조적 막힘 | structural blocker | | 지속 경합 | sustained contention |
| 묶기 | bundling | | 고아 점유 | orphan claim |
| 은퇴 관측 게이트 | retirement observation gate | | 봉쇄 | blockade |
| 유효 | active | | 대체됨 → DD-nn | replaced by DD-nn |
| 유효 · 일부 정정 → DD-nn | active, partly corrected by DD-nn | | 최초 설계 | origin |
| 기획 증거 규율 | planning evidence discipline | | 수리 계보 | repair lineage |
| 재관측 | recurrence observation | | 구속 전 재검토 | pre-commitment review |
| 신호 카드 | signal card | | 기획 깊이 등급 | planning depth grade |
| 접근 방식 | approach | | 디자인 원천 | design source |
| 토큰 전략 | token strategy | | 컴포넌트 전략 | component strategy |
| 분해 축 | decomposition axis | | 검토 표면 | review surface |
| 구축 범위 | build scope | | 처분 | disposition |
| 결정 기록 | decision record | | 증거 기록 | evidence record |
| 기록 게이트 | record gate | | 기록 도구 | record tool |
| 지식 캡슐 | knowledge capsule | | 개봉 예산 | opening budget |
| 출처 표기 | provenance mark | | Intent 총론 | Intent overview |
| 종합 | synthesis | | 추정 | conjecture |
| 다툼 | dispute | | 출처 표본 검사 | provenance sampling check |
| 기명 미결 항목 | named open item | | 설계 미결 항목 | design open item |

가설은 능력 지식 기준선의 신뢰 상태이며 검증 결과인 `unverified`와 다른 개념이다. artifact의 정식
명칭은 `capability document`, 짧은 이름은 `baseline`뿐이다. `capability file`과 `capability baseline`을
다시 만들지 않는다. `waiting capability file`은 트리 루트의 미개방 능력 자리표시자다.

`verify_channel`은 arch.md 필드 식별자이고 `verify channel`은 산문형이며 같은 개념이다. `Settled by`는
arch.md 열 머리글에서 settling card를 부르는 형식이다.
