---
name: adopt
description: 관리되지 않은 brownfield 프로젝트의 유지 지식을 모든 source에 대한 회계와 풀 수 없는 충돌을 드러내면서 자기완결적인 Devflow Product, Architecture, 해당되는 Design, Domains, decisions로 재구성한다. 기존 프로젝트를 명시적으로 adoption할 때만 사용하며 새 프로젝트 planning, 일반 변경 또는 legacy Devflow migration에는 사용하지 않는다.
---

# Brownfield 지식 소유권 이전하기

Adopt는 관리되지 않던 기존 프로젝트를 이해하는 권한을 `.devflow/` 안으로 옮긴다. 오래된 문서를
영구 참조용으로 요약하거나, 이전 Devflow 형식을 migration하거나, 유지 source로 확인할 수 있는 사실을
사용자에게 다시 설명하라고 요구하지 않는다.

이 스킬을 수행하기 전에 `references/communication.md`를 열고, 수행 중 독자에게 보내거나 문서에 저장하는 자연어에 적용한다. gate에서 종료할 때 보내는 안내도 포함한다.

## 관리되지 않은 프로젝트 gate로 진입한다

target 고유 행동을 하기 전에 `references/project-gate.md`를 열고 `adopt` 행을 적용한다. 이어서
`references/project-knowledge.md`를 연다. 읽을 수 있는 `.devflow/index.md`가 이미 있다면 먼저 읽고,
진행 중인 adoption인지 새로 발견된 brownfield boundary인지 판단한다.

Product 또는 Domain 문서를 구성하거나 교체하기 전에 `references/product-document.md`를 열고 문서의
내용과 완료 기준에 적용한다.

사용자가 기존 프로젝트를 adoption하라고 명시적으로 요청했거나, 다른 Devflow route가 내부 foundation이
없는 maintained brownfield material을 발견했을 때만 진입한다. 명확한 새 brief는 `product`, 불확실한
새 아이디어는 `sketch`, 관리되는 프로젝트의 변경은 그 소유 route로 보낸다. legacy Devflow 파일을
upgrade protocol로 인식하거나 runtime fallback으로 import하지 않는다.

쓰기 전에 Git status를 검사하고 repository boundary를 식별한다. 무관한 dirty bytes를 보존한다.
maintained source boundary 자체를 repository evidence로 결정할 수 없을 때만 묻는다. generated output,
dependency, cache, VCS metadata는 존재한다는 이유만으로 maintained knowledge가 아니다.

## 모든 maintained source를 회계한다

복구 가능한 현재 workspace로 `.devflow/adoption/`을 만든다. 공통 routing header를 가진 `state.md`,
`sources.md`, `conflicts.md`를 공개한다. `state.md`는 교체되는 하나의 snapshot이다.

```yaml
next_route: adopt
next_action: <하나의 범위가 정해진 inventory, reconstruction, decision 또는 disposition 행동>
blockers: []
```

coverage table, conflict 사본, 진행률, phase, 대화, source file 목록은 state에 넣지 않는다. 현재 행동을
끝내지 못한 채 관리권이 바뀔 수 있다면 먼저 state를 교체한다. 공개된 route의 actor가 snapshot을
소유한다. 관리권이 모호하면 덮어쓰지 말고 사용자에게 보낸다.

고정 key `adoption`에 해당하는 범위가 정해진 note가 있거나 handoff 뒤에도 보존해야 하는 local delta,
환경 고유 맥락 또는 잠정 맥락을 가지고 있다면 `references/team-context.md`를 연다. 그렇지 않으면
건너뛴다.

`sources.md`는 maintained input universe를 정의하고 범위가 정해진 source group으로 나눈다. 각 group에
다음을 기록한다.

- 정확한 include path 또는 glob과, 겹침을 드러내는 상보적인 exclusion
- source 성격과 authority: intent prose, executable behavior, test, configuration, operation,
  generated evidence 또는 다른 구체적 역할
- 찾는 knowledge 종류와 하나의 내부 target home
- 현재 disposition: landed, conflict, pending, retained live evidence, noncanonical preservation,
  pointer replacement, move 또는 deletion
- uncovered maintained path의 총수

maintained prose는 각각 disposition을 가진다. 동질적인 code, test 또는 configuration은 include/exclude
boundary를 검사할 수 있고 authority, 찾는 knowledge, target, disposition을 실제로 공유할 때만 묶을 수
있다. group이 maintained path를 하나도 빠뜨리지 않을 때 coverage가 완료된다. 이것은 그 의미를
이해했다는 증거가 아니다.

