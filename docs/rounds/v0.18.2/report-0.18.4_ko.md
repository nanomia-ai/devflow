# v0.18.4 수리 보고 — 능력이 제 이름을 지키고, 능력 하나의 색인이 혼자 서고, 일곱 보고가 사람에게 말한다

날짜: 2026-08-20
비교 기준: `d406efa` (v0.18.3 착지 시점)
착수 테스트: 123/123 · 종료 테스트: **126/126**

유지보수 프로토콜 §5 에 따라 별도 폴더 없이 직전 라운드 안에 기록한다. 무엇이 바뀌었는지는
CHANGELOG `0.18.4` 항목이 소유한다. 이 문서는 **어떻게 알았고 무엇이 남았는가**만 담는다.

## 왜 이 라운드가 시작됐나

셋 다 **실측으로 확인된 결함**이고, 첫째는 소유자의 실제 프로젝트에서 바로 물린다 — 소유자의
프로젝트는 전부 한국어다. 0.18.3 이 도구와 정본의 약속을 맞춘 자리 둘을 고쳤는데, 같은 접합부에
아직 둘이 더 있었다.

## 수리 1 — 한국어 능력 이름이면 캡슐이 조용히 사라진다

정본(`baseline-predicates.md:22-25`)은 능력 문서 파일명을 *"use the product.md capability name
exactly as split would use it in the tree; invent no separate slug normalization"* 으로 정하고,
캡슐 폴더는 그 파일명을 그대로 잇는다(`:126-127`). **그런데 도구는 부모 폴더 이름을 ASCII
소문자·숫자·하이픈으로만 받았고, 전역 열거는 안 맞는 폴더를 오류도 없이 `continue` 했다.**

**착수 상태 실측** (fixture: `02-결제/K-001-settlement.md` 하나만 디스크에 둔 상태)

```
--- BEFORE (HEAD d406efa): project --capability 2 ---
project: capsules=0 bodies=0 form=full index-bytes=0/24576 emitted=0
exit=0
--- BEFORE (HEAD d406efa): validate ---
validate: valid=0 markers=0 disputes=0 warnings=0
exit=0
```

**`exit=0` 이다.** 세션은 오류를 보지 못한 채 「캡슐 없음」으로 진행하고, 디스크에 있는 지식이
아무 데도 안 닿는다. 조용한 자료 소실 — 감사 지침 §6 의 1계층이다.

**수리 뒤 같은 fixture**

```
--- AFTER: project --capability 2 ---
project: capsules=1 bodies=0 form=full index-bytes=316/24576 emitted=1
projection: {"path":"devflow/project/capabilities/02-결제/K-001-settlement.md","heading":"# 정산 배치의 멱등 규칙 · 정산 재실행을 건드릴 때","about":"정산, 멱등키, 재시도","changed":null,"lines":6,"bytes":241,"markers":{"synthesis":0,"code":1,"conjecture":0,"dispute":0},"disputes":[]}
exit=0
--- AFTER: validate ---
validate: valid=1 markers=1 disputes=0 warnings=0
exit=0
```

| 좌표 | before | after |
|---|---|---|
| `scripts/project-knowledge.mjs:10` | `/^(?<number>0*[1-9][0-9]*)-(?<name>[a-z0-9]+(?:-[a-z0-9]+)*)$/` | `/^(?<number>0*[1-9][0-9]*)-(?<name>.+)$/` (앞에 이유 주석 3줄) |
| `scripts/project-knowledge.mjs:239` | `capsule parent must be NN-ascii-name` | `capsule parent folder must be <number>-<name>` |

`K-NNN-<topic>.md` 파일명 문법은 **손대지 않았다** — 그건 캡슐 파일 자신의 이름이고 ASCII slug
계약이 유효하다. 능력 선택은 이미 정본대로 첫 토큰의 정수값만 쓴다.

## 수리 2 — `--capability` 가 파싱 뒤에 걸려 무관한 능력의 결함이 현재 작업을 막는다

정본은 *"Call the index projection narrowed to one capability"* 라고 하고 `project --capability
<number>` 를 정본 호출로 고정한다. 그런데 `loadCapsules` 는 **모든 폴더의 파일을 먼저 파싱**하고
그 뒤에야 능력 번호로 걸렀다.

