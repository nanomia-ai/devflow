# Design 문서 계약

이 계약은 Design과 Adopt가 `.devflow/project/design.md` 또는 design concern child를 만들거나 교체할 때,
Work가 확인된 pending landing을 Design 또는 Domain design 경로에 반영할 때 적용한다. 고정 목차나
design-system taxonomy가 아니라, 처음 읽는 사람이나 AI가 경험 방향과 검토 기준을 발명하지 않게 하는
내용 계약이다.

Work는 이 계약을 확인된 사실을 기존 경험 모델에 통합하는 데만 사용하며, 새로운 경험 방향이나 concern
구조를 결정하지 않는다.

## root는 하나의 현재 경험 모델을 제공한다

Design root는 Product·Domain 의미와 Architecture 제약을 반복하지 않고, 지원 surface에서 그것들이
어떻게 경험되어야 하는지 설명한다. 고정 heading이나 문답 순서가 아니라, 처음 읽는 독자가 다음
내용을 하나의 경험으로 이어서 이해할 수 있어야 한다.

- 적용되는 사용자와 surface에서 무엇을 쉽게 이해하고 판단·행동할 수 있어야 하며, 선택을 가르는
  경험 원칙이 무엇인지
- 여러 변경이 함께 따르는 표현 언어와 안정된 pattern. 시각 surface가 있을 때만 visual foundation,
  token과 component 전략이 여기에 포함된다.
- navigation, input, feedback, error recovery, Product·Domain이 드러내는 state, accessibility와
  Architecture가 지원하는 presentation range에서 무엇이 달라지고 무엇이 유지되는지
- 실제 review surface와 관찰할 내용, 안정된 원칙과 교체 가능한 현재 선택, 알려진 gap·열린 질문,
  직접 child와 live source route

작은 프로젝트는 이 내용을 짧게 이어 쓸 수 있다. 모든 token, component, 화면과 상태를 inventory하지
않는다. 다음 변경의 선택을 실제로 바꾸는 원칙·pattern·예외와 검토 경로만 남긴다. 입력, 현재 canon과
관찰 가능한 evidence가 제기하지 않은 pattern, state와 gap을 문서의 완성도를 위해 만들지 않는다.
열린 질문에는 현재 취급과 다시 여는 조건을 둔다.

## 현재 필요한 깊이만 사용한다

`project/design.md` 하나가 기본이다. 모든 Design 작업이 함께 알아야 하는 경험 방향, 공통 언어,
interaction·accessibility·state 원칙, review surface와 직접 child route는 root에 남긴다.

`project-knowledge`의 공통 split/fold 판정을 먼저 적용한다. 특정 surface 또는 interaction 계열을 다른
작업이 안전하게 건너뛸 수 있고 독립된 적용·검토 계약과 변경 이유가 있을 때만
`project/design/<concern>.md`로 분리한다. visual foundation, component, accessibility와 platform은
가능한 질문일 뿐 기본 taxonomy가 아니다.

한 Domain에만 적용되는 경험 concern은 그 Domain parent에서 선택할 수 있을 때
`project/domains/<domain>/<concern>.md`에 둘 수 있다. 위치가 Domain subtree여도 업무 규칙이 아니라
Design 계약이며 decision route는 Design이다. 같은 원칙을 Design subtree에 다시 요약하지 않는다.

page, component, framework 이름이나 문서 길이만으로는 독립된 concern이 되지 않는다. exact prop,
token 값, 구현 상태와 specimen은 code나 catalog가 더 정확하면 그곳에 남긴다.

## 정본, live source와 reference의 역할을 구분한다

현재 경험 원칙과 프로젝트별 사용·예외 규칙은 Design이 소유한다. exact token 값, theme, component
구현, prototype, rendered catalog와 regression asset은 더 정확한 code·asset이 있으면 그곳에 두고
산문에 복제하지 않는다. Design은 필요한 독자가 그 live source를 선택할 조건과 review route를
제공한다. 실제 작업자가 접근할 수 없거나 현재 흐름에서 사용되지 않는 source는 이름만으로 review
근거가 되지 않는다.

외부 site나 design system을 사용하면 영감을 주는 evidence인지 계속 의존하는 live contract인지
밝힌다. 프로젝트가 채택한 범위, 바꾼 부분과 현재 검토 방법은 외부 source를 다시 해석하지 않아도
알 수 있어야 한다. 이름이나 URL만으로 “같이 만든다”고 지시하지 않는다.

중요한 선택을 지킬 이유, 기각 대안과 재검토 조건이 필요하면 공통 decision 문서 계약을 사용한다.
Product·Domain 상태, Architecture 제약, Work 과정과 verification verdict를 Design에 복제하지 않는다.

## 다음 변경이 경험 기준을 발명할 필요가 없을 때 완전하다

다음 변경이 적용되는 경험 원칙, 공통 표현·interaction pattern, 접근성 기대와 review surface를 새로
발명하지 않고 시작할 수 있어야 한다. 한 surface의 가역적인 세부 배치나 구현하며 비교할 수 있는
표현은 열려 있을 수 있다.

각 현재 Design 판단은 사용자 선택, Product·Domain 계약, Architecture가 정한 surface나 관찰 가능한
live evidence에서 나오거나, 그 안에서 Design이 고른 선택이면 짧은 이유를 곁에 둔다. review surface는
실제로 열어 볼 수 있거나 사용할 수 없는 이유와 다시 확인할 조건이 있어야 한다. 빈 절, 가상의
token·component·state, 사용되지 않는 child와 catalog를 문서 완성도를 위해 만들지 않는다.
