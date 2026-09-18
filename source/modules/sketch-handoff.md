# Sketch 결론 landing

Sketch가 결정 가능한 결론을 게시하려 할 때, 또는 현재 member의 Sketch state가 현재 target을 `next_route`로 지정했을 때만 이 모듈을 연다. 이 계약은 같은 member의 개인 탐구에서 확정된 결론만 canonical owner로 올리는 역할 전환이다. 다른 member에게 Sketch를 발견시키거나 탐구를 넘기는 handoff가 아니며, 모든 Devflow route를 고정된 lifecycle로 만들지도 않는다.

finding의 결론이 지정된 canonical home에 흡수될 때까지 그 finding을 `unresolved_findings`에 유지한다. `landing_condition`은 finding을 게시할 준비가 된 시점을 뜻하며, 목록에서 제거할 수 있는 시점을 뜻하지 않는다. Sketch는 한 번에 준비된 항목 하나만 게시한다. 해당 destination을 `next_route`로 설정하고, `next_action`에 finding, 결론, canonical destination을 명시한다. Sketch는 artifact와 다른 모든 항목을 그대로 유지하고 destination 문서를 쓰지 않는다.

다음 역할은 먼저 state가 자신의 route를 지정하는지, 선택한 finding이 `landing_condition`을 충족하는지, destination이 현재 target의 소유 범위 안에 있는지 확인한다. 현재 member가 선택한 정확한 Sketch 폴더의 brief와 state, 존재하는 경우 선택된 finding 본문, 그리고 이 landing에 필요한 최소 canonical 문서만 읽는다. 다른 member의 Sketch를 검색하거나 비교하지 않는다. 결론이 준비되지 않았거나 현재 증거와 충돌하거나 다른 owner의 책임이면 canon을 변경하거나 artifact를 삭제하지 않는다. 한 가지로 제한된 질문이나 증거 행동을 지정해 같은 member의 `sketch`로 돌려보내고, 사람만 결정할 수 있는 선택이라면 `user`로 보낸다.

다음 역할은 결론을 destination의 현재 문맥에 맞게 게시한 뒤 그 항목 하나를 `unresolved_findings`에서 제거한다. 항목이 남아 있으면, 준비되지 않은 항목에는 `sketch`와 한 가지 증거 행동을 게시하고, 이미 준비된 항목에는 해당 destination과 landing 행동을 게시한다. 마지막 landing이 끝나면 선택한 `<artifact-id>/` 폴더 하나만 제거한다. 조사 서사를 canon에 복사하거나, 한 결론을 여러 home에 중복 landing하거나, canonical write가 성공하기 전에 state를 바꾸거나, 항목이 남아 있는데 artifact를 삭제하지 않는다.
