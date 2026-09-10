# v0.25.0 Adopt 의미 반증 게이트 재저작 구현 보고

상태: 릴리스 후보. 이 보고는 공식 설치·실사용·gate B 이전이며, 실행하지 않은 동작을 통과로 적지 않는다.

## 원인과 자연 소유자

0.24.0 공식 설치본으로 같은 소스 저장소의 서로 다른 sparse 부분집합에 Adopt end-to-end 두 번을 돌렸고,
둘 다 되돌릴 수 없는 최초 정본 쓰기 앞에서 사람이 멈춰야 했다. 두 lane 은 입력이 달라 모델 비교가 아니고,
아래 원인은 fixture 와 무관하게 소스에서 성립한다.

원인은 하나가 아니라 부재 하나와 누수 하나다.

**부재 — 반증자만 역할이 아니었다.** `skills/adopt/spec.mjs` 의 `ROLES` 는 비어 있었고 반증은
`RUN` 액션 문자열 하나였다. 그래서 반증자의 입력·제외·판정·반환이 `body.md`·`references/workflow.md`·
`DECLARATIONS.semantic_refutation` 세 곳의 산문에만 있었고, 그 산문을 브리프로 옮기는 것은 생산자의 일이었다.
devflow 의 다른 독립 판단자는 전부 선언된 역할이다 — work reviewer, verify verifier·auditor·retrospector,
arch channel-verifier, principles 다섯 역할 본문. 브리프를 좁힌 lane 은 이 저작 공백을 밟았고, 그 결과
`body.md` 가 블로킹 임계로 명시한 `omit verification means` 가 검사 범위 밖으로 나갔다.

**누수 — 승인이 남의 질문을 타고 넘어간다.** `api.mjs:255-257` 은 `reinvoke === "after-input"` 인 Decision 에서
그 호출에 공급된 judged/decided **전부**를 봉인하고, `api.mjs:266-278` 이 같은 run·안정 snapshot 에서 그것을
상속한다. adopt 에서 after-input BLOCK 을 내는 자리는 `semantic-refutation` 의 `refutation.state` 요구 한 곳뿐이다
(`adoption` 은 `needs` 가 없다). 따라서 호출 1 에 `approval.action=approve` 만 주면 반증 질문의 BLOCK 이 그 승인을
봉인하고, 호출 2 에서 `refutation.state=clear` 를 주면 승인이 상속되어 `TABLES.approval` 의 approve 행이
`prepare` 의 REPORT→ASK 없이 바로 열린다. 중단 뒤 재개해 곧바로 쓰기로 간 lane 이 이 모양이다.

자연 소유자는 `skills/adopt/spec.mjs` 다. Adopt 만이 네 조건을 동시에 갖는다 — `.devflow` 부재로 디스크 전송로 없음,
최초 정본 쓰기라 상류 검증자 없음, `guard: state-owned-elsewhere` 와 DD-97 로 재실행 불가, DD-108 로 흡수 원본을
의존성으로 남기지 않아 사후 재유도 불가. Product 의 최초 커밋(`product/spec.mjs:52`)은 소유자 `decided` 승인과
collector 둘로 열리고 생산자 judged 게이트가 0 이므로, 공용화할 두 번째 사례가 없다.

## 무엇을 바꿨나

`skills/adopt/` 안에서:

- `ROLES.refuter` 선언 — inputs 7, reads 2, judgments 3, `returns: refutationResult`.
  브리프는 이제 `node <skill-root>/scripts/skill-rails/run.mjs role --skill <skill-root> --role refuter`
  의 출력이다. 생산자가 저작하지 않으므로 좁힐 수 없다.
- `TEMPLATES.refutationResult` 와 `templates/refutation-result.md` — coverage·findings·verdict·uncertainty.
  `coverage` 가 「preserved initial coverage」의 운반자다. `revise` 분기는 `reinvoke: null` 이라 런타임이
  직전 입력을 폐기하므로, 산문만으로는 교정 너머로 넘길 수 없던 값이다.
