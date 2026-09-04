# v0.23.7 결과 보고 — 현재 증거 기반 Adopt 복구

기준 commit: `9479feb7ad468c11c977a9220e1fb6eb45a1761f`
배포 version: Claude·Codex manifest 모두 `0.23.7`

## 목적과 관측된 실패

현재 checkout에 `.devflow`가 없어도 `project-state.mjs`가 `git log --all -- .devflow`에서 다른
ref나 과거 commit의 경로를 찾으면 관리 상태로 판정했다. 그 결과 shallow history, 깨진 무관 ref,
linked worktree의 형제 ref가 명시 최초 Adopt를 `setup.no-product`로 우회시켰다. 현재 main의 Adopt
제안은 `Evidence verification` 구역을 가지고도 전체 자료 처분, Layer 0, 능력/K 연결, 검증 수단을
구속 전에 독립적으로 반증하는 계약이 없었다.

이번 수리는 두 문제의 현재 main상 최소 의미만 현행 Skill Rails P2 구조로 옮긴다. 과거 브랜치의
version·round·decision 기록은 이관하지 않았고, users-only 예외도 채택하지 않았다. JZ Note의
`devflow-test1/2/3` 원본 실험 sample에는 접근하지 않았다.

## 구현한 경계

- 멤버십은 현재 작업 트리의 `.devflow` 루트와 현재 index의 `.devflow` 항목만 본다. 둘 다
  부재일 때만 unmanaged이고, index 관찰 실패는 부재 증명이 아니므로 보수적으로 no-product다.
  이력·다른 ref는 멤버십 입력에서 제거했다.
- 현재 Product가 없으면 `setup.no-product`를 내되 DD-92의 승인된 `00-project` 사전 Product 연구는
  기존 `zoneOrder` 순서를 유지한다. 현재 Product는 있지만 HEAD에 커밋된 Product 경계가 없으면
  `setup.layer0-uncommitted`가 복구를 소유한다. 이때 현재
  journal은 계속 검증하지만 이력 기반 lifecycle·기준선 복구는 첫 커밋 전까지 빈 기준선을 쓴다.
  HEAD 경계 판독 실패는 blocking integrity다. Product 직접 진입은 선택 route와 별개로 동시에
  보고된 이 정본 setup 사실을 소비해 미커밋 Adopt 초안을 확정 문서로 오인하지 않고 Resume으로 돌려보낸다.
- Adopt는 `refutation.state = pending | clear | blocked` 판단 관측을 갖는다. pending은 완전한
  draft와 유계 입력으로 clean-context 의미 반증을 한 번 실행하고, clear만 제안·구속 질문·승인
  쓰기에 도달한다. blocked는 근거 있는 차단 finding 또는 clean context unavailable을 함께
  뜻하며 제안 앞에서 멈춘다. 승인 행도 clear를 결합한다.
- 반증 입력은 전체 draft, inventory/disposition, load-bearing 현재·제안 source/code 좌표, 선택한
  공용 능력·capsule 계약, Arch verification-channel 표의 Surface·Required channel 열, 첫 proposal
  문단과 ADR 조건뿐이다. Missing-channel action과 다른 Arch 실행·verification-run·승인·쓰기·commit
  지시, producer transcript, 이전 audit 결론은 제외한다. wrong action, 필요한 결정/기각 방향 소실,
  wrong owner, verification means 누락을 만드는 뒷받침된 모순·누락만 막고, 한 번 수정 뒤 반환
  좌표만 재검사한다.
- 공용 기준선 정본의 Identity 구역을 Adopt의 유계 읽기에 포함해 `Product C<n> <name>`과 disk
  `NN`을 구분한다. 소비 관계의 한 용어는 `provider disk NN`으로 통일했다.

DD-101이 현재 증거 멤버십, 커밋된 Product 복구 경계, Product·Resume 소비를 소유하고 DD-102가
구속 전 refutation 상태와 입력·차단 경계를 소유한다. DD-95와 DD-97의 해당 이유만 일부 정정했다.
Arch runtime, state shape, SessionStart와 Verify 계약은 바꾸지 않았다.

## Skill Rails 정본과 생성 범위

정본 변경은 Adopt의 `spec.mjs`, `body.md`, workflow, intent, obligation ledger, scenario fixture와
Principles의 state source 및 선택된 공용 reference, Product의 canonical-state entry bridge,
Direct의 canonical-state entry guard, Product·Resume의 setup P2 행과 대표 fixture에 한정했다. 설치된 대표
Skill Rails 0.3.1의 P2 maintain transaction으로 각 패키지를 rebuild했다. transaction 영수증인
`semantic-diff.json`은 마지막 유계 transaction의 증분을 기록하며 release 전체 diff의 대체물이
아니다. `.generated.json`은 현재 전체 package hash를 봉인한다.

