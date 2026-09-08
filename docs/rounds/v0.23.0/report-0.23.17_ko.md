# v0.23.17 구현 보고 — Adopt 패키지 seal hotfix

날짜: 2026-09-08

시작 HEAD: `aecf4d38360897964e246e527cd19d9fbe01921f`

범위: 0.23.16 Adopt의 stale Skill Rails 생성 manifest 복구와 두 provider 재설치

## 실제 원인과 수정

source와 설치된 0.23.16의 `skills/adopt/body.md`는 모두
`sha256:4751d59dcf8e937b2064c77d00703bb92ef4d0f58ad8693a843e6c24cc8ad366`이지만,
source `.generated.json`의 `content.body.md`는 이전 byte의
`sha256:af4cab80925d5ebc93032221c8cf3dea5ba9bfd72932a4e250cc9496aa3231c7`을 봉인했다.
manifest의 모든 content 항목을 현재 package와 대조했을 때 불일치는 `body.md` 하나였고, source
`run.mjs enter`가 `SR_MANIFEST_MISMATCH`로 중단됐다. 따라서 fixture, cachebuster, runtime 판단이
아니라 0.23.16의 마지막 whitespace 정리 뒤 정본 build를 다시 실행하지 않은 release 결함이다.

Skill Rails 설치본의 정본 `scripts/build.mjs --skill skills/adopt --json`으로 package를 재build했다.
authored prose, spec, fixture, loader는 바꾸지 않았고 생성 diff는 `.generated.json`의 `build_id`,
`content_hash`, `content.body.md`와 build evidence의 표준 200-repeat 재실행뿐이다. 두 plugin manifest와
CHANGELOG를 0.23.17로 올렸다. 결정 색인 행, 유즈케이스 행·교차 셀, runtime 의미 변화는 0이다.

## 표적 검증과 설치

- 정본 build: L0–L18 통과, mutation 20/20, fixture 12/12 × 200회, mismatch 0.
- source lint: L-structural 통과. source Adopt `run.mjs enter`: exit 0,
  `enter-hash sha256:091865b2b5b92c32bbbeebd6bc0db8d9077e41e3af3d1b152e9e1a0062de2779`.
- Codex: Orca가 주입한 `CODEX_HOME`과 기본 `C:\Users\joinj\.codex`에 각각 local installer를 실행했다.
  두 `plugin list --json` 모두 requested/effective 0.23.17, installed/enabled이며 두 cache의 Adopt
  `run.mjs enter`가 exit 0과 같은 entry hash를 냈다.
- Claude: 최초 `plugin install`은 기존 설치라고 보고했으므로 `plugin update ... --scope user --yes`로
  0.23.16→0.23.17을 적용했다. `plugin list --json`의 effective version과 install path를 확인했고
  설치된 Adopt `run.mjs enter`가 exit 0과 같은 entry hash를 냈다.
- `skills/adopt/body.md`와 모든 generated runtime 파일의 Git diff는 0이다. 생성물 직접 편집은 0이다.

## 감사 종료 조항과 제한

감사 가이드라인 §5의 규칙 충돌·소실 경로 class는 0이다. 남은 수정 소견은 없고, stale seal을 정본
build로 교체한 수리는 새 해석을 열지 않는 수렴형 기계 수정이다. 변경 문장과 manifest를 다시 읽어
원인·결과·범위가 실제 명령 결과와 어긋나지 않음을 확인했지만, 구현 의도를 이미 아는 같은 context의
자기 검토이므로 독립 감사 증거로 세지 않는다. H33/A16과 H2×A3·A10·A17의 기존 판정은 유지되며 새
요청·진입 형태와 공백은 0이다.

전체 `node --test "scripts/*.test.js" "skills/**/*.test.mjs"` suite와 그 안의 gate A는 coordinator가
후보 설치 뒤 정확히 한 번 실행하기 전까지 **unverified**다. 실제 sol-project·opus-project Adopt
사용 시험, provider 재시작 뒤 trigger/hook 관찰, push도 이 worker가 실행하지 않았다. fixture와 sample
project는 수정하지 않았다.
