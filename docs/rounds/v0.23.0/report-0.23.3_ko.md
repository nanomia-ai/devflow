# v0.23.3 수리 보고 — 프로젝트 소속 판정을 현재 증거로 한정

상태: 구현·유계 정적 검증·Sol 교차 검토 완료, 커밋·배포·사용자 실사용 시험 대기  
기준 커밋: `4b37a2a96d270edea48c56e57cb5ee9ef260ecd1`

## 범위와 원인

이번 수리는 상태 도구의 프로젝트 소속 판정 하나를 바로잡는다. zone 표, 라우팅 우선순위,
SessionStart, Adopt·Product·Arch 패키지, 다른 스킬의 spec·collector·fixture는 변경 범위가 아니다.

`skills/principles/scripts/project-state.mjs`의 소속 판정은 현재 `product.md`와 색인이 비어 있으면
`git log -1 --format=%H --all -- .devflow`로 공유 객체 저장소의 모든 ref를 걸었다. 그래서 자기
계보에 `.devflow`가 한 번도 없던 연결 워크트리(linked worktree)가 형제 브랜치의 `.devflow` 때문에
`setup.no-product`로 읽혔고, 명시 `devflow:adopt`는 `state-owned-elsewhere` guard로 Resume에 넘어가
설정 질문에서 멈췄다. 기존 T2 시험 「linked worktree sees devflow history on another current ref」가
이 잘못된 답을 그대로 고정하고 있었다. 직전에 되돌려진 `f850a35`는 이 함수를 건드리지 않았다.

## 검토 흐름과 결정

처음 제안은 `--all`을 현재 HEAD 계보로 좁히는 안이었다. 실측 결과 unborn HEAD와 손상된 현재 ref를
Git 종료 코드로 가려내려면 `symbolic-ref`·`show-ref` 호출을 더 얹어야 했고(`rev-parse --verify`는
둘 다 1을 돌려준다), 그렇게 해도 커밋된 전체 삭제는 「product.md 없음」 질문으로 바뀔 뿐 경고가 되지
못했다. 소유자가 전제를 다시 열어 **현재 증거만으로 판정**하기로 결정했다: 작업 트리의 `.devflow`
루트나 이 체크아웃 색인의 `.devflow` 경로가 있으면 관리 또는 부분 상태, 둘 다 없으면 어느 ref의
이력과도 무관하게 `setup.unmanaged`. 근거는 셋이다 — 현재 루트와 색인이 비어 있으면 devflow가 덮어쓸
산출물이 없고, 커밋된 전체 삭제의 복원은 Git이 소유하며, 명시 Adopt는 소유자가 재역산을 선택한
것이다. 추적되지 않은 부분 `.devflow` 폴더는 덮어쓸 수 있는 실물이므로 반대로 `setup.no-product`로
보호된다. 이 결정은 DD-100으로 기록했고 DD-95·DD-97의 상태를 일부 정정으로 바꿨다.

## 적용한 최소 수정

- `skills/principles/scripts/project-state.mjs`: `devflowHistoryEvidence`(이력·shallow·`--all`
  관측)를 삭제하고, `devflowMembershipEvidence`를 `.devflow` 루트 lstat과 `git ls-files -- .devflow`
  두 관측으로 줄였다. 관측 실패(`unknown`)는 종전처럼 무관리로 단정하지 않는다. 내부 `history`
  필드는 사라졌고 출력 schema에는 없던 값이다. +7/-29.
- `scripts/project-state.test.js` T2 블록: 부분 폴더 보호, 스테이징된 전체 삭제(HEAD에 경로가
  남아 있음을 단언), 커밋된 전체 삭제, shallow, 무관한 손상 ref, 색인 관측 실패(`.git/index`
  손상), 형제 ref만 가진 연결 워크트리를 고정했다. +29/-13.
- `docs/design-decisions_ko.md`·`docs/design-decisions.md`: DD-100 신설(정체성·배포·플랫폼),
  DD-95 상태 `일부 정정 → DD-97 (v0.21.0), DD-100 (v0.23.3)`, DD-97 상태 `일부 정정 → DD-100 (v0.23.3)`.
- `docs/usecase-matrix_ko.md` §3.24: 장면을 현재 체크아웃의 작업 트리·색인 기준으로 고치고 판정 문장
  하나를 정정했으며 0.23.3 부분 재판정 한 단락을 §6 기록에 더했다. 새 H·A 행 0, 새 교차 셀 0.
- `skills/resume/body.md` `stage: scope-entry`: 무관리 보고 문장을 「작업 트리에 `.devflow` 루트가
  없고 현재 체크아웃의 색인에 `.devflow` 경로가 없다」로 바꿨다. Skill Rails `maintain.mjs`의
  `replace-body-section` 트랜잭션으로 적용해 `.generated.json`과 semantic diff를 재생성했다. semantic
  diff는 body 수정 1, behavior·observation·guard·stage·table·format·template·reference·ownership·
  role·declaration 변화 0이다.
