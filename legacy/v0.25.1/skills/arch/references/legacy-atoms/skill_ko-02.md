# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0087 — migration:SKILL_ko.md:43-45

Source hash: sha256:64512fe2906e0ec306c8d65d44df8021dc58c816a3d5aa7931bf1e234e0bc6e2

arch.md에 빠진 필드 하나 — `브라운필드`, 또는 `integration`과 `merge` — 를 채우러 resume이
여기로 보냈다면 역시 1~5단계를 실행하지 않는다. 그 한 가지만 묻고 그 필드 또는 두 줄만 더해
정본 Layer 0 커밋으로 착지시키며 다른 것은 바꾸지 않는다.

## migration-a0088 — migration:SKILL_ko.md:47-47

Source hash: sha256:49372b6c1c8e6c50cb459064ef110937b911cb85f37ee415e2492f4fa3c2d421

## 절차 — 이 순서 그대로

## migration-a0089 — migration:SKILL_ko.md:49-49

Source hash: sha256:e03bf278de493b73e7bc56cbe53fa95cf89d88295c7e04d571edf083e6007596

### 1. 구성요소 도출 — 내가 먼저 판단해 확인만 받는다

## migration-a0090 — migration:SKILL_ko.md:50-50

Source hash: sha256:0d1d80e1ad43fb91ba1fcef3625ef807c283a3b31225434d7b400ee14af2691d

product.md의 능력 목록에서 필요한 구성요소를 도출해 근거 1줄씩 붙여 제시한다.

## migration-a0091 — migration:SKILL_ko.md:52-57

Source hash: sha256:15cdebd4b4fba36733ae361f8631322bfff5b5c116d237547f9951ce915d9ef8

```
✔ 백엔드 API    (①②③ 전부 서버 상태 필요)
✔ DB           (등록 데이터 영속)
✘ 큐/워커       (비동기 작업 없음 — ⑤정산 들어오면 그때)
맞나요?
```

## migration-a0092 — migration:SKILL_ko.md:59-63

Source hash: sha256:f389a89a694a6d6723b8abc5a0ca888fb9ceb513447b3d9c72848a05d8bc0bb9

구성요소를 도출한 뒤 stack 후보를 제시하기 전에 기획 증거 규율로 후보 생존 사실을 확인한다.
현재 저장소 제약·지원 플랫폼·고정 버전·라이선스·배포 환경 중 가능한 결과 하나가 후보를
제거하거나 추천 기본값·검증 가능성을 바꿀 사실만 닫는다. 정확한 한 좌표는 메인이 확인하고,
답만 필요한 다중 경로·출처 대조는 그 규율의 격리 조사 분기를 쓴다. 구조 선택에 필요한 원자료
이해는 메인이 소유한다.

## migration-a0093 — migration:SKILL_ko.md:65-65

Source hash: sha256:2d9bd5ac799f22ba52784167274cb5e652028dd5cd33dfd779c7ef2f9ac63bb0

확인 전에는 다음 둘을 나눈다.

## migration-a0094 — migration:SKILL_ko.md:67-68

Source hash: sha256:287e26dbf4146864a9e50cab1d0d730be015ad8046dbe0d4b9f305b4fe4741d7

- 닫히지 않으면 후보의 사용 가능성이나 완료 검증을 결정할 수 없는 사실은 `차단`이다.
  `settled` 전에는 그 후보를 선택지로 올리거나 선택을 구속하지 않는다.

## migration-a0095 — migration:SKILL_ko.md:69-70

Source hash: sha256:f73f6d0c6b57213764f789433f6ad0ad447901199a5b46c00ebc27063b0b7bd3

- 안전한 기본값으로 진행할 수 있고 나중 결과가 최적화만 바꾸는 값은 `잠정값`이다. 아래 표의
  출처·안전한 기본값·`해소 카드`를 가져야 하며 차단 사실을 잠정값으로 밀지 않는다.

## migration-a0096 — migration:SKILL_ko.md:71-73

Source hash: sha256:e0dee938bbd66f61c871c2deca728c223bbcbd76dfabf1f169a14dad127cfd5a

- 같은 권위가 충돌하거나 허용된 수단으로 확인할 수 없으면 기획 증거 규율의
  `conflicted`·`unavailable` 경계로 보고하고 의존 선택을 멈춘다.


## migration-a0097 — migration:SKILL_ko.md:74-74

Source hash: sha256:d9d89f32495f0eae97888de7eb5f868dc1ec9a4479df6372114db10ac3663811

### 2. 스택 질문 — 묶음으로

## migration-a0098 — migration:SKILL_ko.md:75-77

Source hash: sha256:11efb904eb6d5655ee738c41f7076bce919d7e7b0e2b5d0bc1bca16444a0cad3

생존 사실이 확인된 구성요소별 후보 2~3개 + 내 추천 + 근거 1줄. stack 질문은 비교표를 쓰지
않고 기본값을 명시한다. 비교표 금지는 이 질문 형식에만 적용되며 아래 조건부 설계 비교를
막지 않는다.

## migration-a0099 — migration:SKILL_ko.md:79-82

Source hash: sha256:fcac2ad57265f8c650546598baf15e44fcc0b8a19ef849f52dcaceda684971d3

되돌리기 어렵고 경계가 비자명하며 현재 증거로 설명되는 실제 trade-off가 있을 때만
counter-design 하나를 현재 안과 비교한다. 이 조건을 충족하지 않으면 후보·질문·출력을 만들지
않는다. 현재 증거로 둘을 가를 수 없으면 성공 판정과 사용자 우선순위를 붙여 묻고, 표현만 다른
안은 후보로 세지 않는다.
