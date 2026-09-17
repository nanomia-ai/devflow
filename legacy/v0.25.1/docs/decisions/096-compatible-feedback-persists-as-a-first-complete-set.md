# DD-96 · 호환 환류는 최초 완전 집합이 봉인된 카드 경계 payload로 보존되고, Resume이 한 의미 소유자씩 증명해 착지시킨다

- 상태: 유효 · 일부 정정 → DD-97 (v0.21.0)
- 주제: 작업 트리와 카드
- 도입: v0.20.0
- 날짜: 2026-08-30

관측된 문제: 깨끗한 Work 검토가 재사용 가능한 호환 환류를 발견해도 기존 `compatible` 갈래는
소유자에게 보고한 뒤 카드를 닫을 뿐 그 내용을 지속하지 않았다. 이를 K에 넣으면 카드 실행
증거와 현재 재사용 진실의 소유권이 섞이고, 자유 메모나 HANDOFF에 넣으면 정본 소비자와 원자적
완료 경계가 없다. 한편 단순한 소유자 파일 diff는 내용·출처·후속 함의가 실제로 착지했음을
증명하지 못한다.

원하는 동작: Work는 제목 커밋 전후 어느 경계에서도 호환 환류를 잃지 않는다. 한 카드에서
lifecycle이 아직 없을 때만 이미 수집된 pending·eligible 집합과 카드 target의 기계적 관계를
검증해 전체 소유자 집합을 완전하고 결정적인 payload로 한 번 원자 생산한다. 모든 줄이 정본
payload이고 source가 하나이며 owner가 중복되지 않고 모든 owner 경로가 존재하는 첫 after-state가
집합을 봉인한다. 이후의 차가운 재진입은 제안을 다시 발명하거나 pending 집합을 재구성하지 않고
봉인된 current·consumed lifecycle과 eligible 공집합 사실을 소비한다. Resume은 current 소유자를 기존
Product·Design·Arch·Adopt 단계로 전부 라우팅한다. 각 단계는 정확한 소유자에 Background,
Why/증거, Conclusion, implication, 카드@커밋 출처가 모두 있음을 정본 상태 재생으로 확인한 뒤에만
그 마커 하나를 삭제하며, 다른 소유자는 잔여 마커로 남는다.

선택한 경계: 정본 문법은 `compatible feedback pending: payload-json:` 한 줄이며 payload 키는
`owner`, `source`, `coordinates` 순서다. coordinates 키는 `target`, `background`, `why`,
`conclusion`, `implication` 순서이고 모두 비어 있지 않다. owner는 product, glossary, design,
arch 또는 정확한 능력 설계 문서뿐이다. source는 정확한 카드 경로와 전체 커밋 oid이고, 첫 집합의
모든 항목은 같은 source revision을 쓴다. 한 source card의 모든 호환 줄이 정본 payload이고 source가
하나이며 owner가 중복되지 않고 모든 owner 경로가 존재하는 첫 전이의 after-state가 그 완전한 정확
payload 집합의 seal이다. 한 줄이라도 받아들일 수 없으면 그 전이는 도입이 아니며, 어느 카드에도
귀속할 수 없는 invalid 줄은 그 전이의 모든 미봉인 카드를 보류한다. 그 뒤 같은 카드에서 기존 항목을 다시 도입하거나 새 owner·oid·좌표
paraphrase를 도입하면 무결성 차단이다. 별도 journal 문법, tombstone, note 계층은 추가하지 않으며
기존 Git lifecycle 이력이 seal과 소비 상태의 정본이다.

Work의 제목 전 최초 생산은 기존 카드 내용과 정확한 H1 커밋에 완전한 마커 집합 쓰기를 함께
싣는다. 제목 뒤 최초 생산은 journal만 만지는 별도 경계 커밋이고 카드를 수정하지 않는다. lifecycle
하나라도 생긴 뒤에는 Work가 수집된 lifecycle 사실이 `settled`이고 eligible 집합이 비었는지만
기계적으로 확인해 새 마커를 생산하지 않는다. 이 갈래에서 pending 집합은 비교 대상이 아니다.
current는 Resume으로 계속 라우팅되고 consumed는 영구 은퇴하며,
그 뒤 발견한 환류는 새 요청과 새 카드로 들어간다. 다른 카드 마커는 현재 작업을 가로채지 않고,
미판정 UNKNOWN은 필요한 판단으로 차단되며 `none`, staling, design-note 경로는 바뀌지 않는다.

Resume은 product와 glossary를 Product로, design을 Design으로, greenfield arch와 능력 문서를
Arch로, brownfield arch와 능력 문서를 Adopt로 보낸다. 소유자 단계는 먼저 정확한 내용을 쓰고
WAIT하여 상태를 다시 계산한다. 상태가 source와 다섯 좌표의 의미 착지를 증명한 재진입에서만
바이트 동일 마커 삭제와 정확한 소유자 diff를 한 커밋에 묶는다. 소유자 파일 변화는 삭제 권한의
필요조건일 뿐 의미 착지의 충분조건이 아니다.

