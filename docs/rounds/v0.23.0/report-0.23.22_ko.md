# v0.23.22 구현 보고서

- 날짜: 2026-09-10
- 기준: `190961b026d6e691c16353e6bbb662d30e7f8305`
- 외부 소유자: 공식 Skill Rails v0.4.3 (`nanomia-ai/skill-rails`, 설치 폴더 해시
  `e8cc9c86c1174e4a96f8736fa25999b6197f9d83`)

## 결과

0.23.22는 아홉 P2 패키지 Adopt, Architecture, Design, Direct, Principles, Product,
Resume, Verify, Work를 공식 설치 경로
`C:/Users/joinj/.agents/skills/skill-rails/scripts/build.mjs --repair-generated`로 하나의
cohort에서 다시 생성했다. 모든 패키지는 runtime 0.3.6, validator 0.6.2, kernel 6과
하나의 runtime hash
`sha256:c871a427645d6f734e97c777f694c94678dafd36dabf777608a543cc2648df3b`를 공유한다.

0.3.6은 현재 Decision에서 계획된 effect의 index와 verb를 runtime이 직접 결합하고,
shell의 JSON quoting에 기대지 않는 최대 64 KiB UTF-8 `--data-file` 입력을 제공한다.
생성된 guide는 필요한 `record inputs`를 구조화해서 보여 주며, CLI의 argument·input·resume
실패는 trace 기록 전에 안정된 진단 code와 pointer로 끝난다. 이 변경의 canonical owner는
Devflow 단계 의미가 아니라 공식 Skill Rails runtime과 generator다. 직접 소비자는 생성된
`SKILL.md`, `run.mjs`가 부르는 CLI/API/guide, manifest loader와 seal, Codex·Claude 설치
snapshot이다. 이 cohort를 생략하면 일부 패키지에 0.3.5 runtime과 shell-dependent 기록 안내가
남아 동일한 Devflow 단계가 설치 경로에 따라 다른 evidence 입력 계약을 갖게 된다.

Devflow의 Product·Architecture·Design·Direct·Work·Verify·Resume·Principles·Adopt
관계, 단계와 행, effects와 needs, provenance·evaluation·deploy 계약은 바뀌지 않았다.
따라서 decision index 이동은 0건이고 use-case matrix의 기존 판정을 유지했다. provenance는
유지보수 owner로 승격되지 않았고, 새 index canon이나 maintenance map/cache를 만들지 않았다.

## 기준 상태와 변경 범위

- `git fetch origin main --prune` 뒤 HEAD, `main`, `origin/main`은 모두
  `190961b026d6e691c16353e6bbb662d30e7f8305`였고 ahead/behind는 0/0, tree·index·untracked는
  비어 있었다. main을 별도로 합칠 필요가 없었고 보존할 overlap이나 conflict도 없었다.
- builder 소유 변경은 패키지마다 `.generated.json`, `SKILL.md`,
  `scripts/skill-rails/cli.mjs`, `constants.mjs`, `guide.mjs`의 5개, 합계 45개다.
- 릴리스 기록은 두 plugin manifest, `CHANGELOG.md`, use-case matrix의 재판정 근거,
  이 신규 보고서의 5개다. 최종 허용 범위는 정확히 50개 경로다.
- 생성 파일을 제외한 아홉 skill root의 authored 파일 299개 aggregate는
  `sha256:01ad90fae24cf1c8664a767f2515ee100608f45ece373a0b32cfa8a71d79b1b1`다.
  그중 `spec.mjs`, `body.md`, collectors, fixtures, intent, obligation ledger 107개
  aggregate는
  `sha256:77f9a0f7f81c4492440505872f8d10e52d27a1874ef1d66be126deebb15e57f8`다.
  두 집합 모두 기준 HEAD와의 exact scoped diff가 0이므로 authored-source byte 변경은 0건이다.
- 생성 runtime 세 파일은 아홉 패키지에서 각각 동일하다: `cli.mjs`
  `sha256:0a07e22c7fda8e84b08d715aca0b167c6e6798f3c7b027ada5c84339e7c2ed22`,
  `constants.mjs` `sha256:e58a0fea3aea4f267f095ab4daaa168cde767bb4da4203922d1bddceee62f06f`,
  `guide.mjs` `sha256:490d965b5e988319f6d806e870cd8e15f8ada0a0f1c70ed1aaa4a860112da280`다.
- 생성은 이 보고서 1개뿐이고 삭제와 이동은 없다. 기존 backlog와 0.23.20·0.23.21의
  carry-forward는 이번 external runtime projection에 섞지 않았다.

## 검증

- 공식 builder의 아홉 L-full 검증은 모두 통과했다. 각 manifest는 runtime 0.3.6,
  validator 0.6.2와 같은 runtime/validator hash를 기록하고 generated path hash의 missing과
  mismatch가 0이다.
- targeted repository/semantic 검증은 29/29 통과했다. 아홉 P2 package의 runtime,
  validator, runtime hash 일치와 authored Devflow 관계의 비회귀를 함께 확인했다.
