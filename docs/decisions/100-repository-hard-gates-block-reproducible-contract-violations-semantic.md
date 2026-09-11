# DD-100 · 저장소 hard gate는 재현 가능한 계약 위반만 막고, 의미 휴리스틱은 스킬 문구를 지시하지 않는다

- 상태: 유효
- 주제: 정체성 · 배포 · 플랫폼
- 도입: v0.23.6
- 날짜: 2026-09-04

관측된 문제: P2 이관 때 추가한 devflow 자체 semantic audit가 한 target에 모인 원장 atom 수를
의미 착지의 대리값으로 삼고 임계값을 넘으면 전체 suite를 실패시켰다. Principles에서는 같은 atom의
동일 locator 세 건을 서로 다른 의미 edge처럼 중복 집계해 실제 unique atom 수가 임계값 아래인데도
실패했다. Adopt에서는 이전 설계를 현재 stage에 넓게 투영한 출처 부채를 발견했지만, 그 결과가 현재
runtime의 단계 선택·상태 계산·쓰기 실패를 입증하지는 않았다. 이 신호를 없애려고 stage를 쪼개거나
산문을 늘리거나 원장 처분을 일괄 변경하면 검사가 제품의 정답지가 되고, 실제 동작과 무관한 수리가
후속 수리와 긴 검증을 낳는다.

원하는 동작: 저장소 검사는 AI가 실수했을 때 조용한 소실·잘못된 행동·깨진 실행 경계에 부딪히게
하되, 목적에 맞는 여러 산문 표현과 의미 구조 중 하나를 기계가 대신 고르지 않는다. 검토할 가치가
있는 냄새는 계속 보여 주지만, 그 수치나 이름만으로 현재 스킬을 실패시키거나 수정 방향을 정하지
않는다.

선택한 경계: 현재 byte가 실행·구조 계약 위반을 직접 증명하고 감사 가이드라인 §2의 구체적 실패
경로를 댈 수 있을 때만 저장소 도구가 nonzero를 낸다. 깨진 JSON, 불러올 수 없는 spec module,
명시적인 `review-required`, 빠진 package 입력·scenario, 상태를 계산하는 패키지의 collector·
raw-fact fixture 부재는 그 벽에 남는다.
예약된 migration placeholder는 유효한 저작 위치가 없고 그 정확한 byte가 미완료 산출물을 직접
증명하므로 hard wall이다. 반대로 fan-in 크기, 한 atom 안의 locator 중복, current semantic target이
보이지 않는 넓은 migration 투영, 사용되지 않아 보이는 observation, 판단·진행형 이름과 완료 읽기,
effect 없는 `NEXT`, 폐기된 policy owner일 수 있는 문구는 advisory다. 이 묶음은 이름·횟수·어휘
검색만으로 그 의미를 확정할 수 없다. target 집계는 unique atom→target edge와 raw occurrence를
분리하며, advisory는 루트 suite에도 보이는 검토 시작점일 뿐 변경 권한이나 통과 조건이 아니다.
감사 도구는 별도 문법을 추측하지 않고 `spec.mjs`가 실제 내보낸 observation을 읽는다. 직접 suite가
hard/advisory 분리, 중복 edge, 명시 미해결, 여러 줄·주석 observation, placeholder, 빠진 요청
package를 검사한다.

필요한 이유: DD-92·DD-93의 portable provenance는 출처와 생성 증거를 보존하려는 경계이지, 원장
밀도에서 현재 의미의 품질을 계산하겠다는 약속이 아니다. Skill Rails도 결정론적 구조와 모델 판단을
나누며 fixture를 제품 정답지로 삼지 않는다. 따라서 이 경계는 upstream 보장을 약화하지 않고
devflow가 덧붙인 검사의 권한만 실제 증거 수준에 맞춘다. 다른 repository test의 경로·형식·parser·
Git 전이·설치·trigger 소비 계약은 구체적 실패 경로가 있으므로 그대로다.

기각한 대안: semantic audit 전체 삭제는 명시 미해결과 자기보고 완료 같은 실제 위험을 잃는다.
Adopt·Principles 예외 목록이나 임계값 상향은 다음 package에서 같은 오탐을 반복한다. 경고를 없애기
위한 stage 분할·산문 추가·legacy atom 일괄 재분류는 현재 행동을 입증하지 못한 채 제품을 검사에
맞춘다. 모든 의미 신호를 hard gate로 두는 안은 판단을 기계 이름과 숫자에 넘긴다.

영향 좌표: `scripts/skill-rails-semantic-audit.mjs`와 그 직접 suite,
`scripts/repository-invariants.test.js`, 감사 가이드라인 §3, DD-92·DD-93, P2 obligation ledger를
검토하는 이후의 유지보수 세션. 이 감사 경계 때문에 스킬 산문·원장·생성 byte를 바꾸지는 않는다.

재검토 조건: advisory 한 종류가 현재 byte에서 반복 가능한 실행·소실 결함과 인과적으로 연결되거나,
남은 hard check가 유효한 package를 실패시키거나, upstream이 지금의 휴리스틱을 대체하는 결정론적
의미 계약을 제공할 때. 그때도 관측된 실패 경로가 먼저이며 수치 조정만으로 hard gate를 만들지 않는다.
