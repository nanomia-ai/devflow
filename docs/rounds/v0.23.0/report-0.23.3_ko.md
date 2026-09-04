# v0.23.3 수리 보고 — Work–Verify 루프 연결 복원

상태: 구현·표적 검증·교차 감사·수동 Gate B 완료, 설치는 사용자 지시로 생략  
기준 커밋: `4b37a2a`

## 실제 원인과 적용 범위

이번 수리는 새 루프 방법론을 추가하지 않는다. Work가 닫힌 카드마다 Verify를 직접 호출해
Resume의 남은 일 선택을 우회하던 경로, 재검토 결과를 디스크에 남기지 않아 재진입 때 이전 판정으로
돌아가던 경로, Verify 실패 이력이 수리 카드로 이어지지 않고 다시 Verify로 순환하던 경로가 실제
실행 분기에서 확인됐다.

Work의 완료 경계는 기존 Resume 선택기로 돌아가며 재검토 직후 기존 `reviewResult`를 기록한다.
Resume은 기존 `transition.failure-routing`을 수리 계획 소유자인 Direct로 보내고, Direct는 그 한
Failure-history locator를 기존 card·approval·`routing prepared` 계약으로 처리한다. 실제 Gate B가
드러낸 마지막 차단은 Verify의 일반 invalid-layer guard가 기존 prepared-route 복구보다 먼저 닫는
것이었다. guard는 이제 recoverable transition이 없을 때만 닫힌다. 새 정본 파일, 상태 소유자,
단계, route family, reviewer 정책, event loop, 개인화 체계는 만들지 않았다.

## 크기와 과잉 감사

네 skill의 사람이 작성한 동작 원본은 기준 대비 `+52/-43`줄이다. fixture와 표적 검사는 기존
분기 하나씩을 봉인하고, 큰 diff의 대부분은 Skill Rails가 생성한 manifest와 semantic receipt다.
Codex Sol은 현재 원본 전체를 다시 읽어 각 변경이 도달 가능한 한 실패에만 대응하며 설명과 실행
효과가 일치한다고 판정했고, 마지막 stale 순환에는 중복 관찰·guard 삭제가 가장 작은 해법이라고
반증했다. Claude Fable의
앞선 구현 감사와 목적 감사도 새 체계 없이 Work 검토·Resume 선택·Verify 실패 수리라는 기존
목적에 수렴한다고 판정했다.

감사 지침 §5는 규칙 충돌·소실 경로 0, 남은 양갈래 독해 0, 새 해석을 여는 문장 0으로 종료한다.
같은 문장의 세 번째 수정, 구체적 오독 없는 혼동 주장, 앞 수리의 철회, 지난 소견만을 근거로 한
소견은 없었다. 수정 뒤 재감사는 수정된 경계 한 번으로 닫았고 범위를 다시 넓히지 않았다.

## 검증과 한계

- Skill Rails build는 Direct 27/27, Work 73/73, Resume 49/49, Verify 28/28 fixture와 각 200회
  결정 반복, L0–L18 mutation 20/20, mismatch 0을 기록했다.
- 실제 임시 Git 프로젝트 `C:\Users\joinj\AppData\Local\Temp\devflow-gateb`에서 최초 Direct,
  Work 완료, 의도한 Verify 실패, 정확한 Failure-history 선택, Direct 수리 카드와 prepared-route
  interruption 복구, repair Work, 새 verifier의 pass 기록, capability closure까지 직접 실행했다.
  최종 commit은 `a0305cc`, `next: complete.adoption`, transition·marker 없음, integrity·baseline
  anomaly 0, working tree clean이었다. 따라서 Gate B는 **통과**했다.
- 장시간 전체 `node --test "scripts/*.test.js"`는 앞서 순서를 잘못 잡아 시작했다가 결과 없이
  중단했다. 사용자 지시에 따라 반복하지 않았으므로 전체 suite와 Gate A는 **미검증**이다.
- `git diff --check`는 오류 0이고 두 manifest는 0.23.3으로 일치한다. 기존 유즈케이스의 경계만
  복구하므로 새 H·A 행 0, 새 교차 셀 0, 새 공백 0이다.
- 이번 세션의 설치는 사용자의 명시적 지시에 따라 실행하지 않는다.

새로 만든 영속 경로는 이 보고서 하나다. 삭제하거나 이동한 경로는 없고, 새 결정·결정 이동·미수리
감사 소견도 없다.
