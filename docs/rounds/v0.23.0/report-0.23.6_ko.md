# v0.23.6 결과 보고 — 증거에 한정된 저장소 감사

상태: 완료 — 이 보고서를 포함하는 0.23.6 릴리스 커밋으로 닫음
기준 커밋: `2eca653`

## 목적과 관측된 실패

0.23.5의 Skill Rails v0.3.0 이관은 아홉 패키지를 정상 재빌드했지만, devflow 자체
`skill-rails-semantic-audit.mjs`가 Adopt와 Principles를 실패시켰다. 이 검사는 한 target에 모인
locator 출현 횟수를 현재 의미 품질의 대리값으로 사용했다. Principles는 세 atom 안의 같은 locator
중복 세 건까지 별도 의미 edge로 세어 22건이 되었지만 unique edge는 19건이었다. Adopt의 77개
unique edge는 이전 자료가 현재 adoption stage에 넓게 투영된 검토 신호이나, 현재 단계 선택·상태
계산·쓰기의 실패를 입증하지 않았다.

이 수치를 통과시키려고 stage를 쪼개거나 산문을 늘리거나 원장 처분을 일괄 변경하면 테스트가
스킬의 정답지가 된다. DD-100은 저장소 hard gate의 권한을 현재 byte가 직접 증명하는 구조·실행
계약 위반으로 한정하고, 의미 휴리스틱은 보이는 advisory로 남긴다.

## 구현한 경계

- 깨진 ledger/scenario/spec module, 명시적 `review-required`, 빠진 package 입력·scenario,
  상태 계산 패키지의 collector·raw-fact fixture 부재는 hard failure다.
- 유효한 저작 위치가 없는 `atom-migration-aNN` 계열 예약 placeholder는 정확한 byte 자체가 미완료
  산출물을 증명하므로 hard failure다.
- fan-in, locator 중복, current semantic target이 보이지 않는 넓은 migration 투영, 미사용으로
  보이는 observation, 판단·진행형 이름과 완료 읽기, effect 없는 `NEXT`, 폐기된 owner일 수 있는
  문구는 advisory다. advisory는 제품 변경 권한이나 통과 조건이 아니다.
- target 집계는 unique atom→target edge와 raw occurrence를 분리한다.
- observation은 별도 정규식 문법으로 재해석하지 않고 각 `spec.mjs`의 실제 export를 읽는다.
- root suite는 audit schema와 아홉 package ID를 확인하고 advisory를 diagnostic으로 출력한다.
- audit script의 예외 없는 직접 fixture suite를 추가했다.

`skills/**`의 spec, body, 원장, 생성물, runtime, collector와 사용자-facing 산문은 바꾸지 않았다.
다만 완료 gate에서 드러난 devflow 소유 상태 도구의 예외 경로는 아래처럼 수리했다. 이 스크립트는
Skill Rails 봉인 대상 밖이므로 아홉 패키지를 다시 빌드하지 않았고 validator/runtime/kernel 계약도
바꾸지 않았다.

## 독립 감사와 판정

Codex Sol xhigh 반증·문자 실행 감사와 Claude Opus xhigh 뺄셈 감사를 별도 컨텍스트로 수행했다.
첫 감사에서 advisory가 root suite에 숨는 경로, 한 줄 observation 정규식이 유효한 여러 줄 선언을
hard failure로 오판하는 경로, 예약 migration placeholder를 지나치게 advisory로 내린 충돌을
채택했다. 릴리스 기록 미작성도 마감 항목으로 채택했다.

수리 재감사에서 두 검토자는 현재 package의 정규식 적합성에는 다른 판정을 냈다. 현재 파일만
보면 문제가 없다는 의견보다, 유효한 주석 배치에서 다시 오판한다는 구체적 반례를 채택했다.
정규식을 더 복잡하게 늘리지 않고 실제 module export를 읽도록 바꿔 중복 문법 자체를 제거했다.
그 밖의 이름·수치 신호를 hard gate로 승격하자는 제안은 현재 동작 실패를 입증하지 못해 채택하지
않았다. 이 판정 뒤 추가 감사 라운드는 열지 않았다.

검토자가 범위를 넘어 실행한 집중 test는 보조 증거로만 취급한다. Sol이 시작한 전체 suite는
조정자가 즉시 중단했고 결과로 세지 않는다. 최종 검증은 아래 한 번의 정식 실행만 기록한다.

## 첫 완료 gate와 최소 수리

첫 정식 전체 suite는 508개 중 502개가 통과하고 `scripts/project-state.test.js`의 여섯 항목이
실패했다. 새 semantic audit와 그 직접 test 8개는 모두 통과했으므로 감사 경계 수리의 회귀가
아니었다. 같은 여섯 이름만 고른 표적 명령이 0/6을 재현해 병렬 실행이나 우연한 실패도 배제했다.

- 세 undecodable-HEAD 항목은 설계·용어·compatible-feedback 투영이 이미 marker-aware reader로
  손상을 구조화했지만, capability-closing 투영이 같은 HEAD journal을 다시 무방비 디코딩해 CLI를
  종료하던 실제 결함이었다. 기존 reader를 재사용하고 해당 marker byte가 있을 때만 같은 blocking
  integrity issue를 만들었다.
