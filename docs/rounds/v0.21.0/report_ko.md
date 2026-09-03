# v0.21.0 구현 보고서 — 목적 우선 기존 프로젝트 도입

상태: 구현 완료 · 독립 반증 감사 완료

기준 커밋: `404a3fe71289`

## 요청과 증거

이미 진행된 프로젝트의 유지 문서 또는 코드를 역산해 devflow의 전체 지식층을 처음 세우는
Adopt가 세 실제 작업 트리에서 진입하지 못하거나 순환했다. 원래 에이전트에는 아무 입력도 보내지
않고 Orca가 보존한 상태와 출력만 읽었다.

- `devflow-test`의 Codex는 명시 Adopt보다 Principles를 먼저 실행하고 작성 상태를 되풀이했다.
- `devflow-test3`의 Claude는 계획까지 도달했지만 빈 `devflow/` 폴더를 만들어 잘못된 상태 경계를
  스스로 우회해야 했다.
- `devflow-test4`의 Codex는 Resume의 `DONE: unmanaged` 뒤 Product부터 시작하라고 안내했다.

세 장면의 공통 원인은 모델 능력 차이가 아니라 서로 맞지 않는 진입 계약이었다. 명시 단계도
Principles 사전 분류를 거쳤고, Adopt는 정작 `setup.unmanaged`를 받지 않았으며, Resume은 무관리
상태를 정상 종료했다. 이후 덧붙은 자기보고 단계·파일명 대리 증거·브라운필드 기원 기반 작성자
분기는 실제 조사 대신 완료 선언과 `Resume → Adopt → Resume` 순환을 만들었다.

## 적용한 경계

명시한 devflow 단계는 그 단계로 바로 들어간다. Principles는 Principles로 들어온 일반 devflow
의도만 분류한다. SessionStart는 현재 `.devflow/project/product.md`가 있을 때만 안내하므로 빈 폴더나
추적되지 않은 일부 `.devflow/` 경로는 관리 상태를 만들지 못한다. Git index나 이력에 남은 `.devflow`
경로는 중단 복구 증거로 유지한다.

대상 프로젝트의 정본 루트는 `.devflow/` 하나로 바꿨다. SessionStart, 정본 상태·지식 도구,
Git pathspec, journal·카드 좌표와 아홉 스킬의 reader/writer를 같은 표기로 함께 옮겼다. 실제 사용 중인
관리 프로젝트가 없고 시험 프로젝트도 다시 만든다는 소유자 확인에 따라 구 경로 별칭·이중 판정·
자동 이관은 만들지 않았다. `devflow:` 스킬 이름, plugin 이름, wire schema는 프로젝트 경로가 아니므로
그대로 두고 과거 round·CHANGELOG·blueprint·legacy atom의 당시 좌표도 다시 쓰지 않았다.

명시 Adopt는 무관리 저장소에 devflow 이전의 유지할 프로젝트 자료가 문서 또는 코드로 하나라도
있으면 역산을 시작한다. 그런 자료가 전혀 없는 저장소만 Product로 보낸다. 모든 유지 구현·테스트·
API·스키마·설정·문서·명세·운영 자료에는 이름 난 착지, 보조 증거, 대체/모순, 이유 있는 비도메인
제외, 또는 드러난 미해결 중 하나가 붙는다. 코드 기반 능력 후보는 대표 실행 흐름 하나를 추적하고,
문서에만 존재하는 후보는 문서 출처를 드러내되 실행 증거를 만들지 않는다.

문서의 내부 상태와 실제 코드·테스트·운영 흔적을 우선 대조하고, 폴더·파일명·Git 이력·마지막 수정
시각은 권위를 정하는 단독 기준이 아니라 우선순위와 연대를 맞추는 보조 단서로 쓴다. 그 결합으로
현재 구현·구속 기획·탐색 리서치·대체 기록을 구분한다. 증거로 닫히는 불일치는 출처를 남기고
능동적으로 종합하지만, 현재 의도를 결정할 수 없는 충돌은 경쟁 자료의 좌표와 필요한 결정을
구체적으로 제시해 사람에게 묻고 상상으로 메우지 않는다.

