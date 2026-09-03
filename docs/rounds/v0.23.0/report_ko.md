# v0.23.0 구현 보고 — 실사용 가능한 단계 연결 복구

상태: 구현·정적 검증·교차 재감사 완료, devflow 배포 확인 대기  
기준 커밋: `9462cf2c18d9`

## 범위와 판단 기준

이번 작업은 Adopt를 다시 설계하는 감사가 아니다. Adopt는 공통 생성 어댑터 변경의 간섭만 확인했고, Product·Arch·Design·Direct·Work·Verify·Resume·Principles가 각 목적에 맞게 실제 흐름을 이어 갈 수 있는지를 중심으로 보았다. 과거 jgnote worktree는 이전 버전의 단편 시험이므로 현재 동작의 증거로 사용하지 않았다.

기존 Orca 시험 에이전트에는 입력하지 않고 남아 있던 상태와 출력만 읽었다. 이후 Claude Fable xhigh와 Codex Sol xhigh를 같은 이해가 축적된 터미널에서 재사용해 정본 spec/body, 수집기, 상태 도구, 생성 어댑터와 Git diff를 교차 감사했다. 수정에는 devflow 스킬을 사용하지 않았고, Skill Rails의 정본 트랜잭션과 재빌드를 사용했다.

## 발견한 공통 원인

첫째, 생성 어댑터가 최종 ASK·WAIT를 먼저 보고 앞의 REPORT·WRITE·COMMIT·DISPATCH를 생략할 수 있었다. 이는 개별 스킬의 문제가 아니라 Skill Rails 생성기 계약의 문제였다. 진단·stale snapshot만 즉시 멈추고, 정상 Decision은 배열 순서대로 모든 prefix effect를 처리한 뒤 terminal에서 멈추도록 정본과 생성기를 고쳤다.

둘째, 여러 단계의 정본에는 다음 소유자와 상태가 쓰여 있었지만 실제 Decision 효과 또는 수집기가 그 연결을 표현하지 않았다. Claude가 문맥으로 우회할 수 있는 경로도 문자적으로 실행하는 Codex는 멈추거나 같은 단계를 재진입할 수 있었다. 새 범용 상태를 늘리지 않고 기존 journal, Git commit, card, marker의 정본 사실을 읽도록 복구했다.

## 단계별 개선

- Product: 최초 확정은 Arch로, glossary 단독 복구와 재기획은 Resume로 이어진다. 재기획 확정은 일치하는 discovery update를 적용하고 해당 product re-run 줄만 같은 binding commit에서 소비하므로 Resume가 같은 Product 결정을 다시 열지 않는다. 중복 판단이던 `plan.disposition`은 제거했다.
- Arch: `capability-only`라는 별도 refresh 결과와 Arch↔Resume 왕복을 제거했다. 현재 Layer 0 상태에서 기존 `request.kind`가 capability 설계로 자연스럽게 진행한다.
- Design·Direct: 유지보수 요청 기록자는 Direct 하나로 통일했다. Direct는 요청 줄이 아직 미커밋인지, 먼저 다른 checkpoint에 실렸는지, 그 뒤 정본 `design — design.md` 커밋이 실제로 도달했는지를 Git 이력으로 구분한다. 각 Design 커밋은 그 커밋의 journal에 있던 가장 오래된 요청 하나만 확인하므로 A의 확인이 함께 있던 B까지 확인한 것으로 번지지 않는다. Design의 reject는 기존 의미대로 요청을 재개 가능하게 보존한다. 명시적 `withdraw`는 draft가 없으면 요청 줄만 철회하고, draft가 있으면 새 취소 분기를 만들지 않고 기존 `cancel-plan`이 카드·요청·layer marker를 함께 정리한다.
- Direct: 실행 제안을 승인 질문보다 먼저 보여 준다. 승인 후 planning commit과 정확한 Work handoff를 보고한 다음 WAIT하여, solo 호출자는 정확한 카드로 Resume/Work를 선택하고 외부 coordinator는 여러 승인 카드를 충돌 없이 배정할 수 있다.
- Work: park와 contract-route는 작업 브랜치에 진행 checkpoint를 먼저 커밋하고, integration에서 claim 반환 rename만 별도 binding commit으로 남긴다. 진행 변경과 공유 할당 상태가 한 커밋에 섞이지 않는다.
- Verify: HEAD closing marker 또는 byte-first `layer.children-done` 후보만 exact `closure.target`으로 고른다. 명시적 target도 현재 eligible 집합 안에서만 허용하고, 다른 capability의 유일한 verify record를 가져오던 fallback은 삭제했다. record·baseline·marker·sweep·rename은 모두 같은 target을 사용한다. begin commit 뒤 중단되면 begin 효과를 반복하지 않고 남은 suffix만 복구하며, working tree에서 marker 줄이 먼저 지워진 경우에도 복구 READ는 HEAD의 marker를 명시적으로 사용한다.
- Principles: SessionStart hook이 stage 자체를 실행한다는 잘못된 설명을 제거하고 실제 생성 어댑터 진입 경계를 기록했다. maintenance/product re-run 예시는 정본 JSON-string 문법과 맞췄다.
- Adopt·Resume: 공통 생성 어댑터만 갱신했다. unmanaged 진입, Adopt 전용 완료 경계, Resume의 기존 상태 우선순위에는 새 분기를 넣지 않았다.