**착수 상태 실측** (fixture: 02 는 유효, 09 의 `Source basis` 좌표만 낡음)

```
--- BEFORE — HEAD d406efa ---
--- project --capability 2  (한국어 폴더 02-결제, 유효한 캡슐) ---
error: devflow/project/capabilities/09-shipping/K-001-carrier.md: Source basis 1: coordinate exceeds 3 source lines (docs/source.md:9999)
exit=1
```

02 의 헤더 투영이 한 줄도 안 나온다. 정본이 투영·선택의 유일한 수단을 이 도구로 고정했으므로
**손으로 우회할 수도 없다.**

**수리 뒤 같은 fixture** — 02 는 살고, 결함의 주인인 09 와 인자 없는 `validate` 는 그대로 잡는다.

```
--- AFTER — 두 능력 모두 디스크에 있고 09 가 낡은 좌표를 든 상태 ---
--- project --capability 2 ---
project: capsules=1 bodies=0 form=full index-bytes=316/24576 emitted=1
projection: {"path":"devflow/project/capabilities/02-결제/K-001-settlement.md", … }
exit=0
--- disputes --capability 2 ---
disputes: capsules=1 items=0 bodies=0 form=full index-bytes=0/24576 emitted=0
exit=0
--- project --capability 9  (결함을 실제로 든 능력) ---
error: …/09-shipping/K-001-carrier.md: Source basis 1: coordinate exceeds 3 source lines (docs/source.md:9999)
exit=1
--- validate  (인자 없음 — 전역 형식 검사) ---
error: …/09-shipping/K-001-carrier.md: Source basis 1: coordinate exceeds 3 source lines (docs/source.md:9999)
exit=1
--- select --path  (정확 경로, 경계 그대로) ---
select: candidates=1 opened=1 lines=6/240 bytes=241/24576 approved=0
exit=0
```

| 좌표 | before | after |
|---|---|---|
| `project-knowledge.mjs:280` | `capsulePaths(root)` | `capsulePaths(root, capability)` — 경로 열거 단계에서 번호로 거른다 (앞에 이유 주석 4줄) |
| `project-knowledge.mjs:286` | `if (!entry.isDirectory() \|\| !CAPABILITY_NAME.test(name)) continue;` | 폴더 판정 → 번호 추출 → `capability` 불일치면 `continue` |
| `project-knowledge.mjs:312` | `loadCapsules(root, rawPaths = [])` | `loadCapsules(root, rawPaths = [], capability)` |
| `project-knowledge.mjs:462·470` | `loadCapsules(options.root, options.paths)` | `…, options.capability)` — `project` 와 `disputes` 만 |

**`validate` 는 통째로 손대지 않았다.** 인자 없는 `validate` 가 전역 형식 검사를 유지하는 것이
전역 결함을 잡는 자리다. `select` 는 `--path` 정확 경로만 검증하는 기존 경계 그대로다.

## 수리 3 — 소유자에게 나가는 보고 문장 일곱

소유자 원문(COMPASS 4번): *"이것은 니가 알아보기 위한 말이지 아무런 이해도가 없는 내가 이해할 수
있는 말이 아니야."* 자리마다 **기계가 읽는 토큰인가 사람이 읽는 문장인가**를 판정했다.

