# 능력 지식 기준선 제안 — 작업 트리와 장기 전문성을 함께 보존하기

## 문서 상태

- 상태: **후보 계약 설계 완료, 런타임 채택 결정 대기**
- 적용 대상: v0.9.21 이후 후보
- 이 문서는 규칙 정본이 아니다. 아래 선택 사항을 소유자가 확정하기 전에는 어떤 스킬도 이
  제안을 실행해서는 안 된다.
- 목적: 중계노트식 도메인 핸드오프의 장점을 devflow의 트리·카드·다중 모드와 결합할 수
  있는지 검증하고, 구현 가능한 후보 계약을 남긴다.

## 1. 확인된 문제

devflow의 현재 기록은 서로 다른 일을 정확히 나눈다.

| 기록 | 정본인 것 | 정본이 아닌 것 |
|---|---|---|
| `product.md`·`arch.md`·`design.md` | 제품 경계와 구속 결정 | 작업 진행률, 세부 구현 지도 |
| `devflow/project/decisions/` | 장기간 유지할 중요한 선택과 이유 | 현재 구현 전체 설명 |
| `tree/` 작업 카드 | 작업 경계·의존·점유·완료 상태·진행 로그 | 능력 전체의 최신 구현 설명 |
| `HANDOFF.md` | 다음 세션의 시작점과 열린 결정 | 서비스 도메인의 영구 백과사전 |
| `journal.md` | 정해진 사건과 짧은 구속 지식 | 긴 설명과 코드 지도 |
| 기존 기록 색인 | 브라운필드 문서의 위치와 지위 | 자동 읽기 명령, 최신성 보증 |

이 분리는 순차적인 MVP 실행에는 강하다. 그러나 같은 능력을 여러 번 다시 열어 개선하면,
완료된 카드 여러 장을 읽지 않고는 다음 질문에 바로 답하기 어렵다.

- 지금 사용자가 실제로 경험하는 동작은 무엇인가.
- 프론트엔드·API·데이터 계층은 어디서 만나며 어떤 계약을 지키는가.
- 다시 밟으면 안 되는 실측 함정과 유효한 검증 절차는 무엇인가.
- 과거 카드의 결론 중 지금도 유효한 것은 무엇인가.

중계노트의 도메인 핸드오프는 이 네 질문에 잘 답했다. 반대로 문서 안에 최신 요약, 과거
변경, 폐기된 표현이 함께 쌓여 국소적인 “더 최신” 선언이 선행 절을 덮는 구조가 생겼다.
장기적으로는 읽기 비용, 최신성 판정, 동시 수정 충돌이 증가한다.

## 2. 결합할 두 축

후보 설계는 상태와 지식을 합치지 않는다.

| 축 | 질문 | 유일한 정본 |
|---|---|---|
| 실행 축 | 누가 무엇을 왜 어떤 순서로 하고 있는가 | `tree/`·작업 카드·`users/` 점유 |
| 지식 축 | 마지막으로 기준선 갱신에 성공한 검증 시점에 이 능력은 어떻게 동작하는가 | 제안된 능력 지식 기준선 |

현재 진행 상황의 개념 모델은 `기준선 + 기준선의 Covered cards에 없는 현재 카드`다. Covered cards는
기준선이 요약한 `.stale.` 아닌 `.done.` 작업 카드 번호의 JSON 문자열 배열이며 정본 카드 번호
순서로 정렬한다(예: `["02.2","02.2b","02.10"]`). 현재 카드 중 그 배열에 없고 `.stale.`이 아닌
대기·점유·완료 카드는 모두 기준선 이후 변화다. 이것은 work가 변화 카드 전부를 자동 통독하라는
규칙이 아니다. work는 기존 읽기 집합만 쓰고, verify가 적용 대상의 최종 능력 폐쇄에서 현재
`.stale.` 아닌 `.done.` 카드와 그 입력을 한 번 읽어 기준선을 만든다. 기존 기록 색인은 split이 현재
변경 범위와 다시 대조해 카드의 `읽을 것`에 넣은 뒤에만 그 입력이 된다. 기준선 파일은 Covered cards의 과거
포함 관계 외에 현재 카드 상태·진행률·담당자·다음 작업을 복제하지 않는다. 따라서 능력 단위의
전문성이 작업 분할이나 팀 점유를 대체하지 않는다.

## 3. 검토한 선택지

| 안 | 구조 | 장점 | 실패 경로 | 판정 |
|---|---|---|---|---|
| A. v0.9.21만 유지 | 기존 기록 색인과 카드만 사용 | 추가 비용 없음 | 반복 개선 때 현재 구현을 여러 카드에서 재구성 | 작은·선형 프로젝트에는 충분 |
| B. 카드마다 공유 핸드오프 갱신 | 능력마다 파일 하나를 모든 카드가 수정 | 항상 최근 기록 | 같은 능력의 병렬 카드가 문서 하나에서 충돌하고 미검증 중간 상태가 기준선이 됨 | 기각 |
| C. 카드별 지식 조각 | 카드마다 조각을 쓰고 나중에 합성 | 병렬 쓰기 안전 | 제2 트리가 생기고 합성 전에는 독자가 모든 조각을 읽음 | 기각 |
| D. 검증 폐쇄 기준선 | 능력 검증 경계에서 파일 하나를 갱신하고 Covered cards 밖의 현재 카드는 별도로 읽음 | 단일 작성 경계, 유계 읽기, 검증된 상태만 보존 | 능력이 오래 닫히지 않으면 기준선이 늦게 갱신됨 | **권고 후보** |

## 4. 권고 후보의 정확한 의미

임시 명칭은 **능력 지식 기준선**이다. 런타임 용어로 채택하려면 AGENTS.md 대역표에 먼저
등재해야 한다.

- 단위는 제품의 수직 능력이다. 고객 관리처럼 화면·API·데이터가 한 사용자 동작을 함께
  구현하면 한 파일에 둔다.
