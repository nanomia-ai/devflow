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
경로·실패 장면·관련 결정을 보고하고 별도 요청으로 넘긴다. CHANGELOG 전체와 결정 파일 전부는
새 세션의 기본 온보딩 집합이 아니다. 필요한 좌표가 생겼을 때만 연다.

## 2. 언어와 문서 정합성

**언어 규칙은 한 줄이다 — `skills/` 는 영어, `docs/` 는 한국어, `CHANGELOG.md` 는 영어.**

`skills/` 와 `codex/` 는 전 세계 사용자 프로젝트에서 다른 AI 가 읽는 **제품**이므로 영어다.
`CHANGELOG.md` 와 `docs/changelog-archive.md` 는 공개 저장소의 출하 이력이므로 영어다.
`docs/` 는 소유자와 유지보수 세션이 읽는 **작업면**이므로 한국어이고 짝을 두지 않는다.
`AGENTS.md` 는 두 진영이 함께 들어오는 진입면이라 영어를 유지한다.

**짝은 없다.** 이전에는 정본 넷이 `_ko`/영문 쌍이었고 결정 111 개도 쌍이었다 — 그것은 문자 그대로
한 사실 두 집이었고, 이 저장소가 지키려는 규칙을 문서 체계 자신이 어기고 있었다. 접미사도 함께
사라졌다: 구분할 짝이 없으면 `_ko` 는 의미가 없다. 계보는 DD-115.

P2 런타임 스킬은 영문 `spec.mjs`와 `body.md`가 실행 작성 정본이고, `SKILL.md`와
`.generated.json`은 생성 배포물과 영수증이다.

**`skills/` 안에 남는 한글은 둘뿐이고 둘 다 devflow 가 쓰는 산문이 아니다.** 이관 출처 —
`references/legacy-atoms/` 의 원자, `.skill-rails/obligation-ledger.json`, `arch/fixtures/source/remap-ledger.mjs` —
는 원문 그대로 보존하며 수정 원본이 아니다. vendored Skill Rails 런타임(`scripts/skill-rails/`)은
외부 소유자의 바이트다. 둘 다 번역·치환의 대상이 아니다. 언어 시험은 `skills/**/*.md` 에서
`legacy-atoms/` 만 제외한다.

영어 전용 작성 파일은 `AGENTS.md`, `CHANGELOG.md`, `CLAUDE.md`, P2의 `spec.mjs`와 `body.md`다.
`CLAUDE.md`는 이 저장소에서 `@AGENTS.md` 한 줄만 유지한다. 역할 계약은 등록 에이전트가 아니라
깨끗한 컨텍스트에 원문으로 전달하는 동반 파일이다. predicate 동반 자료와 역할 계약을 섞지 않는다.

`docs/` 를 고칠 때 번역 단계는 없다. 고치는 곳이 하나이므로 순서도 하나다.
배포 artifact 를 바꿨다면 §5 의 설치·CHANGELOG·버전 절차를 끝내고, 정본 용어는 §7 을 따른다.

## 3. 설계 의도와 기록의 착지

새 정보를 아무 문서에나 쌓지 않는다. 수명이 같은 정보만 같은 곳에 둔다.

**착지표는 `AGENTS.md` §4 에만 산다** — 세션이 진입에서 읽는 쓰기 배선이므로 여기 사본을 두면 갈린다.
이 절이 소유하는 것은 *언제* 기록할 가치가 있는가와 *어떤 형태로* 기록하는가다.

수동 `CURRENT.md`, 자유 형식 메모층, 종합 요약 파일은 만들지 않는다. 현재 위치와 방향은
`docs/direction.md` 가 소유하고, 그날의 수치와 실행 로그는 Git 에서 복구한다. 의도는 다음 중 하나일 때만 기록한다.

- 미래 AI가 중복·비효율로 오인해 제거할 수 있다.
- 현재 동작만 보아서는 존재 이유가 드러나지 않는다.
- 여러 구현 중 하나만 원래 목적을 지킨다.
- 실제 실패 때문에 추가된 경계다.
- 반복 제안될 대안을 기각했다.
- 테스트가 통과해도 잘못된 방향으로 구현될 수 있다.

그때에는 `관찰된 문제 / 원하는 동작 / 선택한 경계 / 필요한 이유 / 기각한 대안(있을 때만) /
영향 좌표 / 다시 검토할 조건`을 남긴다. 오탈자, 경로, 일자, 검사 개수처럼 스스로 완결되는 사실에는
붙이지 않는다. 같은 뜻을 정본·결정·CHANGELOG에 반복하지 않고 각 문서는 자기 수명만 소유한다.

## 4. 검증과 감리