생성 변경은 Adopt·Direct·Principles·Product·Resume의 `.generated.json`과 각 package의
`.skill-rails/semantic-diff.json`이다. 생성 `SKILL.md`는 byte상 바뀌지 않았고 어떤 생성물도 손으로
고치지 않았다.

## 독립 반증과 finding 처분

첫 독립 Opus pass는 current main에서 전역 이력 멤버십 결함, 비어 있던 Evidence verification,
Arch verification-channel 입력 누락, Product C와 disk NN 혼동을 재확인했다. users-only 제외와
Product-file 멤버십 유지 제안은 승인된 현재-root+index 경계 및 재현 증거와 충돌해 채택하지 않았다.

두 번째 Opus pass의 원문 F0–F10은 다음처럼 처리했다.

- F0: 이 보고서를 현재 repair round에 생성해 CHANGELOG의 report 단정을 실제 경로와 일치시켰다.
- F1: Product 부재 전체를 short-circuit하던 임시 수리를 폐기했다. 현재 journal은 관리 상태에서
  항상 검증하고, HEAD의 커밋된 Product 경계가 없을 때만 과거 lifecycle 비교와 기준선 투영을
  시작하지 않는다. 최초 초안과 관리 HEAD에서 Product를 지운 반례를 함께 regression으로 고정했다.
- F2: Adopt와 Resume이 실제로 여는 Principles 두 정본의 낡은 product-before-unmanaged 문장을
  current root/index 및 canonical-state recovery로 교체했다.
- F3: 산문 RUN 뒤 무조건 ASK하던 흐름을 refutation 판단 관측·별도 stage·blocked terminal·clear
  승인 결합으로 바꿨다.
- F4: Arch 표 전체가 아니라 Surface·Required channel 열만 읽고 Missing-channel action을 제외한다.
- F5: C/NN 정의가 있던 `Identity and expected set`을 Adopt의 선택 read에 포함했다.
- F6: 같은 소비 필드의 이름을 `provider disk NN`으로 통일했다.
- F7: semantic-diff는 transaction 증분이라는 현행 계약을 유지하고 CHANGELOG와 이 보고서가 이를
  release 전체 영수증처럼 말하지 않게 고쳤다.
- F8: body·workflow·DD·matrix의 refuter 제외 집합을 같은 범주로 맞췄다.
- F9: 상태 공간을 pending·clear·blocked 세 값으로 줄였다. fixture는 pending 실행, blocked 정지,
  clear proposal, clear+approve 쓰기를 각각 관측하는 최소 조합이며 효과 이름만으로 차단 의미를
  대신하지 않는다.
- F10: 정확한 Arch sibling 경로를 첫 READ_FIRST body에 두고, 저장소 invariant가 그 pointer와 Arch의
  선택 표 열·proposal/ADR 문단 anchor를 함께 검사한다. Arch 내용은 복사하지 않았다.

후속 감사에서 같은 축의 결함이 연속해서 드러났다. 현재 Product가 없는데도 커밋된 closing marker가
route를 소유했고, 완전한 미커밋 Adopt 초안에서는 current marker가 Product나 Arch writer로 우회시킬
수 있었으며, HEAD가 없다는 이유로 현재 journal 검증까지 생략한 중간안도 있었다. 마지막으로 Product
직접 진입은 파일 존재만 보아 정본 state route를 우회했다. 이를 반례별 guard로 남기지 않고 하나의
모델로 다시 묶었다: 멤버십은 current root+index, 커밋된 Product는 과거 복구의 권위 경계,
current journal은 관리 상태에서 항상 검증, unreadable 경계는 integrity blocking이다. 상태 도구가
관찰과 기존 zone 순서를 한 번 소유하고, DD-92의 사전 Product 연구는 기존 `zoneOrder`가 보존한다.
Product는 선택된 route 하나가 아니라 동시에 보고된 미커밋 Layer 0 사실을 소비한다. 반복되던 journal
경계 변환은 `committedJournalAt` 하나로 합쳤고, state fixture는 부분 초안→완전 초안/marker→첫
commit과 겹친 git-operation 소비를 한 시나리오로 압축했다.

위 수리 뒤 같은 Opus 5 xhigh가 base `9479feb` 대비 당시 40-file 전체 diff를 read-only로 다시 감사하고,
수정 전 B1 연구 순서 실패와 B2 route 가림 장면을 제출 직전에 재실행했다. 두 장면과 F0-F10,
N1-N3이 모두 닫혔고 blocking finding은 0이었다. 저장소 수정은 0개였다. 연구가 낡은 marker보다
앞서는 전이적 귀결, 00-project 카드가 있으면 absent 열은 도달 불가인 점, en 문장의 정밀도는 현재
결함이 아닌 관찰로 남겼다.

