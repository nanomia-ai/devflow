# v0.19.0 국면 5B 통합 원천 수리 계획

기준: `7ca411f9a73502fbe762f702b50aa0c84905d021` · manifest `0.18.9` · 계획 작성 전 working tree clean

## 1. 왜 이 라운드를 하는가

두 차례의 실사용에 가까운 실행은 서로 다른 시점을 보여 줬다. 첫 실행은 구조적인 누락이 많았고,
그 증거로 5A를 구현했다. 두 번째 긴 실행은 5A와 그 뒤의 `7ca411f`를 보는 **current-skill before
기준선**이다. 여러 핵심 흐름이 실제로 작동했지만, 그 실행은 5B 행동 수리 전에 시작됐으므로
5B-after나 합격 증거가 아니다. 이번 라운드는 그 실행을 재개하지 않고, 이미 수확된 장면과 현재
source가 함께 가리키는 결손을 한 번의 통합 수리로 닫는다.

중심 문제는 개별 문장 열네 개가 아니다. 네 연결이 끝까지 이어지지 않은 것이다.

1. 실행 사실이 기존 영속 소유자에 기계가 다시 읽을 수 있는 형태로 착지하지 않는다.
2. 경로·Git object·빈 목록·원 요청의 정체성을 한 번 정규화하지 않아 소비자가 사실을 잃거나
   발명한다.
3. split에서 이미 승인했거나 상태 도구가 이미 계산한 값이 실제 reviewer·work·verify에 도달하지
   않는다.
4. 한 실행에서 생긴 한 실패 장면을 여러 사건으로 세거나 같은 실패 사다리에서 사람을 여러 번
   부른다.

따라서 특정 함수에 예외 조건을 계속 붙이지 않는다. 기존 소유자와 writer는 유지하고, 위 네 연결의
누락된 producer→consumer edge만 만든다. 새 PR 계층, 새 work-note, 새 journal kind, 새 capability
writer, 새 origin passenger는 만들지 않는다.

## 2. before 증거의 경계

### 2.1 이미 작동했고 회귀시키지 않을 것

- product→arch/adopt→split→work가 여러 카드와 Git 경계를 만들고 중단 뒤 재개했다.
- task 완료와 capability·product 판정은 실제로 분리됐다. task가 끝났어도 실제 채널 검증 실패는
  capability를 `unverified`로 남겼다.
- 다른 capability에 대한 기존 `capability note` producer와 parser가 작동했다. 그 capability의
  다음 closure가 수확하는 기존 경로는 보존한다.
- capability closure, 상위 문서 환류, Failure history→repair routing, audit/retrospective event,
  product-verification-running marker가 Git 경계로 남았다.
- clean reviewer는 실제 제품 결함을 찾았다. 결함은 reviewer 역할 자체가 아니라 승인된 입력이
  전달되지 않은 데 있었다.
- 5A의 정적 관문과 `7ca411f`의 두 수리, 즉 same-source marker identity 복원과 remote-finalizing
  claimed-card HEAD byte 판정은 회귀 봉인 대상이다.

### 2.2 실행과 source가 함께 확정한 잔여 결함

HANDOFF §0.5의 A·B·C, D-1~D-7, E-1~E-3 전부다. 각 항목은 아래 §4에서 실패 장면, 현재 owner,
없는 edge, red와 기대 결과를 1:1로 연결한다. 이것을 “5A 전체 실패”라고 부르지 않고, 두 번째
실행을 “5B 합격”이라고도 부르지 않는다.

### 2.3 아직 결함으로 판정하지 않을 관찰

- `arch.md`의 의미 없는 head-only 변화가 모든 capability의 `Design head`를 움직이는 현상
- 실제 동시 claim/push 경합
- 자연 발생 30장 이상 규모와 비-Windows 동작
- 두 중단 제품의 완전한 product pass와 5B-after

첫 항목은 현장 관찰로 유지한다. cited ADR hash 방식은 이미 기각됐고, 마지막 Fable 감사가 더
단순하고 안전한 상위 구조를 실제로 입증하지 않는 한 이번 구현에 섞지 않는다. 나머지는
`unverified`다.

## 3. 통합 수리의 구조

### 3.1 task attempt envelope

카드의 Intent·Forbidden·Completion signal, 해당 task의 exact diff, Progress log의 local signal과
review 결과, 그 바이트를 담은 containing commit이 한 시도의 복원 가능한 증거다. PR 기능이 아니라
기존 Git·카드 계약의 완결이다. 외부 자동화는 이 묶음만으로 task/capability/product 판정과 남은
미확인을 구분한다.

### 3.2 한 번의 identity 판정, fail closed

계획 필드와 실행 기록, Git object와 hex 모양, waiting file과 열린 folder, 빈 목록과 `none` 표기,
카드 경로와 원 요청을 각 소비자마다 다시 추측하지 않는다. 상태 도구가 정규화·해결하고 정확히
하나로 결정되지 않으면 `unknown`/`unresolved`와 이유를 내며 다른 범위를 사실처럼 조회하지 않는다.

### 3.3 승인·계산된 값의 끝까지 투영

split이 승인한 exact `Read first`, 상태 도구가 계산한 revision, 각 current card의 origin과 sibling은
다음 독자에게 실제 경로로 전달한다. 대상이 0개면 저장소 전체를 대신 조회하지 않는다.

### 3.4 한 실행은 한 causal scene, 사람은 한 경계에서 한 번

review 세 번째 objection과 verify의 channel-unavailable은 정해진 사람 경계로 간다. 한 verifier
run의 동일한 미완료 장면에 딸린 여러 기준은 primary failure 하나와 subordinate signal로 남긴다.
서로 다른 원인은 합치지 않고, root가 실제로 둘 이상이거나 불명확하면 현재 safe stop을 보존한다.

### 3.5 지식·메모리 계층의 보존선

이 계층은 기록을 많이 남기기 위한 저장소가 아니라, 새 AI가 필요한 신뢰 수준과 깊이만 읽고도
올바르게 판단하게 하는 장치다.

