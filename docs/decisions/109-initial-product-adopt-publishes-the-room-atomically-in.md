# DD-109 · 최초 Product/Adopt는 방을 별도 커밋하지 않고 첫 구속 경계에 원자적으로 싣는다

- 상태: 유효
- 주제: 동시성 · 점유 · 통합
- 도입: v0.23.19
- 최종 검토: 2026-09-11

관측된 문제: 동일한 cold Adopt 입력에서 한 실행은 제안 승인 뒤 별도 방 join 커밋을 먼저 만들어
승인 snapshot을 낡게 했고, 다른 실행은 첫 core write 전에 방을 전혀 만들지 않았다. 별도 join 뒤
중단하면 Product도 승인된 Adopt 의미도 없는 room-only 관리 상태만 남아 Resume가 같은 요청을
자연스럽게 이어갈 근거가 없다. clean room-only를 무관리로 다시 분류하는 보상은 새 join과 과거
관리 tree를 지우고 방만 남긴 저장소를 구분할 수 없어 DD-101의 부분 상태 보호를 뒤집는다.

원하는 동작: 최초 Product 또는 Adopt가 구속 확인을 준비할 때 actor와 Git identity를 읽기 전용으로
확정한다. 거절이나 승인 전 중단은 계속 쓰기 0이다. 승인 뒤 방이 없다면 정본 room triple을 기존
첫 구속 커밋에 함께 싣고, pre-Product research가 이미 만든 방은 덮어쓰거나 다시 stage하지 않는다.

선택한 경계: 공통 policy index가 최초 Product/Adopt 구속 준비에 Identity and Rooms를 열고,
열린 Git operation gate 뒤 identity를 읽기 전용으로 해소한다. 정확한 순서는 Product의
`commit-initial`과 Adopt의 `approve` P2 effect plan이 각각 소유한다. 두 branch는 기존 첫 커밋 직전에
방이 없을 때만 owner.md·빈 HANDOFF.md·digest.md를 만들고, digest에는 그 경계 전 HEAD 또는 unborn
history의 `none`을 기록하며, 그 세 경로를 승인된 owner set과 같은 커밋에 stage한다. 이 좁은 최초
publication은 공통 독립 joining transition을 확장하며, DD-46의 단일 모드와 카드별 점유 선택은
그대로다. 기존 방, 이후 신규 구성원 join, newcomer·
research·upgrade·claim 경로와 상태 판정은 그대로다.

이 경계가 필요한 이유: Skill Rails에서 effect 순서는 각 P2 spec만 소유하므로 공통 산문만으로는
모델별 누락을 막지 못한다. 별도 room 커밋은 approval snapshot과 중단 경계를 둘로 가르지만,
기존 첫 binding commit에 합치면 identity와 승인된 현재 의미가 함께 durable해져 ownerless fragment가
없다. boundary commit과 journal 결합 선례는 한 transition의 조각을 함께 싣는 이유를 뒷받침하지만,
이 최초 room publication을 이미 허가한 것은 아니므로 이 결정은 그 확장만 좁게 승인한다.

기각한 대안: 승인 전 join은 거절·중단 쓰기 0과 approval freshness를 깨뜨린다. join 뒤 fresh
re-entry와 room-only 무관리 판정은 사용자 진입을 늘리고 과거 managed deletion을 새 Adopt로 오인한다.
승인 뒤 독립 join prefix는 그 직후 중단 창을 남긴다. 모든 writer stage나 공통 runtime에 같은
장치를 넣는 안은 실제 roomless 최초 writer 둘보다 넓고 behavior owner를 복제한다.

영향 좌표: `skills/principles/references/{policy-index.md,state/identity-and-rooms.md,delivery/commit-and-verification.md}`;
Product `spec.mjs`·`body.md`·승인 fixture; Adopt `spec.mjs`·`body.md`·workflow·제안 template·승인 fixture;
`docs/design{_ko}.md` component intent 계보; matrix §3.24; 세 package 생성 영수증; plugin manifest; CHANGELOG;
v0.23.19 보고. project-state,
Resume, 다른 stage spec, runtime·trace·evaluator, 기존 방과 research/upgrade/claim 효과는 바뀌지 않는다.

재검토 조건: roomless 최초 binding writer가 둘 밖에서 실제로 나타나거나, 기존 방이 다시 stage되거나,
첫 커밋 뒤 actor room이나 승인 의미 중 하나가 빠지거나, pre-boundary digest가 containing commit을
가리키거나, 원자 publication이 기존 integration/room 소비자를 깨뜨리는 장면이 관측될 때.

## 기각된 안 — 동시성 · 점유 · 통합

- **[DR-06 · v0.8.0]** **A안(공유 문서 + ID 표기)·C안(사용자별 폴더 분리)** — 채택안 D("진실의 범위")에 흡수됨.
- **[DR-07 · v0.8.0]** **B′안(gitignore 사설 + 공개 노트)** — 기각이 아니라 보존: "저장소에 devflow 흔적을
  남기면 안 되는 팀" 전용의 답으로 남겨둔다. 일반 채택 경로에는 쓰지 않는다.