같은 adoption boundary에서 작은 `.devflow/index.md`를 만들거나 갱신한다. 답을 복제하지 않고 프로젝트
방향을 알려주며 현재 Product, Domain, Architecture, Design, adoption 질문을 route한다. 즉시 복구에
쓰는 `team/<current-member>/sketches/*/state.md`, `adoption/state.md`, `work/*/state.md` glob만 노출하고 현재 canon과 adoption
status로 readiness를 도출한다. source group이나 active artifact ID를 열거하지 않는다.

## 산문이 아니라 의미를 재구성한다

각 source를 `sources.md`에 기록한 authority에 따라 읽는다. 실행한 code와 test는 현재 behavior를
확인할 수 있지만, 모순되는 제품 promise를 조용히 선택할 수 없다. intent prose는 사용자 의미를
확인할 수 있지만, divergence를 드러내지 않은 채 관찰한 runtime behavior를 덮을 수 없다. configuration은
현재 상태이고 실제로 사용되는 범위에서만 환경을 확인한다.

maintained source가 어떤 내용을 주장하거나 명시적으로 질문할 때, 또는 그런 source-backed claim을
해석하는 데 현재 실행이 필요할 때만 knowledge unit으로 취급한다. 다른 부재, test하지 않은 case,
가능한 미래 결정을 fact나 unknown으로 만들지 않는다. 각 knowledge unit은 다음 중 하나로 구분한다.

- 현재 source 또는 실행이 직접 뒷받침하는 observed fact
- evidence, 남은 uncertainty, confirmation condition을 곁에 둔 interpretation
- maintained source가 명시적으로 제기했지만 어느 source도 해결하지 못한 unknown. 바뀔 decision과
  함께 한 번만 기록한다.
- maintained source들이 서로 양립할 수 없는 현재 답을 뒷받침하는 conflict

어느 maintained source에도 제품의 목적, 대상 또는 핵심 약속을 뒷받침하는 주장이 없어 자기완결적인 Product를 만들
수 없다면 동작에서 의도를 추론하지 않는다. 현재 source가 확인하는 동작과 그 동작만으로는 정할 수
없는 제품 의미를 구분해 `product`로 보낸다.

각 unit은 그것을 해결하는 decision route의 문서 하나를 내부 home으로 가지며, 자신이 한정하는 문장
옆에 둔다. 다른 home은 그 unit을 link할 수 있지만 completeness를 위해 다시 catalog하지 않는다.

완전한 현재 `.devflow/project/product.md`, 필요한
`.devflow/project/domains/<domain>/index.md` Domain parent, `project/architecture.md`를 공개한다.
`project/design.md`는 Architecture가 Design이 적용된다고 말하고 maintained source에서 재구성할 현재
interaction, presentation, accessibility, component 또는 review rule이 있을 때만 공개한다. 어떤
surface에 대한 Product promise나 goal은 Design knowledge가 아니다. Design은 적용되지만 source에 그런
rule이 없다면 placeholder Design을 공개하지 않는다. Architecture가 applicability를 드러내고, 앞선
adoption decision이 닫힌 뒤 다음 foundation route가 `design`이 된다.

conditional concern child를 만들기 전에 공통 split test를 적용한다. Product는 사용자, promise,
boundary, shared language, cross-domain composition을 소유한다. 각 Domain은 자신의 업무 state와
rule만 소유한다. Architecture는 technical seam, dependency direction, runtime/data behavior,
verification channel, Design applicability를 소유한다. Design은 experience principle과 review surface를
소유한다. 사실을 복제하지 말고 이 home들을 서로 참조한다.

공개한 모든 문서는 오래된 prose가 제거된 뒤에도 이해할 수 있어야 한다. 외부 reference를 input을 다시
열라는 summary가 아니라 자기완결적인 현재 문장으로 대체한다. code, test, live operational asset은
현재 evidence로 남을 수 있지만 그 경로가 두 번째 project knowledge canon이 되지는 않는다.

## 풀 수 없는 conflict만 드러낸다

`conflicts.md`에는 source authority와 현재 evidence만으로 풀 수 없는 contradiction만 둔다. 각각에
양립할 수 없는 claim, 양쪽 evidence, 영향을 받는 현재 judgment, 이미 배제한 interpretation, 필요한
정확한 decision, 소유 route, resolution confirmation condition을 쓴다. 남은 것이 없다면 직접 그렇게
쓴다. 해결된 conflict history를 현재 truth로 보존하지 않는다.

제품 또는 Domain 의미는 `product`, 기술 의미는 `architecture`, 경험 의미는 `design`으로 보낸다.
그 decision route는 conflict를 소유하고 답을 질문의 canonical home에 흡수한다. owner가 선택해야 하는
경우에도 Domain rule은 해당 Domain index에, promise 또는 boundary는 Product에 넣는다.
`next_route: user`는 답을 흡수할 decision route를 행동에 적은, 충분히 구성된 선택만 전달할 수 있다.
경쟁하는 답과 consequence를 보여준 뒤에만 사용자에게 묻는다. foundation을 완전하게 보이게 하려고
만들어낸 답을 다듬지 않는다.