| # | 좌표 (en) | 판정 | after |
|---|---|---|---|
| 1 | `resume/SKILL.md:161` | **사람** — resume 라우팅 표의 행을 가리키는 내부 용어이고 아무것도 파싱하지 않는다 | `<every other unit that could be started now for the same reason \| none>` |
| 2 | `work/SKILL.md:242` | **사람** — reviewer 투영 `design: baseline missing — …` 은 **별개 리터럴**이고 그대로 뒀다 | `no capability document for <number> — nothing on disk describes that capability, so the planning documents and this card carry the work` |
| 3 | `work/SKILL.md:247` | **사람** — verify 의 `baseline no-op: legacy v0.10 …` 과 별개 문자열이다 | `<path> is a capability document in the earlier shape, so it stays unread until it is migrated — the planning documents and this card carry the work` |
| 4 | `work/SKILL.md:290` | **혼합** — 틀은 work 소유(사람)이나 `fresh\|hypothesis\|missing` 은 정본 상태 표기 | `capability document verified <Verified at>, design <fresh\|hypothesis\|missing>, verification <fresh\|hypothesis\|missing>, <M> cards changed since — fresh means its inputs have not moved, hypothesis means it is reconfirmed before use, and missing means there is no such statement` |
| 5 | `verify/SKILL.md:265` | **기계** — 정본 `registered consumers: unknown — provider baseline no-op: <same reason>` 가 이 문자열을 이름으로 인용한다 | `baseline no-op: <reason> — this capability document was left exactly as it stood and the closure went ahead` |
| 6 | `verify/SKILL.md:292` | **기계** — `baseline-predicates.md:653` 이 이 줄을 정본으로 고정한다 | `registered consumers: <number (status), ... \| none> — these are the other capabilities built on this one, hypothesis marks one to reconfirm before trusting it, and nothing in them changed here` |
| 7 | `verify/SKILL.md:391` | **혼합** — `repair lineage` 는 §9 고정 용어이자 verify.md 필드 이름이다. 용어를 남기고 사람 말을 덧붙였다 | `repair lineage cannot be determined — which earlier failure this one continues cannot be told, so the run stops here for a person to decide` |

**넷(1·2·3·7의 뒷부분)은 다시 썼고, 셋(4·5·6)은 리터럴 머리를 그대로 두고 사람용 설명을 곁들였다.**
ko 를 먼저 고치고 영문을 맞췄다(DD-16). ko 좌표는 `resume/SKILL_ko.md:126` ·
`work/SKILL_ko.md:199·203·236` · `verify/SKILL_ko.md:219·240·321` 이다.

**시험 단정 셋을 갱신하되 지키던 성질은 유지했다.**

| 시험 | 지키던 성질 | 갱신 |
|---|---|---|
| `repository-invariants.test.js:1570` | resume 보고가 고른 걸음 **말고도** 대안을 전부 이름 댄다 | 새 문안으로 같은 자리를 단정 |
| `:1061` | 문서 부재를 보고하고 **멈추지 않고** Layer 0 와 카드로 계속한다 | 앞부분만 새 문안, `continue from Layer 0 and the card` 는 그대로 |
| `:983` | 구형 형태를 보고하고 **본문을 열지 않는다** | 앞부분만 새 문안, `open no body` 는 그대로 |

`:984`(verify 의 legacy 줄)와 `:825·:1026·:1034`(정본 `baseline-predicates.md` 단정)는 **건드리지
않았고 그대로 통과**한다.

## 더한 시험 셋 (`scripts/project-knowledge.test.js`)

```
✔ a capability folder keeps the product's own capability name, and only its number is read (380.2368ms)
✔ folders whose numbers compare equal as integers are one capability (213.1857ms)
✔ one capability's projection survives another capability's malformed capsule (349.2349ms)
ℹ tests 27
ℹ pass 27
ℹ fail 0
```

- 첫째는 `02-결제` · `03-order flow`(공백) · `04-Billing`(대문자) 셋을 각각 정상 투영한다.
- 둘째는 **정수로 같은 `02`/`2` 폴더의 공존**을 못 박는다 — K 번호가 다르면 **한 능력으로 합쳐져
  둘 다 나오고**(`capsules=2`), 같으면 `duplicate capsule number` 로 거절된다. 즉 폴더 두 개가
  조용히 서로를 가리지 않는다.
- 셋째는 09 의 낡은 좌표가 있어도 `project`·`disputes --capability 2` 가 살고, 결함의 주인인
  `--capability 9` 와 인자 없는 `validate` 는 여전히 잡는다는 것을 못 박는다.

## `fresh` 리터럴 전수 — 보고만 한다 (고치지 않았다)

소견의 요지: `Design head` 가 증명하는 것은 「입력이 안 움직였다」뿐인데 리뷰어는 그것을
「도전하지 않는다」로 소비한다. **낱말을 바꾸는 것이 리터럴 계약을 건드리므로 이번엔 고치지 않았다.**

**상태 리터럴로서의 `fresh` — 배포 영문 9자리**