그 전체 증거에서 Product, Architecture, 해당 시 Design, code style, glossary, 능력 설계 구역과
깊은 영속 도메인 지식에 필요한 모든 소유자 인접 K를 한 번에 제안한다. K가 0개인 것은 모든 유지
도메인 자료가 상시 읽는 소유자에 완전히 착지했다는 증거가 있을 때뿐이다. 발견 가능한 사실은
다시 묻지 않고 불가약한 판단 공백과 모순만 사람에게 묻는다. 한 구속 승인 전에는 쓰지 않으며,
거절·승인 전 중단도 쓰기 0이다. 승인 뒤 Architecture·Design·code style·glossary·정확한 후속 요청을
쓰고 Product를 마지막에 둔 첫 커밋으로 완전한 Layer 0을 세운다. 이어 그 커밋 해시를 `Design head`로
기록한 능력 문서를 쓰고 각 소유자 옆에 모든 K를 써 정본 검사기로 검증한 뒤 둘을 두 번째 커밋에
함께 둔다. 두 커밋은 한 승인에 묶이며 Product나 다른 후속 단계를 대신 선택하지 않고 끝난다.
함께 받은 후속 요청은 Principles의 기존 정본 라우팅 줄 형식으로 첫 커밋에 온전히 보존한다.

관리 상태의 glossary/design/baseline 갱신은 현재 기술 설계 소유자인 Arch로 간다. 과거에 커밋된
정확한 `writer=adopt` 지식 마커는 출처 표시는 그대로 보존하되 Arch가 소비한다. 새
`writer=arch` 마커도 브라운필드 기원과 무관하게 Arch가 소비하므로, 혼합 집합이 Resume과
Adopt 사이를 순환하지 않는다.

## Skill Rails 관점의 정리

### A — 반드시 기계가 소유할 것

- 현재 관리 상태, 열린 Git 작업, 정본 journal 마커의 구문과 writer, 단일 다음 route
- 명시 단계와 일반 intent의 진입 경계
- 승인 전 쓰기 0, 한 승인 아래의 Layer 0·능력/K 커밋 경계, Product-last와 정확한 후속 요청 보존
- 생성 패키지의 P0/P1/P2 구조와 collector의 유계한 상태 관찰

### B — AI 판단을 안내할 것

- 유지 자료 전체의 의미 있는 처분과 모순 대조
- 능력 후보별 대표 흐름, 문서 전용 후보의 출처, Product/Architecture/Design/glossary/도메인 종합
- 어느 지식이 상시 읽는 소유자에 충분한지와 어느 깊은 지식이 K로 남아야 하는지
- 증거로 닫히지 않는 질문만 고르고 하나의 이해 가능한 제안으로 설명하는 일

### C — 제거한 과잉 기계화

- 모델이 `read/inspect/derive/proposal` 완료를 스스로 보고하면 전진하는 단계 필드
- 코드 존재를 흐름 증거로 간주하는 대리 판정과 파일명 모양의 문서 선택
- 실제 산출물이 아닌 pseudo path와 사용되지 않는 별도 scenario 사본
- Adopt 뒤 다시 Product/Arch/Resume을 고르게 하는 후속 route
- 브라운필드 기원마다 현재 설계 writer를 갈라 같은 문서에 두 절차 소유자를 두는 분기
- 한 도메인 스킬에서 공용 Skill Rails trace 위치를 덧대는 국소 우회

## 간섭 점검

- Resume은 `setup.unmanaged`를 성공한 관리 재개로 오인하지 않고 보고 후 끝난다. 명시 Adopt만 그
  무관리 상태를 최초 도입에 소비한다.
- Product는 유지 자료가 전혀 없는 새 프로젝트만 받으며 기존 프로젝트의 Product 역산과 경쟁하지
  않는다.
- Arch는 관리된 현재 기술 갱신을 소유하고 Adopt를 다시 열지 않는다.
- SessionStart와 Codex fallback은 명시 stage를 Principles보다 뒤로 숨기지 않는다.
- 정본 상태 도구는 빈 폴더를 멤버십으로 쓰지 않고, knowledge writer를 Brownfield에서 재계산하지
  않는다. Work는 현재 `arch` 출처만 만들고 Arch는 유효한 과거 `adopt`·현재 `arch` 출처를 모두
  소비하므로 다른 스킬로 순환시키거나 출처를 다시 쓰지 않는다.
- Product/Architecture/code-style/glossary/capability/K의 공통 파일 규칙과 design/verified byte 소유
  경계는 바꾸지 않았다. Adopt는 같은 정본 형태를 초기 역산에 사용하고 Arch는 이후 갱신에 쓴다.