제품 의미가 자료끼리 충돌하는 경우와, 제품 의미를 뒷받침할 자료가 없는 경우를 구분한다. 전자는
`conflicts.md`에 기록한다. 후자는 conflict로 만들지 않고 state를 `next_route: product`와 필요한 제품
판단 및 Product가 읽을 source 경로를 적은 `next_action`으로 교체한다. 확인한 사실을 state에 복제하지
않는다.

Product가 답을 canonical Product 또는 Domain에 게시하고 state를 `next_route: adopt`로 되돌리면,
그 답으로 해결된 conflict를 `conflicts.md`에서 지우고 게시된 의미를 기준으로 나머지 source 회계와
foundation 완성을 계속한다. 그 전에는 목적, 대상이나 핵심 약속을 추측한 Product를 게시하거나
adoption을 닫지 않는다.

## 입증된 경계 안에서만 work를 연다

Adoption은 vertical slice로 진행할 수 있지만, 아직 회계하지 못한 repository 전체가 준비된 것은 아니다.
요청한 tracked change boundary는 다음 세 사실을 현재 파일에서 모두 확인할 수 있을 때만 eligible하다.

1. 그 변경에 영향을 줄 수 있는 모든 maintained source가 `sources.md`에서 disposition을 가진다.
2. 변경에 필요한 Product, Domain, Architecture, Design, cross-domain canon이 자기완결적이다.
3. unresolved conflict가 그 change boundary에 영향을 주지 않는다.

이는 status field가 아니라 도출한 evidence다. 세 조건이 모두 참이면 state가 그 정확한 boundary와
범위가 정해진 변경을 `direct`로 보낼 수 있으며, 다른 adoption은 열린 채로 남는다. 하나라도 불확실하면
`next_route: adopt` 또는 하나의 decision route를 유지하고 Work를 만들지 않는다.

## 오래된 prose를 이전하거나 폐기한다

기존 documentation은 고유한 현재 knowledge가 모두 반영되거나 명시적 conflict가 된 뒤에만 project
truth authority를 잃는다. 최종 disposition은 deletion, 현재 search surface 밖으로 이동, host가
요구하는 최소 pointer로 대체, 또는 Devflow project truth가 아니며 고유한 project knowledge가 없다는
명확한 문장과 함께 보존하는 것 중 하나다. 이미 허가되지 않은 파괴적 처리나 목적 변경 전에는 사용자
결정을 요청한다.

유일한 fact를 남겨 둔 채 오래된 문서를 noncanonical로 표시하지 않는다. 안심을 위해 전체 old manual을
새 canon 옆에 남기지 않는다. runtime code, test, configuration은 운영 역할이 요구하는 위치에 남는다.
disposition은 knowledge authority를 바꾸며 execution role을 바꾸지 않는다.

## 완전히 이전한 뒤에만 닫는다

모든 maintained source group이 landed, retained live evidence, explicit conflict 또는 위 규칙에 따른
noncanonical 상태이고, uncovered path가 0이며, 모든 conflict가 해결되었고, 완전한 Product,
Architecture, 해당되는 Design, Domain, decision knowledge가 자기완결적일 때 adoption을 닫는다. index를
갱신하여 readiness와 다음 route가 이 결과를 반영하게 한 뒤 `adoption/`과 모든
`team/*/adoption.md` 파일을 제거한다. Git이 reconstruction history를 보존한다.

closure 뒤에는 파일 존재가 아니라 의미를 test한다. old prose가 없거나 의도적으로 모순되는 상태에서
`.devflow/project/`만 사용해 대표적인 Product, Domain, Architecture 질문에 답한다. fresh reader는
internal canon을 선택하고, 남아 있는 모순을 non-authoritative라고 보고해야 한다. 이를 관찰하지 않았다면
external input independence는 `unproven`이다.

다음을 반환한다.

- `Coverage:` 유지 source group, 제외 경로, 포함되지 않은 경로 수
- `Published:` 만들거나 교체한 모든 canonical project 및 adoption path
- `Conflicts와 unknowns:` 열린 decision과 route, 또는 `none`
- `Ready boundary:` 세 readiness fact를 충족하는 요청 change boundary, 또는 `none`
- `Source disposition:` 아직 필요한 old prose 및 live source 처리
- `Route와 행동:` 다음 route 하나와 범위가 정해진 행동 하나

제품 변경을 구현하거나 Work 계약을 만들거나 legacy Devflow state를 migration하거나 path coverage가
semantic completeness를 증명한다고 주장하지 않는다.
