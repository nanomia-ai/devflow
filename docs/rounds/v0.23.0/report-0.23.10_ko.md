# v0.23.10 결과 보고 — 응집된 지식 단위를 정확한 현 위치에 착지

날짜: 2026-09-06
시작 HEAD: `c0924ffa257e74f9a57f619657a1cf938e7cefb4`
범위: Principles의 공통 K/Foundation 계약, 최초 Adopt의 지식 단위별 착지와 반증, 관리 Arch의 현 위치 갱신, 대응 결정·용어·매트릭스·릴리스 기록

## 요청과 보존한 전제

사용자가 직접 확인한 결함은 실제다. v0.23.9로 최초 프로젝트 판단, 문서 생성 흐름, 승인 전
clean-context 재반증은 정상 작동했지만, 생성 예정 트리와 결과 문서에서 함께 유지보수해야 할
중요 지식이 여러 곳으로 흩어지고 문서의 중심 목적이 희석됐다. 이번 수리는 그 성공 경계를
되돌리거나 같은 문제를 다시 푸는 작업이 아니다.

사용자 평가 원문 `DEVFLOW-KNOWLEDGE-STRUCTURE-REVIEW.md`는 39,268 byte 전체를 읽고 관측과
제안을 분리했다. 작업 전후 SHA-256은 모두
`f67c29dc0c841118ed61381bdda40420ba0f343203b5bef0d37e2fd683d0a7ea`이며, 파일은 끝까지 untracked
read-only evidence로 남겼다. 수정·이동·삭제·stage·commit하지 않았다.

## 확정 원인과 소비 경로

현재 bytes를 Principles→Product/Adopt/Arch/Design→Resume/Direct/Work/Verify 소비 경로로 대조한
결과, 결함은 새 지식층 부재가 아니라 기존 K의 의미 경계와 최초 착지 연결이 충분히 드러나지 않은
것이었다.

1. Principles는 K를 `one topic`과 owner-document `overflow`로도 설명했다. 연구 정본에는
   독립 소비자·자기완결·독립 갱신 주기가 모두 있어야 가른다는 기준이 있었지만 런타임 공통 계약에는
   없었다. 처음 보는 모델은 길이, 제목, 키워드 유사성을 분할 근거로 삼을 수 있었다. 최초 통합
   수정 뒤에도 같은 policy index의 `inputs-and-entry.md`에는 greenfield 지식을 overflow 전까지
   capability 문서에 둔다는 옛 종속절이 남아 새 공통 계약과 실제로 다른 배치를 지시했다.
2. Adopt는 모든 source의 처분과 큰 의미 소유자는 요구했지만 source inventory의 세부
   지식 단위와 제안의 owner/K 경로를 한 행으로 연결하지 않았다. 둘을 각각 완성해도 한
   단위가 여러 현 정본으로 흩어지거나 일부가 미착지할 수 있었다.
3. Foundation이 오직 `arch.md`가 이름 댄 공용 계약·경계만 담고 code style, verify-channel 세부,
   보편 규칙을 복사하지 않는다는 경계는 Adopt 단계 5와 refuter가 여는 고정 구간 밖에 있었다.
   따라서 실제 관측의 VERIFICATION→Foundation 오착지를 현 반증 입력만으로 안정적으로 막지 못했다.
4. Arch의 관리 갱신 문구는 기존 단위를 고치는 경우에도 다음 미사용 K 번호를 고르라고 읽혔다.
   이는 DD-77의 현재 위치 교체와 충돌해 같은 개념의 둘째 K를 만들 수 있었다. 최초 통합 수정의
   existing-locus 규칙도 recursive 계열에서만 실행돼, compact/partial-compact를 고르면 owner만
   바꾸고 기존 K를 stale로 둔 채 marker를 소비할 수 있었다. 현 state predicate는 의도대로 owner
   변경을 승인하므로 이는 새 predicate가 아니라 mode 판단과 공통 착지 계약의 누락이었다.
   `Source basis`도 현재 카드만 쓰는 것으로 오인하면 여전히 유효한 이전 근거를 잃을 수 있었다.
5. 같은 경계를 `cohesive unit`, `cohesive source unit`, `load-bearing unit`, `source unit`으로 달리
   불렀고 Arch workflow에는 옛 `knowledge-overflow topic` 명칭도 남아 있었다. 서로 다른 집합이
   아니라 모두 독자가 함께 읽고 같은 이유로 바꾸는 동일 경계였다.

