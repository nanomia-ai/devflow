# 현재 decision 문서 계약

이 계약은 Product, Architecture, Design 또는 Adopt가
`.devflow/project/decisions/<id>-<slug>.md`를 만들거나 교체할 때 적용한다. decision은 프로젝트 전체가
공유하는 현재 결정 이유다. 개인 Sketch, member note, Work state, verification record 또는 시간순
회의 기록이 아니다.

## 미래 판단을 실제로 보호할 때만 만든다

현재 규칙만 알면 다음 작업자가 올바르게 행동할 수 있다면 decision을 만들지 않는다. 실제 대안 중
하나를 선택한 이유를 잃으면 중요한 논의를 반복하거나, 기각한 대안이 다시 안전성을 해치거나, 현재
선택을 다시 결정할 구체적인 조건이 있을 때만 만든다. 작업이 있었다는 사실, library 선택 하나,
구현 과정 또는 완료 이력을 남기려고 만들지 않는다.

본문은 결정 질문, 현재 결론, 결론을 지배하는 맥락과 제약, 실제로 고려한 중요한 대안과 기각 이유,
현재 영향과 감수한 대가, 재검토 조건, 규칙이 반영된 canonical path를 스스로 설명해야 한다.
decision은 현재 규칙의 사본이 아니다.

## 한 질문의 현재 답으로 유지한다

decision ID는 한 질문의 identity다. 같은 질문의 결론이 바뀌면 같은 파일을 현재형으로 교체하고,
독립된 새 질문에만 새 ID를 사용한다. 날짜, 작성자, accepted·superseded status와 과거 결론 목록은
필수 metadata가 아니며 Git이 변경 시점과 이전 내용을 보존한다.

이유가 더 이상 현재 판단을 보호하지 않으면 문서를 삭제하고 route를 갱신한다. redirect와 tombstone을
쌓지 않는다.

Sketch finding, member note와 Work observation은 소유 decision route가 canonical rule과 이 문서를
게시하기 전까지 공용 결정이 아니다. 근거가 부족하거나 owner 결정이 남아 있으면 결정된 것처럼
다듬지 않는다.