| 파일 | 줄 | 성격 |
|---|---|---|
| `principles/baseline-predicates.md` | 406 · 410 | 신선도 판정을 정의하는 산문 |
| `principles/baseline-predicates.md` | 586 | **`design: fresh` — reviewer 투영 토큰** |
| `principles/baseline-predicates.md` | 637 | 소비자 상태 `fresh` 의 참 조건 |
| `verify/SKILL.md` | 292 | 정본의 `fresh`·`hypothesis`·`unknown` 판정을 이름으로 인용 |
| `work/reviewer.md` | 7 | **역할 계약이 `design: fresh` 를 실제로 소비하는 자리** |
| `work/SKILL.md` | 267 · 273 | 신선/가설 판정 산문 |
| `work/SKILL.md` | 292–293 | 보고 템플릿 + 이번에 더한 설명 |

**ko 짝 9자리** — `baseline-predicates_ko.md:342·346·485·527` · `verify/SKILL_ko.md:240` ·
`work/reviewer_ko.md:5` · `work/SKILL_ko.md:219·224·238–239`.

**이동 규모: 배포 18자리(파일 쌍 4개) + 시험 단정 1건**(`repository-invariants.test.js:1024`).
여기에 유지보수 프로토콜 §9 판단이 하나 붙는다 — 아래 소견 참조.

**쓸어 담으면 안 되는 것 — 보통 영어 낱말로 쓰인 `fresh` 6자리**: `verify/SKILL.md:400·493·518`
와 `work/SKILL.md:178`(전부 *"a clean subagent/fresh session"*), 시험 문자열 `:1455·:1667`
(*"a fresh change request"*). 기계적 치환은 이 여섯을 함께 망가뜨린다.

`신선도`(freshness, 개념 이름)는 이와 별개로 ko 14자리에 더 있고, `freshness` 는 §9 고정 용어라
**상태 낱말만 바꾸면 개념 이름과 갈라진다** — 바꾼다면 그 결정도 같이 해야 한다.

## 검증

1. **기계 검사** — `node --test "scripts/*.test.js"`: **126/126 통과** (착수 123 + 신규 3).
2. **실행 확인** — 수리 1·2 를 fixture 로 만들어 HEAD 판본(`git show HEAD:…`)과 수리 판본을 같은
   디스크 상태에 걸고 출력을 위에 그대로 실었다. 텍스트 대조가 아니라 실행 대조다.
3. **ko↔en 구조 동형성·배포물 한글 0** — 시험이 소유하고 통과했다. 사람용 문장에서 `v0.10` 을
   일부러 뺐다: 판본 번호는 읽는 사람에게 아무 뜻이 없고, `machineFigures` 의 버전 배열이 ko·en
   1:1 이어야 하기 때문이다.
4. **감사 지침 §5 종료 조건 평가**
   - 규칙 충돌·소실 경로 클래스의 **새** 소견: **0**. (수리 1 자신이 소실 경로 클래스였고 닫혔다.)
   - 남은 소견은 전부 아래 「울타리 밖」의 관찰 등급이다.
   - 수리는 전부 수렴형이다 — 정규식 축소, 필터 위치 이동, 문안 교체. 해석을 새로 여는 문장 0.
   - **종료 조건 충족.** 동의어를 바꾸는 새 라운드를 열지 않는다.
5. **회로 차단기: 하나도 걸리지 않았다.** 같은 문장을 세 번째 고친 적 없고, 이전 수리를 되돌린
   적 없고, 모든 소견에 원문 좌표와 실행 출력이 붙어 있다.
6. **결정 행 이동: 0.** 셋 다 정본이 이미 말한 것을 구현이 지키지 못한 자리이거나 사람용 표현
   문제다. DD-76·DD-77 의 내용은 그대로다.
7. **매트릭스: 새 행 없음.** H11·A5(도메인 진입)와 A1 이 이미 덮는 자리이고, 수리 1·2 는 그 칸이
   한국어 프로젝트에서 **실제로 작동하게** 만든 것이지 새 사용 형태가 아니다.
8. **Codex 로컬 스냅숏은 갱신하지 않았다.** 설치기를 돌리지 않았고 커밋도 하지 않았다 — 둘 다
   코디네이터 몫이다.

## 울타리 밖 소견 (고치지 않았다)