- capability 문서는 항상 읽는 작고 안정된 도메인 지도다. 설계 구역은 arch/adopt가 의도·경계·
  개념·불변식·비범위를 쓰고, 검증 구역은 verify가 실제 실행으로 확인한 현재 동작만 쓴다. 두
  writer의 byte 범위와 신뢰 의미를 섞지 않는다.
- capsule은 capability 지도를 비대하게 만들지 않으면서 특정 task가 필요할 때만 여는 깊은
  design knowledge다. exact path, use-when, provenance, 개봉 예산을 보존하고 자동으로 모든 agent에게
  전달하지 않는다.
- 카드 Progress log는 그 task의 실행 사실, `carry:`는 같은 깊이 1 단위의 다음 카드를 틀리게 할
  수 있지만 아직 다른 정본에 착지할 집이 없는 잔여, journal의 capability note는 정해진 writer가
  소비할 capability 간 또는 design 상승 전달이다. 같은 사실을 여러 집에 복제하지 않는다.
- Git은 지나간 판본과 revision anchor를 소유한다. 대화 요약이나 외부 handoff가 이를 대신하지
  않는다.

이번 C·D-7·B 수리는 이 계층을 우회하는 새 메모리를 만드는 것이 아니다. 얇은 카드가 의존하는
현재 capability와 연결된 provider·same-origin sibling·exact Read first·capsule 지식이 기존 단일 owner와 소비 경로에
실제로 닿게 한다. 기술적으로 시험을 통과해도 항상 읽는 문서가 비대해지거나, design과 verified의
신뢰가 섞이거나, capsule body가 무조건 주입되거나, 수명 없는 note가 생기면 실패다.

여기서 작업 경계와 지식 owner 경계는 같지 않다. 한 현실 작업은 여러 capability에 걸칠 수 있지만,
그 작업에서 확인된 각 사실은 수명·신뢰·도메인에 맞는 기존 owner로 올라가고 same-origin/Consumed
paths가 관계를 다시 잇는다.

## 4. 변경 계약과 시험 seam

### A. task 실행·검토 결과의 내부 증거

**실패 장면.** completion signal 실패와 여러 review objection을 거쳐 통과한 카드가 `.done.` 카드와
task commit만으로는 첫 시도 통과와 구별되지 않는다. `work`는 기록된 결과를 재개 때 읽으라고 하지만
canonical producer가 없다.

**배선.** `skills/principles/SKILL{,_ko}.md`의 Commit discipline이 Progress log의 기계 행 네 종류를
한 목록으로 소유한다. 기존 `carry`와 `remote evidence check`에 아래 두 형식을 합치고,
`skills/work/SKILL{,_ko}.md`는 실행할 때 값을 채운다.

```text
YYYY-MM-DDTHH:MM:SSZ completion signal result: verdict: pass | fail | unverified; detail-json: <short JSON string>
YYYY-MM-DDTHH:MM:SSZ review result: verdict: pass | objections | unverified; detail-json: <short JSON string>
```

- local signal과 clean review는 수행할 때마다 각각 한 줄을 append한다. diff가 바뀐 뒤의 새 줄이
  앞선 결과를 대체하되 과거 줄은 지우지 않는다.
- `fail`·`objections` 뒤 코드를 바꾸기 전에는 그 결과 줄과 당시 task diff를 `NN.N wip: ...`
  checkpoint에 함께 싣는다. 최종 `pass`와 clean review는 final task commit에 함께 싣는다.
  신선도는 DD-24대로 **completion input이나 task diff가 바뀌었는가**로 판정한다. commit 전 중단만으로
  결과를 낡았다고 만들지 않는다. 허용된 절차는 결과 뒤 mutation보다 checkpoint를 먼저 만들므로,
  recovery에서 input·diff가 그대로면 그 checkpoint/final commit부터 끝내고, 바뀌었거나 동일성을
  판정할 수 없을 때만 재실행한다.
- 각 결과의 revision anchor는 그 exact machine line을 카드 diff에 **처음 추가한 commit**이다.
  descendant commit도 그 줄을 포함한다는 이유로 anchor가 되지 않는다. fail/objection은 attempt
  checkpoint, 마지막 pass/review는 final task commit이며, pure-Git reader는 카드 history의 line
  introduction commit을 그 시점까지의 **누적 task commit set**과 조인한다. 이 set은 claim 뒤부터
  anchor까지 같은 카드 번호를 가진 canonical `NN.N wip: ...` commit들과 exact final card-title
  commit을 Git 순서로 모은 것이다. 각 commit의 parent patch 중 그 task commit이 실제로 바꾼 exact
  paths를 합쳐 한 attempt diff를 복원하므로, 두 번째 checkpoint의 parent diff에 첫 checkpoint가
  보이지 않아도 증거가 잘리지 않는다. interleaved boundary/design commit은 제목과 owner가 다르므로
  task diff에 섞지 않되 completion input revision으로는 별도 조인한다.
- remote-only 결과는 기존 six-verdict `remote evidence check`와 evidence-wait/finalizing만 쓴다.
  generic completion 줄을 중복 생산하지 않는다. review의 waived/not-applicable은 카드 필드만 소유한다.
- review·사람 disposition 뒤 재실행을 포함해 모든 signal/review가 끝난 다음 `carry:`를 붙인다.
  input이 다시 바뀌면 새 signal/review 뒤 새 final `carry:`를 붙인다. 어느 정상 완료·중단 복구
  경로에서도 final carry 뒤에 다른 machine line을 붙이지 않는다. 이 ordering은 work loop가 소유하고
  red로 봉인한다. 따라서 `carryState()`의 “마지막 Progress 줄” 계약은 유지하며 parser에 예외를
  더하지 않는다.
- 외부 transcript, PR field, commit trailer, `PR_CONTEXT`, PR 생성 기능은 없다.

