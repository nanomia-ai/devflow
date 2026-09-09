# v0.23.21 구현 보고서

- 날짜: 2026-09-09
- 기준: `01e51b42fe588802513c3413b73036f2a3372929`
- 외부 소유자: 공식 Skill Rails v0.4.1 (`nanomia-ai/skill-rails`, 설치 폴더 해시 `d2d9d3cd03a7b93126867fd671b1d10389a838b1`)

## 결과

0.23.21은 아홉 P2 패키지 Adopt, Architecture, Design, Direct, Principles, Product,
Resume, Verify, Work를 공식 설치본의 `build.mjs --repair-generated`로 한 번의 릴리스
트랜잭션에서 다시 생성했다. 모든 패키지는 runtime 0.3.5, validator 0.6.2, kernel 6과
하나의 runtime hash `sha256:34ae550e8576b283c1a4e9e4deb104d83fe7a826c60ea8221c458bf1c0875fa5`를
공유한다.

0.3.4의 누적 입력 모순은 effect-free `after-input` Decision마다 현재 호출의
`judged`/`decided`만 결합하여 A를 준 뒤 B만 주면 A가 사라지고 같은 Decision이 다시
나올 수 있던 외부 runtime 결함이었다. 0.3.5는 동일한 run, 패키지 내용, canonical
project, target, stable snapshot에서 바로 앞 runtime-observed `after-input` Decision이
자체 봉인한 caller 입력만 이어받고, 새 값은 같은 필드의 보존 값을 대체한다. 다른
continuation이나 바뀌거나 봉인되지 않은 context는 이어받지 않으며 기존
duplicate-Decision emission guard는 그대로 fail-closed이다.

따라서 canonical owner는 Devflow의 Product/Architecture/Design/Direct/Work/Verify/
Resume/Principles 의미 계층이 아니라 Skill Rails runtime의 stage/trace continuation
계약이다. Devflow의 직접 입력은 아홉 패키지의 기존 authored source와 공식 설치
builder이고, 직접 소비자는 생성된 adapters, trace store, stage result와 `resume/2`다.
결정 상태, stage/row, effects, needs, read/write causality는 바뀌지 않았으므로 decision
index 이동과 use-case matrix 판정 이동은 0건이다.

## 변경 범위와 보존 증거

- builder 소유 변경은 패키지마다 `.generated.json`, `SKILL.md`,
  `scripts/skill-rails/api.mjs`, `constants.mjs`, `evaluator.mjs`의 5개, 합계 45개다.
- 릴리스 기록은 두 plugin manifest, `CHANGELOG.md`, use-case matrix의 재판정 근거,
  이 신규 보고서의 5개다.
- 생성 전 아홉 manifest가 소유한 경로는 각 38개, 총 342개였고 모두 존재하며 hash가
  일치했다. manifest 자체까지 포함한 builder envelope는 351개다.
- 보호 대상 `spec.mjs`, `body.md`, collectors, fixtures, `.skill-rails/intent.json`,
  obligation ledger 107개의 aggregate는 생성 전후 모두
  `sha256:ef46bd72a7d55f27fd34eaea9e26bf02437aef90c6ec45b256c073445a9a751b`다.
- manifest 소유 경로와 manifest 자체를 제외한 아홉 skill root의 299개 파일 aggregate는
  생성 전후 모두
  `sha256:543973b3a87581a2d2f1fe2cd10cf32b316b6d358d9d4faf8bc51328931781a4`다.
- 설치된 Skill Rails 전체 path/hash aggregate는
  `sha256:f0a81b1f491437e885f935d48d684bdbd6a9ae72e0cd7d483bad2c8f4e8c157c`다.
- 생성 파일의 runtime 세 구성요소는 아홉 패키지에서 각각 동일하다: `api.mjs`
  `sha256:8fa126794bfdebfda1e4cf92431e4b71eb2315da060425b931093172c91109b2`,
  `constants.mjs` `sha256:d0713c69905df3a29f6b0dda0b4f7c7965de4b99b95c2e800e6b968c10276460`,
  `evaluator.mjs` `sha256:6852b125de8c563c1c5cdf3e2f4248d30d0f8d3de4464dfb07ae178c9ddd5791`다.

Devflow authored semantic prose 증가는 0이다. 생성된 `SKILL.md`의 공통 continuation
안내와 runtime 코드는 공식 builder 출력이며, 릴리스 기록은 의미 계약의 새 소유자가
아니라 출처와 검증 근거를 기록한다. 생성·삭제·이동은 이 보고서 신규 생성 1건뿐이고
삭제와 이동은 없다. 기존 0.23.20의 두 report-only Devflow carry-forward는 이
트랜잭션에 섞지 않았다.

## 검증

- 공식 builder의 아홉 L-full 검증은 모두 통과했다. 각 manifest는 generated path 38개,
  missing 0, mismatch 0을 기록하며 mutation 20/20을 통과했다.
- targeted repository invariants는 21/21 통과했고, 아홉 P2 package의 runtime,
  validator, runtime hash 일치를 확인했다.
- 새 외부 trace 디렉터리
  `C:/Users/joinj/AppData/Local/Temp/devflow-sr-02321-ctx-c0dddd584c19`와 새 run
  `sr035-adopt-ab-c0dddd`, `sr035-principles-ab-c0dddd`를 사용했다. 기존 0.3.4
  trace/run과 평가 sample은 읽거나 재개하거나 수정하지 않았다.
