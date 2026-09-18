# 프로젝트 진입 조건과 route 용어

target별 행동을 시작하기 전에 이 진입 조건을 적용한다. 폴더가 있다는 사실만으로 프로젝트가 준비됐다고 판단하지 않는다.

- `.devflow/`가 없으면 `sketch`, `product`, `adopt`만 파일을 쓸 수 있다. managed project에서만 동작하는 target은 파일을 쓰기 전에 멈추고, 사용자 의도에 맞는 진입점을 안내한다.
- `.devflow/`는 있지만 `index.md`가 없거나 읽을 수 없으면 기존 상태 위에 새 구조를 초기화하지 않는다. `resume`이 범위가 제한된 기존 project 및 artifact 상태를 조사하고 index를 복구할 수 있는 writer를 보고한다. 다른 target은 아무것도 변경하지 않고 `resume`으로 route한다.
- index와 활성 Sketch만 있으면 `sketch`, `product`, `adopt`가 쓸 수 있고 `resume`이 읽을 수 있다. `direct`, `work`, `verify`는 아직 진입할 수 없다.
- Product는 완전하지만 Architecture가 완전하지 않으면 Product, Architecture, 선택적 Design, Sketch, Adopt와 읽기 전용 Resume가 진입할 수 있다. `direct`, `work`, `verify`는 아직 진입할 수 없다.
- Product와 Architecture가 완전하고, 필요한 Design이 준비됐으며, Adoption이 닫혔으면 모든 target이 진입할 수 있다. `work`와 `verify`에는 추가로 유효한 Work 계약이 필요하다.
- `.devflow/adoption/`이 존재하는 동안 기본 route는 `adopt` 또는 conflict 해결에 필요한 결정 route다. 추적되는 변경 작업은 관련 maintained source의 처분이 정해지고, 필요한 canon이 자기완결적이며, 관련 모순이 닫힌 경계 안에서만 진입할 수 있다.

준비 상태는 경로 존재가 아니라 문서 내용과 index 규칙으로 판단한다. 사용할 수 있는 index가 있으면 먼저 읽는다. 프로젝트별 routing은 index가 소유하며, 전역 lifecycle이 소유하지 않는다.

조정 상태의 `next_route` 값은 `sketch`, `adopt`, `product`, `architecture`, `design`, `direct`, `work`, `verify`, `user` 중 정확히 하나다. `resume`은 진입 및 복구 보고 기능이며, 지속되는 custody route가 아니다.

경로의 `<current-member>`는 repository의 `git config user.name`을 안정적인 slug로 변환한 현재 팀 identity다. 값이 없거나 안정적인 slug를 만들 수 없으면 registry를 만들지 말고 사용자에게 짧은 team label 하나를 요청한다. index에는 `<current-member>` placeholder를 그대로 두고, 각 reader가 현재 identity로 해석한다. member별 glob을 나열하지 않는다. 이 namespace는 개인 작업의 기본 발견 경계이지 Git 접근 제어나 비밀 보장이 아니다.