- 새 외부 trace 디렉터리
  `C:/Users/joinj/AppData/Local/Temp/devflow-skillrails-0.3.6-work-ctx-b975915c89f9`와
  새 run `9804ec90-4797-409a-a7bc-df3239fbee1c`를 사용했다. 0.3.4/0.3.5 run이나
  trace, 기존 eval sample은 재개하거나 수정하지 않았다.
- 외부 임시 Devflow fixture의 ready card에서 Work는 `history.basis` after-input 재진입 뒤
  `claim-or-reenter`의 READ·REPORT·COMMIT effect와 구조화된 `record inputs`를 냈다.
  한글을 포함한 UTF-8 JSON file을 `record --effect 0 --data-file`로 전달하자 runtime은
  `index: 0`, `verb: READ`를 현재 Decision에서 결합해 trace에 정확한 문자열을 기록했다.
  나머지 effect claim도 index/verb가 결합됐다.
- `align`은 세 agent claim을 의도대로 관측 증거로 승격하지 않고 aggregate `unproven`,
  issue 0을 반환했다. `resume/2`는 reason `after-effects`와 동일 run의 next command를 냈고,
  임시 fixture에서 실제 claim commit을 만든 뒤 같은 run으로 재진입하자 Work는
  `claim-or-reenter`를 건너 `implement-and-signal`의 입력 경계까지 전진했다. 이 확인은
  evidence transport와 re-entry 실행 증거이며 실제 프로젝트 effect 성공 판정은 아니다.
- 현재 생성 bytes에서 아홉 `maintain.mjs --describe --map`을 stdout-only로 다시 만들고
  각 package의 `intent:description` exact-owner query를 수행했다. 9/9 모두 source snapshot이
  stable, relation coverage가 closed, blocker 0이며 manifest path hash가 현재 bytes와
  일치했다. source basis는 Adopt
  `968cea80fdf7e1482cc6567a8b9569f89bf032fe7bf7f5c05154af67f5b200cb`, Architecture
  `0df2754fdfc089c997e00bae11035251dee931174990dd3455ce01938c31e9bc`, Design
  `460a8f67760050c70a6e32ac79d73d9c96950d10a3e51415499cf68ae4dd589b`, Direct
  `9e32e1d1f7f4190b6e4664ea11d4762443721012e6a2e83221420c856371c50a`, Principles
  `b8623c13b53036162ab545186e2fe9251c2962c3a09f837bb600bc68e399f102`, Product
  `4546efd0dbfaf4cfaa628872ceed02261b4b4d85dac3d31b47b511ac1a5a2d33`, Resume
  `07106f6e7108aa5a3f06dc87bc2bbba0e0f47627b9f98b3760291ab9afed6b06`, Verify
  `86b7093dec01b538b81df00199e52f32c9ea4363645d1107a3afc8d02fddfc7d`, Work
  `d5ce94c83f7b401885841b36f9a71730a1e9f49cfc1204700980ee0359928540`다.
- AGENTS.md의 완료 명령 `node --test "scripts/*.test.js" "skills/**/*.test.mjs"`은 수렴한
  diff에서 정확히 한 번 시작했지만, 장시간 실행을 기다리지 말라는 owner 지시에 따라 배경
  process를 안전하게 중단했다. 중단 전에 Gate A의 정상형 수용과 손상형 거부 출력은 모두
  green이었으나 전체 run의 terminal summary가 없으므로 completion suite는 `unverified`이며
  통과로 기록하지 않는다. 이 릴리스는 Devflow verification contract를 바꾸지 않으므로 수동
  Gate B는 적용 대상이 아니다.
- coordinator가 별도 Opus whole-diff 검토의 PASS와 blocking finding 0을 전달했고, owner는 이
  결과와 targeted runtime 검증을 이번 release decision에 충분한 증거로 승인했다.

## 전체 인과 검토와 한계

전체 diff는 공식 0.3.6 runtime projection, 그 hash receipt, 공통 생성 안내, 버전과 릴리스
기록으로만 닫힌다. cold consumer는 `SKILL.md`에서 shell-neutral 입력 형태를 받고, guide에서
현재 Decision에 허용된 record type·effect index·artifact 경계를 찾으며, CLI는 그 입력을
Decision 및 trace와 결합한다. 기존 Devflow authored owner는 이 흐름에서 읽힐 뿐 바뀌지 않아
별도 규칙, 중복 authority, case-specific 금지 문구가 생기지 않았다.

감사 지침 §5의 중지 조항 중 규칙 충돌과 데이터 손실은 0건, 같은 원인 결함의 두 번째 재발은
0건, 허용 범위 밖 diff는 0건으로 평가했다. Opus whole-diff 검토는 PASS이고 blocking finding은
0건이다. installed-only Codex·Claude 실제 소비는 coordinator가 release 설치 뒤 새 lane에서
재관측하기 전까지 `unverified`다. 이 보고서가 기록되는 시점에는 commit, push, 두 플랫폼
재설치와 설치 후 cache smoke를 아직 실행하지 않았다.