- Adopt run은 최초 호출에서 `refutation.state`가 필요한 effect-free `after-input`
  BLOCK을 냈고 `refutation.state=clear`를 주자 `adoption`의 `prepare` ASK로 이동했다.
  이 run은 한 입력 뒤 도메인 ASK로 넘어가는 유계 probe이며 누적 A→B 증거로 세지 않았다.
- Principles에서 `authoring.readiness=ready`만 준 Decision
  `sha256:09bff588bc6f413f6d7865811a740ef0ebfe639df276486aafdfe68d4d1c1900` 다음에
  `request.partition=pure-tweak`만 주자 Decision
  `sha256:bcc32c4972ef00dbb55a4e39a4ba30ac11ae50d4070a49c1ee9845c460568221`가 A와 B를
  함께 보존했다.
- 같은 run의 무입력 반복은 `SR_TRACE_INVALID`/
  `duplicate-decision-emission`으로 종료되어 guard를 확인했다. 이어
  `tweak.gate=not-all-no`만 준 Decision도 A와 B를 보존했고, 마지막 두 decided 값만
  주자 Decision
  `sha256:ffeaca7c3ca48ce1fcf390581725ae7877ed7f8dcacf9539fc387ab6193e52e2`가
  `normal-gate`에서 Resume으로 terminal ROUTE했다.
- 같은 새 trace의 `resume/2`는 terminal Decision을 last verified로 확인하고
  `next_command: null`, alignment aggregate `aligned`를 반환했다. run-level A→B
  carry-forward와 Devflow owner/read/write causality의 비회귀가 실제 실행으로 확인됐다.
- 독립 Opus whole-diff 감사가 공식 설치본 byte identity, manifest/content hash,
  repository invariants 21/21, 52개 stage, A→B trace, duplicate guard와 consumer coupling을
  별도 context에서 다시 대조했고 blocking finding은 0건이었다.
- AGENTS.md의 완료 명령 `node --test "scripts/*.test.js" "skills/**/*.test.mjs"`은 안정된
  diff에서 정확히 한 번 실행했고 577/577 통과, 실패·취소·건너뜀 0이었다. 같은 실행의
  Gate A가 모든 canonical reserved journal line을 deployed parser에 넣어 정상형을 받고
  손상형을 거부했다.

Fresh Opus cold Adopt 평가는 새 작업공간에서 stage 3회가 BLOCK→ROUTE→ASK로 수렴했고,
누적 caller 입력과 snapshot을 보존한 채 자기완결 proposal을 렌더링했다. owner 문서와 K 본문에
흡수된 legacy coordinate는 0, fixture는 clean, `.devflow` 생성과 저장소 변경은 0, blocking finding은
0이었다. 별도 범위의 비차단 기존 authored-contract/CLI usability 신호 7건은 refuter verdict 용어와
judged enum의 차이, 문서화되지 않은 `record --data` binding 형태, binding이 아닌 `proof_recorded`,
ask/refute 순서, 무조건적인 design artifact 나열, 겹치는 question/contradiction slot, trace-dir 문구이며
이 runtime-only 릴리스에서는 수정하지 않았다.

## 유지보수 context와 한계

현재 생성 bytes로 아홉 패키지의 `maintain.mjs --describe --map`을 stdout-only로 다시
실행했고, 52개 spec stage의 exact-owner query를 수행했다. 48개는 relation coverage가
closed였다. 다음 네 건은 변경되지 않은 authored owner를 대상으로 한 bounded derived
extractor의 frontier 한계이며 제품 실패나 이번 변경의 미해결 결함으로 계산하지 않았다.

- Adopt source basis `585061a22e81b300e7e5cc80715629c8616356dbd71d154b92c159421f4c5082`:
  `spec:STAGES/adoption`, `required-output-cut`, incoming `targets`, relation 8개 cut.
- Principles source basis `14938c93f1a312f2418c0f0d35c514ec2c60c504effa8f8f7ba943a58d85a971`:
  `spec:STAGES/classify`, `source-universe-incomplete`, incoming `targets`와
  `names-evidence`; 큰 obligation ledger를 bounded UTF-8 text로 열지 못했다.
- Resume source basis `983b05802db7df1783741eec85a9f53249173554fd7d67e6d6e42783e856c052`:
  `spec:STAGES/scope-entry`, `required-output-cut`, incoming fixture
  `declares-stage-expectation` relation 28개 cut.
- Work source basis `6a77823ba1791a666e2bd384448aa8a52307f61b773bc5ad6c7ee05a213b6019`:
  `spec:STAGES/task-finalization`, `required-output-cut`, incoming fixture expectation 1개 cut.

나머지 source basis는 Architecture
`82c2cec5fd0e1de867e2a57909b557100a0adc92c70b0cde0812c3c476bad0d3`, Design
`5bbecc0922a0d28cb5bbb5b1b796834e4f5d1dd296631754b08241da57c41d79`, Direct
`a81e08598895e16be7e9de3516483a369bdeba382cc7f2f74ac2f11bd93dd681`, Product
`8d96fe76c64020cfa5e74d2ea4dfbc325cd44daf755ae2281197e5d7442fec57`, Verify
`a351beb38855d3d1dc65931569d692c4f4b829a6946dd439067e26bed4838ef9`다.

감사 지침 §5의 중지 조항 중 규칙 충돌과 데이터 손실은 0건, 동일 원인 결함의 두 번째
재발은 0건, 허용 범위 밖 diff는 0건으로 평가했다. 원인은 외부 canonical runtime에서
한 번 수정됐고, 생성 projection의 공통 안내와 코드에 다른 주장·임시 상태·중복 설명은
없다. commit, push, 두 플랫폼 설치와 설치 후 smoke는 아직 실행하지 않았으므로 이
시점에는 `unverified`다.
