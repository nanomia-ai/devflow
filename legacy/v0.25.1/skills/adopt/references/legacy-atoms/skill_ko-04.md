# Legacy atom projection

Repository-relative migration evidence for skills/adopt. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0068 — migration:SKILL_ko.md:129-130

Source hash: sha256:1898eac03121a8f362e28859d718d027730d2e98ab2acdfebb972566c74dec99

4. **code-style.md도 arch 스킬의 "산출 2" 형식 그대로 역산한다.** 코드가 이미 하고
   있는 방식이 정본이다 — 형식의 기본 지향을 강요해 스타일을 두 쪽 내지 않는다.

## migration-a0069 — migration:SKILL_ko.md:131-135

Source hash: sha256:8b467c76b39e5a82eae1bff4fda2e44f4e2adbbd0e94665cc1c9f669ac36c1fe

5. **기존 완성 코드를 트리에 소급 기록하지 않는다.** `devflow/tree/`는 도입 이후의
   작업부터 시작한다 — 이미 있는 기능을 `.done.` 카드로 채우는 것은 낭비다.
   트리를 여는 것은 split이다 — 능력 폴더 이름이 역산된 능력 목록과 같은 단어가
   되게 하여, 새 작업이 제자리에 쌓이게 한다.


## migration-a0070 — migration:SKILL_ko.md:136-139

Source hash: sha256:09dbbcbf8cd3e47151ac0241fd9bc41db53258b09ed2a0c43437d29009feee83

새 도입에서 사용자가 도입 뒤 처리할 변경을 이미 요청했다면 split의 정확한 `유지보수 라우팅
대기` 줄을 먼저 journal에 쓰고, 사용자가 확인한 도입 문서와 함께 규칙 정본의 Layer 0 커밋으로
착지시킨다. 요청이 없으면 도입 문서만 그 커밋에 둔다. 아래 능력 문서 전용 분기만 실행하는
기존 프로젝트에서는 이 시점에 Layer 0 커밋을 다시 만들지 않는다.

## migration-a0071 — migration:SKILL_ko.md:141-141

Source hash: sha256:e1454e2d46d323c2e83c39cfa599964436ee1e99f67ac6baec7a5aa2d26a0769

## 능력 문서 — 도입 커밋 뒤 마지막 출력

## migration-a0072 — migration:SKILL_ko.md:143-145

Source hash: sha256:f33f014641dcb8a20b5bfcc7c2da23132008be812c1f604ae77188209f9c14a8

확정된 product.md·arch.md·glossary.md가 HEAD에 착지한 뒤 기준선 판정 정본의 브라운필드 설계
작성자 절차를 실행한다. 새 도입에서 이미 추적한 대표 흐름은 product.md·arch.md를 역산한
근거이며, 능력 문서에 코드 세부나 흐름을 다시 복사하지 않는다.

## migration-a0073 — migration:SKILL_ko.md:147-148

Source hash: sha256:4a2a54cfa176e233eff3d40ea5e68f4677dce28d9f1f77a5069d1517479399b0

- `01-foundation.md`와 모든 비은퇴 능력의 목적·경계·Intent 총론·개념 모델·불변식·하지 않기로
  한 것·구속 ADR을 Layer 0에서 능력 단위로 도출한다.

## migration-a0074 — migration:SKILL_ko.md:149-158

Source hash: sha256:eca3421ec75e8424e4acb3b9daedfe1295efbf786e0c5e8008c50d20cc074ff2

- **캡슐 가공.** 사용자가 지목한 기존 도메인 문서가 능력 문서 예산을 넘치면 기준선 판정
  정본의 지식 캡슐로 가공한다. 순서는 다섯이다: ①사용자가 지정한 revision에서 원문
  인벤토리(제목·줄 범위) ②주제 단위로 자르고 코드와 대조 ③관통 의도는 능력 문서 Intent
  총론으로, 주제 지식은 캡슐로 — 출처 표기·다툼 보존·Source basis는 정본 계약 그대로이며,
  원문 안의 서로 다른 서술은 한쪽을 고르지 않고 dispute로 남긴다 ④깨끗한 세션의 반증
  문답 — 중요 의도·경계·함정의 누락과 창작이 0이어야 하고, 캡슐마다 무표 문장 3개를 원문
  좌표에서 실제로 찾는 출처 표본 검사를 포함하며, 실패한 캡슐은 착지하지 않는다 ⑤기준선 판정 정본의 설계
  확인 묶음과 같은 확인·같은 커밋으로 착지. dispute 목록은 확인 묶음에서 소유자 결정거리로
  함께 보고한다. 원문의 삭제·이동은 이 절차에 없다 — 판단 재료만 보고한다.


## migration-a0075 — migration:SKILL_ko.md:159-170

Source hash: sha256:a5c6d4d4589aa72821c06a6619fe12d164ea932c06539636f7f4e39941311217

**설계 전용 진입.** 진입이 `marker.design-note` 또는 `marker.design-open-item`을 넘겨 왔으면
역산 전체를 다시 돌지 않는다.
그 줄이 이름 댄 능력 하나의 설계 구역만, 확정된 현재 Layer 0과 그 정확한 문장에서 다시
유도한다. 문장이 능력 문서 예산 안에 들면 Intent 또는 Invariants에 넣고, 예산을 넘치는 설계
주제 상세는 위 캡슐 가공 계약으로 내린다. 넘겨받은 `anchor`가 그 `card`·`code`의 정확한
스냅샷 기준이며, 이력이나 카드에서 다른 기준을 다시 계산하지 않고 능력 사실을 arch.md에 복제해
작성자를 깨우지도 않는다 — 진짜 Layer 0 사실만 발견→갱신 표의 기존 경로로 간다.
`marker.design-open-item`은 `anchor`도 `code`도 싣지 않는다 — 사람이 확정한 `statement`
자체가 기준이고, 그 `card`는 확정이 일어난 자리일 뿐이며, 소유자는 그 줄이 이름 댄
`capability`다. 그 카드에서 코드를 읽지 말고 문장을 그 카드의 능력으로 옮기지도 않는다.
그 줄과 바이트가
같은 journal 줄은 같은 구속 능력 문서 커밋에서 지운다.
