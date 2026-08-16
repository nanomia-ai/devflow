# v0.16.2 실행 보고 — 유지보수 진입 비용을 줄이고 설계 의도 보존을 검증하다

날짜: 2026-08-15  
비교 기준: `933a3390ebbce1e5478b5cf779b89c66766d9646` (v0.16.1)

## 왜

새 유지보수 세션은 30,716바이트의 `AGENTS.md`에서 시작한 뒤 README, CHANGELOG, 여러
라운드 기록까지 반복해서 읽었다. 그런데도 영향받는 스킬 원문과 그 구성요소의 존재 이유를 실제로
확인했다는 보장은 약했다. 목표는 스킬을 한 글자도 바꾸지 않으면서 기본 입력을 줄이고, Claude와
Codex가 전체 스킬 체계의 의도·권위·영향 경로를 더 빨리 복원하게 만드는 것이었다.

## 실제 배포 (Actually shipped)

- `AGENTS.md`는 항상 읽는 진입 게이트와 조건부 읽기 배선만 남겼다. 현재 상태는 manifest, Git,
  최신 CHANGELOG 한 항목, 숫자로 판정한 직전 라운드의 결과·한계만 제한해서 읽는다.
- `docs/design{_ko}.md`에 8개 진입 스킬, predicate 정본, 기획 증거, coordinator와 네 역할 계약의
  존재 이유·권위·소비 관계를 압축한 의도 인덱스를 넣었다. 이 인덱스는 원문 규칙의 대체물이 아니다.
- 상세 유지보수 절차는 `docs/maintenance-protocol{_ko}.md`의 9개 절로 분리하고 `AGENTS.md`만
  조건별 읽기 집합을 소유하게 했다.
- `scripts/repository-invariants.test.js`에 진입 예산, 배선 단일성, 의도 인덱스 완전성, 한영 대응,
  스크립트 소비자, 문서 생명주기, 라운드 역할 문법과 폐쇄 역사 예외 검사를 추가했다.
- 두 plugin manifest를 0.16.2로 맞추고 CHANGELOG를 갱신했다.
- `skills/**`, hook, installer는 바꾸지 않았다.

## 측정과 문자 실행 시뮬레이션

| 관찰 | 이전 커밋 | 현재 | 판정 |
|---|---:|---:|---|
| 항상 읽는 `AGENTS.md + docs/design.md` | 50,796 B | 29,567 B | 21,229 B, 41.8% 감소 |
| 동일 질문 Codex 총 input | 1,225,227 | 580,044 | 52.7% 감소 |
| 동일 질문 Codex 완료 시간 | 246.9초 | 234.4초 | 5.1% 감소 |
| 동일 질문 Claude 완료 여부 | 304초 제한에서 미완료 | 274.7초 완료 | 현재안만 완결 응답 |

현재 Codex는 이전처럼 README·backlog·다수 스킬을 기본으로 넓혀 읽지 않고, 영향 경로인
coordinator와 work 원문을 열었다. Claude는 8개 스킬의 의도, predicate와 역할 계약의 권위 차이,
coordinator 삭제 유도 입력의 위험, 영향 원문 확인 전 판단 금지를 복원했다. 읽지 않은 스킬 본문은
추측하지 않고 미확인으로 표시했다. 별도 Claude 기준 실행의 cache creation은 68,773에서 34,396으로
줄었지만 질문이 완전히 같다는 증거가 없어 방향성 자료로만 채택했다.

## 감사와 재감사

독립 기록 소실 감리와 좌표 스윕에서 다음 결함을 채택하고 닫았다.

1. 진입 게이트의 직전 라운드 읽기가 라운드 작업 배선을 다시 발동해 더 오래된 라운드까지 여는
   재귀 경로를 차단했다.
2. 버전 크기의 변경이 라운드 기록을 잃는 경로와 외부 기여자의 한국어 전용 수단 예외가 빠진 것을
   복구했다.
3. version bump가 라운드 규칙에 도달하지 못하는 배선과, 역할을 지정하지 않은 버전 구현의 기록이
   비결정적인 충돌을 고쳤다. 기본 기록을 `report_ko.md` 하나로 정했다.
4. `v0.15.0/progress-review_ko.md`의 생명주기가 선언되지 않았고 round 검사가 `.md` 확장자만
   확인하던 문제를 닫았다.
