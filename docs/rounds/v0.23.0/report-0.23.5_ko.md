# v0.23.5 결과 보고 — Skill Rails v0.3.0 코호트 이관

상태: 이관·독립 감사·패키지 평가·설치 확인 완료, 저장소 전체 gate는 기존 semantic audit 부채 2건으로 실패
기준 커밋: `c12e92d`

## 실제 출하

`adopt`·`arch`·`design`·`direct`·`principles`·`product`·`resume`·`verify`·`work` 아홉 P2
패키지를 Skill Rails v0.1.9에서 v0.2.0을 거치지 않고 v0.3.0으로 함께 재생성했다. 모든
`.generated.json`은 validator 0.6.1, runtime 0.3.3, kernel 6을 기록한다. 공통 runtime hash는
`sha256:90a4c7b0db87b8da7849174fda4c9f80700907f5cfe481c3806a87e71b30146f`, 공통 validator
hash는 `sha256:f4d2f24bdc94936180f8cafde1d84eb737173bdcc958b6f9166e2e8b35c1edb5`다.
`SPEC.version` 5, 닫힌 export 14개, Decision·trace schema, effect authority와
`enter`·`stage`·`record`·`align`·`resume` 경로는 바꾸지 않았다.

패키지마다 변경된 생성 경로는 `.generated.json`, `SKILL.md`, 그리고
`scripts/skill-rails/{api,authoring-ledger,constants,templates,trace-core,validator}.mjs`뿐이다.
`spec.mjs`·`body.md`·원장·receipt·`cli.mjs`·schema·adapter·collector·reference·template·fixture는
바뀌지 않았다. 외부 공용 collector의 행동 시험, 아홉 패키지 runtime/validator·hash 동일성,
정책 포인터 동일성, 반복 template 항목 문법, 둘째 이후 WRITE의 알려진 투영 공백은 계속 devflow가
소유한다.

## 재빌드 전 진단과 생성 결과

설치된 Skill Rails v0.3.0의 `lint.mjs`를 재빌드 전에 패키지별로 실행했다. 출력은 모두 정확히
`L-structural: pass`였고 exit code는 0이었다.

| 패키지 | 사전 lint | build fixture | build 반복/불일치 | 생성 파일 |
|---|---:|---:|---:|---:|
| adopt | pass / 0 | 9/9 | 200 / 0 | 38 |
| arch | pass / 0 | 54/54 | 200 / 0 | 38 |
| design | pass / 0 | 20/20 | 200 / 0 | 38 |
| direct | pass / 0 | 27/27 | 200 / 0 | 38 |
| principles | pass / 0 | 10/10 | 200 / 0 | 38 |
| product | pass / 0 | 18/18 | 200 / 0 | 38 |
| resume | pass / 0 | 49/49 | 200 / 0 | 38 |
| verify | pass / 0 | 28/28 | 200 / 0 | 38 |
| work | pass / 0 | 73/73 | 200 / 0 | 38 |

아홉 build 모두 L0–L18, mutation 20/20, survivor 0을 기록했다. 진행 중인 maintain
transaction이나 recovery artifact는 없었다.

## 생성 SKILL.md와 semantic impact

아홉 `SKILL.md`는 각각 실제 두 줄이 바뀌었다(`+2/-2`). 모든 패키지에 같은 변경이다.

```diff
- Resolve `<trace-dir>` to a writable directory outside the installed skill ...
+ Resolve `<trace-dir>` to a writable directory outside both the installed skill and the repository or directory tree that contains that project ...
- 3. Determine the current stage and required evidence from `<project>`; do not infer ...
+ 3. Determine the current stage and required evidence from `<project>`. Do not infer ...
```

v0.1.9의 resource hash 누락으로 `changed:false`였고 semantic impact가 미검증으로 남은 현재
항목은 없었다. 최신 `changed:false` receipt 여섯 개 중 resource를 포함한 것은
`adopt/references/workflow.md`, `arch/references/workflow.md`,
`principles/references/policy-index.md`, `work/references/purpose.md`이며 모두 `READ_FIRST`라 구버전도
이미 hash하던 경로다. `design`은 body, `direct`는 observation collector만 바뀐 receipt다.
따라서 v0.3.0의 `references/**`·`templates/**` 전수 hash로 다시 판정되어 상태가 바뀐 항목은 0건이다.

이 저장소에는 이관 시작 시 프로젝트 내부를 가리키는 활성 trace 설정이나 trace 파일이 없어서
옮긴 경로가 없다. 생성 안내의 결손만 해결됐고, runtime이 프로젝트 로컬 위치를 계속 허용하는 v5
호환 경계와 냉시작 소비자의 실제 외부 위치 선택은 통과로 판정하지 않았다.

## 계약 정정 재검토

`FORMATS`가 표현 가능한 한 줄 형식만 소유한다는 정정과 bare `judged`/`decided` 값이 snapshot에
결속되지 않는다는 정정을 자체 검사와 대조했다. `skills/principles/scripts/semantic-audit.mjs`는
한 줄 소유 형식과 template heading을 분리해서 검사하고,
`skills/work/fixtures/format-adversarial.test.mjs`와
`knowledge-marker-grammar.seam.test.mjs`가 더 강한 반복 항목 문법을 계속 소유한다. 생성 runtime
밖의 저장소 자료에는 `@sha256:` 사용이나 bare 값의 replay 결속을 전제한 검사가 없었다. 따라서
계약 정정 때문에 바꿀 자체 검사는 0건이며 기존의 더 강한 검사를 제거하지 않았다.