- capability template 항목은 Adopt의 현재 `bindingAdrs` 필드와 공통 `Trust` 문구 대신 폐기된
  fixture 값을 쓰고 있었다.
- compatible-feedback 항목은 DD-97이 정한 owner 기반 writer를 Brownfield 유무로 다시 추론하던
  낡은 기대였다.
- knowledge-landing 항목은 한 저장소에서 정상 marker를 다른 writer로 덮어 써 실제 unauthorized
  deletion을 만들었다. 각 허용 writer를 독립 lifecycle에서 검사하도록 격리했다.

첫 표적 수리 시 공통 `Trust` 기대값 하나가 더 남아 5/6이 통과했고, 현재 두 shipped template의
동일한 계약에 맞춘 뒤 같은 명령이 6/6 통과했다. 여기서 새 규칙이나 추가 감사 라운드는 열지 않았다.

## 최종 검증과 설치

정식 완료 명령은 `node --test "scripts/*.test.js"`였다. 첫 실행은 508개 중 502개 통과·6개
실패(`duration_ms 1178267.7132`)였고, 위 원인 판정과 표적 수리 뒤 최종 실행은 새 closing 회귀
검사까지 포함한 **509/509 통과, 실패 0, `duration_ms 1247924.989`**였다. Gate A의 모든 canonical
reserved journal line도 통과했다. 검증 계약을 바꾸지 않았으므로 수동 Gate B 대상은 아니다.

semantic audit 직접 suite는 8/8 통과했다. root suite가 출력한 advisory는 다음 둘이며 hard failure는
0건이다.

- `adopt`: `provenance-fan-in=1`
- `principles`: `duplicate-target-locators=28`

실패 재현 명령은
`node --test --test-name-pattern "undecodable HEAD journal|arch and adopt shipped capability templates|compatible feedback grammar preserves|compatible feedback: an undecodable HEAD|K exact knowledge landing marker" scripts/project-state.test.js`
였고 최초에는 선택한 6개 모두 실패했다. 첫 수리 뒤 출력은 `tests 6 / pass 5 / fail 1 /
duration_ms 45810.1169`였으며 남은 실패는 Adopt `Trust` 기대값이었다. 현재 공통 shipped 문구와
대조해 그 낡은 기대를 고친 뒤 같은 명령은 `tests 6 / pass 6 / fail 0 / duration_ms 46435.8091`로
끝났다.

진행 중 concise audit를 출력하려던 PowerShell 명령 한 건은 JavaScript template literal의 backtick을
shell이 소비해 `SyntaxError: missing ) after argument list`로 실패했다. 제품 실패가 아니라 명령 인용
실수였고, 문자열 연결식으로 다시 실행해 아홉 보고서와 위 advisory 두 건을 정상 확인했다.

Codex 설치 스크립트는 성공했고 `codex plugin list --json`에서 `devflow@nanomia` 0.23.6이 현재
저장소 source로 installed·enabled 상태임을 확인했다. installer가 사용자만 확인할 수 있다고 명시한
`/hooks`의 SessionStart 신뢰 표시는 실행하지 않았으므로 미검증으로 남긴다.

Claude는 기존 plugin 제거 뒤 첫 설치가 아래처럼 실패했다.

```text
Installing plugin "devflow@nanomia"...× Failed to install plugin "devflow@nanomia": Plugin "devflow" not found in marketplace "nanomia". Your local copy may be out of date — try `claude plugin marketplace update nanomia`.
```

갱신 명령도 marketplace가 삭제된 임시 Orca worktree를 가리켜 다음처럼 실패했다.

```text
Updating marketplace: nanomia...× Failed to update marketplace(s): Failed to refresh marketplace 'nanomia': ENOENT: no such file or directory, open 'D:\Program Files\orca\workspaces\devflow\adopt-evidence-reset'
```

낡은 `nanomia` 등록만 제거하고 현재 저장소를 같은 marketplace로 다시 등록했다. 재설치와
`claude plugin validate .`가 통과했고, `claude plugin list --json`에서 `devflow@nanomia` 0.23.6이
installed·enabled임을 확인했다.

## 감사 종료와 경계

감사 가이드라인 §5의 규칙 충돌·소실 경로는 최종 검토에서 각각 0건이다. 산문이나 원장 처분을
검사 수치에 맞추는 수리는 0건이며, 수리는 hard/advisory 권한과 중복 parser 제거로 수렴했다.
실제 모델 trigger·장기 세션 drift·프로젝트 task output은 이번 저장소 검사 변경으로 실행하지
않았으므로 미검증이다. 새 H·A 행과 matrix 공백은 0이다.

생성 경로는 `scripts/skill-rails-semantic-audit.test.js`와 이 보고서 두 개다. 삭제·이동 경로는
없다. 다음 재검토는 advisory 한 종류가 반복 가능한 현재 실행·소실 결함과 인과적으로 연결되거나,
남은 hard check가 유효한 package를 거부할 때만 연다.