스킬 문장은 문자 그대로 실행되므로 검증은 적대적인 실행 시뮬레이션이다. 소견의 채택 기준,
렌즈, 종료 조건, 보고 형식은 `docs/audit-guideline.md`만 소유한다.

1. 설계 → 독립 반증 → 적용 → 적용 후 감리 → 수정분 재감리 순서를 지킨다.
   **이것은 `skills/**` 변경의 기본 작업 형태이지 격상이 아니다:** 작업자, 감사 지침 §8 브리핑만
   받은 독립 반증자, 그리고 교차 판정. 한 에이전트의 결론은 단독으로 채택되지 않는다.
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

외부 기여자에게는 이 등가 PR 증명이 한국어인 `docs/audit-guideline.md`·`docs/usecase-matrix.md` 를
직접 여는 의무를 대신한다. PR 설명에 무엇을 깨뜨리려 했고, 건드린 각 단계에서 문자적 독자가 무엇을
하는지 적는다.

## 5. 릴리스와 설치

- **릴리스 증거가 어디에 남는가.** 라운드 기록이 없으므로 집을 이름으로 정하고 「기록 어딘가」로
  남기지 않는다. **CHANGELOG 항목**: 무엇·왜·파일·`unproven` 목록·관문 B 한 줄(능력·채널·통과 여부).
  **릴리스 커밋 메시지**: `AGENTS.md` §6.2 다섯 답, 관문 B 원증거, `skills/**` 변경의 verbatim 전후 렌더.
  **`docs/direction.md`**: 날짜·남은 한계·다음 재검증.
  원증거는 릴리스당 5~15 KB 라 CHANGELOG 에 쌓으면 **라운드 더미가 이름만 바꿔 돌아온다** — 그래서
  Git 에 둔다. 그날의 수치와 실행 로그도 같은 이유로 Git 에서 복구하고 다시 호스팅하지 않는다.
- 정본 버전은 `.claude-plugin/plugin.json`이다. 배포 artifact가 바뀌면 버전을 올리고 두
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
릴리스 커밋 메시지에 둔다. 새 마이너가 열리면 CHANGELOG 머리말의 창 규칙대로 밀려난 계열을 같은
변경에서 `docs/changelog-archive.md` 로 옮긴다 — 그 규칙은 머리말 한 곳이 소유한다.

## 6. 사전 점검표

**벽은 무엇을 건드렸는지에 따라 달라진다.** 원리와 실측 근거는 `AGENTS.md` §6 이 소유한다.

- [ ] `AGENTS.md` §6.1 의 원리로 이 변경에 필요한 벽을 판단하고 돌렸다. 양식 벽 셋은 항상,
      행동 시험은 그 행동을 바꿨을 때. 건너뛴 것이 있으면 보고에 적었다
- [ ] **다섯 질문에 글로 답했다**(`AGENTS.md` §6.2) — 진입 · 정합 · 헛점 · 사용 · `unproven`.
      릴리스면 커밋 메시지에 쓰고 `unproven` 만 CHANGELOG 에도 옮긴다. 「모른다」는 답은 허용한다
- [ ] `scripts/project-state.test.js` 가 도는 변경이면(`AGENTS.md` §6.1) 관문 A — 정경 예약 줄
      열세 종을 배포본 파서에 먹이는 시험, 그 실행에 동승 — 이 초록
- [ ] push 전에 관문 B 를 지났다 — 일회용 저장소에서 능력 하나를 direct → work → verify → 폐쇄까지.
      **조건 없이 매 릴리스**
- [ ] `docs/design.md` 전문과 생성된 결정 색인(`node scripts/decision-index.mjs`) 확인,
      움직인 행은 `--id DD-nn` 으로 열었다
- [ ] `skills/**` 변경 시 matrix 셀 재판정, 새 사용 형태 확인, 전후 렌더를 릴리스 커밋 메시지에
- [ ] 고정 용어 적용. `docs/` 는 한국어이고 정본 영어 토큰은 원문 그대로 유지했다
- [ ] audit 가 있었다면 채택 소견 승격 또는 미승격 이유 확인
- [ ] 감사 지침 §2 기준과 §5 종료 조건으로 비례 검증 보고
- [ ] skill·hook·installer 변경 시 Codex 로컬 설치 snapshot 갱신 여부 기록
- [ ] 두 플랫폼의 현재 네이티브 skills·plugins·hooks 채널 재확인
- [ ] 배포 artifact 변경 시 CHANGELOG 와 버전, 문서만이면 둘 다 없음
- [ ] 생성·삭제·이동 시 문서 지도·참조·테스트·installer 좌표 훑기
- [ ] `git diff HEAD --name-only -- skills` 가 비어 있다(`skills/**` 가 범위 밖일 때)

### 무조건 게이트 넷 — 실행 방법

**관문 B**:

- **무엇을 시험하나 — push 할 바이트.** 후보를 격리된 홈에 설치해 돌린다. Codex 는 임시
  `CODEX_HOME` 에 설치하고 사용자의 실제 `~/.codex` 는 건드리지 않는다. Claude 는 `plugin list --json`
  의 effective version·install path 를 확인한다. 설치본 `run.mjs enter` 의 entry hash 가 원본과 같아야
  한다. 시험한 `skills/`·`codex/`·`hooks/`·`scripts/`·manifest 바이트가 push 할 바이트이고, 관문 B 뒤에
  그 바이트가 바뀌면 다시 돈다. 전역에 설치된 옛 버전으로 돈 실행은 관문 B 가 아니다.
- **어디서·어떻게.** 픽스처가 아닌 일회용 실제 Git 저장소에서 실제로 만드는 작은 능력 하나를, 단계마다
  새 냉간 세션으로 direct → work → verify → 폐쇄까지 끈다. 가능하면 검증 실패 → 수리 카드 → 새
  verifier 의 재검증 경로를 한 번 밟는다(0.23.3·0.23.8 이 그렇게 돌았고, 첫 실행은 시험 301 개가 초록인
  채 살아 있던 코드 결함 넷을 잡았다).
- **무엇이 통과인가.** 폐쇄 뒤 worktree clean · `integrity: blocking=0 advisory=0 shape=0` · anomaly 0 ·
  전이·marker 없음 · 능력 `.done` · freshness 전부 fresh. 돌리지 않은 층(예: 제품층 verify)은 pass 로
  적지 않고 `unproven` 으로 남긴다.
- **기록.** CHANGELOG 항목에 한 줄(능력·채널·통과), 최종 상태 출력 원문은 릴리스 커밋 메시지, 날짜는
  `docs/direction.md`. 사용자는 GitHub 에서 설치하므로 **push 가 출하**다. 관문 B 가 아직 `unproven` 인
  버전 커밋은 후보이고 push 하지 않는다.

**`skills/**` 전후 렌더**: 아래를 변경 전후로 돌려 전문을 릴리스 커밋 메시지에 싣는다.
`--project` 를 이 저장소로 겨누지 않는다 — 바꾸고 있는 것을 관찰하게 된다.

```
node skills/<pkg>/scripts/skill-rails/run.mjs stage --skill skills/<pkg> \
  --project <일회용 저장소> --trace-dir <두 트리 바깥> --decided <field>=<value>
node skills/<pkg>/scripts/skill-rails/run.mjs role --skill skills/<pkg> --role <id>
```

**냉간 이해도 비교**: 진입 체계를 바꾼 변경은 옛 상태를 별도 worktree 로 떼어 같은 질문을
깨끗한 읽기 전용 Claude·Codex 세션에 던진다. 질문은 전체 흐름·구성요소의 존재 이유·권위 차이·삭제 유도
입력·영향 경로·최근 상태·불확실성 보고를 덮는다. 결정적 불변식·소비자·설계 이유 누락은 각각 0 이어야
하고, 원문을 읽기 전에 삭제를 제안한 횟수도 0 이어야 한다. 이해도가 떨어지면 토큰이 줄어도 기각이다.

**생성·삭제·이동 경로 명명**과 `git diff HEAD --name-only -- skills` 확인.

관문 B 는 매 릴리스 사람 손으로 한다. **자동화하지 않는다** — 자동화하면 그것이 다시 자기 자신을
검사하는 하네스가 되고, 0.18.8 까지 스물여섯 릴리스가 시험 초록만으로 지나가는 동안 신규 프로젝트는
첫 Direct 진입에서 멈춰 있었다. 관문 B 의 사양은 이 절이고, 릴리스별 원증거는 릴리스 커밋 메시지다.


## 7. 고정 용어표

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
| 호환 환류 대기 | compatible feedback pending | | 의미 착지 | semantic landing |
| Product 내부 능력 식별자 | Product C<n> <name> | | 제공자 능력 번호 | provider disk NN |
| 유계 의미 반증 | semantic refutation | | 커밋된 Layer 0 기준점 | committed Product boundary |
| 지식 단위 | knowledge unit | | 작업 언어 | Working language |
| 용어 정본 | terminology canon | | | |

가설은 능력 지식 기준선의 신뢰 상태이며 검증 결과인 `unverified`와 다른 개념이다. artifact의 정식
명칭은 `capability document`, 짧은 이름은 `baseline`뿐이다. `capability file`과 `capability baseline`을
다시 만들지 않는다. `waiting capability file`은 트리 루트의 미개방 능력 자리표시자다.

`verify_channel`은 arch.md 필드 식별자이고 `verify channel`은 산문형이며 같은 개념이다. `Settled by`는
arch.md 열 머리글에서 settling card를 부르는 형식이다.