- 프론트엔드와 백엔드를 기본적으로 나누지 않는다. `arch.md` 구성요소라는 이유만으로 별도 파일을
  만들지 않는다. 분리 배포되고 독립적으로 소유되는 구성요소가 product.md에도 별도 능력과 자체
  안정 키로 존재할 때만 그 product 능력의 파일을 만든다.
- 이 후보는 `arch.md` 구성요소 단위의 별도 기준선을 만들지 않는다. devflow에는 구성요소 단위의
  독립 검증 폐쇄가 없으므로, 여러 능력이 공유하는 구성요소를 어느 능력의 폐쇄가 확정하는지
  결정할 수 없기 때문이다. 공유 백엔드·플랫폼 지식은 `arch.md`·그 문서가 권위를 위임한 ADR·현재
  코드가 소유한다. 각 능력 기준선에는 그 능력에 미치는 계약과 정확한 공유 경로만 둔다. 별도
  구성요소 기준선은 독립 검증 경계가 생긴 뒤 검토할 후속 설계이며, 프론트엔드·백엔드 파일을
  임의로 나누는 예외가 아니다.
- 파일은 기준선 갱신까지 성공한 가장 최근의 검증 통과 구현을 설명한다. 더 최근의 통과가 입력
  미해결로 포착되지 않았으면 기존 파일은 가설로만 읽는다. 진행 중인 시도나 미검증 추측은 넣지 않는다.
- 능력이 열린 채로 오래 지속되면 기준선은 마지막으로 포착에 성공한 폐쇄에 머문다. Covered cards
  밖의 현재 카드는 그 뒤의 변화량이지 검증된 현재 요약이 아니다. 다음 폐쇄 전에는 코드와 현재
  카드가 정본이며, 카드마다 기준선을 덧붙여 거짓 신선도를 만들지 않는다.
- 역사는 git과 `.done.`·`.stale.` 카드에 남는다. 기준선에는 연대기 절을 두지 않는다.
- 중요한 선택의 이유는 `devflow/project/decisions/`가 계속 소유한다. 기준선은 그 경로를 가리킬 수 있지만
  이유를 복제하지 않는다.

제안 경로는 다음과 같다.

```text
devflow/project/capabilities/<stable-capability-key>.md
```

어느 소유 위치를 택해도 안정 키는 `[a-z0-9]+(?:-[a-z0-9]+)*`과 일치하고 제품 안에서 유일해야
한다. 고정 길이 제한은 두지 않는다. 이 문법은 대소문자·Unicode 정규화·경로 구분자 차이를
피하기 위한 것이며 실제 파일시스템의 파일명 제한은 그대로 따른다. 처음 등록 파일이나 기준선에
쓰인 뒤에는 바꾸지 않으며, 능력이 은퇴해도 재사용하지 않는다.

`knowledge/`처럼 내용 제한이 없는 이름은 자유로운 덤프 폴더로 변할 수 있어 쓰지 않는다.
`domain/`은 제품 능력과 백엔드 도메인을 한 단어로 합치므로 기본 이름으로 쓰지 않는다.

## 5. 후보 문서 계약

각 파일은 아래 절만 가진다.

| 절 | 담는 내용 | 담지 않는 내용 |
|---|---|---|
| Identity | product 능력 행, 불변 product 능력 번호, 안정 키, 소유 경계 | 작업 담당자 |
| Baseline | Product·Verification·Code·Capability revision, 능력 product digest, 능력 코드 digest, 능력 입력 digest, 검증 시각, Covered cards | “최신” 같은 상대 표현 |
| Code scope | 저장소 기준 진입점과 공유 계약 경로 | 관련 폴더 전체 |
| Current behavior | 사용자가 관찰할 수 있는 현재 동작 | 계획 중 기능 |
| Cross-surface contracts | UI·API·데이터 사이의 입력·출력·불변조건 | ADR의 이유 전문 |
| Operational traps | 재현된 함정, 깨지는 조건, 회피가 필요한 이유 | 일반 개발 상식 |
| Verify | 지금도 실행 가능한 대표·적대 입력·회귀 절차 | 과거 통과 결과의 누적 목록 |
| Pointers | 구속 ADR의 정확한 저장소 경로 배열, 외부 근거의 정확한 HTTPS URL 배열, 기존 기록의 정확한 저장소 경로 배열 | 무유계 “관련 문서” 링크 |

갱신은 기존 절 뒤에 새 설명을 덧붙이지 않는다. Identity·Baseline의 필드와 Code scope부터 Verify까지의
각 절을 현재 근거로 교체하고, 더 이상 근거가 없는 문장은 삭제한다. 구현된 능력의 Code scope·Current
behavior·Verify는 비어 있을 수 없다. 검증된 Cross-surface contracts나 Operational traps가 없으면
추측하지 않고 그 절에 정확히 `None.`을 쓴다. 값이 없는 Pointers 배열은 `[]`다. 이 교체 규칙은
연대기 비대와 “아래쪽이 더 최신”이라는 내부 우선순위를 다시 만드는 것을 막는다. 현재 근거로
비어 있을 수 없는 절 하나를 채울 수 없으면 내용을 발명하지 않고 기준선 연산을 만들지 않는다.

기계 판정 필드와 절 순서는 아래 형식이 유일한 후보 계약이다. 각 필드는 표시된 순서로 정확히 한
줄·한 번만 쓰며 `-json` 값과 Covered cards는 JSON으로 해석한다. 꺾쇠 placeholder는 실제 값으로
교체한다. Code scope부터 Verify까지는 표의 내용 경계를 지키는 Markdown이고 Pointers에는 표시한 세
필드만 둔다.