## 검증과 제한

Skill Rails runtime 0.3.2와 validator 0.4.2로 아홉 P2 패키지를 현재 작성 정본에서 다시 생성했다.
모든 영수증은 `L-full:pass`이고 fixture 합계 281/281을 5회 반복해 불일치 0이다. 한·영 결정 색인
생성, SessionStart·정본 상태·지식 도구의 구문 검사, 현재 source/generated 표면의 구 경로 잔류 검색,
두 지식 도구의 줄바꿈 정규화 후 byte 동일성, `git diff --check`도 통과했다. wire schema·plugin·skill
이름과 과거 기록 좌표가 경로 치환에 섞이지 않았는지도 별도로 대조했다. 경로가 함께 바뀐 Split의
기존 project-research source fixture에서 잘못된 따옴표 escape를 발견해 의미 변화 없이 JSON 구문만
고쳤고, 변경 JSON 33개를 다시 파싱해 오류 0건을 확인했다.

독립 Fable 감사는 두 단계로 했다. 구현 감사가 진입·라우팅·자료 처분·writer 소유권·중단 복구와
모든 생성 영수증을 대조했고, 목적 감사가 JGNote 규모의 구현 명세·구속 기획·탐색 리서치·대체 문서·
문서 전용 능력·용어가 섞인 반례로 지식층 완성을 추적했다. 처음에는 보고서와 backlog의 낡은 두
문장을 찾아 수리 뒤 0건을 확인했다. 별도 Sol 반증은 K를 소유 능력 문서보다 먼저 쓰면 정본
검사기가 거부하는 점과 Product 쓰기 뒤 첫 커밋 전에는 이미 관리 상태라는 점을 찾아냈다. Fable이
원문을 다시 대조해 두 소견을 받아들였고, K를 두 번째 커밋으로 옮기고 세 중단 창을 사실대로
나눴다. 최종 수정본 재감사는 DD-76 정정 좌표 하나만 더 찾았으며 한·영 DD-97에 같은-커밋 규칙과
writer 생애를 명시한 뒤 재독해 0건으로 닫았다. 첫 커밋에 임시 소유자를 만들기, 검사기를 약하게
하기, 전체를 한 커밋에 넣기, 도입을 Arch에 미루기는 각각 지식 검증·Design head·역산 목적을
깨므로 더 단순한 자연스러운 대안이 아니었다.

`.devflow/` 하드 전환 뒤에는 기존 Sol과 Fable 컨텍스트를 다시 사용해 현재 main을 읽기 전용으로
교차 감사했다. Sol은 상태 도구의 membership·Git pathspec·journal 좌표, 아홉 생성 영수증과 타 스킬
간섭을 대조해 차단 0건을 냈다. Fable은 실제 diff 감사와 Adopt 목적 감사를 다시 분리해 수행했고,
구 대상 경로 잔류·schema/name 오치환·역사 기록 변조·Split 권한 증식·Adopt 본질 훼손을 모두 0건으로
확인했다. 둘 다 이 감사에서 파일을 편집하지 않았다.

소유자가 빠른 반복을 요청했으므로 전체 `node --test "scripts/*.test.js"`와 설치 뒤 실제 Codex·Claude
행동은 실행하지 않았다. 따라서 Gate A와 실제 세션 행동은 **미검증**이며 통과로 쓰지 않는다.
검증 계약 자체는 바꾸지 않아 수동 Gate B 대상이 아니다. 공용 Skill Rails trace 위치 문제는 Adopt
안에 복제하지 않고 `docs/design-backlog.md`의 upstream 관찰로 남겼다.

감사 지침 §5의 규칙 충돌·의미 소실 중지 조건은 중간 반증에서 실제로 발동해 먼저 수리했다. 현재
규칙 충돌과 소실 경로는 0이며, 수리한 표면은 같은 감사자가 다시 읽었다. 지원 파일만 있는 저장소는
제안 뒤 쓰기 전 사람 판단에 머무는 보조 경계이지 빈 능력을 만드는 완료 경로가 아니므로 새 상태를
추가하지 않았다.

생성 경로: `docs/rounds/v0.21.0/report_ko.md`, `skills/adopt/templates/design.md`

삭제 경로: `skills/adopt/scenarios.json`, `skills/adopt/references/knowledge-landing.md`,
`skills/adopt/fixtures/projects/knowledge-landing/cards/01.1-research.md`

이동 경로: 없음