- 두 plugin manifest 0.23.3, CHANGELOG 최신 항목, 이 보고서.

## Sol 교차 검토

첫 검토는 P0 0, 범위 내 P1 1건 — 스테이징된 전체 삭제와 관측 실패의 회귀 시험 부재 — 이었다. 두
시험을 T2에 더했고 구현 코드는 바뀌지 않았다. 재검토는 T2 12/12와 P0·P1 0을 확인했다. 그 뒤 동작과
문구는 동결했고 이번 릴리스 봉투(manifest·CHANGELOG·이 보고서)만 더했다.

## 검증 증거와 한계

- T2 소속 시험은 구현 전 9개 중 5개가 실패했고(부분 폴더·커밋 삭제·shallow·손상 ref·형제 ref),
  구현 뒤 12/12 통과했다. 스테이징 삭제와 색인 손상 장면은 시험을 쓰기 전에 임시 저장소에서
  실제 도구로 먼저 실측했다.
- `scripts/decision-index.test.js` 12/12. 생성 색인은 DD-100과 두 정정 상태를 en·ko 모두 투영한다.
- Resume 재빌드: L0–L18 통과, fixture 48/48, 결정 반복 200회, mismatch 0, L-fast 통과, receipt의
  `body.md` 해시 일치. `SKILL.md`와 `agents/openai.yaml`은 바뀌지 않았다.
- `git diff --check` 통과. CRLF 파일은 CRLF, LF 파일은 LF를 유지했다.
- `scripts/repository-invariants.test.js`는 20개 중 19개가 통과했다. 실패한 한 항목은 전체 P2
  semantic audit를 녹색으로 요구하는 집계 검사이며, 이번 diff가 건드리지 않은 Adopt의
  `spec:STAGES/adoption`과 Principles의 `spec:STAGES/classify`에 이미 존재하는 overloaded provenance
  소견 둘을 보고한다. 0.23.2 보고가 이미 기록한 기존 소견으로 v0.23.3의 회귀가 아니며, 둘 다 다음
  라운드로 그대로 이월한다.
- 검증 계약은 바뀌지 않아 수동 Gate B 대상이 아니다.
- 저장소 완료 게이트 `node --test "scripts/*.test.js"`를 커밋 전에 한 번 끝까지 실행했다(약 19분).
  결과는 502개 중 494 통과, 8 실패다. 실패 하나는 위의 semantic audit 집계 기준선이고, 나머지 일곱
  — T4 glossary 투영, undecodable HEAD journal 셋(C·G·compatible feedback), arch·adopt 능력 템플릿
  round-trip(`bindingAdrs` 누락), compatible feedback 문법, K 지식 착지 마커 — 은 기준 커밋
  `4b37a2a`의 순수 복사본에서 같은 이름으로 똑같이 실패했다. 이번 12개 경로가 만든 회귀가 아니라
  기존 실패이며, 이전 보고들이 전체 게이트를 끝까지 돌리지 못해 관측되지 않았던 것이다. 통과로 세지
  않고 다음 라운드의 부채로 이월한다.
- 설치 후 연결 워크트리에서의 실제 Adopt 진입과 Resume의 무관리 보고 문장은 사용자가 확인하기
  전까지 **미검증**이다.

감사 지침 §5의 종료 조건은 자기 검토(§8의 자기 검토 갈래, §1 오염 통제 적용 불가)로 평가했다:
수정 범위에서 규칙 충돌·소실 경로 0, 남은 양갈래 독해 0, 해석을 새로 여는 추가 문장 0. DD-97의
「추적되지 않은 부분 `.devflow/`는 소속 증거가 아니다 · 이력 경로는 복구 증거로 남는다」 절과 새
경계의 충돌은 DD-97 상태 정정과 DD-100 본문으로 닫았다. 유즈케이스 매트릭스 §4의 순서대로 닿는
칸은 §3.24(H2×A3·A10·A17) 하나이고 A10 행의 뜻은 바뀌지 않았다.

## 남긴 것

- `skills/resume/.skill-rails/intent.json`의 `state_dependent_behaviors` 한 항목과 obligation
  ledger의 같은 문장은 아직 「no current or historical」이다. 런타임 안내가 아닌 intent 기록이라
  승인 범위(문장 하나) 밖에 두었다.
- 루트 존재는 `.devflow` 디렉터리의 lstat이므로 파일이 하나도 없는 빈 `.devflow/` 폴더도 이제
  `setup.no-product`로 읽힌다. 「안의 항목이 하나라도 있을 때」로 좁히는 것은 한 토큰 변경이다.
- DD-100의 버전 라벨 v0.23.3은 이 봉투의 버전과 같다.

이번 수리에서 만든 영속 경로는 이 보고서 하나이며, 삭제하거나 이동한 경로는 없다.

## 배포 기록

미실행. 커밋·push·양 플랫폼 설치는 릴리스 봉투 검토 뒤 소유자 또는 코디네이터가 수행하며, 그
증거는 별도 커밋으로 이 보고에 더해진다.
