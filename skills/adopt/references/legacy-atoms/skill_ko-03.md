# Legacy atom projection

Repository-relative migration evidence for skills/adopt. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0061 — migration:SKILL_ko.md:84-86

Source hash: sha256:5b1195a38cbbf67b71c97cdc0ef2d3cb56586d7799bbba06d818f906908d73e4

확인 묶음에는 `관찰`·`해석`·`결정 preview`를 나눠 제시한다. 관찰은 코드와 고정 버전 계약,
해석은 그 사실이 현재 경계에 뜻하는 바, 결정 preview는 소유자가 확인할 미래 방향이다. 현재
사실을 미래 의도로 바꾸거나 해석을 관찰처럼 제시하지 않는다.

## migration-a0062 — migration:SKILL_ko.md:88-89

Source hash: sha256:198455fd5aa8326f30553b2b66e1b4ea6d525ef52ba5d6f14e728c7afe05ca2b

현재 동작 보존과 목표 방향이 실제 다른 결과를 낼 때만 확인 전에 기획 증거 규율의 구속 전
재검토로 대안 하나를 비교한다. 실질 후보가 없으면 출력·질문·조사를 더 만들지 않는다.

## migration-a0063 — migration:SKILL_ko.md:91-99

Source hash: sha256:8875c9c625b1becb6fcfe59b318318674f1da72b22d286d533015ff55a7a1d44

커밋 이력은 보조 증거다.
현재 코드와 문서가 충돌한 경우에만, 충돌한 정확한 경로를 건드린 최신 커밋과 바로 앞의 해당
커밋까지 본다. 저장소 전체 이력을 훑지 않는다.
기존 문서의 최초 읽기 집합은 저장소 루트의 README 파일, 사용자나 저장소 지침이 정확한
경로로 지목한 파일, 이름을 소문자로 바꾸면 `docs`·`specs`인 루트 디렉터리와 지침이 지목한
문서 루트의 파일 경로 목록이다.
루트 README와 정확히 지목된 파일을 제외하고, 문서 파일명 본체와 코드에서 나온 후보 이름을
각각 소문자로 바꾸고 글자·숫자 아닌 문자를 지웠을 때 어느 한쪽이 다른 쪽을 포함하지 않으면
그 문서 본문은 열지 않는다. 정규화 결과가 빈 문자열인 쪽이 있으면 통과하지 않는다.

## migration-a0064 — migration:SKILL_ko.md:101-101

Source hash: sha256:49372b6c1c8e6c50cb459064ef110937b911cb85f37ee415e2492f4fa3c2d421

## 절차 — 이 순서 그대로

## migration-a0065 — migration:SKILL_ko.md:103-108

Source hash: sha256:b1988a468e21baa23fd8983eae3a559409464dbdfad085a6b5f195249faf8240

1. **능력 후보와 흐름 추적.** 외부 진입점·최상위 코드 모듈에서 코드 후보를 먼저 열거하고,
   위 파일명 규칙을 통과한 문서를 연다. 그 문서의 기능 목록과 경로 이름에서 나온 후보는
   코드 흐름과 연결되면 추가하고, 연결되지 않으면 확인 질문 묶음에 남긴다. 기존 문서는 아직 주장으로만 취급한다.
   후보마다 외부 진입점에서 대표 실행 하나를 끝까지 따라가며 경계를 확인한다. 두 후보가
   같은 외부 관찰 책임과 같은 코드 흐름을 가질 때만 합치고, 경계를 확정하지 못한 후보는
   확인 질문 묶음에 남긴다.

## migration-a0066 — migration:SKILL_ko.md:109-119

Source hash: sha256:7819860ce39a35c634a4c65ac457ec5c5742a182da19dedfc294ab0d41a8646d

2. 코드·기존 문서·커밋 이력에서 `product.md`를 **product 스킬의 산출 형식 그대로** 역산한다.
   코드가 답할 수 있는 것(정체성 문단, 번호·이름·사용자 결과까지의 능력 목록, 경계의 MVP
   범위 — 이미 만들어진 것이 그 답이다, 화면·창구, interface)은 역산으로 채우고,
   코드가 답할 수 없는 것(경계의 "안 만들 것" · 성공 판정과 능력별 사용자 결과가 그 성공
   판정에 필요한 이유 · 역산된 정체성 문단이 놓친 문제와 해결 방식)은 소유자에게 묻는다.
   전체 인터뷰는 하지 않는다 — 확인 질문 한 묶음이 틀리게 역산한 것의 교정과 이
   보완을 겸한다. 성공 판정은 예외다: 소유자가 답해야 하며, `product.md`의 성공 판정이
   적힌 그대로 검증 가능해야 한다. 검증 가능하지 않으면 다시 묻고, 이 조건을 통과하기 전에는
   3단계로 가지 않는다. 그 밖의 무응답만
   지어내지 말고 '열린 질문'에 남긴다.
   `glossary.md`도 코드가 실제로 쓰는 용어로 시작한다 — 코드의 단어가 정본이다.

## migration-a0067 — migration:SKILL_ko.md:120-128

Source hash: sha256:be84bd36e6eca4ff8e5688fc3395694b5037f1298c9e98fdb2496248e5ec0962

3. `arch.md`를 **arch 스킬의 산출 형식 그대로** 역산하고 `브라운필드: 예`를 기록해 초안으로
   제시한 뒤 사용자 확인을 받는다. 기존 arch.md에 이 필드만 없으면 다른 내용을 재역산하지
   않고 필드만 추가한다. 검증 창구는 arch의 "검증 창구 결정" 절을 게이트째 그대로
   적용한다 — 정해지기 전에는 이 스킬이 끝나지 않는다. git 확인(리포가 아니면
   `git init` 제안)도 같은 절의 것이다.
   기존 핸드오프·사양 파일의 서술 하나 이상이 1단계에서 추적한 코드와 맞으면, 그 서술의
   단계·계약·상태를 쓰는 후보 흐름이 하나일 때 arch.md의 `기존 기록`에
   `그 능력 이름: 정확한 경로`로 적는다. 둘 이상이면 이름 대신 `shared`를 쓴다.
   한 줄에는 경로 하나만 쓰고 같은 이름을 반복할 수 있다. 경로만 적고 내용을 복사하지 않는다.
