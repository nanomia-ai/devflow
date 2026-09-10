# v0.25.1 역할 브리핑 사본 여섯을 걷어낸 수리 보고

상태: 릴리스 후보. 실행하지 않은 동작을 통과로 적지 않는다.

## 왜 되돌리는가

0.25.0 은 「역할 브리프를 어떻게 건네는가」가 저장소 어디에도 없다는 SWEEP §0 의 공백을 닫으면서
발동 역할마다 계약 파일 하나를 두었다. **사후 실측 결과 그 다섯은 서로 93.7~97.8% 동일했다.**

```
다섯 파일 합계                 2,035 B
다섯 개 전부에서 동일한 줄       293 B  = 각 파일의 72%
파일당 고유                    114 B  = H1 제목 + 명령 안의 역할 id 하나
순수 반복(여분 4 벌)           1,172 B
```

`work/references/reviewer-role.md` 와의 유사도는 1.5~2.2% 다. 그것은 입력 목록·판단 축 셋·반환 형식이
실제로 적힌 **내용 계약**이고, 새로 만든 다섯은 어느 역할에도 같은 **전달 지시**였다.
구현자가 work 파일의 *모양*을 따르면서 *내용의 종류*가 다르다는 것을 확인하지 않았다.
한 지시문을 다섯 곳에서 고치게 되는 형태이며, 이 저장소가 막으려고 존재하는 바로 그 모양이다.

## 무엇을 바꿨나 — 두 단계

**단계 1(측정 후 기각).** 지시문을 각 `DISPATCH` 의 `brief` 인자로 인라인했다. 실측으로 원문 렌더는
확인됐지만(§실측), 같은 문장이 spec 여섯 자리에 남아 **복제가 사라진 게 아니라 옮겨졌다.** 기각.

**단계 2(채택).** 사본을 전부 걷어내고 **대체 문장을 두지 않는다.** 전달 지시는 devflow 에 두지 않는다. ROLE 이 선언된 verify·work 는 그 지시 없이 0.23.3·0.23.8 실전에서 제대로 브리핑했고, 관측된 실패는 ROLE 이 없던 adopt 하나뿐이며 그것은 ROLE 선언으로 닫혔다. 그 문장이 필요하다는 증거가 없다.

- 계약 `READ` effect **여섯 제거** (adopt 2 · arch 1 · verify 3).
- `principles` 의 **고아 role 4절 삭제** (reviewer·verifier·auditor·retrospector, ledger anchor 전부 0)
  과 그 `ROLES` 선언 넷. `coordinator`(anchor 44)는 남는다. 이것을 안 하면 자리만 옮긴 것이다.
- `work/references/reviewer-role.md` 를 stub 으로 — 그 700 B 는 `work/body.md` 의 `role: reviewer` 절의
  두 번째 사본이었다. ledger anchor 는 `body:role: reviewer` 10 건이고 파일에는 0 건이다.
- `skills/adopt/references/refuter-role.md` · `skills/arch/references/channel-verifier-role.md` **삭제**.
- verify 의 셋은 **원래 locator 형태로 복원**. 삭제 불가다 — `obligation-ledger.json` 의
  **projected atom 48 개**가 `file:references/{verifier,auditor,retrospector}-role.md` 를 좌표로 들고 있고,
  `repository-invariants.test.js:404` 의 `companionHomes` 와 `:218` 의 design 의도 색인도 그 경로를 이름으로 붙든다.
- work 의 `READ` 셋은 **그대로 둔다** — 열리는 파일이 stub 이 되었을 뿐, 그 자리는 0.25.0 이전부터 있었다.
- 판정·상태·guard·관측치·커밋 경계 **변화 0**. 새 규칙 문장 **0**.

## 실측 — 단계 1 이 왜 기각됐는가

탐침(`PROOFTOKEN-brief-renders-verbatim`)이 렌더된 지시문에 1회 출현해 인자 인라인이 성립함을 확인했다.
아래는 그 단계의 출력이다. **원문 렌더는 되지만 같은 문장이 여섯 자리에 남으므로 채택하지 않았다.**

```
ordered effects: READ(path=references/workflow.md)
  -> RUN(action=inventory-all-maintained-sources-by-knowledge-unit-with-exact-coordinates-disposition-and-landing-target)
  -> RUN(action=trace-one-executable-flow-per-code-backed-capability-candidate-and-record-documentary-basis-for-document-derived-candidates)
  -> RUN(action=reverse-derive-complete-layer-zero-applicable-design-capability-zones-glossary-whole-owner-adjacent-knowledge-and-adr-or-missing-ground-owner-landings)
  -> DISPATCH(brief=hand the clean context the verbatim output of scripts/skill-rails/run.mjs role
     --skill <skill-root> --role refuter; attach only its listed inputs; send nothing else;
     accept only its declared return,role=refuter,template=refutationResult)
  -> WAIT
```

`validator.mjs` 의 기록된 근거와 일치한다 — *"An effect argument is text the runtime renders into the
model's instruction, not a path the runtime opens: `renderGuide` serializes every argument verbatim."*
채택된 최종 형태에서는 이 `brief` 인자도 없다: `DISPATCH(role=refuter,template=refutationResult)` 뿐이다.

## 순감 실측 (0.25.0 대비)

| 대상 | 0.25.0 | 현재 | delta |
|---|---|---|---|
| `adopt`·`arch`·`verify` spec.mjs | 64,646 | 64,331 | **−315** |
| `principles` spec.mjs + body.md (고아 role 4) | 13,229 | 12,231 | **−998** |
| 계약 파일 여섯 (adopt·arch 삭제, verify 3·work stub) | 2,735 | 646 | **−2,089** |
| fixtures 넷 | 109,438 | 109,294 | −144 |
| `design.md` 쌍 | 33,172 | 33,089 | −83 |
| **저작 합계** | | | **−3,692 B** |