**직접 소비자.** `work`의 interrupted/final-boundary 복구, `resume`의 해당 route, 카드와 Git만 읽는
외부 도구다. clean reviewer는 Progress log와 과거 결과를 받지 않는다. external reader는 line별
introduction commit, 마지막 anchored signal/review 두 결과, task commit/diff를 조인하며 capability/
product 판정과 혼동하지 않는다.

**red.** 형식 부재, fail 뒤 수정 전에 anchor 없음, unchanged pre-anchor recovery의 불필요한 재실행,
diff 변경 뒤 옛 pass 재사용, line별 first-introduction commit과 두 개 이상 wip의 cumulative task
commit set 조인, interleaved boundary commit 제외, local/remote 중복을 각각
실패시킨다. objection 수정·사람 disposition·remote recovery·final boundary 각각에서 final machine
line이 `carry:`인지 봉인한다. **seal.** 기존 remote six-verdict, one final task commit, Progress
전문을 읽지 않는 기존 resume 경계를 보존한다.

**기대 결과.** 한 task의 실패·이의·미실행·최종 통과가 Git만으로 복원되고, 그 결과가 어느 코드
상태를 본 것인지 containing commit으로 결정된다.

### B. clean review 입력과 세 번째 objection

**실패 장면.** 카드가 공유 구현과 `arch.md`를 exact `Read first`로 승인했지만 reviewer input에서
빠져 speculative objection이 네 번 났다. 또 “3 strikes”가 사람에게 가기 전 자동 4차 review로
읽혔다.

**배선.** `skills/work/SKILL{,_ko}.md`와 `skills/work/reviewer{,_ko}.md`의 동일 input clause에
split-approved `Read first` 중 **현재 존재하는 exact file 전부**를 추가한다. 단,
`devflow/project/capabilities/NN-name/K-NNN-topic.md` 형태의 capsule body는 카드에 적혀 있어도
자동 reviewer 전달에서 제외한다. capsule path는 Progress를 뺀 카드의 `Read first`에 그대로 보이지만,
별도 header·provenance·남은 budget을 합성하거나 reviewer용 두 번째 개봉 경로를 만들지 않는다.
구현에 필요한 capsule body와 한 카드 실행의 개봉 예산은 기존처럼 work의 유일한 capsule gate가
소유한다. reviewer는 split이 승인한 카드 Intent·Forbidden·Completion signal과 non-capsule exact
근거, task diff로 판정한다. 그 계약만으로 판정할 수 없다면 capsule을 몰래 여는 대신 card-contract
objection을 내며, 기존 objection automaton이 처리한다.

review 상태는 다음 하나의 automaton으로 쓴다.

```text
clean review
  ├─ pass → 계속
  ├─ objection 1 또는 2 → 수정 → signal 재실행 → 새 clean review
  └─ objection 3 → 사람 disposition
                     → signal 재실행 → clean final review 정확히 1회
                     → pass면 계속, 새 objection/unverified면 다시 사람
```

횟수는 bullet 수가 아니라 anchored `review result` 사건 수다. 세 번째 objection 뒤 사람의 disposition은
새 machine 형식을 만들지 않고 bounded ordinary Progress entry로 남겨 objection-3 결과와 함께 wip
checkpoint에 anchor한다. recovery는 그 anchored disposition이 있을 때만 signal과 clean final review
한 번을 허용한다. 사람이 답한 뒤 자동 수정·5차 review는 없고 reviewer는 계속 read-only다.

**red.** 두 개의 non-capsule Read first가 reviewer input에 모두 존재, missing path는 발명하지 않음,
capsule body·header·provenance·budget 자동 전달 0개, capsule에만 있는 판정 근거를 reviewer가 발명하지
않고 card-contract objection으로 냄,
objection 3에서 즉시 사람, disposition anchor 전후 중단 복구, disposition 뒤 signal→final review 1회,
새 objection에서 다시 사람을 고정한다. **seal.** reviewer가 구현 경위·Progress log·과거 review
이력은 받지 않고 exact task diff와 기존 design/ADR·승인된 knowledge input만 받는 독립성을 보존한다.

**기대 결과.** reviewer는 승인된 근거를 모르기 때문에 내는 거짓 objection을 줄이면서도 구현자의
설명을 받아 편향되는 일은 없다.

### D. 상태 도구의 일곱 결함

모두 `skills/principles/scripts/project-state.mjs`와 `scripts/project-state.test.js`의 좁은
red→green으로 구현한다. 도구는 계속 read-only·stateless다.

#### D-1. approval freshness

`approvalState()`는 카드 경로에 diff가 있다는 이유만으로 Progress-only append도
`invalid/card-diff`로 만든다. integration의 카드와 current card를 **정확히 한 `## Progress log`
heading 위의 계획 bytes**로 비교한다. 그 아래 append만 다르면 effective, heading 부재·중복이나
Intent/Forbidden/Completion signal/Approval 등 위쪽 변화는 fail closed다. A와 같은 commit에서
고쳐 producer가 즉시 자기 approval을 깨는 상태를 만들지 않는다.

red: staged·unstaged Progress-only effective, 계획 필드 한 byte 변화 invalid, heading 0/2개 invalid.

#### D-2. digest marker

producer는 `git rev-parse HEAD`의 full object ID만 쓴다. `digestLag()`는 object를 commit으로 resolve한
뒤 ancestor를 판정한다.

- `none`: 기존 전체 branch 계산
- resolved ancestor: `<marker>..<integration>`만 계산
- unresolved object: `behind=unknown`, `others=unknown`, `reason=unresolved-object`, history query 0
- resolved non-ancestor: `behind=unknown`, `others=unknown`, `reason=non-ancestor`, history query 0

red: 발명된 SHA-1/SHA-256 모양과 실제 non-ancestor를 구별하고 둘 다 full `git log`를 호출하지
않는다. seal: `none`, 자기 자신, 정상 ancestor, SHA-1/SHA-256 저장소 의미를 보존한다.

#### D-3. HANDOFF empty claim

