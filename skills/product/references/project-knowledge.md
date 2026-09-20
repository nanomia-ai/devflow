# 프로젝트 지식 게시 규칙

Devflow 프로젝트 문서는 활동 기록이 아니라 현재 지식을 제공하는 interface다. 모든 Markdown 파일에 다음 routing header를 둔다.

```yaml
---
summary: <이 문서가 현재 답하는 질문과 현재 결론>
read_when:
  - <이 문서를 읽어야 하는 구체적인 질문 또는 조건>
---
```

각 문서는 하나의 질문에 대해 자기완결적이어야 한다. 본문은 현재형으로 쓰고, 사실마다 canonical path를 하나만 둔다. 관찰, 해석, 미해결 질문, 그리고 질문을 해결할 조건을 구분한다. 대화, 초안의 이력, 다른 문서의 두 번째 요약을 저장하지 않는다.

`.devflow/index.md`는 항상 읽는 지도다. 프로젝트를 한 줄로 설명하고, 구체적인 질문을 canonical parent로 route하며, 재개에 사용하는 범위가 제한된 immediate artifact glob을 밝히고, foundation 문서에서 준비 상태를 판단하는 방법을 설명한다. 상세 지식을 복제하거나 활성 artifact ID를 열거하지 않는다.

조건부 child는 독자가 현재 질문과 parent route만으로 본문을 열기 전에 선택할 수 있고, child가 독립된 질문과 변경 이유를 하나씩 가지며, 줄어드는 읽기 비용이나 충돌 비용이 새 route 비용보다 클 때만 분리한다. 그 외에는 지식을 parent에 둔다. parent route와 child header는 함께 갱신한다.

child도 같은 판정을 통과하면 자신의 child를 가질 수 있고, 그때는 그 문서가 자기 subtree의 route를
소유한다. 실제 작업이 parent와 child 또는 형제 대부분을 늘 함께 열고 함께 고친다면 다시 합친다.