5. 진입 게이트가 파일을 읽은 뒤 도달하는 규약이 “어떤 파일도 읽기 전” 범위를 고정하던 순서
   충돌을 고쳤다.
6. 라운드 정규식이 모든 역할의 임의 semver, 0·1·선행 0 순번, `-r0`, patch `003`을 허용하던
   오술어를 닫았다. 병존 기록은 선행 0 없는 2 이상, revision은 선행 0 없는 1 이상, repair report는
   같은 major·minor와 더 큰 canonical patch만 통과한다.

마지막 항목은 독립 재감사가 발견한 뒤 수리했다. 수리 자체는 적대 입력을 고정한 자동 회귀 검사,
한영 구조 대응, 현재 round 전수 분류, 전체 테스트로 다시 읽었다. 채택 후 미수리 소견은 없다.

## 스크립트와 문서 정리 판정

삭제한 파일은 0개다. 이름만 보고 보존하지 않고 소비 경로와 생명주기를 확인했다.

| 런타임 스크립트 | 실제 소비자 | 판정 |
|---|---|---|
| `session-start.js` | `hooks/hooks.json` | 활성 hook, 직접 테스트 있음 |
| `verify-codex-plugin-install.js` | 두 Codex installer | 설치 상태 검증, 직접 테스트 있음 |
| `remove-generated-codex-prompts.js` | 두 Codex installer | 구형 생성 prompt 정리, 직접 테스트 있음 |
| `remove-legacy-codex-hook.js` | 두 installer가 신뢰 확인 뒤 실행할 수동 명령을 출력 | 중복 hook 방지용 보류 수리, 직접 테스트 있음 |

`git-state-transitions.test.js`는 실제 Git fixture의 상태 전이를 측정하고,
`repository-invariants.test.js`는 저장소 정적 계약을 소유한다. 나머지 테스트는 각각 동명 런타임의
직접 검사다. `docs/`의 최상위 정본·상시 수단·archive, `rounds/`의 불변 실행 기록,
`blueprints/`의 snapshot·rollback 기준도 모두 소비 목적이 있었다. `progress-review_ko.md`는
소유자가 요청한 중간 리뷰인 폐쇄 역사 예외이며 쓰레기가 아니다.

## 검증

- `node --test "scripts/*.test.js"`: 98/98 통과.
- `scripts/repository-invariants.test.js`: 65/65 통과.
- ko↔en 구조 대응, 영어 배포물 한국어 0건 규칙, 문서 경로, manifest 버전 대응 통과.
- `git diff --check`: 통과.
- `git diff --exit-code HEAD -- skills`: 차이 0.
- 이전 커밋의 `skills` tree: `238a7092cccd4444f1f7af8c179304314f132721`; 현재 작업에서도
  해당 트리에 변경이 없다.

## 새 구속 결정 (New binding decisions)

- DD-71: 유지보수는 design의 전체 의도를 먼저 읽고 상세 절차를 조건부로 연다. `CURRENT.md`,
  두 번째 스킬 지도, 이력 전체의 기본 읽기, 이 라운드의 스킬 변경은 채택하지 않았다.
- DD-72: 문서 역할을 따로 지정하지 않은 버전 구현은 `report_ko.md` 하나를 기본 기록으로 남긴다.

## 미수리 소견 (Unrepaired findings)

없음.

## 남은 한계 (Remaining limitations)

- 이전 HEAD의 동일 Claude 질문은 제한 시간 안에 끝나지 않아 동일 질문의 token A/B는 얻지 못했다.
- 전체 맥락 독립 패스 일부는 424초·604초 제한에서 미완료되어 증거로 채택하지 않았다.
- 마지막 숫자 문법 수리 뒤 또 하나의 전체 맥락 AI 감사를 반복하지 않았다. 대신 독립 감사가 제시한
  적대 문자열을 회귀 검사에 고정하고 정상 권한의 98개 테스트와 현재 round 전수 분류를 통과시켰다.
- skill·hook·installer가 바뀌지 않아 로컬 Codex installer는 재실행하지 않았다. 외부 배포와 Claude
  재설치는 수행하지 않았다.

## 다음 재검증 (Next revalidation)

다음 유지보수 변경은 `AGENTS.md + docs/design.md` 30KiB 상한, 첫 안전한 기획 입력의 기존 대비
70% 상한, 이해도 누락 0건을 다시 측정한다. 새 스크립트·문서·라운드 이름은 소비자 또는 선언된
생명주기 없이 테스트를 통과할 수 없다.