`parseHandoff()`가 현재 room의 claimed path 0개일 때 path query를 아예 실행하지 않는다. unrelated
최신 commit을 HANDOFF freshness로 쓰지 않는다.

red: claim 0 + HANDOFF 뒤 unrelated commit에서도 거짓 stale 0, path Git query 0.

#### D-4. HANDOFF durable tree identity

card는 exact normalized card path로 비교한다. waiting `NN-name.md`와 열린 depth-1 folder
`NN-name`, 그리고 `.done`/`.stale` status suffix는 **status와 terminal `.md`를 제거한 capability
identity**로 비교한다. 후보는 cards·waiting files·depth-1 folders다. waiting file과 동명 folder가
동시에 있으면 `resolves=2`로 fail closed한다. `layer.children-done`의 `next`는 실제 routable capability
folder다. Unicode raw-line fallback은 보존한다.

red: waiting file→folder resolves 1, 동시 존재 resolves 2, children-done folder resolves 1,
status suffix와 Unicode 경로를 봉인한다.

#### D-5. revision projection

`loadSnapshot`이 `--capability N`을 `revisions(snapshot, N)`에 전달하고 render가 아래 bounded fact를
항상 낸다.

```text
revisions: product=<...> verification=<...> code=<...> capability=<...|not-applicable|unresolved>
```

product/unfiltered 호출은 capability가 `not-applicable`, capability 호출은 실제 hash 또는
`unresolved`다. `FACT_ZONES`에는 `revisions`와 D-7의 `current-card`·`origin-group` projection을
등록한다.

red: filtered/unfiltered 값과 `verify`의 네 revision 소비가 일치하고 narrow output에서도 줄이
사라지지 않는다.

#### D-6. Failure history empty grammar

canonical empty는 `Failure history:`와 다음 heading 사이 list item **0개**다. producer는 `- none`을
쓰지 않는다. migration은 `failure:` 또는 `unverified:` entry 모양인데 source id가 없는 legacy
항목에만 적용한다. `- none`과 `None.`은 입력 호환으로 빈 상태이며 가짜 id를 만들지 않는다.

red: canonical 0 items, `- none`, `None.`, 실제 missing-id legacy, 기존 id와 duplicate 판정을 각각
고정한다.

#### D-7. same-origin current-card projection

`7ca411f`의 `claimOrigin(firstMine)→report`는 origin identity 복원까지만 닫았다. 상태 도구는 이제
모든 pending/claimed nonclosed current card를 먼저 계산하고, 같은 값을 카드마다 반복하지 않는
정규화 projection 둘을 canonical order로 낸다.

- `current-card`: exact current path + normalized origin(`journal:...`, `none`, 이유가 있는 `unknown`)
- `origin-group`: concrete origin 하나 + 그 origin을 가진 current card exact paths 전부

각 current card의 sibling은 같은 origin의 `origin-group`에서 자기 경로를 뺀 값이다. 이것은 디스크의
새 bundle state가 아니라 한 state invocation의 중복 없는 relational projection이다. `none`·`unknown`은
group을 만들지 않고, `.done`·`.stale`과 다른 origin은 sibling이 아니다. 새 카드 `Origin:` field,
journal marker, bundle 파일은 없다. `--capability` narrow에서도 선택된 card가 속한 group은 다른
capability의 current sibling을 포함해 통째로 남는다. compact render는 path array를 자르지 않으며
전체 group이 24KiB 계약에 들지 않으면 기존처럼 fail closed한다.

`resume`은 selected card와 origin을 join해 exact sibling paths를 보고한다. `work`는 각 sibling
카드에서 Progress log를 제외한 Intent·Forbidden·Completion signal·Depends on·Read first 계약을
읽어 구현자에게 준다. 한 복합 요청이 여러 도메인 카드로 갈라졌더라도 이 edge로 전체 작업 흐름을
인지하고, 각 카드에서 얻은 지식은 그 사실의 capability owner로 따로 올라간다.

Git 계산도 카드마다 `log --follow`를 반복하지 않는다. `devflow/tree`의 한 `--name-status
--find-renames` history traversal에서 current card path를 rename edge를 따라 과거로 접어 각각의
planning addition commit을 매핑하고, distinct planning commits의 journal diff를 한 batch로 읽어
7ca의 origin identity fold를 적용한다. capability folder rename과 status rename도 이 lineage 안에서
해결한다. shallow 판정은 1회이고 grouping은 메모리에서 O(N)이다. creation commit까지 해결했고
marker가 없을 때만 `none`이며, rename이 모호하거나 shallow boundary 때문에 creation을 유일하게
해결하지 못한 legacy card는 expensive fallback을 숨겨 돌리지 않고 이유가 있는 `unknown`이다.

`FACT_ZONES` 등록만으로 projection이 끝났다고 보지 않는다. `renderProjection()`은
`--capability N`에서 N의 current-card facts와 그 카드들이 참조하는 origin-group 전부를 함께 남기며,
그 group의 cross-capability paths도 제거하지 않는다. full/compact renderer는 current-card와
origin-group의 exact path를 96-byte field truncation에 보내지 않는다. 선택 group 전체가 24KiB를
넘으면 기존처럼 fail closed한다. 따라서 unfiltered overflow가 권하는 `--capability N`은 실제로
완전한 선택 관계를 더 작은 출력으로 만들 수 있고, 선택 자체가 너무 크면 거짓 성공 대신 거부한다.

red: reciprocal sibling reconstruction, different/none/unknown 제외, pending+claimed 혼합, capability folder
rename과 status rename을 거친 origin 복원, ambiguous/shallow lineage는 unknown, cross-capability group의
narrow 보존, renderProjection의 참조 group 보존, compact에서 array 무절단·over-budget fail-closed,
selected resume/work 전달,
canonical order, card 수가 늘어도 history traversal/batch lookup 수가 늘지 않음을 고정한다. 작은 N의
fixture로 rendered path cell이 O(N)인지 검증하되 30장 이상 통과 증거로 과장하지 않는다. seal:
7ca의 request+N marker, marker-only verify/core/journal, genuine multiple origins, shallow, single legacy
marker를 보존한다.

