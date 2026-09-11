# DD-31 · 다중의 공유 라우팅 상태는 로컬 브랜치가 아니라 통합 브랜치 tip에서 읽는다

- 상태: 유효
- 주제: 동시성 · 점유 · 통합
- 도입: v0.9.21
- 최종 검토: 2026-09-11

층 열기·검증 상태·최초 점유 커밋은 통합 브랜치에 착지하지만 기존 점유가 있는 다른 checkout은 로컬 HEAD만 읽어 그 전환을 놓칠 수 있었다. 최초 점유도 같은 번호의 중복 작업을 막는 구속 결정이며, 통합 tip과 현재 브랜치에 보이기 전에는 구현하지 않는다. 다음 단계 라우팅과 정합성 점검은 통합 tip의 project·tree·journal·verify를 읽고, 아직 현재 브랜치 조상이 아닌 미완 전환 commit을 로컬 작업보다 먼저 포함한다. 관련 없는 변경은 checkpoint한다. 작업 경계는 상태 개명·HANDOFF·journal·환류 문서를 쓰기 전에 그 경계가 기록하는 최종 작업 commit·checkpoint를 arch.md의 merge 방식으로 통합하고, rebase로 checkpoint hash가 바뀌면 그 값을 journal에 기록한다. 승격·범위 밖 선행 작업의 `card:` 출처 checkpoint도 층 열기 마커보다 먼저 통합한다. 이는 devflow가 worktree를 생성·배정하는 정책이 아니라 사용자가 이미 여러 branch·worktree를 쓰더라도 하나의 공유 상태를 보게 하는 호환 규칙이다. 소화 diff와 marker 전진은 계속 깨끗한 경계에서만 한다
