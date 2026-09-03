# v0.23.1 수리 보고 — Principles 선택과 공통 정책 소비의 분리

상태: 구현·정적 검증·교차 재감사·배포 완료, 사용자 실사용 시험 대기  
기준 커밋: `c22780bf2d1f57b848e087d1337c1b218c34bdee`

## 범위와 실제 실패

이번 수리는 이미 깊은 검수를 마친 Adopt의 역산 절차를 다시 설계하지 않았다. 사용자가 제시한 실제 장면, 즉 devflow가 시작되지 않은 저장소에서 설치 버전만 물었는데 Codex Sol이 `devflow:principles`를 선택한 장면을 기준으로 Product·Principles의 선택 표면, 모든 이름 있는 단계의 공통 규약 소비, SessionStart와 Codex fallback, 역할 계약을 감사했다. 과거 jgnote worktree는 현재 동작의 증거로 사용하지 않았다.

훅 자체는 `.devflow/project/product.md`가 없는 저장소에서 침묵했다. 잘못된 선택의 공통 원인은 Product 설명의 부정문이 「일반 devflow 언급은 Product가 아니며 Principles가 맡는다」고 Principles를 포괄 fallback처럼 지목하고, Principles 설명도 그 넓은 해석을 배제하지 못한 데 있었다. 이는 버전 조회 예외를 새로 추가할 문제가 아니라 요청 선택과 공통 정책 소비가 한 개념으로 섞인 문제였다.

## 채택한 자연스러운 경계

Principles에는 두 책임이 있다. 하나는 이름 없는 **현재 프로젝트의 devflow 작업** 또는 공통 workflow 규약 질문이 실제로 Principles에 들어왔을 때 상태 없이 분류하는 책임이다. 다른 하나는 모든 devflow 단계가 함께 쓰는 정책 정본을 소유하는 책임이다. 앞 책임의 선택 범위와 뒤 책임의 소비 범위를 분리했다.

- 설치 버전·패키지 정보처럼 현재 프로젝트를 devflow로 운용하려는 요청이 아닌 일반 질문은 어떤 devflow 단계도 선택하지 않는다.
- Product·Adopt·Arch·Design·Direct·Work·Verify·Resume를 이름으로 부르면 그 단계가 곧 진입이다. Principles 분류기를 먼저 거치지 않는다.
- 이름 있는 여덟 단계는 각자의 항상 읽는 `why: purpose`에서 같은 한 문장으로 Principles 정책 색인 하나를 연다. 절차는 각 단계가 계속 소유하고 공통 규약만 중앙 정본에서 소비한다.
- `reviewer`·`verifier`·`auditor`·`retrospector` 역할은 coordinator가 넘긴 원문 계약을 그대로 따르며 일반 분류기와 단계 진입을 모두 우회한다. coordinator도 단계가 아니라 역할이다.
- 정책 색인은 첫 판단 전에 항상 적용 행을 읽고, 요청·선택 단계·관찰 입력·요청된 판단·결정된 값에 의해 드러난 행만 추가로 연다. 반환된 Decision의 효과가 새 조건을 드러내면 첫 효과 전에 해당 행만 다시 연다. 전체 정책 트리를 매번 읽지 않는다.

이 구조는 공통 규약을 훅에 복제하거나, 단계마다 복사하거나, Principles 사전 진입을 강제하지 않는다. 따라서 Claude가 규약을 놓치는 위험과 Codex가 Principles를 과잉 선택하는 위험을 같은 정본 배선으로 줄이면서 단계의 유연한 목적 선택을 보존한다.

## 실제 수정 좌표