분해 판정은 다음과 같다. 공통 Devflow 계약 결함은 K 응집도·semantic owner·Foundation 범위,
개별 소비 결함은 Adopt의 지식 단위→target/refuter와 Arch의 existing-locus refresh였다. 출력 shape에는
Adopt proposal 및 Architecture `Existing records`의 행 문법 공백이 있었지만 새 template 계층은
필요하지 않았다. Skill Rails 자체 결함이나 state-tool predicate 결함은 없었고, 테스트 입력의
특수성만으로도 설명되지 않았다.

## 평가 문서 제안의 채택과 기각

채택한 핵심은 “함께 유지보수할 지식을 한 응집된 현재 위치에 둔다”는 관측과 그 결과 조건이다.
이를 기존 owner-shaped K 안에서 구현해 한 K를 “독자가 함께 필요로 하고 같은 이유로 바꾸는 현재
지식 단위”로 정의했다. 자식 K는 독립된 독자와 변경 경계가 함께 있을 때만 만들며, 120줄은 계속
소프트 보고선이지 강제 분할선이 아니다.

다음 제안은 현재 bytes와 결정 계보에 맞지 않아 기각했다.

- K가 evidence/history 전용이라는 원인: 거짓이다. 현 K는 현재 규범 깊이도 소유하고 DD-77에 따라
  현 위치를 교체한다.
- mandatory 중간 module 문서층: DD-28·DR-30의 둘째 거처 문제를 되살리고 현 K와 경쟁한다.
- custody mode/registry, claim graph, fingerprint, generated catalog: source→owner의 한 번짜리 착지
  결함을 영구적인 두 번째 권위와 동기화 문제로 바꾼다.
- 새 stage, classifier, marker, state predicate, validator, index: 현 실패는 기존 Adopt proposal과
  refuter 입력, Arch 갱신 규칙 안에서 닫히며 새 기계 상태가 판정할 값이 아니다.
- 외부 문서의 ongoing drift trigger와 240줄/24KiB 개봉 상한 변경: 장기 실사용 증거가 아직 없고
  이번 최초 착지 실패를 닫는 데 필요하지 않다. 현 상한의 잠정성은 기존 backlog가 소유한다.
- Layer 0 K의 모든 downstream 소비 확대: 정확 소비자가 확인되지 않은 무유계 읽기 확대이므로
  이번 범위에서는 미검증 carry-forward다.

## 통합 수정

공통 정본은 Principles에서 한 번 고쳤다. `capsules-and-provenance.md`가 K 응집도와 분할 경계,
지배 질문과 독자로 고르는 가장 가까운 semantic owner, soft-cap 예, 기존 K가 소유한 지식 단위는
그 현 경로에서 갱신한다는 one-current-locus 불변식을 소유한다. `inputs-and-entry.md`의 옛
overflow-only 종속절은 새 설명을 덧붙이지 않고 이 공통 capsule 계약을 가리키는 문장으로
치환했다. Foundation의 내용 경계는 그 파일에서 지우고 모든 작성자·refuter가 이미 여는
`baseline-contract.md`의 identity로 이동했다. 새 사실을 복제하지 않은 순이동이다.

Adopt는 inventory를 지식 단위 또는 supporting group으로 만들고 각 행을 정확한 owner
document/planned K path 또는 disposition evidence/reason에 연결한다. 같은 원자료가 여러 단위를
지지할 수 있지만 단위 하나는 온전하게 한 current target에 착지한다. proposal과 Architecture
template에 그 한 줄 행 문법을 드러냈고, 기존 clean-context refuter가 지식 단위별 mapping과
Foundation 범위를 읽어 필수 단위 미착지·현 target 분산/복제를 기존 blocking threshold 안에서
막는다. 새 refutation pass나 판정 상태는 없다.

Arch는 mode 판단 전에 항상 읽는 workflow를 통해 shared opening/selection row를 열고, 그
owner-bounded projection으로 기존 K를 찾는다. 기존 K가 소유하면 recursive/partial-recursive를,
새 단위가 owner 문서 안에서 완결될 때만 compact/partial-compact를 고르며 두 종류가 섞이면 기존
multi-mixed를 쓴다. knowledge-landing 항목 2에서는 이 판단의 낡은 복사본을 지우고 원자료 길이에
끌리지 않는다는 자기 몫만 남겼다. 항목 3이 기존 K path 교체와 새 단위 번호를 소유한다. 따라서
모든 기존 mode/action으로 K 갱신을 실행하며 새 detector나 state predicate는 없다. 기존
`Source basis`는 여전히 주장을 지지하는 동안 보존하며 현재 card range를 더하고, 근거 삭제는
그 문장과 함께 또는 대체 원자료 재확인 뒤에만 한다. 같은 source-to-owner 행 shape를 Adopt와
공유하는 Architecture template에도 맞췄다.