```markdown
# Capability baseline

## Identity
Product-capability-row-json: <줄 끝 byte를 제외한 product.md의 정확한 현재 능력 행을 담은 JSON 문자열>
Product-capability-number-json: <product.md의 정확한 불변 능력 번호 token을 담은 JSON 문자열>
Stable key: <stable-key>
Ownership-boundary-json: <능력 소유 경계를 담은 JSON 문자열>

## Baseline
Product revision: <Product revision>
Capability product digest: <capability product digest>
Verification revision: <Verification revision>
Code revision: <Code revision>
Capability revision: <Capability revision>
Capability code digest: <capability code digest>
Capability input digest: <capability input digest>
Verified at: <YYYY-MM-DDTHH:MM:SSZ>
Covered cards: <JSON 문자열 배열>

## Code scope
<유계 서술과 정확한 저장소 상대 경로>

## Current behavior
<검증된 현재 동작>

## Cross-surface contracts
<검증된 UI·API·데이터 계약>

## Operational traps
<재현된 함정>

## Verify
<실행 가능한 검증 절차>

## Pointers
Binding-adrs-json: <구속 ADR의 정확한 저장소 상대 경로를 담은 JSON 문자열 배열>
External-references-json: <외부 근거의 정확한 absolute HTTPS URL을 담은 JSON 문자열 배열>
Existing-records-json: <기존 기록의 정확한 저장소 상대 경로를 담은 JSON 문자열 배열>
```

세 Pointers 배열은 중복 없는 JSON 문자열 배열이며 배열 순서는 의미를 갖지 않는다. 같은 저장소 경로를
Binding-adrs-json과 Existing-records-json에 함께 넣지 않는다. Binding-adrs-json은 규칙 정본 문서가
권위를 위임한 현재 `devflow/project/decisions/` ADR만 담으며 모든 미래 카드의 신선도 입력이다.
External-references-json은 절대 `https://` URL만 담는 비구속 근거다. work가 자동으로 열지 않고 구속
결정을 이기지 않는다. 외부 규칙을 구속하려면 필요한 현재 해석과 출처 URL을 ADR에 먼저 기록한다.
Existing-records-json은 정본이 아니고 현재 변경 범위와 다시 맞는 카드에서만 입력이 된다. 어느 배열도
설명문이나 “관련” 범위를 담지 않는다.

능력 product digest의 원본은 `git cat-file blob HEAD:devflow/project/product.md`가 내는 commit된
blob byte다. 정확한 `## Capabilities` H2 heading은 하나여야 한다. 능력 행의 번호 token은 그 절 안에
있는 행의 첫 non-whitespace token이다. Identity의 Product-capability-number-json을 decode한 값과
token 전체가 byte로 같은 현재 비은퇴 행을 그 절 안에서 정확히 하나 고른다. 접두 일치는 허용하지
않는다. 줄 끝 byte를 제외한 그 행 전체가 Product-capability-row-json을 대체한다.

한 줄 범위는 첫 byte부터 `LF` 또는 `CRLF` 줄 끝 byte까지며 EOF 줄은 종결자가 없는 그대로다. H2
절 범위는 해당 `## ` heading의 첫 byte부터 다음 `## ` heading의 첫 byte 직전 또는 EOF까지다.
정체성 범위는 H1 줄 끝 다음 byte부터 `## Problem` 첫 byte 직전까지다. H1 줄, 정체성 범위,
`## Problem` 절, `## Approach` 절, 정확한 `## Capabilities` heading 한 줄, 선택한 능력 행 한 줄,
`## Boundary` 절, `## Success criteria` 절, `## Screens & access points` 절, 정확한 `interface:` 한 줄의 byte를 이 순서로 각각
`<bytes><NUL>`로 이어 `git hash-object --stdin`으로 hash한다. H1·대상 번호 token·행·필수 절·interface
줄·`## Capabilities` heading이 없거나 하나로 결정되지 않으면 `미해결`이며 기준선을 만들거나 갱신하지 않는다. Open questions와
다른 능력 행은 넣지 않는다. Product revision은 검증 실행의 증거로 보존하고, 이 digest가 다른 능력
행의 변경을 대상 능력의 신선도 변경과 구분한다.

파일 지도는 모든 파일을 나열하지 않는다. 능력의 외부 진입점, 계층 사이 계약, 반복해서
찾기 어려웠던 위치만 기록한다. 코드를 읽으면 즉시 알 수 있는 목록은 넣지 않는다.
능력 코드 digest는 이 짧은 파일 지도가 아니라 verify 5단계 표준 게이트의 현재 구조 규칙으로
계산한 전체 `능력 코드 범위`를 쓴다. 그 정확한 경로들을 `git ls-tree -r -z --full-tree HEAD --`에
주고 검증 판정 정본의 Verification revision과 같은 raw-byte 방식으로 hash한다. verify 5단계가
범위를 `미해결`로 판정하면 기준선을 만들거나 갱신하지 않는다.

능력 입력 digest 함수는 호출자가 준 Covered-card 번호 목록의 각 번호로 결정한 카드와 그 카드들의
직계 `의존` 입력만 포함한다. Covered 번호는 최종 폐쇄 tree에서 `.stale.` 아닌 `.done.` 작업 카드로
정확히 하나씩 결정되고 조상 폴더에 `.stale` 상태가 없어야 한다. 그 카드의 직계 의존 번호는 작업
카드로 정확히 하나 결정되어야 한다. `.done.`이고 `.stale` 조상이 없는 현재 카드이거나, split이 완료
카드의 역사적 `의존`을 다시 쓰지 않는 규칙 때문에 보존된 **역사 stale 의존**일 수 있다. 역사 stale
의존은 카드 자체가 `.stale.`이거나 `.stale` 조상 아래에 있는 카드이며, 신선도 hash 입력일 뿐 기준선
서술의 근거가 아니다. `Depends: none`은 유효한 빈 의존 집합이며 의존 항목을 만들지 않는다. 그 자체로
`변경`이나 `미해결`이 되지 않는다. 같은 실제 경로를 여러 Covered 카드가 직계 의존으로 공유하면 실제 경로의 집합
합집합을 먼저 만들어 그 경로를 한 항목으로만 쓴다.
그 뒤 각 실제 경로에서 폴더 구성요소의 `.done` 접미사만 제거하고 작업 카드 파일명은 그대로 둔다.
서로 다른 두 실제 경로가 같은 정규화 경로가 되면 정합성 이상이다. 각 정규화 경로와 HEAD tree의
원래 실제 경로가 가진 commit된 blob object ID를 한 항목으로 묶으며 working-tree 파일을 다시
hash하지 않는다. hash와 경로의 짝을 유지한 채 항목들을 정본 경로 순서로 정렬한다. 정렬된 각 항목의
`<정규화 경로 UTF-8 byte><NUL><blob hash ASCII><NUL>`을 이어 붙여 `git hash-object --stdin`으로
hash한다.