- `skills/product`: selector 설명과 spec 선언에서 Principles를 일반 devflow 언급의 소유자로 만들던 부정문을 제거했다. Product의 목적·입력·전이는 바꾸지 않았다.
- `skills/principles`: 설명을 긍정적인 현재 프로젝트 의도로 좁히고, purpose·진입 계약·정책 색인이 선택과 소비의 차이를 한 해석으로 말하게 했다. `Every devflow invocation`은 실제 역할 우회와 맞도록 `Every stage or Principles entry`로 고쳤다.
- 여덟 이름 있는 단계: `why: purpose`에 byte-identical 정책 색인 포인터 하나만 추가했다. Adopt와 Arch에 남아 있던 개별 Principles topic 직통 참조는 색인의 조건 행을 통해 도달하도록 바꿨다. Adopt의 무관리 역산, 확인, 완료 경계는 건드리지 않았다.
- SessionStart와 Codex fallback: 관리 프로젝트에서만 같은 진입 위상을 안내한다. 이름 있는 단계는 직접 진입하고, 이름 없는 현재 프로젝트 작업만 Principles가 분류하며, 역할 계약은 우회한다. coordinator 문장은 두 어댑터에서 동일하다.
- 설계·결정·매트릭스: DD-97을 뒤집지 않고 v0.23.1 경계 명료화로 기록했다. 유즈케이스 H51에 「미관리 저장소의 설치 패키지 정보 조회」를 추가했고, 설계 문서의 Principles 구성요소 행을 같은 소유권으로 맞췄다.
- Skill Rails: devflow를 자기 개발에 사용하지 않았다. 아홉 P2 패키지는 Skill Rails 유지보수 트랜잭션으로 정본을 변경하고 생성물·hash·semantic receipt를 다시 만들었다.

## 교차 감사와 재수렴

프로젝트 이해를 쌓은 Claude Fable xhigh와 Codex Sol xhigh 터미널을 종료하지 않고 같은 Orca run과 현재 worktree에서 재사용했다. 새로운 시각이 아니라 누적 이해가 필요한 감사였으므로 새 에이전트로 교체하지 않았다.

Fable의 첫 구현 감사는 큰 구조에 결함이 없다고 판정하면서 다섯 수렴 항목을 찾았다: 검사가 포인터의 위치와 동일 문장을 증명하지 못함, 훅과 fallback의 coordinator 문장 차이, 정책 행을 여는 조건에서 요청된 판단·결정값 누락, 역할까지 포괄한 `Every devflow invocation`, DD-97 보정 표식 누락. 모두 새 상태나 분기를 만들지 않는 최소 수정으로 반영했다. 같은 Fable의 재감사에서 다섯 항목 모두 닫혔고 추가 결함은 0이었다.

Fable의 별도 목적 감사는 선택기와 정책 소비의 분리가 현재 제약에서 가장 작은 구조라고 판정했다. 훅 정책 운반, 단계별 복제, Principles 사전 진입, cross-skill `READ_FIRST`는 각각 비관리 진입 손실·정본 중복·명시 의도 파괴·현재 생성기 미지원 때문에 더 나쁜 대안으로 반증됐다. Sol의 최초 전체 문자 감사와 수정 후 최종 반증도 미관리 버전 조회, 관리 상태의 이름 없는 작업, 명시 단계, 네 역할, pass·COMMIT 정책 시점에서 추가 소견 0으로 끝났다.

## 검증 증거

- `scripts/session-start.test.js`: 8/8 통과. 미관리 Git 저장소와 빈 `.devflow/`가 침묵하고, 관리 프로젝트만 고정 안내를 받으며, 역할·coordinator 경계를 확인했다.
- `scripts/repository-invariants.test.js`의 공통 정책 배선 대상 검사: 1/1 통과. 여덟 단계 모두 정확히 한 포인터를 `why: purpose` 안에 byte-identical 문장으로 가지며 topic 우회가 없음을 확인했다.
- Principles 생성 런타임 `enter`: purpose, 진입 계약, 정책 색인과 새 조건 문구가 실제 출력되는 것을 확인했다.
- `git diff --check`와 한국어 decision index 투영이 통과했다.
- 전체 `node --test "scripts/*.test.js"`는 한 번 실행했고 exit 1이었다. Gate A의 모든 예약 journal 행은 통과했다. 이번 변경 경계는 통과했지만 기준선에도 있던 `T4 glossary projections match Product and a rendered glossary is canon` 실패와 Principles `spec:STAGES/classify`의 overloaded provenance를 실패로 취급하는 semantic audit가 남았다. 둘은 이번 선택·정책 배선이 만든 회귀가 아니며 별도 의미 수리가 필요한 기존 범위라 이 릴리스에서 기계적으로 덮지 않았다.
- 검증 계약 자체를 바꾸지 않았으므로 수동 Gate B 대상이 아니다.