네 표면형은 maintenance protocol §9의 `knowledge unit`/`지식 단위` 한 용어로 통일했다. Arch의
낡은 `knowledge-overflow topic`은 실제 두 policy row를 직접 지목하는 문장으로 치환했다. 기계
schema·field·action id는 늘리지 않았다.

DD-103이 이 선택과 기각 계보를 소유하며 Arch 주장은 위 mode 연결을 포함한 실제 bytes와 맞는다. 상태 행이 움직인 DD-76·DD-92·DD-97·DD-102를 양 언어
결정 원문에 연결했고, 한국어 전용 매트릭스 §3.18·§3.24와 §6 부분 재판정을 갱신했다. Product,
Design, Direct, Work, Verify, Resume, state tool은 읽기 대조 뒤 변경하지 않았다. 기존 intent와
obligation ledger는 각각 독립 frontier/현재 target, 완전한 source disposition/K plan을 이미
소유하므로 새 의무를 만들지 않았고, 행동 정밀화만 spec/body/reference/template에 투영했다.

별도 명백 결함 하나는 직접 고쳤다. Arch의 현재 obligation ledger는 시작 HEAD부터 160개 atom을
전부 `projected`로 갖지만 source fixture 제목과 두 assertion만 158에 고정돼 있었다. 실행에서
처음 드러난 이 문자 충돌을 160으로 맞춘 뒤 같은 test를 재실행했다. 제품 의미는 바뀌지 않는다.

## 변경량과 경로

시작 HEAD 대비 실행 원문은 총 `+60/-40`줄이다. 이 중 fixture 정정·보강이 `+13/-3`, 실제
계약·소비·template 변경은 `+47/-37`이다. 최종 R1·R2 수리 자체는 `+7/-2`이며, 이 가운데 기존
projection·뺄셈 계약을 지키는 source fixture가 `+5/-0`, 정본 산문은 `+2/-2`다. Skill Rails가
다시 만든 `.generated.json` 세 파일은 `+20/-20`이며 런타임 의미 줄 수와
분리했다. 결정·용어·매트릭스·CHANGELOG·manifest는 위 수치에 포함하지 않았다.

수정한 실행 경로:

- Principles: `.generated.json`, `references/knowledge/{baseline-contract,capsules-and-provenance,inputs-and-entry}.md`
- Adopt: `.generated.json`, `authoring-card.md`, `body.md`, `spec.mjs`, `references/workflow.md`,
  `templates/{adoption-proposal,architecture}.md`
- Arch: `.generated.json`, `body.md`, `spec.mjs`, `references/{workflow,knowledge-landing}.md`,
  `templates/architecture.md`, `fixtures/source/arch-package.test.mjs`
- release/docs: 두 plugin manifest, `CHANGELOG.md`, 양 언어 design decisions와 maintenance protocol,
  `docs/usecase-matrix_ko.md`, 이 보고서

생성한 경로는 이 보고서 하나다. 삭제·이동한 경로는 없다. Skill Rails 임시 유지 스크립트와
semantic-diff 작업 출력은 최종 diff에 남기지 않았다. 생성 산출물을 손으로 고치지 않았다.

## 표적 검증

- Skill Rails fast lint: Principles·Adopt·Arch 모두 `L-fast: pass`.
- Skill Rails build: 세 패키지 모두 성공; mutation L0–L18, fixture 반복, generated receipt 갱신 성공.
- Skill Rails full lint: 세 패키지 모두 `L-structural: pass`.
- Skill Rails eval 200회: Principles `10/10`, Adopt `11/11`, Arch `54/54`, mismatch 0.
- Adopt project simulation: 3개 fixture, 대표 6개 시나리오 통과.
- Principles source test: 4/4 통과.
- Arch source test: 최초 5/6에서 시작 HEAD부터 stale이던 `158 !== 160`만 실패; assertion 정정 뒤
  `READ_FIRST` workflow, owner-bounded projection, 항목 2 뺄셈, mode별 K-write 연결을 함께 잠갔고
  rebuild 뒤 6/6 통과.
- 양 언어 `decision-index.mjs`: 성공, DD-103과 네 partial-correction 연결 확인.
- `git diff --check`: 통과.

## 자기 재감사와 종료 조건