**D 전체 기대 결과.** 상태 도구가 사실을 발명하거나 계산한 사실을 숨기지 않고, resume과 다음
worker는 대화 기억 없이 정확한 현재 작업·revision·원 요청을 복원한다.

### C. user-confirmed capability Intent/Invariant의 실제 owner 상승

**실패 장면.** 정상 work 중 사용자가 현재 card의 capability나 그 card가 소비하는 provider
capability의 새 Intent/Invariant를 확정해도 Progress는 sibling이 읽지 않고, carry는 closure 때
Traps와 비교되며, 기존 capability note는 code-confirmed observation으로 수확된다. 실제 target design
zone의 유일한 writer인 arch/adopt로 가는 edge가 없다.

**기존 문법 안의 producer.** outer journal 문법은 그대로 둔다.

```text
YYYY-MM-DDTHH:MM:SSZ capability note: capability: <NN>; note-json: <JSON string>
```

user-confirmed design note는 target이 current card와 같은 번호든 다른 번호든 decoded string의 닫힌
네 필드로 구별한다. outer `capability: <NN>`은 statement의 실제 durable owner 번호다. 값 자체는 계속 JSON
**string**이며 object로 바꾸지 않는다.

```text
confirmed capability design
statement-json: <user-confirmed whole statement as JSON string>
card: <exact current card path>
commit: <full object ID of the card+code checkpoint>
code-json: <non-empty JSON array of exact repository paths, with #symbol/heading where useful>
```

work는 user-confirmed statement와 exact code paths를 먼저 bounded ordinary Progress entry에 남기고,
그 card entry와 현재 code basis를 `NN.N wip: capability design` checkpoint에 싣는다. 그래서
checkpoint 뒤 note 전 중단에도 payload가 task의 기존 evidence slot에 남는다. checkpoint의 full OID를
위 strict note에 넣어 journal boundary commit으로 착지시킨다. parser는 checkpoint commit이 실제
commit이고 exact card, confirmation entry, 열거 code paths를 모두 담는지 검증한다. user-confirmed
statement가 아닌 추론은 이 producer를 쓰지 않는다.

**라우팅.** 기존 note를 새 journal kind로 만들지 않되, 유효한 strict design note를 상태 도구의
`marker.capability-design`으로 투영한다. 우선순위는 기존 `capability-closure`와 `re-split` 뒤,
current `claim` 앞이다. 그래서 찢어진 transition과 기존 closure/re-split은 먼저 끝나고, note가
착지한 current claim은 source card와 target 번호가 같든 다르든 일반 work 재개 전에 arch(브라운필드는
adopt)의 **design-only target branch**로
간다. 기존 `baseline.design-refresh`에 원인 조건을 끼워 넣지 않는다. 그것은 claim 뒤라 계약을
만족하지 못하고 Layer 0 refresh와 user-confirmed target update라는 다른 원인을 한 kind에 섞는다.
유효한 strict note가 여러 개면 journal 순서의 첫 note 하나만 target으로 투영하고 소비 뒤 다음 note를
다시 계산한다. target 번호가 현재 capability 정본 하나로 해결되지 않으면 다른 번호를 추측하지 않고
integrity stop한다.

**단일 writer.** arch/adopt는 note가 가리킨 capability 번호 하나의 HEAD design zone과 같은 번호
capsule만 재도출한다. 이 target branch의 읽기 집합은 HEAD의 target design zone, exact strict note,
checkpoint card와 code basis, 그 target을 실제로 지지하는 product/arch/glossary 절과 cited ADR·선택된
capsule로 제한한다. 관계 진술이면 exact provider/consumer design zone과 code path만 더 연다. 기대
집합 전체나 Layer 0 전체를 문장 하나 때문에 다시 읽지 않는다.

Layer 0를 다시 만들지 않고, 확인된 문장을 다시 질문하지 않으며, 기존 verification bytes는 그대로
보존한다. DD-77에 따라 같은 개념의 현재 문장을 **교체**하고 옛 문장을 뒤에 누적하지 않는다. 옛
문장이 지금 독자를 틀리게 만들면 그 결론 옆의 rejected direction으로만 남긴다. Intent의 관통 의도는
항상 읽는 지도에 남고 capsule로 내려가지 않으며, 예산을 넘는 design-topic detail만 기존 capsule
writer가 내린다. capability 고유 invariant를 `arch.md`에 복제하지 않는다. 실제 Layer 0 authority인
사실만 기존 discovery→update 표를 쓴다.

writer 결과가 바뀌면 기존 capability-only `arch — capabilities`/`adopt — capabilities` commit으로
target document·capsule만 먼저 착지시킨다. 이미 같은 의미와 bytes면 기존 규칙대로 design commit을
만들지 않는다. 어느 경우든 target design이 statement를 소유하고 verified bytes가 보존됐음을
확인한 뒤, 별도 `boundary — capability design <NN>` commit이 **그 exact journal note만 소비**한다.
design commit 뒤 note 소비 전 중단은 같은 marker가 이 마지막 boundary만 복구하고, no-op도 직접
그 boundary로 빠져나간다. journal을 capability-only commit에 섞거나 no-op note를 영구 marker로
남기지 않는다.

design 적용 뒤 card·code와 양립하면 `work`로 돌아가 completion signal과 clean review를 다시 수행한
뒤 carry와 final task commit으로 간다. 양립하지 않으면 기존 stale/re-split 경로다. strict design
prefix를 가진 note는 이 route의 전용 입력이다. basis가 invalid하거나 card가 status rename된 채
남아도 ordinary observation으로 낮추지 않는다. 전자는 integrity stop, 후자는 checkpoint의 card
identity로 design route를 복구한 뒤 closure로 간다. verify step 7의 multiset은 strict design note를
항상 제외하므로 design statement가 verified zone에 섞이지 않는다. ordinary other-capability note만
그 capability의 다음 closure→verified zone 경로를 그대로 쓴다.

