# Architecture 문서 계약

이 계약은 Architecture와 Adopt가 `.devflow/project/architecture.md` 또는 concern child를 만들거나
교체할 때 적용한다. 고정 목차나 기술 taxonomy가 아니라, 처음 읽는 사람이나 AI가 현재 기술 경계와
다음 변경의 위치를 발명하지 않게 하는 내용 계약이다.

## root는 하나의 현재 모델을 제공한다

Architecture root는 Product와 Domain을 반복하지 않고 그것이 어떤 실행 가능한 체계로 이루어지는지
설명한다. 고정 heading이나 문답 순서가 아니라, 처음 읽는 독자가 다음 내용을 하나의 구조로 이어서
이해할 수 있어야 한다.

- Product 약속, 실행·배포 환경, 운영 책임, 외부 제약과 현재 code/runtime evidence 중 구조를 실제로
  좌우하는 것
- 주요 실행 단위와 구성요소, 책임·소유권과 배포 관계
- 의존 방향, data ownership, public seam과 중요한 runtime/data flow
- failure·운영 경계, verification channel, Design 적용 여부, 안정된 불변식, 교체 가능한 현재 선택과
  열린 질문

작은 프로젝트는 이 내용을 짧게 이어 쓸 수 있고, 복잡한 프로젝트는 root가 공통 답과 직접 child
route만 가진다. 선택한 기술이 구조를 바꾼다면 현재 선택과 짧은 이유를 함께 쓴다. 열린 질문에는
현재 취급과 다시 여는 조건을 둔다. 모든 dependency를 inventory하거나 근거 없는 scale, provider,
보안, 운영과 가능한 미래를 채우지 않는다.

## 현재 필요한 깊이만 사용한다

작은 프로젝트는 `project/architecture.md` 하나가 기본이다. 모든 기술 작업이 함께 알아야 하는 경계,
불변식, 큰 구성요소 관계, 주요 flow, verification과 직접 child route는 root에 남긴다.

`project-knowledge`의 공통 split/fold 판정을 먼저 적용한다. 특정 기술 질문을 다른 작업이 안전하게
건너뛸 수 있고 독립된 계약과 변경 이유가 있을 때만 `project/architecture/<concern>.md`로 분리한다.
frontend, backend, data, security와 operations는 가능한 이름일 뿐 기본 taxonomy가 아니다.

한 Domain에만 적용되는 기술 concern은 그 Domain parent에서 선택할 수 있을 때
`project/domains/<domain>/<concern>.md`에 둘 수 있다. 위치가 Domain subtree여도 업무 의미가 아니라
기술 계약이며 decision route는 Architecture다. 같은 규칙을 Architecture subtree에 다시 요약하지
않는다.

정확한 file·folder·package 배치는 현재 소유권, 의존, runtime 또는 verification을 실제로 바꿀 때만
규칙으로 둔다. 아직 존재하지 않는 layer, adapter, package와 빈 tree를 미래 가능성만으로 만들지 않는다.

## 의미, 이유와 실행 증거를 분리한다

현재 기술 규칙은 Architecture가 소유한다. 중요한 선택을 지킬 이유, 기각 대안과 재검토 조건이
필요하면 공통 decision 문서 계약을 사용한다. Product·Domain 업무 규칙, Design 원칙과 Work 진행
상태를 복제하지 않는다.

code, configuration, test와 프로젝트가 가진 기계 판독 model이나 자동 검사는 실행 증거가 될 수
있지만 두 번째 산문 canon은 아니며 그 내용을 문서에 옮겨 적지 않는다. 자동 검사는 실제 작업이나
CI에서 실행되어 위반을 구체적으로 거부할 때만 verification channel로 적는다. 생성된 출력은
파생물이지 canon이 아니다.

## 다음 단계가 기술 경계를 만들 필요가 없을 때 완전하다

다음 단계가 주요 구성요소, 의존 방향, data ownership, public seam, 배포 또는 verification 방식을
새로 발명하지 않고 시작할 수 있어야 한다. 가역적인 local 구현 선택과 현재 구조를 바꾸지 않는 미래
질문은 열려 있을 수 있다.

각 현재 기술 결정은 사용자 제약, Product·Domain 계약이나 code/runtime evidence에서 나오거나, 그
안에서 Architecture가 고른 선택이면 짧은 이유를 곁에 둔다. verification channel은 실행 가능하거나
사용할 수 없는 이유와 다시 확인할 조건이 있어야 한다. 빈 절, 가상의 component, 사용되지 않는 child와
decision을 문서의 완성도를 위해 만들지 않는다.