신선도 비교용 **저장 Covered 비교 digest**는 기존 기준선의 Covered cards를 함수 입력으로 쓴다.
정상적으로 열거한 현재 tree에서 저장 Covered 번호의 일치가 0개이거나, 정확히 한 일치가 `.done.`이
아니거나 `.stale` 조상 아래에 있으면 그 비교 결과는 `변경`이다. 저장 Covered 카드의 직계 의존이
가리키는 각 번호가 현재 tree에서 0개에 일치하면 역시 `변경`이다. 2개 이상 일치, 허용한 현재 카드·역사 stale 의존 이외의 의존 상태, parse 실패,
서로 다른 실제 경로의 정규화 충돌, HEAD blob 조회 실패는 `미해결` 정합성 이상이다. 최종 갱신용
**최종 교체 Covered digest**는 현재 대상 능력 아래의 모든
`.stale.` 아닌 `.done.` 카드 번호를 정본 카드 번호 순서로 정렬한 목록을 함수 입력으로 쓴다. 이 목록과
digest만 기준선의 Covered cards와 Capability input digest에 함께 기록한다. 최종 교체 계산에서 번호나
직계 의존이 위에서 허용한 상태의 카드 하나로 결정되지 않거나 위 정합성 이상이 있으면 값은
`미해결`이며 기준선을 만들거나 갱신하지 않는다. 역사 stale 의존은 최종 digest에는 남지만
7절 규칙으로 5절의 전체 `능력 코드 범위`에서 다시 확인된 서술만 기준선에 남는다. 이 digest는 능력 폴더의 폐쇄·재개 상태 접미사만 바뀌어도 값이 유지되고, Covered
card 또는 그 직계 의존의 경로나 byte가 바뀌면 값이 달라진다. Capability revision은 검증 실행의
증거로만 보존하며 기준선 신선도 비교에는 쓰지 않는다.

세 digest의 NUL 포함 입력은 text로 decode하거나 줄바꿈을 바꾸지 않고 binary-safe byte 경로로
`git hash-object --stdin`에 보낸다. POSIX는 native binary pipe를 쓰며 Windows PowerShell object
pipeline은 쓰지 않는다. 임시 파일이나 native process를 쓰면 byte를 그대로 보존한다.

## 6. 후보 생명주기

아래는 선택 사항이 확정됐을 때의 구현 후보이며, 현재 스킬은 실행하지 않는다.

1. split이 이미 구현된 능력의 유지보수 요청을 라우팅하고, 확정된 생성 발동 규칙으로 그 능력을
   기준선 적용 대상으로 정한다. 권고 발동을 채택했다면 기준선과 등록 파일이 모두 없을 때 같은
   계획 커밋에 `devflow/project/capabilities/<stable-key>.pending.md`를 아래 정확한 내용으로 만든다.
   등록 파일은 기준선이 아니며 work의 읽을 것이 아니다. 같은 계획에서 split은 arch.md `기존 기록`의
   대상 능력 이름·`shared` 행을 현재 변경 범위와 다시 대조하고, 맞는 정확한 경로만 유지보수 카드의
   `읽을 것`에 넣는다. 색인 자체는 읽기 명령이 아니다.

   ```markdown
   # Capability baseline enrollment
   Product-capability-row-json: <줄 끝 byte를 제외한 product.md의 정확한 현재 능력 행을 담은 JSON 문자열>
   Product-capability-number-json: <product.md의 정확한 불변 능력 번호 token을 담은 JSON 문자열>
   Stable key: <stable-key>
   ```
2. 기준선이 없으면 verifier와 두 폐쇄 게이트를 통과한 최종 능력 폐쇄 경계 전에는 만들지 않는다.
   work의 기존 읽기 집합과 코드 검색 경계를 바꾸거나 모든 과거 카드를 추가하지 않는다.
3. 기준선이 있으면 split은 같은 능력의 새 카드마다 정확한 기준선 경로와 Binding-adrs-json의 모든
   exact 저장소 경로를 `읽을 것`에 넣는다. Existing-records-json은 현재
   변경 범위와 다시 맞는 exact 경로만 넣는다. work는 그 입력과 기존 읽기 집합을 읽는다. 구속 ADR을
   열 수 없으면 기준선 전체를 가설로 두고, 사용할 문장을 현재 정본 또는 사용자 확인으로 다시
   결정하기 전에는 구현 근거로 쓰지 않는다. 저장 revision이 같아도 현재 구속 ADR이 기준선과
   충돌하면 ADR이 이긴다. Covered cards 밖의 카드는 split·verify가 변화량으로
   판정하며 work의 자동 통독 목록이 아니다.
4. 여러 카드는 같은 능력에서 동시에 진행할 수 있다. 진행 중에는 기준선을 수정하지 않는다.
5. verifier 판정과 5단계 폐쇄 게이트 둘 다 통과한 뒤 최종 능력 폐쇄의 시작 커밋에서 처리한다.
   파일이 있으면 갱신한다. 파일이 없고 권고 발동의 등록 파일이 있거나 확정된 다른 발동 규칙이 그
   능력을 적용 대상으로 만들었으면 생성한다. 그 밖에는 기준선 연산을 만들지 않는다. 현재 구현의
   네 revision·능력 product digest·능력 코드 digest·능력 입력 digest·검증 시각을 쓰고 현재
   `.stale.` 아닌 `.done.` 작업 카드 번호 전체로 Covered cards를 교체한다. 현재 product 능력 행은
   Product-capability-number-json의 번호 token 전체로 정확히 하나를 결정하고,
   Product-capability-row-json은 줄 끝을 제외한 그 행 전체로 교체한다. 번호가 없거나 중복되면
   입력은 `미해결`이다. 새로 생성하거나 갱신할 때는 7절의 기본 갱신 집합을 이 폐쇄에서 한 번
   읽는다. 저장 Covered 비교 결과가 `변경`이거나 그 digest가 저장값과 다를 때만 Covered history
   확장도 읽는다. 그 뒤 현재 전체 카드 목록으로 최종 교체 Covered digest를 따로 계산하고 그
   목록과 digest를 함께 쓴다.

