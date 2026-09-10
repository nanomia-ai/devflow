# v0.24.0 staged knowledge contract와 AI 실행 문맥 재설계 구현 보고

상태: 릴리스 후보. 이 보고는 공식 설치·실사용·commit 전이며, 실행하지 않은 동작을 통과로
기록하지 않는다.

## 원인과 자연 소유자

첫 실패는 실제 Adopt follow-on이 millisecond timestamp와 JSON object를 써서 Principles parser가
요청 줄을 조용히 잃은 일이었다. 범용 Skill Rails 형식을 축소하지 않고 journal 의미 owner
`skills/principles/references/state/journal-grammar.md`, 그 projection, parser consumer, staged Git
후보의 commit 경계를 함께 닫았다. 이 staged knowledge-contract repair의 증거 경계는
`b178898a8e596cb843ab9efc306acd7e23659cb9`다.

두 번째 원인은 아홉 단계의 목적·공통 Why·상시 READ가 중요도 차이 없이 반복되어, 긴 cold 실행이
현재 요청·승인 범위·owner와 필요한 read path를 놓치는 전달 구조였다. DD-110은 첫 판단 전에 이
현재 원문을 복사하지 않고 정본 owner/read path로 가리키고, 단계별 판단 입력과 첫 소비자 가까이의
상세, canonical disk state의 정상 세션 재진입을 분리한다. 역할·승인·검증·복구 인과와 staged
knowledge contract는 유지한다.

## 작성 의미 변경

- policy-index가 목적·현재 요청·최근 승인 범위를 정본 owner/read path로 가리키는 문장을 소유하고
  여덟 body는 이를 동일하게 투영한다.
- Product 완료 뒤 HEAD/current 네 경로가 정확히 맞는 좁은 경우에만 상태 도구가 기존 entry data
  `stage:arch`를 보이며 Resume이 transient observation으로 소비한다.
- Direct는 Architecture와 Design을 읽되 현재 요청이나 승인 범위에 실제 미해결 Design 판단이 있을
  때만 Design change로 분류한다. current/default style 작업은 tree work다.
- Adopt workflow의 body 중복만 제거하고 whole follow-on journal carrier와 no-follow-on DONE을 보존했다.
- Verify의 세 branch reference와 Resume recovery policy는 첫 branch effect 직전으로 옮겼고,
  recovery route의 stale Work 표기를 Arch로 교정했다.
- Product·Design·Resume의 runtime purpose edge는 제거했지만 purpose 파일과 migration ledger는 보존했다.
- 새 state·approval·route kind·registry·helper·checklist·model/OS 분기는 만들지 않았다.

## 생성 영수증과 실행 증거

아홉 P2 package는 설치된 Skill Rails v0.4.3/runtime 0.3.6의 공식 builder로 cohort 재생성했다.
Verify의 첫 scratch rename은 일시적 EPERM으로 실패했지만 승인된 동일 재시도 1회가 성공했다. 아홉
manifest는 공통 runtime hash
`sha256:c871a427645d6f734e97c777f694c94678dafd36dabf777608a543cc2648df3b`를 가리키며, 공식 build 전후
작성 원본 diff hash는 `1e4b9ce003ec5952f0f5115ee79970379b487e13`로 같았다.

별도로 완료된 표적 명령은 Direct fixture, repository invariants, Product→Resume project-state 묶음,
staged knowledge-contract project-state/Adopt projection과 `git diff --check`였다. 이후 시작한
project-state/Direct 결합 재실행은 중단됐으며 전체 명령을 통과로 세지 않는다. 그 안에서 완료된
`.000Z` 하위 case도 결합 명령의 성공으로 승격하지 않는다. 최종 전체 suite는 한 번 실행해
1,803,551.7646 ms에 exit 1, 587 tests 중 585 pass·2 fail·0 skip으로 끝났다. 실패는 journal grammar의
exact parser 문장을 요구한 `R7 the canon's progress heads and the tool's recognizer are one table`과
Verify fixture가 새 두 번째 READ를 반영하지 않은 `prepared and interrupted recovery perform a finite
suffix and resume`다.

그 실패 뒤 Principles의 parser/consumer 역할 명칭과 Verify의 finite-suffix 보조 assertion만 교정했다.
실패했던 R7과 Verify test는 각각 1/1 pass, portable P2 package와 공통 runtime/validator hash invariant는
2/2 pass였고, Principles와 Verify의 공식 build도 각각 L-full·fixture·mutation 검증을 통과했다.
이어 마지막 Product K atomicity micro-fix 전 0.24 runtime 후보 byte에서 full suite가
2,163,543.0507 ms에 587 tests·587 pass·fail/cancelled/skipped/todo 0으로 끝났다. micro-fix는
`+14/-2`였고 해당 project-state 표적 검증은 28,565.6368 ms에 6/6 pass였다. 이 suite 결과는
micro-fix 전 증거이며 현재 후보의 completion evidence가 아니다. 최신 후보 full suite는
2,200,272.2947 ms에 588 tests·588 pass·fail/cancelled/skipped/todo 0으로 끝났다.

## 독립 검증

Fable과 Astra는 Product fresh-session proof, Direct의 Design optionality, purpose provenance,
READ 배치를 whole-context로 교차 반증해 두 blocking 표현을 수리한 뒤 수렴했다. Opus whole-diff는
blocking 0을 보고했고 Fable final whole-diff도 blocking 0이었다. N1은 body 문장이 policy-index의 intentional projection이라 유지했고, N2는
state tool의 기존 package boundary를 test cover로 유지했으며, N3 Adopt의 고아 지시어 `That`만
`The`로 교정했고, N4 Verify의 기존 purpose locator는 현재 인과 밖이라 건드리지 않았다.

동일 질문 cold before/after에서 Codex와 Claude(Fable) 모두 current introduced critical omission,
history/current confusion, deletion-before-source-read가 각각 0이었고 comprehension은 떨어지지 않고
개선됐다. 늦게 드러난 design-marker
recovery 충돌은 `b178898`부터 있던 pre-existing 관찰이다. 이번 `route-work`→`route-arch` 교정은 실제
writer owner와의 정렬을 개선하므로 0.24.0에는 nonblocking이며, 남은 producer/external 의미는 별도
Resume/Arch scope에서 판단한다.

문서 시스템 검토에서는 외부 live consumer가 없고 서로만 연결된 research 두 파일을 함께 삭제했다.
그중 current 의미인 지식·작업 경계와 기각 이유는 DD-92·DD-77, 독립 검증 운용은 감사 지침과
유지보수 규약이 이미 소유하며, DD-92에는 mega-log와 별도 lifecycle을 기각한 이유만 보존했다.
직접 참조와 rollback 기준을 가진 blueprint, manifest selector와 이력 소비자가 있는 round는 모두
보존했다. matrix §6과 settled backlog 계보도 과거의 실제 검증과 미검증을 구분하므로 유지했다.

## 남은 한계

- 마지막 micro-fix 전 suite 587/587은 인과 이력이고, 최신 후보 completion suite는 588/588이다.
  수동 Gate B는 미실행이다.
- 공식 원격 Claude/Codex 설치와 실제 사용은 미검증이다.
- Windows에서 작성·표적 검증했으며 macOS/Linux 동작은 미검증이다.