- `semantic-refutation` 의 두 분기가 `READ references/refuter-role.md` → `DISPATCH refuter` → `WAIT` 으로 끝난다.
  `revise` 의 `ROUTE:adopt` 와 둘째 `RUN` 은 사라졌다(재검사 범위는 역할 계약이 갖는다).
- `refutation.state` 가 `decided` lane 으로. Verify 의 반환된 판정과 같은 종류이며, 이 변경으로 adopt 의
  `render --stats` judgment points 는 0 이 된다.
- guard `approval-precedes-refutation` — route 가 `setup.unmanaged`, 승인이 `approve`, 반증이 `clear` 가 아닐 때 BLOCK.
  `acceptsUnknown` 에 두 필드를 둔 것이 핵심이다: 빠지면 `checkReads` 가 needs 를 가진 BLOCK 을 내고 seal 이 도로 생긴다.
- `DECLARATIONS.semantic_refutation` 에서 입력·제외 열거 삭제, `references/workflow.md` step 7 의 같은 열거 삭제,
  `body.md` 의 두 문단을 새 `## role: refuter` 로 이관, `stage: adoption` 의 `Why:` 를 guard 가 집행하게 된 문장에서
  실제 이유(하나의 확인이 전체 쓰기를 구속한다)로 교체.

횡단 수정 하나 — 역할 브리프를 건네라는 지시가 생성물 어디에도 없었다. `verify` 셋과 `arch` 하나의 기존
`DISPATCH` 앞에 `READ <role>Contract` 를 넣고, stub 이던 `verify/references/{verifier,auditor,retrospector}-role.md`
를 실제 전달 계약으로 바꾸고, `arch/references/channel-verifier-role.md` 와 `adopt/references/refuter-role.md` 를
신설했다. 새 상태·산문 조항은 0 이다.

커밋 전 독립 검증이 이 이식에서 결함 하나를 잡았다. 처음에는 계약을 `ARTIFACTS` 로 선언하고
`READ { artifact }` 로 열었는데, 그러면 그 경로가 Decision 의 `stage_artifacts[].path` 가 되고
생성 `SKILL.md` 3항이 그것을 `<project>` 기준으로 해석하라고 말한다 — 문자적 실행자는
`<project>/references/<role>-role.md` 를 찾다 없어서 계약을 못 받는다. 이번 수리의 전제가 바로
그 독자에게 닿지 않는다는 뜻이다. 여섯 자리를 같은 분기가 이미 쓰는 패키지 경로 형태
`READ { path: "references/<role>-role.md" }` 로 바꾸고 계약 `ARTIFACTS` 선언을 걷어냈다.
`work` 의 `reviewerContract` 는 P2 이후 같은 잠복 결함을 갖고 있었으므로 함께 고쳤다 — 다만 그
선언은 obligation ledger 가 좌표로 붙들고 있어 지우는 대신 reader 를 `role.reviewer` 하나로 좁혔다.
`projectStageArtifacts` 는 `stage.`/`guard.` reader 만 투영하므로 잘못된 project 해석은 사라지고
migration provenance 는 그대로 남는다. arch 의 `channel-verifier` 는 `inputs`·`reads`·`judgments` 가
비어 있는데 새 계약 문장이 「나열된 입력만 첨부하라」고 말해 충돌했으므로 세 필드를 채웠다.

## 두 실패 경로 커버

**브리프 축소 — 닫힌다.** `renderRole`(`api.mjs:167-183`)이 `inputs/reads/effects/judgments` 와 반환 템플릿을
spec 에서 출력한다. `arch-verification-channel-surface-and-required-channel-columns` 가 `inputs` 배열에 서 있는 한
브리프에서 지울 수 없다.

**중단 후 재개 — 관측된 형태는 닫힌다.** 개정 후 같은 순서를 걸으면: 호출 1 의 `approve` 는 새 guard 에 걸려
BLOCK 이고, guard 정지는 `needs: []` 이므로 `reinvokeFor("BLOCK", [], [])` 가 `null` 을 내 continuation 이 만들어지지
않는다. 호출 2 는 아무것도 상속하지 않고 `approval.action` 이 UNKNOWN 이라 exclusive table 의 fallback `prepare` 로
떨어져 REPORT→ASK 한다. 소유자가 제안서를 본다.