verify 5단계의 `능력 코드 범위`가 미해결이면 기존 표준 게이트가 `미검증`으로 폐쇄를 막으므로 이
생명주기에 도달하지 않는다. 두 폐쇄 게이트가 통과한 뒤 기준선 전용 product·input digest만
`미해결`이면 능력 폐쇄를 막지 않는다. 기준선과 등록 파일을 byte 그대로
보존하고 기준선 연산 없이 닫은 뒤 다음 최종 능력 폐쇄에서 다시 시도한다. 기존 기준선은 그동안
7절의 가설 규칙으로 읽는다. 정의된 binary-safe 직렬화·hash 절차 자체를 실행할 수 없는 것은
snapshot 입력의 `미해결`이 아니다. 시작 marker 전에 실패 사다리로 처리하고 `[]` 이유로 쓰지 않는다.

런타임에 채택할 때 verify 7단계의 시작 transaction을 확장한다. 기존 능력 닫기 marker에
`baseline-operations: <JSON 배열>` 필드를 추가하고, 배열 항목은 규칙 정본 `라우팅 쓰기 순서`의
정확한 write·delete 문법과 UTF-8·경로 의미를 그대로 쓴다. `[]`는 기준선 연산 없음이다. 비어 있지
않으면 첫 항목은 정확한 기준선 경로와 최종 전체 UTF-8 내용을 가진 write다. 둘째 항목은 같은
transaction에서 없던 기준선을 생성해 기존 등록 파일을 소비할 때만 그 정확한 등록 경로의 delete일
수 있다. 기존 등록 파일이 생성 자격이면 둘째 delete가 필수다. 등록을 쓰지 않는 확정 정책이고
등록 파일이 없을 때만 create write 하나를 허용한다. delete-only와 셋째 항목은 유효하지 않다.
갱신은 등록 파일을 삭제하지 않는다.

marker의 배열을 실행하기 전에 규칙 정본의 marker 유효성 검사가 marker의 `head` 입력 snapshot에서
다음을 모두 확인해야 한다. marker의 능력과 확정된 번호·안정 키 정책이 baseline·등록의 정확한 경로
하나씩을 결정한다. 기준선과 등록 파일이 함께 있으면 차단 이상이다. 비어 있지 않은 배열의 write
내용은 5절의 문서 계약과 절 순서를 지키고, 네 revision은 통과 Record와 같다. Product·Verification·
Capability revision은 marker와도 같고 Code revision은 통과 Record와 현재 재사용 검사를 통해 확인한다.
digest·Covered cards는 marker 작성 전에 계산한 최종 교체 값과 같다. marker의 `head`에서 기준선이
없을 때만 create이고, 기준선이 있으며 등록 파일이 없을 때만 refresh다. 등록 기반 create의 delete는
같은 create가 소비하는 기존 등록 파일 하나를 반드시 가리킨다. 등록을 쓰지 않는 정책의 create에는
delete와 등록 파일이 모두 없다.

`[]`는 marker `head`의 정책상 기준선 연산 자격이 없거나 6절이 이름 붙인 기준선 전용 product·input
digest가 그 snapshot에서 `미해결`일 때만 유효하다. 검사는 같은 snapshot에서 그
이유를 결정적으로 다시 계산하고, 기준선·등록 경로 쌍을 byte 그대로 보존한다. 그 밖의 `[]`는 필요한
create·refresh를 건너뛰는 차단 이상이다. 어느 분기든 하나라도 실패하면 차단 이상이며 payload를
실행하거나 다시 생성하지 않는다.

적용 순서는 `verify.md` 통과 기록 → payload를 가진 journal 능력 닫기 marker → 배열의 write →
등록 기반 create의 필수 delete다. marker 뒤에는 내용을 다시 생성하지 않는다. marker가 미커밋이면 HEAD가 marker의
`head`와 같아야 한다. 그 `head` tree에 기존 통과 기록과 marker를 적용한 뒤 배열을 순서대로 적용한
예상 tree와 staged·unstaged·미추적 경로를 포함한 현재 checkout 전체를 byte로 비교한다. 정확한
접두 하나이면 남은 접미만 적용해 전부 `경계 정리 — begin <능력 번호>` 커밋에 착지시킨다. 같은 최종
byte의 미추적 기준선도 write까지 적용된 접두다.

marker가 이미 commit됐으면 현재 checkout을 그 접두와 비교하지 않는다. 그 정확한 marker 줄을 처음
포함한 `경계 정리 — begin <능력 번호>` commit이 하나여야 하고, 그 첫 부모가 marker의 `head`이며,
그 commit tree가 통과 기록→marker→배열 전체를 적용한 최종 tree와 byte로 같아야 한다. 통과한 뒤
현재 HEAD tree와 staged·unstaged·미추적 checkout에서 결정된 기준선·등록 경로 쌍은 marker `head`의
쌍에 배열을 적용한 정확한 사후 상태와 byte로 같아야 한다. `[]`는 두 경로를 byte 그대로 보존한다.
비어 있지 않은 create·refresh는 기준선을 payload byte로 만들고 등록 파일을 없앤다. 다른 descendant나
8단계 접두가 이 사후 상태를 바꾸면 차단 이상이다. 이 검사를 통과하면 기존 revision·
devflow 밖 변경 재사용 판정을 거쳐 8단계로 간다. marker와 payload는 그 begin commit에
남고, 기존 verify 8단계의 marker 삭제가 payload도 함께 없앤다. 그 단계의
`verify.md`→`journal.md`→폴더 rename 순서에는 기준선 연산을 넣지 않는다.