독립 감사 중 `templates.mjs`에서 v0.1.9의 `declaration.example === true` placeholder 검사 면제가
v0.3.0에 없다는, upstream 이관 문서에 적히지 않은 차이를 발견했다. 현재 아홉 패키지의 해당
template 선언은 0건이어서 이 코호트의 동작에는 닿지 않는다. 생성물을 손수정하지 않고 upstream
확인 대상으로 남긴다.

## 감사 소견과 별도 문자 충돌

fresh Claude Opus xhigh와 Codex Sol xhigh가 서로 독립적으로 전체 변경분을 읽었다. 둘 다 아홉
manifest의 version/hash와 vendored runtime byte, 생성 경로, 보존 계약에서 이관 결함 0건을
확인했다. 두 감사가 공통으로 찾은 라운드 report 누락과 CHANGELOG의 `unreadable` 과장은 이
보고서와 정확한 `READ_FIRST`·locator 표현으로 수리했다. Opus가 추가로 찾은 matrix §6 기록 누락과
trace 종결문의 범위 과장은 matrix 재판정과 “이관 시작 시 이 저장소” 한정으로 수리했다.

Opus가 제안한 `<trace-dir>` 절대 착지처 추가는 채택하지 않았다. 쓰기 가능한 저장소 바깥 위치는
호출자 환경의 결정이고 upstream도 이를 강제하지 않으며, 범용 절대 경로를 devflow 생성물에 넣으면
이식성을 잃는다. 실제 위치 선택은 위와 같이 미검증으로 남겼다.

전체 suite가 별도로 드러낸 `scripts/project-state.test.js`의 glossary assertion은 이미 사라진
Adopt `approval` stage를 찾고 과거 WRITE 네 개만 기대했다. 정본 `adoption` stage와 현재 WRITE
template 일곱 개의 정확한 순서로 assertion을 갱신했고, 해당 단일 시험은 1/1 통과했다. skill
동작이나 state predicate는 바꾸지 않은 문자 충돌 수리다.

## 검증, 설치, 실패

- `eval.mjs --skill skills/<id>`: 아홉 패키지 모두 L0–L18 pass, fixture 합계 288/288,
  패키지별 deterministic repeat 200, mismatch 0.
- `node --test "scripts/*.test.js"`: Gate A와 glossary 수리 뒤 행동 시험은 통과했으나 아래의 기존
  semantic audit 부채를 호출하는 repository-invariants에서 exit 1. Gate B는 verification contract를
  바꾸지 않은 이관이므로 적용하지 않았다.
- `codex/install.ps1`: 현재 Orca Codex home
  `C:\Users\joinj\AppData\Roaming\orca\codex-runtime-home\home`에 설치 성공. `codex plugin list --json`은
  로컬 source의 `devflow@nanomia` 0.23.5를 installed/enabled로 확인했다.
- `claude plugin update devflow@nanomia`가 latest 0.23.5를 확인한 뒤 최종 커밋 기준 cache를
  확실히 갱신하려고 같은 plugin을 uninstall/install했다. `claude plugin list --json`은 user scope의
  installed/enabled 0.23.5를 확인했고 `claude plugin validate .`도 통과했다.

실패 명령과 핵심 출력은 다음과 같다. 두 대상은 기준 커밋에서도 같은 정본 원장을 읽는 기존
provenance fan-in이며, 이번 이관에서 `spec.mjs`와 원장을 바꾸지 않았으므로 억지로 해소하지 않았다.

```text
node scripts/skill-rails-semantic-audit.mjs
exit 1

adopt
"target": "spec:STAGES/adoption",
"count": 77,
"failures": ["1 overloaded provenance targets require semantic review"]

principles
"target": "spec:STAGES/classify",
"count": 22,
"failures": ["1 overloaded provenance targets require semantic review"]
```

```text
node --test "scripts/*.test.js"
exit 1

1 !== 0
at TestContext.<anonymous>
  (scripts/repository-invariants.test.js:330:10)
```

감사 guideline §5의 규칙 충돌은 0건이고 이관으로 새로 생긴 소실 경로도 0건이다. 다만 기존
provenance review-required 신호 두 건이 남아 저장소 전체의 “모든 남은 소견이 표현 등급뿐”인 종료
조건은 충족하지 않는다. 모델 trigger·장기 세션 drift·실제 task output, 냉시작 trace 위치 선택,
Codex `/hooks` 화면의 SessionStart 항목 직접 확인은 미실행이므로 **미검증**이다. 생성·삭제·이동은
이 보고서 생성 1건뿐이며, 그 밖의 삭제나 이동은 없다.

## 경계 출력

- Actually shipped: 아홉 P2 패키지의 Skill Rails v0.3.0 코호트, 두 manifest 0.23.5, 정확해진
  trace 안내와 build-time validator·resource receipt.
- New binding decisions: 없음. 결정 색인 이동 0건.
- Unrepaired findings: 기존 Adopt·Principles provenance fan-in 두 건; upstream example-template
  검사 문서화 차이 1건은 현재 코호트 영향 0.
- Remaining limitations: runtime의 프로젝트 로컬 trace 호환 허용, non-first WRITE template 투영,
  외부 collector 봉인 밖 경계, 수동 `/hooks`와 실제 모델 forward run 미검증.
- Next revalidation: provenance 재구성 라운드에서 두 fan-in을 별도 판정하고, upstream이 example
  template 규칙을 확정하면 해당 선언이 생긴 코호트를 다시 lint/eval한다.
