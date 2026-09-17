# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0144 — migration:SKILL_ko.md:256-260

Source hash: sha256:e906ffef2ce425b6f8e77077efaf4cb3802767aee3ae0e7ae46ff2090942f4a0

arch.md 확인을 받기 전에, 이 문서가 내린 결정 중 ADR 세 조건을 모두 만족하는 것과 근거가
아직 문서에 없는 것을 함께 열거하고 각각 남길지 사용자와 확인한다. 이 자리에서 product가
남긴 기명 journal 줄의 개발 선택도 수용해 arch.md의 그 결론 옆으로 착지시킨다 — product가
물려준 기술 선택의 확정은 arch 소유다. 열거하고서 남기지 않기로 한 결정은 그대로 두되 열거는
건너뛰지 않는다. 착지한 뒤에는 그 대화로 돌아가는 경로가 없다.

## migration-a0145 — migration:SKILL_ko.md:262-262

Source hash: sha256:b7ada256c794fd2839b64af9cb46a5cf77f25d2794c03d8370ff497c59fa216b

사용자가 arch.md 또는 code-style.md를 확인한 즉시 규칙 정본의 Layer 0 커밋으로 착지시킨다.

## migration-a0146 — migration:SKILL_ko.md:264-264

Source hash: sha256:8cf7fbfb460a8ee6cbdfc018e83a761b3ae5578f586613a5699b32dcb0401673

## 능력 문서 — Layer 0 뒤 마지막 출력

## migration-a0147 — migration:SKILL_ko.md:266-267

Source hash: sha256:4239b9f5bbc97ad255d0f49cf03d9a256527a3456960012b95b72379c2e015aa

확정된 arch.md가 `브라운필드: 예`이면 이 절을 실행하지 않고 adopt의 능력 문서 전용 분기로
보낸다. adopt가 그 실행의 마지막 커밋을 소유하며, 아래 완료 안내도 그 뒤에 한다.

## migration-a0148 — migration:SKILL_ko.md:269-272

Source hash: sha256:893d1e8fd9a1ab2eb3719928ff7134fc8cd1483391cbe0b46531f90df53eb213

이 절은 트리에서 가장 큰 단일 산출물이다. 시작하기 전에 기대 집합의 크기를 문서 장수로 말한다.
하네스가 컨텍스트를 경고했다면 시작하지 말고 확정된 Layer 0 커밋에서 이 실행을 끝낸다. 그때 이
실행이 arch의 완료가 아님을 말하고, 점유한 카드가 없는 상태에서 다음 세션이 resume으로 들어와 이
절만 실행하면 된다고 안내한 뒤, 아래 완료 안내는 하지 않는다.

## migration-a0149 — migration:SKILL_ko.md:274-275

Source hash: sha256:d12670e01425a04b00224384465f22b10442962808522e2aa245446007491b58

확정된 product.md·arch.md·glossary.md가 모두 HEAD에 착지한 뒤 기준선 판정 정본의 설계 작성자
절차를 실행한다. `Design head`는 이 세 경로의 현재 명령 출력으로 계산한다.

## migration-a0150 — migration:SKILL_ko.md:277-278

Source hash: sha256:a5787a7e6df8d889d47887616818722a1db400e7316de6af5946f6b34af4d688

- `01-foundation.md`와 product.md의 모든 비은퇴 능력 문서를 기대 집합으로 삼는다. 번호는
  기준선 판정 정본의 디스크 우선 규칙으로 정한다.

## migration-a0151 — migration:SKILL_ko.md:279-280

Source hash: sha256:20f07d82ca7d1d1923a42375c50edf030e057831463926b3920e19e3349a70da

- 목적·경계·Intent 총론·개념 모델·불변식·하지 않기로 한 것과 현재 진술이 인용하는 구속 ADR만
  능력 단위로 도출한다. planned flow·진입점·코드 필드·code-style.md·design.md 내용은 설계 구역에 넣지 않는다.