principles의 상향 피드백 표도 같은 outer 문법의 두 소비자를 숨기지 않게 고친다. 다른 capability에
대한 ordinary code observation은 계속 그 capability의 다음 closure가 유일한 소비자다. 어느
capability에 대한 것이든 user-confirmed design statement는 위 strict basis를 갖춘 경우에만 claim 전
그 번호의 target arch/adopt route가 소비한다. strict prefix를 선언하고 basis가 불완전한 줄은 다른
관측으로 낮추지 않고 integrity stop한다. 새 note kind가 아니라 기존 문법 안에서 producer의 신뢰
의미와 수명을 명시하는 것이다.

현실의 한 요청이 여러 도메인에 걸리면 split이 만든 same-origin capability cards가 D-7으로 서로를
본다. 각 user-confirmed design fact는 그것을 발견한 card 번호가 아니라 그 사실을 소유할 actual
capability 번호의 strict route로 올린다. 다른 capability에 대한 code-confirmed observation만 기존
closure→verified note로 보낸다. 한 관계의 authority는 그것을 강제하는 capability design에 한 번 두고
반대편은 기존 Consumed paths/contract reference로 연결한다. 복합 작업이라는 이유로 지식을 task
문서에 뭉치거나 여러 capability에 같은 문장을 복제하지 않는다.

**capsule 약속 정리.** 약 185줄과 overflow→capsule은 DD-76의 3,699줄 설계 원문을 다루는
**design knowledge** 계약이다. verified zone은 verify가 유일한 writer이고 capsule writer가 아니므로
초과를 자르거나 capsule로 옮기지 않는다. 초과는 그대로 보존하고 보고하며, capability 분할 여부는
사람의 product 판단이다.

**red.** current/other target strict note의 marker 우선순위, 여러 strict note의 journal-order 단일 소비,
unresolved target stop, checkpoint-before-note payload 복구, note-before-design,
partial design write, changed-design 뒤 boundary, byte-identical no-op 뒤 boundary, status-renamed card,
invalid/basis-missing note의 integrity stop, strict note의 verified 수확 0, target 한 개만 design 변경,
ordinary other-capability observation 표의 closure 소비와 strict user-confirmed design 표의 actual-target 소비,
DD-77 concept replacement, verified byte identity, compatible work 복귀, incompatible re-split을 고정한다.
**seal.** ordinary other-capability note 수확, Layer 0 discovery→update, 기존 full expected-set design
refresh, capsule provenance/budget, arch/adopt design bytes와 verify verified bytes의 single writer를
보존한다.

**기대 결과.** 얇은 다음 카드가 믿는 current/provider capability Intent/Invariant가 닫힌 옛 카드나
대화에 묻히지 않고, 기존 유일한 design writer를 거쳐 실제 owner 번호의 정본 지식으로 올라간다.

### E. verify channel과 failure lineage

#### E-1. 실제 interaction으로 channel 확인

frontend/screen verify channel은 binary/help/capabilities exit 0만으로 confirmed가 아니다. arch의
확인 단계가 clean context에서 실제 rendered element 하나를 읽고, 같은 means로 안전한 interaction
하나를 성공시킨다. 새 note를 만들지 않고 arch.md의 기존 `verify_channel` confirmation record를
`exact means + rendered read target/result + interaction action/result`의 고정 한 줄로 확장한다. verify가
그 exact means를 직접 consumer로 쓴다. CLI/API 등 다른 channel은 그 매체의 실제 최소 probe를
계속 쓴다.

red: help-only/capabilities-only는 미확인, rendered read+successful interaction은 confirmed.

#### E-2. product channel unavailable의 첫 사람 경계

실행한 scenario step이 0개이고 exact failed command와 timeout이 있을 때만 `channel unavailable`이다.
capability와 product 모두 첫 항목에서 사람에게 한 번 돌아가며 repair card를 만들지 않는다. 이미
제품 상호작용을 한 뒤의 non-pass를 channel unavailable로 숨기지 않는다. task/capability/product
verdict owner는 계속 분리한다.

#### E-3. 한 causal scene의 primary와 subordinate signals

verifier role은 overall verdict만 던져 main이 prose에서 원인을 추측하게 두지 않는다. non-pass마다
다음 run-local scene record를 반환한다.

```text
scene-json: {"action":"<exact command or interaction>","observation":"<observed failure>","primary":"<exact criterion>","subordinate":["<criterion>", ...]}
```

한 verifier run에서 같은 exact action과 observed failure 때문에 여러 criterion이 미완료됐으면
scene 하나, source id와 root 하나다. verify는 primary를 Failure history의 failure/unverified로 쓰고
subordinate identifiers와 evidence를 그 entry prose 안에 bounded하게 보존한다. 다른 action, 다른
observed output, 독립적으로 재현되는 원인은 각각 별도 scene/source id다. 문자열 유사도로 합치거나
main이 임의 추론하지 않고, verifier도 primary를 결정할 수 없거나 root 후보가 둘 이상이면 현재 사람
stop을 유지한다.

E-2와 E-3은 같은 commit에서 닫는다. 하나의 channel failure를 여러 entry로 만든 뒤 각각 사람에게
보내는 반쪽 수리를 막기 위해서다.

red: verifier scene schema, capability/product zero-step first-human과 repair-card 0, one primary+four
subordinate에서 root 1, 서로 다른 actions/causes에서 root 2와 safe stop, prose-only grouping 금지, 과거
source id 안정성을 고정한다.

**E 기대 결과.** 도구 존재를 실제 사용 가능성으로 오인하지 않고, 한 채널 실패는 정보 손실 없이
사람 한 번으로 수렴한다.

## 5. exact write scope

한국어 정본을 먼저 고치고 영문을 구조·수치 1:1로 맞춘다. 구현 전 움직이는 decision 원문을 다시
정확한 절로 열고 아래 범위를 줄일 수는 있으나 조용히 넓히지 않는다.

