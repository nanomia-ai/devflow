# v0.23.2 수리 보고 — Resume 선택 설명의 역할 복원

상태: 구현·정적 검증·교차 검토·배포 완료, 사용자 실사용 시험 대기  
기준 커밋: `b2b8cad8180b6276a83bae15e661e6f5acb96b97`

## 범위와 원인

이번 수리는 `resume` 호출명을 유지하고 선택 설명만 바로잡는다. 실제 상태 계산, 상태 우선순위,
라우팅 표, Product·Arch·Design·Direct·Work·Verify의 단계 흐름, Principles의 공통 규약 소유,
Adopt의 무관리 역산, 오케스트레이션과 워크트리 경계는 변경 범위가 아니다.

기존 설명은 “새 세션 복원”을 앞세운 뒤 Arch 지식 마커의 구현 세부를 길게 열거하고, 마지막에
“기존 관리 프로젝트의 작업”을 포괄 진입 조건처럼 두었다. 그 결과 현재 위치를 스스로 찾고 다음
소유 단계를 선택하는 중심 역할은 잘 보이지 않는 반면, 문자적인 선택기는 사용자가 Work·Verify·
Arch를 직접 이름 붙인 요청까지 Resume가 가로챌 수 있었다. 이는 요청 사례별 제외 목록을 늘릴
문제가 아니라, Resume의 양의 목적과 이름 있는 단계의 직접 진입 경계를 같은 설명에서 분리할
문제였다.

## 적용한 최소 수정

`skills/resume/.skill-rails/intent.json`의 description을 다음 의미로 바꿨다.

- 관리 프로젝트의 정본 디스크 상태에서 현재 위치를 복원한다.
- 중단된 transition을 복구하고, 현재 위치를 보고하거나 다음 단계의 단일 소유자에게 라우팅한다.
- 요청받으면 번호 또는 이름으로 capability 문서 하나를 열어 유계 읽기 안에서 도메인을 설명한다.
- 다른 devflow 단계가 이름으로 지정된 요청은 그 단계가 직접 진입한다.
- 기존의 명시적 Resume, 다른 단계에서의 Resume 라우팅, 관리 프로젝트 진입 조건은 그대로 둔다.

Skill Rails의 `update-intent` 유지보수 트랜잭션으로 정본을 바꾸고 `SKILL.md`,
`agents/openai.yaml`, `.generated.json`, obligation ledger와 semantic diff를 재생성했다. spec·body·
collector·reference·fixture에는 변경이 없고 semantic diff의 behavior·observation·context 변화도 0이다.
설계 의도나 결정이 움직이지 않았으므로 `docs/design*`와 결정 원문은 바꾸지 않았다.

## 사전 교차 검토

기존 프로젝트 이해가 축적된 Claude Fable xhigh와 Codex Sol xhigh 터미널을 같은 Orca run에서
재사용했다. 둘 다 파일을 수정하거나 광범위 테스트를 실행하지 않고 selector와 실제 Resume 정본,
중앙 진입 계약, 관련 결정과 유즈케이스만 대조했다.

Fable은 방향을 승인하면서 `boundary` 대신 정본 용어 `interrupted transition`을 쓰고, Resume가
항상 REPORT를 먼저 내는 것은 아니므로 “보고하거나 소유 단계에 라우팅”한다고 구분하며, 도메인
진입은 DD-44대로 “번호 또는 이름”을 유지하라고 교정했다. Sol은 기존 catch-all이 명시 Work·Verify·
Arch를 가로챌 수 있고, 반대로 관리 프로젝트 한정어를 모든 호출에 적용하면 명시적 Resume의
무관리 안전 종료를 숨길 수 있음을 확인했다. 최종 문구는 구체 요청 목록을 추가하지 않고 이름 있는
다른 단계의 직접 진입이라는 한 경계와 기존 `Use when explicitly invoked`를 함께 보존했다.

두 모델 모두 이 변경은 선택 메타데이터와 생성 receipt에만 닿으며 design·decision·상태 로직 변경은
필요 없다고 판정했다. 오케스트레이션 terminal과 상태 기계의 terminal outcome을 혼동할 표현도
최종 문구에서 사용하지 않았다.

## 검증 증거와 한계

