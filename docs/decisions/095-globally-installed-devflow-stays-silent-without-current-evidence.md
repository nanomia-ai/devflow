# DD-95 · 전역 설치된 devflow는 현재 흔적이 없는 저장소에서 침묵하고, 명시 의도와 이력 인식 상태 판정이 도입 경계를 보존한다

- 상태: 유효 · 일부 정정 → DD-97 (v0.21.0), DD-101 (v0.23.7)
- 주제: 정체성 · 배포 · 플랫폼
- 도입: v0.20.0
- 최종 수정: 2026-09-05

관찰된 문제: 전역 설치된 플러그인의 SessionStart가 모든 Git 저장소에 devflow 안내를 넣고,
arch·design·split·work·verify·resume의 일반 개발 어휘와 product·adopt의 넓은 설명이 이를
묵시적 단계 진입으로 바꿀 수 있었다. 상태 도구도 `product.md`가 없는 처음부터 비도입인 저장소와
부분·과거 devflow 저장소를 모두 `setup.no-product`로 합쳐, 안전한 재개 경로가 설치 질문을 할 수
있었다. 이는 DD-92의 재검토 조건인 「지연 안내가 resume과 다른 행동을 유발함」의 실제 장면이다.

원하는 동작: devflow를 도입한 적 없는 보통 프로젝트에는 수동 안내도 남기지 않는다. 명시적
devflow 호출은 언제나 작동하고, 다른 devflow 스킬이 건넨 경로와 기존 관리 프로젝트의 흐름은
그대로 유지한다. 부분·삭제·얕은 이력·판정 실패 상태는 비도입으로 잘못 단정하지 않는다.

선택한 경계: SessionStart는 Git 루트를 찾은 뒤 현재 `.devflow` 경로와
`.devflow/project/product.md` 존재만 싸게 확인한다. 둘 다 없으면 출력 없이 0으로 끝나며, 하나라도
있으면 기존 주입 바이트를 그대로 낸다. 이 검사는 고정 pointer의 유무만 고르고 index·이력·상태
도구·zone·route를 읽지 않는 약한 비구속 판정이다. arch·design·split·work·verify·resume의 설명은
명시 호출, 다른 devflow 스킬의 route, 기존 devflow 관리 프로젝트만 진입 팔로 둔다. product와
adopt는 직접 호출, devflow 명명, 또는 Layer 0·devflow 능력 문서 같은 devflow 산출물을 요구하는
명시 의도만 진입으로 삼는다.

행동을 정하는 정본 판정은 `project-state.mjs` 하나에 남는다. 현재와 index의 `.devflow` 흔적이 모두
없고, 전체 이력에서 `.devflow` 경로가 없다는 사실까지 증명될 때만 `setup.unmanaged`를 낸다. 과거
흔적은 `setup.no-product`에 남고, shallow·Git 실패·해독 실패·불명확은 모두 기존
`setup.no-product`로 보수적으로 후퇴한다. resume은 domain orientation을 먼저 보존한 뒤
`setup.unmanaged`를 ASK·route·write 없이 한 보고와 DONE으로 끝내며, 사용자가 도입 의도를 밝힌
경우에만 product 또는 adopt를 선택지로 알린다.

경계가 필요한 이유: hook의 오판 비용은 비대칭이다. 관리 프로젝트에서 안내를 숨기는 false
unmanaged는 미지 세션 복구를 끊지만, 애매한 저장소에 안내를 한 번 더 보이는 false managed는
정본 상태 도구가 다음 진입에서 바로 정정한다. 따라서 hook은 현재의 압도적이고 싼 증거만 보고
pointer를 억제하고, index·전체 이력·unknown 판정은 행동을 소유한 상태 도구만 수행한다. DD-92가
막은 것은 hook의 route 판정과 파일 본문 주입이다. 이미 있던 Git-root 존재 검사가 보여 주듯 모든
파일시스템 읽기가 상태 계산이라는 전제는 기록된 이유가 아니며, 이번 경계는 route나 본문을 만들지
않는다. DD-05·DD-20·DD-83·DD-92·DD-93은 각각 훅 하나, 독립 adopt 발견성, 읽기 전용 상태 계산,
상태 소유권, P2 작성 정본이라는 기존 이유와 범위에서 그대로 유효하다.

기각한 대안: 새 init 스킬·도입 marker는 한 사실의 두 번째 집을 만든다. hook에서 index와 전체
이력까지 복제하면 모든 세션의 비용과 두 판정의 표류를 늘린다. 비도입 저장소에 고정된 부정 안내를
넣으면 침묵이라는 결과를 깨고 영구 context 세금을 만든다. `allow_implicit_invocation: false`는 관리
프로젝트의 유효한 선택까지 막는다. product·adopt의 일반 어휘를 그대로 열어 두면 hook 침묵 뒤에도
같은 결함이 두 입구로 되돌아온다.

영향 좌표: `scripts/session-start.js`, 여덟 스킬의 `.skill-rails/intent.json`과 생성 trigger 투영,
`skills/principles/scripts/project-state.mjs`, `skills/resume/spec.mjs`·`body.md`·fixture, 그 seam 시험,
A10(도입 전 또는 오발동) 매트릭스 칸, CHANGELOG. 새 매트릭스 행·용어·marker·init 파일은 없다.

재검토: 현재 devflow 프로젝트가 hook에서 침묵하거나, 명시 product/adopt 호출을 찾지 못하거나,
일반 비도입 요청이 downstream 스킬을 다시 고르거나, hook과 `setup.unmanaged`의 의도된 약한 차이가
pointer가 아니라 행동을 바꾸거나, SessionStart 지연이 유의하게 늘어날 때.
