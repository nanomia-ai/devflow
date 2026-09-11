# DD-101 · 프로젝트 멤버십은 현재 `.devflow` 루트와 현재 index만 보고, Git 이력은 복구 증거로 남긴다

- 상태: 유효
- 주제: 정체성 · 배포 · 플랫폼
- 도입: v0.23.7
- 최종 검토: 2026-09-11

관측된 문제: 상태 도구가 `git log --all -- .devflow`를 멤버십 증거로 사용했다. 그래서 현재
checkout에는 `.devflow`가 전혀 없어도 형제 worktree의 branch나 remote-tracking ref에 과거
경로가 하나 있으면 `setup.no-product`가 되었고, 명시 Adopt는 Resume의 setup 질문으로
우회됐다. shallow clone과 깨진 무관 ref도 현재 checkout이 아니라 이력 관찰 가능성 때문에 같은
보수 경로에 들어갔다.

원하는 동작: 사람이 지금 보는 checkout의 싼 증거가 관리 여부와 일치해야 한다. 현재 작업 트리에
`.devflow` 루트가 있거나 현재 index가 `.devflow` 경로 하나라도 가지면 부분 상태를 보호하고,
둘 다 없으면 다른 ref나 과거 커밋과 무관하게 최초 Adopt가 열려야 한다.

선택한 경계: 정본 상태 도구는 현재 `.devflow` 루트 존재를 먼저 보고, 없을 때 현재 index의
`.devflow` 항목만 본다. 루트는 비어 있거나 일부 경로와 users-only 상태여도 현재 증거다. 루트와
index가 모두 없을 때만 `setup.unmanaged`이며, staged 또는 committed 전체 삭제도 그 현재 상태로
판정한다. index 명령 실패나 해독 실패는 부재를 증명하지 못하므로 `setup.no-product`에 남는다.
Git 이력과 다른 ref는 사람이 Git으로 복구할 자료이지 현재 멤버십이 아니며, 상태 도구는 이를 위해
전역 이력을 조회하지 않는다. 멤버십 확인 뒤 현재 Product가 없으면 `setup.no-product`를 내되,
DD-92의 승인된 `00-project` 사전 Product 연구는 기존 `zoneOrder` 소유권에 따라 그보다 먼저 선다.
현재 Product는 있지만 현재 HEAD에 커밋된 Product 경계가 없으면 더 높은 우선순위의
`setup.layer0-uncommitted`를 낸다. 현재 journal byte의 무결성은 계속 검사하되 이력 기반 lifecycle과
능력 기준선 복구는 첫 Adopt 커밋 뒤에만 시작한다. 현재 HEAD 경계를 읽지 못한 상태는 검사를 끌
권한이 아니라 blocking integrity 증거다. Product와 Direct는 더 높은 git·integrity 경로와 동시에
존재할 때도 이 정본 setup 사실을 소비한다. Product는 초안을 커밋된 진실로 취급하지 않고 Resume으로
돌아가며, Direct는 request·research·card 효과 전에 돌아간다.

필요한 이유: DD-95의 비대칭 근거는 고정 pointer만 내는 SessionStart의 약한 eligibility 검사에는
맞지만, 행동을 정하는 상태 도구의 false managed는 뒤의 권위가 고칠 수 없다. 실제로 그것이 명시
Adopt를 닫았다. 반대로 `setup.unmanaged`의 Resume 경로는 쓰기 없이 끝나고 명시 Adopt는 사용자의
선택으로 다시 들어갈 수 있다. 현재 루트와 index를 함께 쓰면 미커밋·staged 부분 상태는 보호하면서
형제 ref가 현재 checkout의 소유권을 빼앗지 않는다. 커밋된 Product 경계는 모든 소비자에게 이력
복구가 권위를 얻는 한 지점을 주고, 현재 Product가 없는 일반 관리 복구는 낡은 marker보다 먼저
서면서도 DD-92의 사전 Product 연구를 빼앗지 않는다. 이 경계는 DD-97의 이력 복구와 untracked 일부
경로를 무관리로 보던 절을 정정하되, 상태 소유자 하나와 명시 단계 직접 진입은 유지한다.

기각한 대안: `--all`만 빼면 unborn HEAD의 `git log` 실패를 위한 새 분기가 필요하고 과거 커밋을
여전히 멤버십으로 만든다. users 경로만 index에서 빼는 안은 현재 `.devflow` 루트라는 단일 증거를
역할별 예외로 쪼개고 이번 현재-evidence 목적에 필요하지 않으므로 채택하지 않는다. 역사와 index를
SessionStart에 복제하는 안은 DD-95가 기각한 이중 판정이다.

영향 좌표: `skills/principles/scripts/project-state.mjs`, `scripts/project-state.test.js`,
`skills/principles/references/delivery/commit-and-verification.md`,
`skills/principles/references/knowledge/writers-and-migration.md`, Product의 정본 상태 진입 collector,
Direct의 정본 상태 collector와 초기 복구 guard, Product·Resume P2 복구 행, Adopt의 중단 경계,
DD-95·DD-97, 매트릭스 §3.24, 배포 manifest와
CHANGELOG, maintenance protocol §9. setup 우선순위와 DD-92 연구의 교차-zone 순서는 기존 zone
배열과 `zoneOrder`가 소유한다.
SessionStart, Arch 작성 계약과 나머지 스킬의 정상 진입은 바꾸지 않는다.

재검토 조건: 현재 `.devflow` 루트 또는 index 경로가 있는데 unmanaged로 판정되거나, 둘 다 없는
checkout이 다른 ref 때문에 Adopt에 들어가지 못하거나, index 관찰 실패가 부재로 오인되거나,
현재-evidence 판정이 관리 상태의 기존 Resume/Arch 경로를 Adopt로 돌릴 때.