Opus 독립 전체 diff 감사 전문
`C:/Users/joinj/AppData/Local/Temp/orca/OPUS-KNOWLEDGE-COHESION-AUDIT.md`를 처음부터 끝까지 읽고
current bytes와 직접 소비자를 다시 대조했다. 표면 verdict는 PASS였지만 §3.1 충돌 때문에 감사
§5 종료조건이 거짓이라는 본문 판정을 그대로 받아 release-ready로 간주하지 않았다. §3.1의 인접
공통 규칙 충돌, §3.2의 compact/partial-compact stale-K 장면, §3.3의 기록 과장 위험, §3.4의 네
용어 표면, §4.4의 낡은 topic 명칭은 모두 재현됐고 하나의 공통 K 응집·현 위치 계약으로 수렴했다.

두 번째 유계 재감사 전문
`C:/Users/joinj/AppData/Local/Temp/orca/OPUS-KNOWLEDGE-COHESION-REAUDIT.md`도 처음부터 끝까지 읽었다.
선행 다섯 소견이 닫힌 것은 current bytes에서 재확인했다. 새 R1은 mode 판단이 기존 K 소유 여부를
묻지만 collector는 marker의 owner/source만 투영하고 Arch가 여는 shared-policy 행에는 기존
owner-bounded projection이 연결되지 않은 조합 결함으로 재현됐다. R2도 knowledge-landing 항목 2가
그 mode 조건을 불완전하게 복사하고 옛 `topic` 표현을 남긴 중복으로 재현됐다.

수정된 문장과 직접 소비자를 다시 걸었다. 공통 정의와 one-current-locus 불변식은 Principles 한
곳, Adopt의 최초 착지 행동은 한 곳, Arch의 mode 선택은 body, 그 판단 수단은 항상 읽는 workflow,
현 위치 쓰기는 knowledge-landing 항목 3에 남는다. 항목 2의 중복 두 문장은 삭제했다. 동일 사실의
새 registry/index는 없고, 옛 overflow-only 종속절과 topic 명칭은 공통 포인터와 정본 용어로
치환했다. v0.23.9의 진입·승인·두 commit·same-stem 경계와 다른 단계의 writer 권한은 그대로다.

감사 지침 §5 종료 절을 다음처럼 평가했다.

- 현 self-review에서 Opus §3.1~§3.4·§4.4와 R1·R2 규칙 충돌·소실·조합 경로 클래스: 0.
- 남은 항목: fresh-agent 실제 생성 품질과 장기 응집도처럼 실측이 필요한 관찰뿐이며 새 텍스트
  수리 finding은 없다.
- 적용한 수리: 기존 모호한 경계를 exact mapping·현 위치 교체로 수렴시켰고 새 해석 단계나
  반복 full pass를 열지 않는다.
- 개인 회로 차단기: 같은 문장 세 번째 수정 0, 구체 오독 없는 “혼동 가능” finding 0,
  앞 라운드 수리 되돌림 0, 지난 finding만을 근거로 한 항목 0.
- R1·R2 post-edit 독립 확인도 새 소견 0, 감사 지침 §5의 세 종료 조건 참으로 끝났다.

## 미검증과 최종 유계 확인

의도적으로 아직 실행하지 않은 것은 `node --test "scripts/*.test.js"` 전체 suite/Gate A,
gate B 수동 실행, clean Claude/Codex 전후 비교, 사용자의 실사용 재생성이다. 사용자 지침에 따라
긴 suite와 실사용은 실행하지 않았고 통과로 쓰지 않는다.

최종 유계 확인 전문
`C:/Users/joinj/AppData/Local/Temp/orca/OPUS-R1-R2-POSTEDIT-CONFIRM.md`는 시작 HEAD와 갱신된
전체 diff에서 다음 두 좌표를 다시 읽고 `PASS — R1·R2 닫힘 / 감사 지침 §5 종료 조건 참`으로
판정했다.

1. Arch `enter`의 `READ_FIRST`가 여는 workflow가 shared opening/selection row를 선택하고, 그 행의
   `project --under <owner>` 투영으로 본문을 열지 않은 채 기존 K를 찾은 다음에만 body의
   `landing.mode`를 판단하는가.
2. `knowledge-landing.md` 항목 2는 source length 비의존만 소유하고, mode 선택은 body, 기존 K 현
   위치와 새 번호 조작은 항목 3이 각각 소유해 compact 조건과 옛 `topic` 표현의 둘째 집이 0인가.

Opus §4.2 큰 K hard cap, §4.3 Layer 0 K downstream 도달, 외부 원문 drift는 직접 blocker로
승격하지 않고 기존 carry-forward에 남겼으며 Product·Design·Direct·Work·Verify·Resume 별도
검토를 선점하지 않았다.

차단 결함이 없을 때만 같은 기술 책임자에게 후속 dispatch를 돌려 전체 suite와 release gate를
실행하고, 그 뒤 정확히 이 작업 경로만 commit·push·양측 install한다.