- runtime: `skills/principles/SKILL{,_ko}.md`,
  `skills/principles/baseline-predicates{,_ko}.md`,
  `skills/principles/scripts/project-state.mjs`
- entry/consumers: `skills/work/SKILL{,_ko}.md`, `skills/work/reviewer{,_ko}.md`,
  `skills/resume/SKILL{,_ko}.md`, 필요할 때만 `skills/split/SKILL{,_ko}.md`
- writers/verification: `skills/arch/SKILL{,_ko}.md`, `skills/adopt/SKILL{,_ko}.md`,
  `skills/verify/SKILL{,_ko}.md`, `skills/verify/verifier{,_ko}.md`
- tests: `scripts/project-state.test.js`, `scripts/repository-invariants.test.js`, 실제 seam이 닿을 때만
  `scripts/git-state-transitions.test.js`
- durable design wiring: 움직이는 절만 `docs/design-decisions{,_ko}.md`, 기존 use-case 행으로 닫히지
  않는 사용 형태만 `docs/usecase-matrix_ko.md`, 실제 해소/유지 상태만 `docs/design-backlog{,_ko}.md`
- release end: 이 `plan_ko.md`의 결과를 쓰는 `docs/rounds/v0.19.0/report_ko.md`, 최신
  `CHANGELOG.md`, manifest 둘

새 문서 역할, 새 PR 파일, 외부 transcript, `Origin:` 카드 필드, bundle state, root-cause graph,
verified capsule writer는 scope 밖이다. `skills/product/**`, `skills/design/**`, README, blueprints도
현재 원인과 연결되지 않는다.

## 6. 결정·matrix 착지 원칙

새 DD를 장면마다 만들지 않는다. 원문이 이미 소유한 이유를 확장하되 실제로 움직이는 기록 이유를
숨기지 않는다.

- A: DD-24의 signal freshness와 DD-48의 bounded task knowledge를 확장한다.
- B: DD-19의 clean role input과 기존 failure ladder의 도달 범위를 확장한다.
- D-1은 whole-card byte equality를 plan bytes와 append-only execution bytes로 나누므로 DD-38을 일부
  정정한다. D-2~D-7은 DD-35·DD-80·DD-83의 full OID, read-only state, complete projection을 해당
  좌표에 적용한다.
- E-2는 DD-81의 channel-unavailable 경계를 product까지 확장한다. E-3은 DD-68의 “한 판정의 여러
  failure는 독립 entry” 이유를 run-local causal scene에서 일부 정정하므로 새 구속 결정 하나에
  scene producer, 안전한 비병합, 사람 stop을 함께 기록한다.
- C: DD-42·DD-43·DD-48·DD-76의 기존 writer·zone·note·capsule 이유는 유지한다. user-confirmed
  capability design note가 source card 번호와 무관하게 claim 앞에서 actual target writer로 가는 새
  route와 기각 대안은 **새 구속 결정
  하나**로 기록한다. DD-77의 concept replacement를 적용하고, DD-76의 total overflow 문구는 design
  knowledge에 한정하는 일부 정정을 명시한다. 새 journal kind나 writer를 만든다는 결정이 아니다.

따라서 예상되는 새 결정은 C route와 E-3 scene producer 두 개다. DD-38·DD-76은 기존 결정의 일부
정정이며, 구현 전 exact 원문과 영향을 다시 열어 이보다 늘리지 않는다.

use-case matrix는 기존 H22/H38의 multi-card, H43~H45의 recurrence/channel, H47/H48의 evidence
landing/re-entry를 먼저 확장한다. user-confirmed capability design fact가 어떤 기존 §1~§2 request
shape에도 맞지 않을 때만 행 하나를 추가한다. same-origin을 별도 사용 형태로 중복 등재하지 않는다.
감사 지침 §2의 기존 소실·오술어·조합·외부 도구 단정으로 모두 분류되므로 새 audit lens는 예상하지
않는다. 구현 diff 뒤 0건을 포함해 다시 판정한다.

## 7. 원인별 commit과 구현 순서

각 commit은 자기 red를 먼저 실패시키고 green+seal까지 함께 담는다. unrelated cleanup은 싣지 않는다.

1. **A + D-1 — task evidence와 approval freshness.** 새 producer가 즉시 approval을 깨지 않도록
   원자적으로 닫는다. Progress 기계 형식의 단일 정본도 이때 만든다.
2. **B — reviewer input과 objection automaton.** A의 review result owner 위에 배선한다.
3. **D-2 — digest object/range.** full OID와 unknown reason을 한 원인으로 닫는다.
4. **D-3 + D-4 — HANDOFF 대상과 durable tree identity.** zero-target query와 file/folder identity를
   같은 “대상 해결” 원인으로 닫는다.
5. **D-5 — revisions projection.** 이미 계산된 값을 direct consumer까지 낸다.
6. **D-6 — empty Failure history.** producer/parser/migration을 한 commit에서 맞춘다.
7. **D-7 — origin/sibling projection.** 7ca seal과 Git 호출 상한을 함께 둔다.
8. **C — confirmed capability design ascent.** strict note→marker route→actual target writer→work 복귀를 end-to-end로
   닫고 capsule 약속을 정직하게 고친다.
9. **E-1 — verify-channel acquisition.** 실제 rendered read+interaction 하한을 닫는다.
10. **E-2 + E-3 — channel boundary와 causal scene.** 사람 한 번이라는 같은 원인으로 묶는다.
11. **design/matrix/backlog wiring.** 실제 behavior diff가 움직인 이유와 사용 형태만 기록한다.
12. **round report와 release.** 모든 gate가 끝난 실제 hash·결과·한계만 싣고 CHANGELOG와 manifest를
    `0.19.0`으로 올린다.

