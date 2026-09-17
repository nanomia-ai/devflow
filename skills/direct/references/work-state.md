# Work artifact 상태 계약

`spec.md`는 현재 outcome, non-goal, acceptance, `read_first`, write boundary를 소유한다. Git은 실제 revision과 byte를 소유한다. `state.md`는 현재 복구 가능한 좌표와 custody 인계만 소유한다.

다음 field를 가진 현재 snapshot block 하나만 유지한다.

```yaml
base_revision: <이 Work 계약이 시작된 revision>
last_safe_point: <commit된 revision과 선택적인 한 줄 의미; 존재하기 전에는 생략>
next_route: <project-gate.md가 허용하는 route>
next_action: <범위가 제한된 한 가지 행동>
blockers: []
knowledge_candidates: []
pending_landings: []
```

`base_revision`, `next_route`, `next_action`, `blockers`는 필수다. `last_safe_point`, `knowledge_candidates`, `pending_landings`는 선택 사항이며, 생략하면 현재 기록된 값이 없다는 뜻이다. safe point는 commit 또는 현재 `HEAD`를 가리키며, commit되지 않은 byte를 가리키지 않는다. 새 현재 snapshot을 설명하는 `summary`와 `read_when`을 포함해 작은 문서 전체를 교체한다. 이전 route를 header에 남기지 않는다. 진행 상황, 시도, transcript, verdict 사본, sibling path pointer를 덧붙이지 않는다.

custody는 마지막으로 게시된 `next_route`의 actor에게 있다. snapshot은 그 actor만 쓴다. custody를 바꾸기 전에 최신 safe point와 next action을 게시한다. 비활성 artifact를 되살리는 actor는 대조를 마친 snapshot을 쓸 때 custody를 맡는다. custody 또는 Git basis가 모호하면 덮어쓰지 말고 `user`로 route한다.

구현이나 검증에서 canon 후보로 판단할 가치가 있는 지속적인 현재 사실이 드러났을 때만 `knowledge_candidate`를 추가한다. 해당 사실이 확인된 뒤에만 `pending_landing`을 추가하고 canonical project path 하나와 짝지은다. 코드 경로, artifact dependency, 관찰, verdict는 landing이 아니다.

state를 읽을 수 없거나, 필수 field 또는 sibling이 없거나, spec에 outcome·acceptance·write boundary가 없거나, spec·state·Git이 서로 일치하지 않으면 Work 계약을 current로 취급하지 않는다. 추측으로 계속하지 말고 불일치를 복구 또는 결정 route에 드러낸다.

spec은 구현을 안내할 수 있지만 state, custody, evidence, landing, closure, verification의 소유권을 바꿀 수 없다. write boundary 안의 local method 제안은 binding이 아니다. spec clause가 이러한 소유 경계, acceptance 또는 write scope와 충돌하면 마지막 safe point까지만 마치고, `next_route: direct`를 게시하며, clause와 whole-file amendment에 필요한 결정을 명시한다.