## 검증 증거

- 현재 아홉 P2 패키지의 287개 시나리오가 모두 mismatch 0이다: Adopt 9, Arch 54, Design 20, Direct 26, Principles 10, Product 18, Resume 48, Verify 29, Work 73. 현재 생성물 기준 Direct를 포함한 나머지는 5회 결정 반복, Product의 마지막 트랜잭션은 200회 반복으로 빌드됐고, 모두 L0–L18·mutation·fixture·선언·format 검사를 통과했다.
- sibling Skill Rails는 생성기 계약·통합 사례·pilot 생성물을 함께 갱신했고 `npm run verify`에서 70개 테스트와 평가가 통과했다.
- Direct 요청 단계의 작은 Git 이력 사례는 `uncommitted → committed → design-confirmed`와 A·B 요청의 순차 확인을 실제 임시 저장소에서 확인해 대상 실행 2/2가 통과했다. 그보다 앞서 실행한 해당 수집기 파일 전체 검사는 당시 7개 중 6개가 통과했고, 1개는 이번 변경 전부터 존재한 schema 문자열 기대 차이였다. 새 A·B 사례를 더한 뒤에는 시간 원칙에 따라 대상 두 사례만 다시 실행했다.
- capability closing marker의 “working tree에서 삭제됐지만 아직 커밋 전” 상태는 두 marker 유지와 삭제 커밋 후 소멸을 확인하는 대상 사례 1/1이 통과했다.
- Verify 수집기 수정 후 대상 사례 3/3이 통과했다.
- 한 번 실행한 전체 `node --test "scripts/*.test.js"`는 exit 1이었다. Gate A의 reserved journal line은 통과했지만, 기준 커밋에도 존재하는 glossary T4, Adopt cross-package reference 금지, generic trigger와 Arch 설명 차이, Arch ledger 예상 수 158 대 실제 160, Direct schema 문자열 기대 차이를 관찰했다. 당시 남아 있던 Arch stale 생성 시나리오는 이번 수정에서 제거하고 패키지를 재빌드했다. 긴 전체 suite는 요청의 시간 원칙에 따라 반복하지 않았다.
- 별도 11개 대상 파일 실행은 47개 중 44개 통과였다. 세 실패 중 Verify fallback 기대는 새 정본 의미에 맞춰 고친 뒤 3/3으로 재확인했고, 나머지 Arch ledger 수와 Direct schema 문자열은 위의 기존 실패다.

실행하지 않은 것은 통과로 보고하지 않는다. 사용자가 시험 브랜치에서 수행할 Product/Direct/Work/Verify 실제 대화 흐름과 수동 Gate B는 **unverified**다.

## 감사 경계와 이월

Fable의 1차 구현 감사와 2차 목적 감사는 누락·모순·간섭·불필요한 상태 증식 없이 목적에 도달한다고 판정했다. Sol은 여기서 승인된 draft 철회, 여러 요청의 Design 확인 귀속, working journal 삭제 뒤 Verify marker READ 세 경계를 찾아냈다. 같은 Fable과 함께 최소 수정안을 재판정해 반영한 뒤 두 모델이 정본·생성물·대상 사례를 다시 읽었고 세 항목 모두 PASS, 추가 동작 결함과 교차 간섭 0으로 수렴했다. Sol이 검사 도중 읽은 보고서의 이전 286/25 수치는 현재 287/26으로 교정했으며, collector 전체 8개를 재실행한 것으로 과장하지 않고 새 대상 2/2만 명시했다.

따라서 감사 지침 §5의 종료 조건은 새 규칙 충돌 0, 도달 가능한 새 실패·손실 경로 0, 모순되는 대안 0, 결론보다 기술 확장을 우선한 항목 0으로 평가했다. SHA-256 Git 저장소의 64자 object id를 Verify의 Skill Rails `hex40` 도메인이 아직 받지 못하는 위험은 현재 SHA-1 저장소에서 도달하지 않고 두 저장소의 공통 도메인 변경이 필요한 별도 범위이므로 이번 릴리스에는 넣지 않았다.

## 배포 경계

공통 생성기 수정은 sibling Skill Rails commit `63147c2c83533ca9bcb69ff4e4a719217ee4d844`, annotated tag와 GitHub Release `v0.1.9`로 배포됐다. GitHub workflow run `33719014072`가 success로 끝났고, release source를 Codex와 Claude Code에 설치한 뒤 `SKILL.md`, generator, P2 contract의 newline-normalized SHA-256 일치를 확인했다. 배포 증거는 docs commit `f2af5b7`로 `main`에 push했으며 사용자 소유 `docs/plan/`은 건드리지 않았다.

devflow는 다음 커밋에서 push하고 Codex와 Claude에 설치한 뒤 설치본의 버전과 정본 hash를 이 보고서에 추가한다. 실사용 시험과 수동 Gate B는 설치 이후에도 unverified로 명시해 사용자 시험 범위로 넘긴다.