- Skill Rails L-fast와 L-structural lint가 통과했다. L-full build는 Resume의 L0–L18,
  mutation 20/20, fixture 48/48, 결정 반복 200회, mismatch 0을 보고했다.
- Skill Rails evaluation도 구조 검사와 같은 48/48 동작 fixture를 통과했다. 이 결과는 정본과
  생성물의 결정론적 일치를 증명하지만 실제 모델의 selector 행동을 증명하지는 않는다.
- `scripts/session-start.test.js`는 8/8 통과했다. 무관리 저장소와 빈 `.devflow/` 침묵, 관리
  프로젝트 안내, 역할 우회, 하위 폴더 루트 해석, 생성 selector의 명시·라우팅·관리 경계를 확인했다.
- `scripts/repository-invariants.test.js`는 20개 중 19개가 통과했다. 실패한 한 항목은 전체 P2
  semantic audit를 녹색으로 요구하는 집계 검사이며, 이번 diff가 전혀 건드리지 않은 Adopt의
  `spec:STAGES/adoption`과 Principles의 `spec:STAGES/classify`에 이미 존재하는 overloaded
  provenance를 보고했다. Resume 자체 semantic audit는 atoms 209, review-required 0,
  overloaded 0, scenario 48으로 통과했다.
- 저장소 완료 게이트 `node --test "scripts/*.test.js"`는 한 번 실행했다. 약 10분 동안 완료되지
  않아 사용자의 장시간 기계 검사 회피 원칙에 따라 중단했다. 중단 전 decision-index, Git 상태
  전이, 지식 캡슐의 출력된 검사와 channel-unavailable 사례는 통과했지만 전체 결과는 **미검증**이며
  통과로 세지 않는다.
- `git diff --check`가 통과했고, intent description과 `SKILL.md`·OpenAI metadata 투영은
  byte-identical이다. 두 manifest 버전은 0.23.2로 일치한다.

검증 계약은 바뀌지 않아 수동 Gate B 대상이 아니다. 설치 후 깨끗한 Codex·Claude의 실제 선택과
시험 브랜치의 직접 사용은 사용자가 수행하므로 그 전까지 **미검증**이다.

감사 지침 §5의 종료 조건은 수정 범위에서 규칙 충돌·소실 경로 0, 남은 양갈래 독해 0, 새 해석을
여는 추가 문장 0으로 평가했다. 변경 후 정본 description과 두 생성 selector를 다시 대조했고,
상태·라우팅·다른 스킬 diff가 없음을 확인했다. 더 넓은 광역 감사는 이 작은 선택 설명 수리의
완료 조건으로 삼지 않았다.

이번 수리에서 만든 영속 경로는 이 보고서 하나이며, 삭제하거나 이동한 경로는 없다.

## 배포 기록

버전은 두 plugin manifest와 CHANGELOG에서 0.23.2로 올렸다. 구현 commit `63039ab`을
`origin/main`에 push한 뒤 Codex와 Claude에 설치했다.

Codex 설치기는 Orca가 지정한 `CODEX_HOME`의
`plugins/cache/nanomia/devflow/0.23.2`에 설치했다. `codex plugin list --marketplace nanomia
--json`은 `devflow@nanomia` 0.23.2를 installed·enabled로, source를 이 저장소의 local 경로로
보고했다. Claude는 `claude plugin update devflow@nanomia`로 0.23.1에서 0.23.2로 갱신됐고
`~/.claude/plugins/cache/nanomia/devflow/0.23.2`에 설치됐으며 새 세션이 필요하다고 보고했다.

두 설치 캐시 각각에서 release source와 manifest 둘, CHANGELOG, SessionStart, Resume의 intent·
generated manifest·ledger·semantic receipt·SKILL·OpenAI metadata·spec·body·collector를 포함한
핵심 13개 파일을 newline-normalized SHA-256으로 대조했다. 양쪽 모두 missing 0, mismatch 0이며
설치된 Resume `SKILL.md` 해시는
`2e3db9c7410839b87635519c73163afe1213ab3529a9ad28d39e923e030986ee`이다.

Codex `/hooks` 화면의 native SessionStart trust와 새 Codex·Claude 세션의 실제 selector 행동은
확인하지 않았다. 이 UI 확인과 시험 브랜치의 실사용은 사용자에게 남긴다.
