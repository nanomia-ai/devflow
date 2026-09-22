# 검증된 tracked Work 닫기

유효한 tracked Work가 closure condition에 도달하고 모든 필수 criterion이 proven인 뒤 candidate를
채택·기각하거나, pending landing을 반영하거나, artifact를 닫을 때 적용한다. 기존 pending landing은
현재 검증과 종료 자격을 대신하지 않는다.

각 knowledge candidate를 채택하거나 기각한다. 미해결 판단은 필요한 decision route와 질문을 밝혀
`direct`로 보내고, 확인된 현재 사실만 `fact -> canonical path` 형태의 pending landing으로 바꾼다.

각 candidate는 그것을 드러낸 code가 아니라 그것이 증명하는 invariant로 판단한다. 그 invariant가 이후
actor의 판단을 바꾼다면 채택하여 home의 언어로 반영하고, 그런 invariant가 남지 않을 때만 기각한다.

pending landing을 `.devflow/index.md` 또는 `.devflow/project/` 아래에 실제로 쓰기 직전에만
`references/project-knowledge.md`를 열어 그 canonical write에 적용한다. Work의 spec·state와
verification은 `references/work-state.md`가 소유하며 이 조건으로 project-knowledge를 적용하지 않는다.

pending landing이 Architecture 또는 Domain technical 경로를 가리킬 때만
`references/architecture-document.md`를 열고, Design 또는 Domain design child를 가리킬 때만
`references/design-document.md`를 열며, 기존 decision 경로를 가리킬 때만
`references/decision-document.md`를 연다. pending landing이 기존 Product 또는 Domain 업무 경로를
가리킬 때만 `references/product-document.md`를 열고 확인된 사실을 기존 의미에 통합한다.

반영하려면 새 제품·업무 의미, Domain 경계나 child 구조, 새로운 기술·경험 방향 또는 decision identity
판단이 필요하면 필요한 decision route와 질문을 밝히고 `direct`로 보낸다.

landing 대상이 없으면 새 문서를 만들어 닫지 않고, 사실과 판단 유형에 맞는 후보 owner를 밝혀
`direct`로 보낸다.

각 pending landing을 해당 canonical Product, Architecture, Design, Domain 또는 decision home에
반영한다. 수정한 문서의 `summary`, `read_when`, 관련 본문을 다시 읽고, 중복 없이 사실이 존재하는 것을
확인한 뒤에만 landing을 지운다. closure가 commit을 만들면 artifact를 삭제하기 전에 그 commit message에
goal, acceptance, verification을 짧게 요약한다. PR이 review surface라면 대신 PR에 쓴다. blocker,
candidate, pending landing이 하나도 남지 않았을 때만 Work artifact 디렉터리와 같은 Work ID의
`.devflow/team/*/<work-id>.md`만 삭제한다. Git이 이력을 보존하므로 완료된 spec tombstone을 남기지 않는다.