- **[DR-26 · v0.12.0]** **기록된 초점 필드** — HANDOFF에 `## Focus` 한 줄로 "오늘은 이 능력"을 영속 저장. 근거로 든
  "그 사실이 어디에도 남지 않는다"가 거짓이다. 선언은 한 걸음 안에 점유 개명으로 착지하고,
  경계 너머는 `Next single step`이 나른다. 남는 구멍은 "선언만 하고 디스크 변화 0으로 세션
  종료" 하나이고 비용은 문장 하나인데, 막는 값은 작성자 셋(resume은 파일을 쓰지 않는다)에
  낡음 판정과 복구 규칙까지다. 아직 관측된 적 없는 마찰이므로 "실제로 만난 결함에서만
  하네스가 자란다"에 걸린다.
- **[DR-27 · v0.12.0]** **터미널마다 상태 폴더(`flows/`)** — 터미널은 조용히 죽는다. 닫는 기점이 없어 폴더가 영원히
  남고 청소 규칙이 필요해진다. 능력 축은 사라지지 않으므로 애초에 닫을 필요가 없다.
- **[DR-28 · v0.12.0]** **사람 아래 두 겹 식별자**(`users/<사람>/flows/<흐름>/`) — "id별"로 쓰인 규칙 전부가
  "사람별 × 흐름별"로 갈라져 복구·정합성이 두 배가 된다. 모드 통합이 같은 문제를 순감으로 푼다.
- **[DR-33 · v0.12.0]** **devflow가 워크트리를 만들거나 관리** — 기존 기각("핵심 편집이 잦아 병합 비용 > 병렬 이득")을
  뒤집지 않는다. 이번 설계는 devflow가 워크트리를 만드는 것이 아니라 사용자가 이미 만든
  워크트리와 호환될 뿐이다.
- **[DR-35 · v0.13.0]** **journal의 `merge=union`** — 실측으로 반증됐다. 한쪽이 요청을 소화해 줄을 지우고 다른
  쪽이 인접 위치에 덧붙이면 union이 소화된 요청을 부활시킨다. 한쪽이 `증거 대기`를
  `증거 마감`으로 교체하고 다른 쪽이 덧붙이면 두 레코드가 모두 남아 정합성 13번을 위반하는데
  처리 규칙이 없다. 지운 상태를 되살리는 합집합은 사람이 푸는 충돌보다 나쁘다.
- **[DR-36 · v0.13.0]** **devflow가 워크트리를 만들고 관리하는 것** — 안전 대책으로서는 실측이 반증했다. 워크트리
  둘이 공유 파일의 같은 자리를 고치면 병합에서 충돌하지만, 한 폴더의 두 세션은 뒤 수정이 앞
  위에 얹혀 충돌하지 않는다. 폴더를 나누는 것은 안전이 아니라 빌드 격리를 사는 일이므로,
  v0.9.x의 비관리 기각은 그대로 서 있고 뒤집을 필요가 없었다.
- **[DR-37 · v0.13.0]** **공유 파일용 원자 락 helper** — 실측으로 불필요해졌다. 자기 경로를 지정한 커밋과 덧붙이기
  전용 기록장이 락에 기대던 것을 이미 준다.
- **[DR-38 · v0.13.0]** **비교-교체 게시용 helper 스크립트** — 필요성이 논증된 적이 없다. `git push . HEAD:<브랜치>`가
  fast-forward 전용이고 `git update-ref <ref> <new> <old>`가 명시적 비교-교체이므로 helper가
  필요 없다. 게다가 실측에서 `update-ref`는 다른 워크트리가 체크아웃한 브랜치에도 성공해 그
  워크트리를 조용히 어긋나게 만든 반면 push는 거부했다 — 평범한 push가 더 약한 것이 아니라 더
  안전한 원시 연산이다. 스크립트를 더하면 devflow가 순수 프롬프트 텍스트라는 성질이 바뀐다.
- **[DR-41 · v0.13.0]** **다른 워크트리에 대한 조상 인지 blob 투영** — 통합 브랜치 하나를 읽는 것으로 대체됐다. 다른
  HEAD가 권위가 아니게 되면 점유만 더하는 필터도 더할 것이 없다.
- **[DR-42 · v0.13.0]** **워크트리별 git 신원** — 기술적으로 가능하지만(`extensions.worktreeConfig` + `git config
  --worktree`) 따라오는 것 때문에 기각한다. 커밋 작성자를 바꾸므로 정합성 8번의 작성자 검사가
  말하는 바를 잃고, 폴더마다 방이 하나씩 남는데 그것을 닫는 것이 없으며, 한 사람이 여러 id로
  갈라져 공유 문서가 그것을 다시 화해시켜야 한다. "가능한가"를 "무엇이 따라오는가"보다 먼저
  답한 것이고, 이번 라운드가 그만두기로 한 실수가 바로 그것이다.

## 정본 토큰

이 결정이 정의하거나 참조하는 정본 문자열이다. **번역하지 않는다** — 문장은 한국어라도
이 토큰은 grep 좌표이므로 원문 그대로 유지한다.

- `evidence-finalizing`
- `evidence-wait`
- `git config --worktree`
- `git push . HEAD:<branch>`
- `users/<person>/flows/<flow>/`