파일 **−2** · effect **−6** · 역할 선언 **−4** · 세 spec 전부 **순감** · 대체 산문 **0**.


## Skill Rails 관찰 두 항목 (기록. 구현 계획 아님)

Skill Rails 저장소는 건드리지 않는다. 설치된 v0.4.3 / runtime 0.3.6 안에서 이번 라운드를 끝냈다.
아래는 devflow 쪽에서 관측한 사실과 좌표이며, 채택 조건은 `docs/design-backlog.md` 의 해당 행이 소유한다.

### 1. `DISPATCH` 효과의 Decision 에 `renderRole` 출력이 실리지 않는다

`ROLES` 는 역할의 입력·reads·판정·반환 템플릿을 완전히 선언하고 `renderRole`(`api.mjs:167-183`)이
그것을 정확히 렌더한다. 그러나 그 출력을 Decision 이 나르지 않는다.

- `renderGuide` 가 싣는 것은 선택된 **stage/guard** body 절과 `template content:` 뿐이고 역할 절은 없다.
- `resolveProjection`(`evaluator.mjs:226-236`)의 `templateId` 는 첫 효과의 template 이라
  `DISPATCH { role, template: verifierBundle }` 는 **입력 묶음** 템플릿만 싣는다.
- 생성 `SKILL.md` 가 이름 짓는 런타임 명령은 `enter`·`stage` 둘뿐이다 (`role` **0 건**, 아홉 생성물 전수).

결과: 브리프가 실행자 손에 있으므로 좁힐 수 있고 잊을 수 있다. 0.24.0 Adopt 실사용에서 생산자가
반증자 브리프를 좁혀 `omit verification means` 차단 검사가 범위 밖으로 나갔다.

관찰: `evaluator.mjs:250-258` 과 `guide.mjs:20` 에 `template_text`·`format.example` 와 같은 형태의
필드 하나가 들어오면 브리프는 좁힐 수도 잊을 수도 없어지고 devflow 문장은 0 이 된다.
그때 `ROLES` 를 쓰는 모든 P2 패키지가 함께 좋아진다.

### 2. `after-input` seal 이 Decision 이 묻지 않은 필드까지 봉인한다

`decisionEventData`(`api.mjs:255-257`)는 `reinvoke === "after-input"` 인 Decision 에서 그 호출에 공급된
judged/decided **전부**를 봉인하고, `callerInputContinuation`(`api.mjs:266-278`)이 같은 run·안정 snapshot 에서
상속하며 `api.mjs:97-98` 이 병합해 누적한다. 봉인 범위가 `decision.needs` 로 한정되지 않는다.

결과: 한 값을 묻는 BLOCK 이 함께 타이핑된 다른 값까지 다음 호출로 실어 나른다. Adopt 에서
`approval.action=approve` 가 반증 질문의 BLOCK 을 타고 넘어가 쓰기 없는 제안서를 건너뛰었다.
같은 형태가 ask/approve 테이블을 가진 모든 스테이지에 잠재한다 — adopt `approval`,
product `confirmationRoute`, arch `approvalBoundary`·`capabilityRoute`, design `confirmation`, direct `proposal`.

devflow 는 `approval-precedes-refutation` guard 하나로 국소 흡수했다. 상류에서 `api.mjs:256` 의 범위를
`decision.needs` 로 좁히면 그 guard 는 삭제 후보가 된다.
0.23.20 라운드 보고가 이미 반대 방향의 마찰을 「requested-only/cumulative-input 계약 모순」으로 기록했다.

## 시험

빌더 fixture: adopt 13/13 · arch 54/54 · verify 28/28 · principles 10/10 · work 75/75, mismatches 0.
아홉 cohort `runtime_hash`·`validator_hash` 각각 distinct 1 — runtime 0.3.6 불변.
`repository-invariants.test.js` 단독 21/21 pass, fail 0.

**완료 게이트 전체 (`node --test "scripts/*.test.js" "skills/**/*.test.mjs"`), 최종 바이트에서 1회:**

```
ℹ tests 588
ℹ suites 0
ℹ pass 588
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1520227.01
EXIT=0
```

실패 0건. **Gate A 는 이 실행 안에서 함께 돌았다** —
`✔ gate A feeds every canon-reserved journal line to the deployed parser (20555.2156ms)`.

## 남은 한계

- **전달 지시 없이 착지한다.** ROLE 이 선언돼 있고 `inputs` 7 이 spec 에 있으며 반환 템플릿은 Decision 에
  인라인된다. ROLE 을 가진 verify·work 는 그 지시 없이 0.23.3·0.23.8 실전에서 제대로 브리핑했고,
  관측된 실패는 ROLE 이 없던 adopt 하나뿐이며 ROLE 선언으로 닫혔다. **그 문장이 필요하다는 증거가 없다.**
- 관찰: `DISPATCH` Decision 이 `renderRole` 출력을 스스로 인라인하면 이 주제가 아예 사라진다.
  전문은 아래 「Skill Rails 관찰 두 항목」 절이고 채택 조건은 `docs/design-backlog.md` 가 소유한다 —
  이번 라운드의 구현 계획이 아니며 Skill Rails 저장소는 건드리지 않았다.
- **역할 브리프 실발동은 여전히 미측정.** 실행자가 `run.mjs role` 을 실제로 도는지는 clean 세션 관찰로만 판정된다.
- gate B 는 0.25.0 계보대로 해당 없음. 실사용(matrix §3.24 (i)(j)(k))은 그대로 `unverified`.
- `skills/arch/fixtures/source/generate-scenarios.mjs` 드리프트는 0.25.0 이월 그대로다.