기본 의미 순서는 A→B→D→C→E다. 한 원인 구현 중 두 번 이상 같은 문장이나 함수에 예외를 더하려는
모양이 나오면 그 patch를 멈추고 §3의 네 상위 구조 중 어느 하나로 접을 수 있는지 다시 판정한다.
이 판정은 settled 계약을 다시 연구한다는 뜻이 아니라 구현이 계약을 국소 규칙으로 왜곡하는지 보는
것이다.

## 8. 검증과 독립 검토

### 8.1 source-only 관문

1. 각 원인별 named red→green과 기존 contract seal
2. 관련 test 파일의 focused run
3. `node --test "scripts/*.test.js"` 전체 — fail/cancelled/skipped 0
4. Gate A의 모든 canonical reserved journal/Progress machine line parse
5. verification contract가 바뀌므로 수동 Gate B 한 번
6. `git diff --check`, ko/en 구조·수치 1:1, decision-index/density/state shape, 금지 좌표 검사
7. audit guideline §5 stop clause 평가와 수정 뒤 별도 re-audit
8. entry-system의 동일 질문 clean Claude/Codex before/after: critical invariant·component·consumer·
   design reason omission 0, source를 읽기 전 삭제 제안 0, comprehension 저하 0

실행하지 않은 관문은 `unverified`다.

### 8.2 모델 운용

- 일반 구현과 review는 Claude Opus xhigh와 Codex sol xhigh를 원인과 강점에 맞게 맡긴다. 중요한
  구조 판정과 최종 검증은 두 계열이 서로의 diff를 독립 교차 검토한다.
- 같은 evidence와 exact file scope의 후속은 이해가 남은 context를 재사용한다. paired Claude가
  70% 이상이면 같은 시기의 Codex와 함께 새 context로 바꾼다.
- agent는 처음부터 exact model/reasoning, Codex YOLO 또는 Claude bypass, 절대 경로, 충분한 한 번의
  brief, exact input/output, 완료 표식을 받는다. Codex update prompt는 option 3, multiline paste 뒤
  두 번째 Enter까지 확인한다.
- 긴 일은 event로 기다리고 분 단위 polling이나 짧은 보충 prompt 연속 투입을 하지 않는다.
- 모든 일반 gate와 두 계열 교차 검토가 끝난 뒤에만 Fable xhigh를 **한 번** 써서 국소 최적화,
  과잉 규칙, 더 단순한 상위 구조, 장기 비용을 넓게 감사한다. 입증된 변경은 다시 red→green과
  re-audit를 거친다. 정말 중요한 최종 경계가 남을 때만 Codex sol max를 추가한다.

Matt Pocock의 Skills/Superpowers 같은 외부 선례는 현재 settled 계약을 다시 고르는 연구에 쓰지
않는다. 구현 중 로컬 원문으로 답할 수 없는 진짜 새 구조 갈림이 생기고 그 선례가 직접 답할 때만
유계 비교한다. 현재 계획에는 그런 질문이 없다.

## 9. 마지막 실측 허용 조건

실사용에 가까운 제품 실행은 발견 수단이 아니다. 다음이 **모두** 닫히기 전에는 시작하지 않는다.

- A~E의 모든 red→green과 seal
- 전체 test, Gate A, 수동 Gate B, diff/번역/decision/audit 관문
- Opus/Codex의 중요한 구조·최종 교차 검토와 그 수정의 re-audit
- 일반 관문 뒤 Fable의 한 번 감사와 채택 수정 재검증
- clean before/after 이해도 대조
- candidate source commit과 양 플랫폼 설치 revision이 정확히 일치

그 뒤에도 먼저 소유자에게 변경된 skill paths, exact revision, source로 답하지 못한 관찰 질문,
성공/실패가 각각 무엇을 가르는지 보고한다. 허용되면 새 disposable greenfield/brownfield에서 한 번의
짧고 밀도 높은 after만 수행한다. 두 중단 제품 저장소는 재개하지 않고 풍부한 handoff를 실제 사용자
세션에 주입하지 않는다. source만으로 답할 수 없는 좁은 predicate 질문이 중간에 생긴 경우에만 변경
path와 질문을 먼저 보고한 뒤 10분 이내 fixture를 쓴다.

## 10. 완료의 관찰 가능한 상태

- 카드와 Git만 읽어 각 local signal·clean review의 결과, 실패/이의/미실행, containing revision을
  복원할 수 있다.
- reviewer가 모든 existing exact non-capsule Read first를 받고 세 번째 objection에서 사람에게
  돌아가며, disposition 뒤 final review는 정확히 한 번이다.
- source card 번호와 무관하게 user-confirmed capability Intent/Invariant가 strict existing note→actual
  target design writer로 올라가고, ordinary code-observation note와 verified writer는 그대로다.
- 모든 current card의 origin과 exact same-origin sibling paths가 resume/work에 보이며 7ca identity
  seal과 호출 상한을 지킨다.
- Progress-only edit는 approval을 깨지 않고, invented digest object·empty claim·waiting→folder·
  revisions 누락·empty history 오독이 사라진다.
- frontend channel은 실제 rendered read와 interaction으로 확인되고, product channel-unavailable과
  한 causal scene은 사람 한 번으로 수렴한다.
- 새 PR 계층·새 지식층·새 writer·새 passenger·중복 정본이 없고, 기존 작동 current-skill 계약의
  seal이 모두 green이다.
- 최종 제품 실측 전까지 예측 가능한 결함은 source·fixture·논리 검토로 닫혀 실제 성공 가능성이
  충분히 높다.

## 11. 구현 중 묻는 경계

현재 A~E는 다시 연구하거나 선택할 후보가 아니다. exact source가 이미 답하는 serialization,
predicate, test seam, 문구는 메인 코디네이터가 자율 판정한다. 진짜 새 중대한 갈림, 즉 두 안전한
구조가 실제 사용성·성능·결과를 크게 다르게 만들고 원문·fixture로 우열을 정할 수 없는 경우에만
구체 diff나 실물을 나란히 보여 소유자에게 묻는다. 그런 갈림이 없으면 위 순서로 진행한다.