다중에서 begin이 통합 브랜치에 착지하기 전에 통합 tip이 marker의 `head` 뒤로 전진하면 그 begin을
rebase하거나 그대로 밀지 않는다. staged·unstaged·미추적 상태가 자기 payload의 정확한 접두임을 먼저
증명하고, 그 transition이 만든 byte만 되돌려 최신 통합 tip을 포함한다. 아직 공유하지 않은 begin
commit이 있으면 그 commit만 제외하고 앞선 작업 commit은 보존한다. 새 tip에서 revision·두 게이트·
payload를 다시 계산하고 새 `head`로 begin을 다시 만든다. 최신 tip 포함과 자기 transition byte 제거를
정확히 증명할 수 없으면 사용자에게 돌린다.

통과 기록만 쓴 중단에서는 기준선 출력이 아직 없으므로 marker를 만들기 직전에 payload를 한 번
계산한다. marker가 생긴 뒤에는 그 배열만 byte 정본이다. 배열은 줄바꿈을 JSON escape한 한 줄이며,
최종 기준선 내용이 begin commit의 journal blob에 한 번 남는다. 이 이력 비용은 payload를 잃지 않는
최소 복구안의 비용이다. 이를 피하는 별도 prepared→applied 상태와 content hash는 채택하지 않는다.

채택 commit은 이 하위 문구만 추가하지 않는다. 규칙 정본의 능력 닫기 marker 형식·시작 연산 목록·
접두 복구·project 문서 소유권을 함께 확장한다. 정상 폐쇄에서는 split만 등록 파일을 만들고 verify만
기준선을 생성·갱신하며 같은 create의 등록 파일을 소비한다. 제품 은퇴 구속 transaction에서는
product가 기준선 없는 등록 파일 삭제와 선택된 `.retired.` rename을 소유한다는 예외를 규칙 정본에
둔다. verify 7단계는 위 payload를 생산·소비하고 resume은 이 확장 접두를 정규 전환으로 라우팅한다.
work·split의 소비 규칙도 같은 commit에서 바꾼다. 권고 안정 키 소유 방식을 채택하면 product가 최초
생성·재실행·기존 문서 이관에서 능력 행 말미 필드를 쓰고 보존하며, split은 그 필드가 확정된 뒤에만
등록한다. 규칙 정본보다 아래에만 있는 예외는 만들지 않는다.

같은 채택 commit은 정합성 점검에 능력 기준선 좌표를 추가한다. 유효한 폐쇄 접두 밖에서는
`capabilities/` 바로 아래의 각 파일이 선택된 정책으로 정확한 능력 번호·안정 키 하나에 결정되고,
파일명과 내부 Stable key가 같으며, 기준선이나 등록 형식 중 하나로 parse되고, 필수 절·필드가 정확히
한 번 존재해야 한다. JSON 필드는 표시된 종류로 parse되고 Covered cards는 중복 없이 정본 카드 번호
순서여야 한다. 같은 능력 번호나 안정 키에 파일이 둘 이상이거나 기준선과 등록 파일이 함께 있으면
정합성 이상이다. 저장 Product-capability-row-json이 현재 행과 다른 것과 Covered 번호가 현재 tree에서
변경된 것은 신선도 판정이지 형식 이상이 아니다. 형식 이상에서는 기준선을 읽을 것으로 주거나
기준선 연산을 만들지 않고 보고하며, 자동 보정하거나 값을 추측하지 않는다.

기준선 생성·갱신은 능력 경계 커밋에만 포함한다. 별도 지식 커밋이나 카드별 갱신을 만들지
않는다.

## 7. 신선도와 충돌 규칙 후보

아래 판정이 기준선을 확정 사실로 쓰지 못하게 하면 work는 그 기준선을 가설로만 읽고 기존 읽기
집합을 넓히지 않는다. 그 가설의 문장을 구현 판단에 쓰려면 기존 읽기 집합의 정확한 현재 권위 경로
또는 기존 코드 검색 경계 안의 정확한 현재 경로에서 다시 확인한다. 둘 밖으로 경계를 넓히지 않으며,
모든 과거 카드나 전체 능력 코드를 work 호출마다 읽지 않는다.

verify는 다음 최종 능력 폐쇄에서 서술을 읽기 전에 revision·digest를 계산한다. 능력 입력 digest를
계산할 때 Covered card에서는 정확한 `의존` 필드와 hash 입력만 기계적으로 추출하며 카드 나머지를
모델 입력에 넣지 않는다.

**기본 갱신 집합**은 기존 기준선이 있으면 그 파일, 현재 product.md·arch.md·code-style.md·glossary.md·
journal.md와 존재하는 design.md, 5절의 전체 `능력 코드 범위`, 기준선 Binding-adrs-json의 모든 exact
저장소 경로, Covered cards 밖의 현재 `.stale.` 아닌 `.done.` 카드와 각 카드의 직계 `의존`·
존재하는 정확한 `읽을 것` 경로다. 기준선이 없으면 모든 현재 `.stale.` 아닌 `.done.` 카드가 Covered
밖이므로 이 집합이 첫 생성 입력 전부를 포함한다.

저장 Covered 비교 결과가 `변경`이거나 그 digest가 저장값과 다를 때만 **Covered history 확장**을
더한다. Covered cards 각 번호의 현재 트리 일치가 0개 또는 1개이면 그 1개와 그 카드의 직계
`의존`·존재하는 정확한 `읽을 것`
경로를 읽는다. Existing-records-json의 기존 기록은 기본 집합이나 확장의 `읽을 것` 경로와 정확히
같을 때만 연다. Product-capability-number-json의 번호 token 전체로 현재 product.md 행을 정확히 하나
결정한다. 번호가 없거나 중복되면 기준선을 만들거나 갱신하지 않고 보고한다. Covered 번호가 2개
이상에 일치하면 정합성 이상으로 멈춘다. 임의의 decisions 폴더나 두 집합 밖의 코드·카드·문서는
열지 않는다.

