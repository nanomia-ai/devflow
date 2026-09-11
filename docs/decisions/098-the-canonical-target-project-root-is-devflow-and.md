# DD-98 · 대상 프로젝트의 정본 루트는 `.devflow/` 하나다

- 상태: 유효
- 주제: 정체성 · 배포 · 플랫폼
- 도입: v0.21.0
- 최종 검토: 2026-09-11

관찰한 문제: 점 없는 `devflow/`는 프로젝트 코드·제품 문서와 같은 층에 놓여 devflow가 관리하는
보조 지식·진행 상태와 제품 자체의 산출물을 시각적으로 섞었다. 더 중요한 위험은 경로가 상태 도구,
SessionStart, journal 안의 직렬화된 좌표, Git pathspec, K 검사기와 아홉 스킬의 읽기·쓰기 계약에
분산되어 있어 일부만 바꾸면 서로 다른 프로젝트 상태를 보게 된다는 점이다.

원하는 동작: 사람과 AI가 devflow의 지식·진행 루트를 프로젝트의 부수 관리 영역으로 즉시 알아보되,
그 안의 Product·Architecture·Design·glossary·능력 문서·K·작업 카드를 평소처럼 읽고 쓸 수 있어야
한다. 모든 현재 reader와 writer는 같은 루트 하나를 봐야 한다.

선택한 경계: 대상 프로젝트에 생성되는 정본 루트는 `.devflow/` 하나다. 현재 상태와 이력을 판정하는
도구, SessionStart, 지식 검사기, journal·카드의 경로 문법, 모든 P2 artifact·ownership 선언과 배포
투영은 이 표기만 읽고 쓴다. `devflow:` 스킬 네임스페이스, `devflow/project-state/2` 같은 wire schema,
플러그인 이름은 프로젝트 경로가 아니므로 바꾸지 않는다. 과거 round·CHANGELOG·blueprint와
legacy atom은 당시 사실과 이관 출처라서 다시 쓰지 않는다.

호환 루트, 자동 이동, 별칭은 만들지 않는다. 소유자가 실제 사용 중인 관리 프로젝트가 없고 시험
프로젝트도 새 설치 뒤 재생성한다고 확인했으므로, 이중 루트는 복구 가치 없이 판정과 쓰기 위치를
둘로 나누기만 한다. 선행 점은 숨김 정책이나 접근 권한이 아니라 이름의 분리 신호이며 사람과 AI의
읽기·쓰기 계약을 약화하지 않는다.

이 경계가 필요한 이유: DD-01의 docs 충돌 회피는 그대로 성립하고 `.devflow/`가 그 분리를 더
직접적으로 표현한다. 한 루트 하드 컷은 경로를 찾는 상수·정규식·Git 제외 규칙이 함께 움직이게 해,
호환 코드를 증식시키지 않으면서 관리 여부와 지식 소유권을 하나로 유지한다.

영향 좌표: `scripts/session-start.js`, `scripts/project-knowledge.mjs`,
`skills/principles/scripts/{project-state,project-knowledge}.mjs`, 아홉 P2 패키지의 작성 정본과 생성
투영, 현재 설계·매트릭스·v0.21.0 보고, CHANGELOG. 새 상태, marker, 문서층, migration 단계는 없다.

재검토: 실제 배포 뒤 `.devflow/`가 사람 또는 지원 플랫폼의 정상적인 읽기·쓰기를 막거나, 현재
reader와 writer가 서로 다른 루트를 관측하는 장면이 재현될 때.