왜: 이 경계는 DD-09의 한 사실 한 집, DD-83의 K 소유권, DD-87의 의미 소유자, DD-94의 단일
정확한 제목 커밋을 유지하면서 1000→30 요약 손실 없이 재사용 진실을 정본 소유자에게 전달한다.
첫 완전 수용 after-state를 seal로 쓰면 완전한 다중 소유자 생산과 부분 소비를 함께 보존하면서 새 oid나 바꿔 쓴
좌표로 같은 카드를 다시 여는 차가운 세션을 결정적으로 끝낸다. 카드는 실행과 출처를, journal은
현재 대기 수송을, Git 이력은 봉인·소비 lifecycle을, 소유자 문서는 현재 재사용 진실을 각각 가진다.
모든 seal 항목이 consumed이고 current가 없을 때만 Work 경계가 닫혀 Verify가 다음 소비자가 된다.

정본 소유자: 문법·Git seal 도출·검증·lifecycle 재구성·우선순위는 Principles 상태 도구, 원자 생산과
이미 수집된 집합의 기계적 정확성 guard는 Work, 전량 라우팅은 Resume, 의미 착지와 원자적 소비는
Product·Design·Arch·Adopt가 소유한다.
증거: `skills/principles/spec.mjs`, `skills/principles/scripts/project-state.mjs`,
`skills/work/spec.mjs`, `skills/resume/spec.mjs`, 네 소유자 skill의 compatible-feedback stage,
`scripts/project-state.test.js`, 각 skill의 실행 fixture.
통합 authority 증거(2026-09-02): 수리
`c28facc1b9707f06234a32426f9b51a695bad053`은 configured integration tip을 compatible-feedback
lifecycle의 유일한 authority로 유지한다. 그 authority가 호출 worktree를 포함하지 않으면
기존 `integrity.blocking` route가 `compatible-feedback-integration-behind`와
`update-current-branch-from-integration`을 보고하고, 경쟁하는 committed 또는 uncommitted local
transition은 local truth를 integration truth에 합치지 않고 lifecycle 사실을 `invalid`로 만든다.
독립 Fable 검토는 현재 linked-worktree scene 5/5와 parent 다섯 번째 scene 0/1을 직접
실행한 뒤 PASS했다. 이 증거는 정본 Principles→Resume 경로만 입증한다. uncommitted-local,
update-to-overlay, merge-commit-entry probe와 원문상 Product/Design direct-entry residual은
통과가 아니라 미검증이다.
재검토 조건: 정상 Git 이력에서 첫 완전 도입을 결정적으로 식별할 수 없는 실측 사례가 생기거나,
상태 재생이 동일 의미를 결정적으로 확인하지 못하거나, 여러 소유자의 원자적 공동 착지가 부분
소비보다 반드시 안전하다는 증거가 생길 때. 이력에서 도출한 차단형 호환 환류 finding은 현재
영구적이며 프로젝트 전체에 적용된다. Work가 아닌 writer가 현장에서 그 finding을 실제로 만난 뒤에
clearable-finding 설계를 재검토한다. 후보는 현재 journal에서 reopen finding을 도출하고, 소비를
오래된 것부터 순회하며, 이미 소비된 identity의 제거 검증은 건너뛰고, 소비된 nonmember 제거는
advisory로 다루는 방식이다.

## 기각된 안 — 작업 트리와 카드

- **[DR-02 · v0.7.0]** **work의 카드 승격 트리거** — 조용한 범위 확장의 문. (기각된 것은 work 루프 안의
  상시 트리거다. 공인 경로는 유지된다: 규칙 정본의 발견→갱신 표가 "예상보다 클 뿐"을
  잡아 split의 승격 절차로 보낸다.)
- **[DR-12 · v0.9.12]** **모순 해소의 표 일원화** — 문서 간 모순을 1~4단계 대신 발견→갱신 표로 보내는 재서술.
  적용 직후의 반증 패스가 회귀 둘을 적출해 원문 복원: 1~4단계의 부수 효과(`.stale.`
  표시·재분할)가 모순 경로에서 사라지고, 표에 착지 칸이 없는 틀린 쪽이 존재한다
  (design.md · 이미 있는 code-style 줄 · 실행은 되지만 틀린 완료 신호). 재제안하려면
  이 둘을 해결한 설계여야 한다. 모순 문장("이 절차로 합친다")과 1~4단계 한정
  문장("위반해야 할 때만")의 문자적 충돌은 미해결 관찰 항목으로 남는다 — Layer 0의
  실측 교착은 초안 조항(같은 버전 채택)이 이미 덮는다.
- **[DR-29 · v0.12.0]** **세션·날짜 단위 작업 묶음 파일** — 전부 닫는 기점을 요구하고, 닫는 기점은 조용히 죽는
  세션에서 반드시 샌다. 카드가 이미 "완료 신호 하나 = 커밋 하나"로 그 역할을 한다.
- **[DR-39 · v0.13.0]** **`legacy signal migration` 마커 상태 기계** — 정본 25~40줄인데, 잔여 위험은 "다른 단위
  점유의 미커밋은 먼저 체크포인트한다"는 work의 기존 규칙이 이미 유계로 만든다.