**닫히지 않는 잔여 — 명시한다.** 같은 호출에 `approve` 와 `clear` 를 함께 공급하면 guard 는 트지 않는다.
승인 전 쓰기 0 이 DD-102·DD-108·DD-109 의 결론이므로 재개 세션과 생신 진입을 가르는 디스크 사실은 존재할 수 없다.
이 라운드는 「재개 후 무단 쓰기가 기계로 막힌다」를 약속하지 않는다. 약속하는 것은
「승인이 다른 질문에 얹혀 조용히 넘어가지 않는다」까지다.

## 실행 증거 — 빌드와 검사

- 공식 Skill Rails v0.4.3 builder 로 아홉 P2 패키지를 재빌드했다. fixture 결과: adopt 13/13, arch 54/54,
  design 20/20, direct 29/29, principles 10/10, product 19/19, resume 52/52, verify 28/28, work 75/75,
  mismatches 전부 0, `deterministic_repeats` 200.
- 아홉 패키지의 `runtime_hash`(`sha256:c871a427…`)와 `validator_hash`(`sha256:07ae1f97…`)는 동일하고
  0.24.0 과 같다. runtime 0.3.6 은 바뀌지 않았다.
- `scripts/repository-invariants.test.js` 단독: 21/21 pass, fail 0, duration 2,711.9641 ms.

**완료 게이트 전체 (`node --test "scripts/*.test.js" "skills/**/*.test.mjs"`), F1·F2 수리 후 1회:**

```
ℹ tests 588
ℹ suites 0
ℹ pass 588
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1434132.5386
EXIT=0
```

실패 0건. **Gate A 는 이 실행 안에서 함께 돌았다** —
`✔ gate A feeds every canon-reserved journal line to the deployed parser (21198.1982ms)`.
별도 명령이 아니며(protocol §8 2항), 그 안의 `jmp gate A — live Adopt Decision projection bytes to parser`
(`scripts/project-state.test.js:993`)가 이번에 `--decided` 로 바꾼 바로 그 호출의 Decision 투영 byte 를
배포 parser 에 먹인다. 즉 Gate A 는 이 변경을 직접 걷는다.

## 실행 증거 — 관측된 실패 경로를 그대로 걸었다

빈 git 저장소와 프로젝트 밖 trace-dir 로, Fable 이 소스에서 세운 재현 경로를 그대로 실행했다.

```
호출 1  --decided approval.action=approve            (반증값 없음)
  status=BLOCK  guard=approval-precedes-refutation  stage/row=None/None
  needs=[]      reinvoke=None                        effects=[]

호출 2  같은 --run-id, --decided refutation.state=clear
  decided={'refutation.state': 'clear'}              ← approval.action 이 상속되지 않았다
  status=ASK    stage/row=adoption/prepare           effects=[REPORT, ASK]
```

`needs=[]` 이라 `reinvokeFor("BLOCK", [], [])` 가 `null` 을 냈고, 그래서 continuation seal 이 만들어지지
않았다. 다음 호출이 승인을 물려받지 못하고 쓰기 없는 제안서와 그 질문으로 떨어진다. 소유자가 본 장면
(「이미 어떤 설정이 활성화되어 곧바로 기록으로」)은 이 순서로는 더 이상 성립하지 않는다.

정상 경로도 확인했다.

```
--decided refutation.state=pending
  status=WAIT  template=refutationResult
  effects=[READ(references/workflow.md), RUN, RUN, RUN, READ(references/refuter-role.md), DISPATCH(refuter), WAIT]
  stage_artifacts=[]

--decided refutation.state=clear --decided approval.action=approve
  status=DONE  stage/row=adoption/approve
  verbs=[WRITE×7, RUN, WRITE, WRITE, RUN, RUN, COMMIT, RUN, WRITE, COMMIT, REPORT, DONE]

run.mjs role --skill <adopt> --role refuter
  role: refuter / inputs: 7항 / reads: 2항 / judgments: ["clear","revise","blocked"] / ## role: refuter
```