work에서는 저장 Product revision이 다르면 product 관련 문장, Verification revision이 다르면 기준선
전체, Code revision이 다르면 코드 관련 문장을 즉시 가설로 둔다. work는 아래 digest를 재계산하지
않고, 사용할 문장만 기존 읽기·코드 검색 경계에서 확인한다. 현재 카드와 직접 입력은 기준선보다
우선한다. 이 판정 전에 work는 규칙 정본이 정한 현재 tree 상태에서 대상 능력 아래의 `.stale.` 아닌
`.done.` 카드 번호 집합을 파일명과 상태만으로 열거한다. 그 집합이 Covered cards와 다르면 기준선
전체를 가설로 둔다. 카드 본문을 열거나 digest를 재계산하지 않는다. 아래 재계산 네 항목은 verify의
최종 폐쇄 전용이다.

- Product revision이 다르면 verify가 능력 product digest를 다시 계산한다. 저장값과 같으면 product 관련
  기준선은 계속 쓰고, 값이 `미해결`이거나 다르면 기준선 전체에 기본 갱신 집합을 쓴다.
- Verification revision이 다르면 verify가 기준선 전체에 기본 갱신 집합을 쓴다.
- Code revision이 다르면 verify가 현재 전체 `능력 코드 범위`와 digest를 다시 계산한다. digest가 같을 때만
  코드 관련 기준선을 계속 쓴다. 범위가 미해결이거나 digest가 다르면 기본 갱신 집합을 쓴다.
- verify가 기존 기준선의 Covered cards로 저장 Covered 비교 digest를 계산한다. 저장값과 같으면
  Covered cards 밖의 현재 대상 능력 카드를 기본 갱신 집합의 변화량으로 읽는다. 결과가 `변경`이거나
  digest가 다르면 Covered history 확장을 더한다. `미해결` 정합성 이상이면 기준선 연산을 만들지
  않는다. 서술을 재검증한 뒤 현재 전체 카드 목록으로 최종 교체 Covered digest를 별도로 계산하며,
  그 값이 `미해결`이면 기준선 연산을 만들지 않는다.
- 기준선과 코드가 충돌하면 코드를 우선한다. 구속 결정의 충돌은 규칙 정본의 문서 계층을 그대로
  따른다. Binding-adrs-json의 ADR은 규칙 정본 문서가 그 정확한 경로에 권위를 명시적으로 위임한
  범위에서만 구속 결정을 이긴다. External-references-json은 근거일 뿐 구속 결정을 이기지 않는다.
- `.stale.` 카드의 결론은 현재 기준선의 근거가 될 수 없다. 5절의 전체 `능력 코드 범위`에서 다시
  확인된 내용만 남긴다.
- 능력 은퇴는 현재 product.md와 트리 상태에서 읽으며, 권고 보존 방식을 택하면 기준선 파일을
  수정하거나 개명하지 않는다. `.retired.` 파일명 대안을 택한 경우에만 제품 은퇴 구속 결정
  커밋에서 기준선을 함께 개명한다. 이는 능력 폐쇄 경계 밖에서 기준선을 바꾸는 유일한 예외다.
  기준선이 없고 등록 파일만 있으면 같은 은퇴 커밋에서 등록 파일을 삭제한다.

Product revision이 달라지면 work는 다른 능력 행만 바뀐 경우에도 다음 최종 폐쇄에서 target-row
digest를 확인하기 전까지 product 관련 문장을 가설로 읽는다. Verification revision은 arch.md·
code-style.md·glossary.md 전체를 묶으므로 다른 능력만 바뀌어도 기준선 전체가 다음 폐쇄까지 가설이
되는 보수적 비용이 있다. Code revision도 devflow 밖의 프로젝트 전체에서 가장 최근에 변경된 commit을
가리키므로 무관한 코드 변경만 있어도 work는 다음 최종 폐쇄까지 코드 관련 문장을 가설로 읽는다.
verify는 그때 능력 코드 digest가 같으면 전면 갱신을 피한다. 이 후보는 능력별 verification·code
revision을 추가하지 않는다. 대신 work 호출마다
전면 재독하지 않고 최종 폐쇄에서 기본 갱신 집합을 한 번 쓰며, 저장 Covered 비교가 바뀐 경우에만
Covered history 확장을 더한다.

## 8. 병렬 작업 시뮬레이션

| 시나리오 | 실행 축 | 지식 축 | 결과 |
|---|---|---|---|
| 신규 MVP를 한 번에 완성 | 카드가 전 과정을 보유 | 기준선이 없거나 첫 폐쇄에서만 생성 | A안과 같은 낮은 비용 |
| 화면을 보며 같은 능력을 반복 개선 | 재개봉 카드가 변화량을 보유 | split은 Covered cards 밖 번호를 변화량으로 판정하고, work는 Depends·읽을 것으로 선택된 정확한 입력만 읽으며, verify는 폐쇄에서 전체 변화량을 압축 | 과거 전체를 매 작업마다 재독하지 않음 |
| 능력이 오래 열린 채 유지됨 | 대기·점유·완료 카드가 현재 상태를 보유 | 기준선은 마지막 성공 폐쇄에 머물고 Covered cards와 현재 완료 번호가 다르면 가설이 됨 | 최신상을 위조하지 않으며 압축 갱신은 다음 폐쇄까지 지연 |
| 두 사용자가 같은 능력의 다른 카드를 수행 | 각자 점유와 의존을 유지 | 둘 다 기준선을 읽고 아무도 중간 수정하지 않음 | 지식 파일 때문에 작업이 직렬화되지 않음 |
| 한 카드가 UI, 다른 카드가 API를 수정 | 트리가 순서·병렬 가능성을 결정 | 수직 계약을 한 파일에서 공유 | 계층별 지식 분열 방지 |
| 공유 계약을 여러 능력이 소비 | 각 능력 카드가 실제 변경을 소유 | 각 기준선은 정확한 공유 경로를 가리킴 | 다음 검증 때 영향받은 기준선만 갱신 |
| 브라운필드에 기존 핸드오프가 있음 | 도입 이후 카드만 생성 | split이 색인을 현재 변경과 재대조해 카드 `읽을 것`에 넣은 문서만 첫 기준선 입력으로 읽고 5절의 전체 `능력 코드 범위`로 재확인 | 과거 카드 소급 생성 없음 |
| 기준선 이후 무관한 코드만 변경 | 카드 상태는 불변 | 능력 코드 digest가 같음 | 불필요한 전면 갱신 없음 |
| 기준선 범위의 코드가 직접 변경 | 변경 카드 또는 작업 밖 변경이 존재 | 기준선은 불일치로 취급 | 낡은 설명을 확정 사실로 사용하지 않음 |
| 능력이 은퇴 | 트리가 `.stale.`·은퇴 상태를 보존 | 안정 키가 마지막 기준선 연결을 보존 | 지식을 삭제하지 않고 역사로 유지 |