그 뒤 동일 질문의 clean Fable/Codex 비교가 갈렸다. Fable은 Direct collector가
`setup.layer0-uncommitted`에서도 Product를 `present`로 투영하는 줄을 읽었지만 base와 같은 byte라는
이유로 기존 범위 밖이라고 분류했다. Codex는 이번에 새로 생긴 동시 setup 사실이 그 이진 관찰에
들어가 `record-request`와 journal WRITE를 여는 장면을 연결했다. ordinary 임시 Git 저장소와
`MERGE_HEAD` overlap에서 state→collector→evaluator를 다시 실행해 Codex의 사실 주장을 확인했다.
Direct는 이제 같은 동시 사실을 별도 값으로 소비하고 모든 planning 효과 전에 Resume으로 돌아간다.
state kind·priority·다른 consumer 조건은 추가하지 않았다.

마지막 Opus 5 xhigh 재감사는 Direct의 22개 쓰기 분기와 정상 Product·DD-92 대조군을 다시 실행해
runtime semantic blocker 0을 확인했다. 다만 기존 interrupted-Adopt 시험에 추가한 두 Direct 단정이
runtime이 항상 주는 `skillRoot` 없이 Product collector용 context를 넘겨 비교 전에 예외로 끝나는 literal
test-call 결함을 찾았다. collector 계약이나 runtime은 바꾸지 않고 두 호출에 동일한 canonical Direct
skill root를 공급했다. 수정 전 T2는 14/16, 수정 뒤 T2는 16/16이며 아래 결합 pattern은 18/18이다.
감사 중 저장소 수정은 0개였고, 이 교정은 기존 state 장면 안의 시험 배선만 바로잡았다.

## 현재 검증 결과

- `node --test --test-name-pattern="K C1 ordinary project research|T2 unmanaged activation|T2 priority structure"
  scripts/project-state.test.js`: 18/18 통과. ordinary·unborn·linked 멤버십, index 오류, DD-92 연구
  순서, 최초 초안→commit, 겹친 git operation, orphan current-journal 검증, unreadable HEAD 경계와 우선순위를 포함한다.
- Adopt·Direct·Principles·Product·Resume P2 full lint/build: 각각 `L-structural: pass`.
- 대표 Skill Rails 0.3.1 `eval.mjs`: Adopt 11/11, Direct 28/28, Principles 10/10, Product 19/19, Resume 50/50,
  모두 L0–L18 pass와 mismatch 0. fresh-agent 행동 품질은 이 결과로 증명하지 않는다.
- `node --test scripts/decision-index.test.js scripts/project-knowledge.test.js
  scripts/repository-invariants.test.js scripts/skill-rails-semantic-audit.test.js`: 85/85 통과.
  provenance fan-in 1과 Principles duplicate-target-locators 28은 DD-100의 advisory이며 실패가 아니다.
- `node scripts/decision-index.mjs --lang ko`: DD-101·DD-102와 DD-95·DD-97 상태를 정상 투영했다.
- `node --test "scripts/*.test.js"`: Direct correction, 독립 재감사, literal test-call 교정 뒤의 최종
  byte에서 한 번 실행해 515/515 통과, fail 0이었다(1,321,800.5662ms). Gate A도 이 실행에 포함됐다.

의미 검토 전에 실수로 시작한 `project-state.test.js` 전체 실행은 장시간 suite임을 확인한 뒤
중단했고 통과로 세지 않았다. 위 최종 completion gate만 현재 byte의 전체-suite 증거로 센다. 실제
Adopt 모델 행동, fresh-agent trigger와 long-session drift, Claude·Codex 설치는 현재 **미검증**이다.
Verify 계약을 바꾸지 않았으므로 수동 Gate B 대상은 아니다.

## 감사 종료 조건과 limitations / carry-forward

감사 가이드라인 §5의 규칙 충돌·조용한 소실·잘못된 행동·출구 없는 정지·비용 조건을 평가했다.
두 번째 pass 시점에는 F1·F2·F3·F4 때문에 정지 조건을 만족하지 않았고, 각 원인을 위와 같이
수리했다. clean 비교가 찾은 Direct wrong-action은 기존 observer가 이미 낸 동시 사실을 Direct가
잃은 한 consumer projection 결함으로 확인했다. correction 뒤 전체 의미 재감사와 최종 stop-clause
판정은 runtime blocker 0, F0-F10·B1/B2·N1-N3 closed로 끝났다. 감사에서 드러난 test-call context
불일치도 기존 장면 안에서 수리하고 같은 pattern을 재실행했다. 규칙 충돌·조용한 소실·잘못된
runtime 행동·출구 없는 정지는 0이며, 최종 completion suite와 Gate A도 통과했다.

실제 Adopt가 한 번의 bounded refutation을 올바른 입력으로 수행하고 반환 좌표 재검사 뒤에만
clear를 판단하는지는 fresh Claude/Codex 실행 전까지 unverified다. JZ Note sample 재실행·보정은
이번 release 범위가 아니다. Product의 확인된 직접 진입 결함은 정본 route 소비만으로 닫았고,
Arch runtime을 확대할 구체 실패는 관측되지 않았다.