실행하지 않은 것은 통과로 보고하지 않는다. 설치 후 깨끗한 Codex와 Claude의 실제 selector 행동, Claude가 commit discipline과 verification iron rule을 실제 효과 직전에 소비하는지, 시험 브랜치의 단계 체이닝은 **unverified**이며 사용자가 직접 시험한다.

## 감사 종료 조건과 남은 한계

감사 지침 §5의 충돌·손실 종료 조건은 수정 후 재감사에서 0, 새 해석을 요구하는 대안 0, 목적보다 기술 확장을 우선한 항목 0, circuit-breaker 해당 없음으로 평가했다. 수정 소견은 한 번 재감사했고 같은 지적이 재발하지 않았다. 다음 유효한 검증은 같은 정적 검사의 반복이 아니라 실제 설치 모델의 사용 장면이다.

교차 감사에서 나온 선택적 표현 정리(Principles 설명의 소비 문구 축약, `Local policy index` 제목 변경, coordinator 행 라벨의 역할 한정, Product 설명의 제거된 부정 guard 복원)는 현재 의미를 개선한다는 증거 없이 churn만 만들므로 올리지 않았다. 소비자가 없는 기존 `skills/principles/fixtures/source/policy-portability.json`, `shared-authoring-policy.md`, `planning-evidence-policy.md`, `coordinator-policy.md`도 이번 실패와 연결되지 않고 변경하지 않았으며, 실제 도달성 문제가 관찰될 때 별도 소견으로 재판정한다.

Fable이 실사용에서 특별히 관찰할 두 지점은 공통 규약 중 산문 소비에 의존하는 경계다. 한 단계의 commit이 다른 작업자가 stage한 무관 경로를 함께 싣지 않는지, 실행 증거 없이 pass를 말하지 않는지를 확인해야 한다. 이는 새 예외를 추가할 이유가 아니라 정책 색인 배선이 모델 행동까지 도달하는지 보는 직접 시험이다.

이번 라운드에서 만든 영속 경로는 이 보고서 `docs/rounds/v0.23.0/report-0.23.1_ko.md` 하나다. 영속 삭제·이동 경로는 없다.

## 배포 기록

버전은 두 플러그인 manifest와 CHANGELOG에서 0.23.1로 올렸다. 구현 commit `9d80041`을 `origin/main`에 push한 뒤 Codex와 Claude에 설치했다.

Codex 설치기는 Orca가 지정한 `CODEX_HOME`의 `plugins/cache/nanomia/devflow/0.23.1`에 설치했다. `codex plugin list --marketplace nanomia --json`은 `devflow@nanomia` 0.23.1을 enabled로, source를 이 저장소의 local 경로로 보고했다. Claude는 `claude plugin update devflow@nanomia`로 0.23.0에서 0.23.1로 갱신됐고 `~/.claude/plugins/cache/nanomia/devflow/0.23.1`을 enabled 설치로 보고했다.

두 설치 캐시 각각에서 release source와 두 manifest, CHANGELOG, SessionStart, Codex fallback 양 언어, 아홉 단계 `body.md`, Product·Principles의 spec·intent·SKILL·OpenAI metadata·generated receipt, Principles의 purpose·진입 계약·정책 색인, Adopt·Arch workflow를 포함한 핵심 30개 파일을 newline-normalized SHA-256으로 대조했고 missing 0, mismatch 0이었다. Claude는 새 세션을 시작해야 갱신본이 적용된다.

Codex `/hooks` 화면에서 native SessionStart command의 trust 상태를 사람이 확인하는 단계는 실행하지 않았고, 따라서 이전 global hook도 제거하지 않았다. 이 UI 확인과 깨끗한 새 Codex·Claude에서의 실제 선택·체이닝은 사용자 실사용 시험에 남긴다.