## 9. 좌표 점검

| 축 | 정의됨 | 적용 없음 | 남은 선택 |
|---|---|---|---|
| 프로젝트 종류: 신규·브라운필드 | 둘 다 후보 흐름 존재 | 없음 | 등록 정책 |
| 작업 형태: 선형·반복·병렬 | 세 형태 모두 실행 축과 분리 | 없음 | 등록 정책 |
| 구현 면: 프론트엔드·백엔드·수직 | 수직 능력이 기본 | 독립 능력이 아니면 계층별 파일 없음 | 안정 키 부여 위치 |
| 공유 구조: 능력 전용·공유 구성요소·독립 능력 | 전용 경로는 해당 기준선, 공유 경로는 영향 계약만, 독립 product 능력은 자체 기준선 | 독립 검증 경계 없는 구성요소 기준선 | 없음 |
| 기록 상태: 대기·점유·완료·stale·은퇴 | 각 소비 규칙 존재 | stale은 근거에서 제외 | 은퇴 파일명 정책 |
| 기준선 파일: 없음·등록만·기준선만·둘 다·형식 이상 | 정책상 연산 없음·create·refresh·유효 폐쇄 접두 밖 이상·형식 이상으로 판정 | 없음 | 등록 정책 |
| 폐쇄 시점: 첫 폐쇄·재개봉·장기 미폐쇄 | 선택된 등록 뒤 생성·갱신·가설 유지 | 미검증 중간 상태 갱신 없음 | 없음 |
| 의존: none·현재 done·역사 stale·누락·중복 | 빈 집합·현재 hash·hash 전용·변경 또는 미해결·미해결로 판정 | 역사 stale은 서술 근거 아님 | 없음 |
| 신선도: 동일·무관 변경·범위 변경·미커밋 | 능력 product digest·정규 능력 코드 범위·digest·Covered cards로 판정 | 없음 | 없음 |
| 소비자: split·work·verify·resume·역할 계약 | split/work/verify만 후보 소비 | resume과 검토·검증 역할은 전체 기준선을 자동 통독하지 않음 | 없음 |

## 10. 채택 전 소유자 선택

세 선택은 결과와 비용을 바꾸므로 자동으로 확정하지 않는다.

1. **등록 정책** — 아래 셋 중 하나를 고른다. 세 정책 모두 6절의 같은 `.pending.md`를 디스크 근거로
   쓰며 대화만으로 등록하지 않는다. 권고는 이미 구현된 능력의 첫 유지보수 카드를 승인하는 계획
   commit에서 split이 등록하고, 그 주기의 verifier와 두 폐쇄 게이트를 통과한 최종 능력 폐쇄에서
   생성하는 방식이다. 첫 구현 정책은 split이 각 능력의 첫 구현 층을 계획할 때 등록해 첫 최종
   폐쇄에서 생성한다. 명시 선택 정책은 사용자가 해당 능력을 선택한 계획을 승인할 때만 split이
   등록하고 다음 최종 폐쇄에서 생성한다.
2. **안정 키의 소유 위치** — 권고는 product.md 능력 행의 명시 키다. 이 안을 고르면 현재 행과 은퇴
   행은 모두 정확한 말미 필드 ` [stable-key=<stable-key>]`를 한 번 가지며, 실제 값은 예를 들어
   `[stable-key=customer-management]`다. 필드 뒤에는 다른 byte를 두지 않고 은퇴 시에도 값을
   보존한다. 기존 product.md는 등록 전에 사용자가 확인한 키를 한 구속 결정 commit으로 이관한다.
   대안은 트리의 첫 능력
   번호나 파일명 slug다. 첫 트리 번호는 브라운필드의 트리 표현 전에는 없고 지식 identity를
   실행 구조에 묶는다. 파일명 slug는 파일이 생기기 전 소유 위치가 없어 별도 충돌 규칙이 필요하다.
3. **은퇴 보존 방식** — 권고는 같은 파일을 수정 없이 유지하고 은퇴 상태를 현재 product.md와
   트리에서 읽는 방식이다. 대안은 `.retired.` 파일명인데, 모든 포인터를 함께 바꾸는 이관 규칙이
   필요하다.

## 결론

도메인 전문성 계층의 필요성은 확인됐다. 그러나 작업 단위와 도메인 단위를 통합하는 방식은
기각한다. 권고안은 **마지막으로 갱신에 성공한 검증 기준선 + Covered cards 밖의 현재 작업 카드**의 결합이며, 트리·카드·users/
점유는 그대로 실행 정본이다.

이 구조는 중계노트의 현재 동작·계약·함정·검증 지식을 보존하면서 연대기 비대와 동시 작성
충돌을 줄인다. 다만 등록 정책·안정 키의 소유 위치·은퇴 보존 방식은 프로젝트의 문서 비용과
이관 방식을 바꾸는 소유자 선택이다. 따라서 v0.9.21에는 구현하지 않고 이 문서에서 멈춘다.