브리프는 spec 에서 렌더되고, 승인 게이트는 그대로 열리며, 기존 쓰기 계획은 바뀌지 않았다.
같은 호출에 두 값을 함께 주는 잔여 경로는 열려 있다 — 이 라운드는 그것을 막는다고 약속하지 않는다.

## 남은 한계

- **gate B 미실행.** 이번 변경은 반증 게이트를 바꾸므로 verification contract 변경에 해당한다.
  gate B 는 자동 실행에 얹혀 가지 않으며 손으로 한 번 통과시켜야 한다. 현재 상태는 `unverified` 다.
- **실사용 미검증.** matrix §3.24 의 실행 항목은 여전히 미검증이고, 이번 변경이 더한 (i)(j)(k) 도 미검증이다.
  공식 원격 Claude/Codex 설치와 실제 Adopt 실행은 하지 않았다.
- **역할 브리프 전달의 실발동 미측정.** 생성 `SKILL.md` 는 `enter` 와 `stage` 만 이름 짓는다.
  이번 `READ <role>Contract` 는 계약 파일을 Decision 의 effect 로 올려 놓지만, 실행자가 그 명령을 실제로
  돌리는지는 clean 세션 관찰로만 판정된다. 미실측.
- **`skills/arch/fixtures/source/generate-scenarios.mjs` 는 현재 `spec.mjs` 보다 낡았다.** 이번 라운드에서
  그것을 돌리면 12개 fixture 기대가 현재 effect 열과 어긋난다(RUN 효과 다수 누락). 이번 변경 이전부터 있던
  드리프트라 손대지 않았고, `scenarios.json` 을 직접 갱신했다. 별도 scope 로 남긴다.
- **Skill Rails 두 항목은 외부 owner 사안이라 구현하지 않았다.** (1) after-input seal 이 `decision.needs` 밖
  필드까지 봉인한다(`api.mjs:256`) — 좁히면 이번 guard 없이도 같은 누수가 닫힌다. (2) 생성 지침에
  「DISPATCH 효과는 `role` 명령 출력을 verbatim 으로 브리핑한다」 한 문장 — 들어오면 이번 `READ` 넷은 삭제 가능하다.
- **이월(관찰 등급, 이번에 고치지 않음).** (1) 반증자 `judgments` 가 판정을 반환하는데 DD-106 의 진전 벽
  (「unchanged root 는 진전이 아니다 → blocked」)은 stage Judgment 에만 있고 역할 브리프에는 없다 —
  판정 권위가 둘이다. 잘못된 쓰기 경로는 `clear` 뿐이고 `clear` 는 반증자만 내므로 비차단.
  다음 라운드에 그 한 문장을 역할로 옮기거나 역할을 findings-only 로 한다. (2) `WAIT` 뒤 재호출 지시의
  긴장은 P2 공용 형태이므로 Skill Rails 관찰 항목에 더한다.
- **`_ko` 우선 검토 미수행.** declared pair 두 쌍(`design`, `design-decisions`)은 같은 변경 안에서 양쪽을 함께 썼다.
  소유자 리뷰는 이 보고 이후다.

## 감사 지침 §5 종료 조건 평가

- **규칙 충돌·소실 경로 클래스 소견: 0.** 이번 변경이 닫은 것은 조합 결함 하나(생산자 브리프 × `RUN` × 산문 계약)와
  누수 하나(seal 범위 × 승인 lane)이며, 새 충돌은 만들지 않았다.
- **남은 소견은 전부 「양갈래 독해의 단일화」 또는 관찰 등급이다** — arch fixture 생성기 드리프트(관찰),
  Skill Rails 두 항목(외부 owner), capability 도출 선별 기준 부재(계약이 결정하지 못한다 — 판정만, 수리 없음).
- **수리 조항: 이 라운드는 수리를 만들었으므로 재감사 대상이다.** 변경분 재감사는 수행하지 않았다 — `unverified`.
- **회로 차단기**: 같은 문장을 세 번째 고친 자리 없음, 앞 라운드 수리를 되돌린 자리 없음.