1. **`verify/SKILL.md:260` 의 `baseline no-op: legacy v0.10 migration pending`** — 이번에 고친
   일곱과 같은 어휘 가족이고 똑같이 사람에게 나가는데, 지정된 일곱에 없어서 그대로 뒀다.
   지금 `:265` 는 사람 말을 달았고 `:260` 은 안 달았다 — 같은 화면에서 둘이 다르게 보인다.
2. **정본 `baseline-predicates.md` 는 여전히 맨 리터럴만 말한다** (`:653` 의
   `registered consumers: …`, `:691` 의 `baseline no-op: <reason>`). 정본은 AI 만 읽으므로
   사람 결함은 아니지만, 스킬과 정본의 문안 길이가 이제 다르다. 정본을 따라가게 할지는 결정거리다.
3. **`fresh` 는 유지보수 프로토콜 §9 고정 용어표에 행이 없다.** 형제인 `hypothesis` 와 개념
   이름 `freshness` 는 행이 있는데, 배포 18자리를 떠받치는 상태 리터럴 자신은 잠겨 있지 않다.
4. **`validate --capability N` 은 여전히 전 폴더를 판다.** `validate` 를 통째로 안 건드린 결과다.
   인자 없는 `validate` 의 전역성이 요구사항이었고 `project`·`disputes` 만 지정됐기 때문인데,
   `validate --capability` 를 부른 사람은 좁혀질 것으로 기대할 수 있다.

## 불확실했던 판단과 고른 쪽

| 판단 | 고른 쪽 | 이유 |
|---|---|---|
| 정본(`baseline-predicates{,_ko}.md`)도 같이 고칠까 | **아니오** | 울타리 밖. 정본이 리터럴의 주인이므로 스킬만 바꾸면 갈라지는 위험이 있으나, 스킬 쪽은 **리터럴 머리를 보존**하는 방식으로 고쳐 갈라짐을 만들지 않았다 |
| resume 에서 `unit`/`단위` 를 `capability`/`능력` 으로 바꿀까 | **아니오** | 골조(`01-foundation`)도 단위다. 낱말을 좁히면 보고 대상이 실제로 줄어든다 — 표현 개선이 행동 변경이 된다 |
| work:242 에 「지식 문서」라고 쓸까 | **아니오** | §9 가 *"full name is `capability document`, only short form is `baseline`"* 로 잠갔다. 두 번째 영어 이름을 만들지 않는다 |
| 사람용 문장에 `v0.10` 을 넣을까 | **아니오** | 읽는 사람에게 뜻이 없고, ko·en 버전 배열 1:1 검사를 흔든다 |
| `validate` 도 `--capability` 로 좁힐까 | **아니오** | 인자 없는 전역 검사가 요구사항이었고, 좁히는 쪽은 지정되지 않았다. 소견 4로 남긴다 |
| 정수로 같은 `02`/`2` 폴더를 오류로 만들까 | **아니오** | 정본이 「번호를 정수로 비교해 같으면 형식 이상」이라고 말하는 대상은 **능력 문서 파일**이고 캡슐 폴더가 아니다. 현재 동작(한 능력으로 합침 · K 번호 충돌 시 거절)을 **시험으로 못 박기만** 했다 |

## 일부러 안 한 것

- `K-NNN-<topic>` ASCII slug 계약 — 유효하므로 그대로.
- reviewer 투영 리터럴 `design: baseline missing — judge from the card and supplied shared
  documents` — 역할 계약이 소비하는 기계 토큰이므로 그대로.
- `fresh` 낱말 자체 — 전수만 하고 보고만 했다.
- 커밋·설치기 실행 — 코디네이터 몫이다.

## 남은 한계

- **실사용 미검증.** 실제 한국어 프로젝트에서 `product → arch → split → work` 를 걸어 `02-결제`
  캡슐이 work 세션의 손에 실제로 닿는 것까지는 보지 못했다. fixture 실행까지가 이 라운드의 증거다.
- **사람용 문안의 이해도는 아직 텍스트 판단이다.** 일곱 문장이 「처음 보는 사람이 다음 행동을
  안다」를 실제로 만족하는지는 소유자가 한 번 읽어 봐야 확정된다.
- 0.18.3 의 한계(정본 토큰 무게, 맹검 이해도 재측정 미실행)는 그대로 이월된다.
