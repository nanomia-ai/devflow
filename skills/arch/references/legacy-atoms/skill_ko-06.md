# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0136 — migration:SKILL_ko.md:205-209

Source hash: sha256:7f5f57dc1ca638b8e6ececab4f43c876cbdef83bfe2958189f398956ca1d3610

```markdown
| 항목 | 잠정값 | 출처 | 해소 카드 |
|---|---|---|---|
| 스트림 batch 크기 | 64 KiB | <참조>에서 차용 | 01.3 |
```

## migration-a0137 — migration:SKILL_ko.md:211-214

Source hash: sha256:c219b0e14d5787de8141fbff1462fcc8ea30f964cd860fa5d31b9e1db7f38716

계약: 해소 카드가 닫힐 때 work의 환류 단계가 이 표를 확인하고, 행은 실측 결과로
**교체**된다 — 결정으로 승격되거나, 불필요로 판명되어 삭제된다. 자기 해소 카드보다
오래 살아남는 행은 세부사항이 아니라 절차의 버그다. 잠정값이 본문 다른 곳에도
등장하면 그 자리에 잠정임을 표시한다.

## migration-a0138 — migration:SKILL_ko.md:216-217

Source hash: sha256:f7c32d5ed989457a37b7d0dbf64842d2c4708378de3c2ae849518bb6411c7d32

ADR(Architecture Decision Record — 결정 하나당 맥락·선택지·결정·결과 한 장)은
**세 조건을 모두 충족할 때만** `devflow/project/decisions/ADR-NNN.md`에 남긴다:

## migration-a0139 — migration:SKILL_ko.md:219-222

Source hash: sha256:5911029811c733dc51dce12c983fccc1f80dfee2ada1d219ca2f7f6c423a5972

```
① 되돌리기 어렵다  ② 나중에 보면 의아할 만큼 비자명하다  ③ 실제로 대안을 검토했다
(예: 인증을 세션 대신 JWT로 = 통과 / 라이브러리 A 대신 B = 탈락)
```

## migration-a0140 — migration:SKILL_ko.md:224-226

Source hash: sha256:2648c7d1a66e45a3625edf6cafae4548cb6bfe534955fefddee48b8a0e32ba1f

세 조건에 못 미치는 결정은 ADR을 만들지 않는다 — 그 결정이 사는 arch.md 절에 선택과 근거를
한 줄로 함께 쓰고, 버린 대안은 같은 절의 ✘ 줄로 남긴다. 근거가 숫자면 그 숫자가 참인 실행
조건과 다시 재는 명령을 같은 줄에 붙인다.

## migration-a0141 — migration:SKILL_ko.md:228-228

Source hash: sha256:9489e32d21df03e1c67137754817e7925380c2e09f67b4388f604fc40d94c7c3

## 산출 2 — devflow/project/code-style.md

## migration-a0142 — migration:SKILL_ko.md:230-231

Source hash: sha256:7ccbe67d6dba8ace43e075870f104ec7c778d605b63d7529389bc907a216c2a8

선택한 스택 때문에 생긴 이 프로젝트 고유의 결정들을 받아 적는 곳. **모든 항목은 "무엇을 우선하는가"로 쓴다 —
"이렇게 하라"로 쓰지 않는다.** 방법은 구현자가 정한다. 상한 1페이지.

## migration-a0143 — migration:SKILL_ko.md:233-254

Source hash: sha256:17815a7f476fe4e348b6fcc3c3f83704c0b55fbad4e6b39030046449f9edbc68

```markdown
# 코드 스타일

## 지향                          <!-- 아래 7줄을 기본 제시하고 프로젝트 성격에 맞게 취사 -->
- 적은 수의 깊은 모듈 > 많은 얕은 헬퍼.
  지웠을 때 복잡성이 호출자로 흩어지는 모듈이 좋은 모듈이다
- 결과를 반환한다 > 상태를 바꾼다. 같은 입력이면 같은 출력인 코드를 우선한다
- 명시가 마법을 이긴다. 코드에 적히지 않은 연결은 없는 것이다
- 테스트는 공개 인터페이스의 행동을 사양처럼 검증한다. 내부 구현을 모킹하지 않는다
- 오류를 삼키지 않는다. 처리하거나 위로 던진다
- 죽은 코드는 지운다. 주석 처리된 코드는 git이 기억한다
- 주석은 "왜"만 적는다. "무엇"은 코드가 말한다

## 이 프로젝트의 선택             <!-- 모델이 알 수 없는 이 프로젝트의 결정만 -->
- (예) 검증: zod / 에러: Result 타입, throw 금지 / HTTP: shared/http.ts만 / 시간: UTC

## 신뢰 경계
- 자세: 엄격 | 표준 | 최소       <!-- 프로젝트 성격이 다이얼을 정한다 -->
- 경계 목록: <외부 입력이 들어오는 지점들>. 경계를 넘는 입력은 적대적으로 간주한다

## 하지 않는 것                   <!-- 이 프로젝트의 YAGNI 선언 2~3개 -->
```
