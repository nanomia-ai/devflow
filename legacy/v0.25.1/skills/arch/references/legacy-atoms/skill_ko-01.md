# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0078 — migration:SKILL_ko.md:1-4

Source hash: sha256:64a903a71f6fad068db183d5be068be89b70cba1dc426af7f4f6f7f32fa78db6

---
name: arch
description: 개발 기획. product.md를 받아 구성요소·스택·코드 구조·검증 창구를 결정하고 능력 설계 구역을 만든다. 스택 선택, 아키텍처 설계, 새 프로젝트의 능력 문서 생성·복구 시 사용.
---

## migration-a0079 — migration:SKILL_ko.md:6-6

Source hash: sha256:5fe01275924abdfb0b2b3abd953b186d8f48739a7e8594cb3809bd1678ff9c7a

# arch — 개발 기획

## migration-a0080 — migration:SKILL_ko.md:8-12

Source hash: sha256:d0621f29c74ab464b941a3c3d7cc40923148901498f041d978e4197a93b1f099

glossary.md는 항상 읽는 Layer 0 기준선이며, 능력 구성이 바뀌면 능력 문서 머리의
`Concepts:`를 정확한 정본 용어로 맞춘다. `marker.glossary-term`이면 도구 payload만 소비해
먼저 glossary 정의를 구속 커밋하고 마커를 남긴다. 다음 `arch — capabilities` 배치에서
glossary definition and every known affected `Concepts:` line을 함께 맞추고 모든 Design head를
갱신한 뒤 마커를 지운다. 공유 용어는 여러 머리에 남고 `[]`는 프로젝트 루트 문맥이다.

## migration-a0081 — migration:SKILL_ko.md:14-20

Source hash: sha256:645a7f85a13372a0c204472189c5eb0da45505e13088b712f06a5a9669abc8b7

먼저 규칙 정본(`../principles/SKILL.md`)·기획 증거 규율
(`../principles/planning-evidence.md`)·`devflow/project/product.md`를 통독한다. 능력 지식
기준선 판정 정본(`../principles/baseline-predicates.md`)은 바로 다음 문단의 캡슐 관문에 따라
읽는다. 존재하면
`devflow/project/arch.md`·`devflow/project/code-style.md`·`devflow/project/glossary.md`,
`devflow/journal.md`, 그리고
`devflow/project/decisions/` 바로 아래의 legacy `ADR-NNN.md`를 각각 통독한다.

## migration-a0082 — migration:SKILL_ko.md:22-27

Source hash: sha256:d8f6e920c6f20d23654422701a6a4f522c324037e398189fa19c18b1449f4c1e

기준선 판정 정본은
`## 도메인 지식 캡슐`부터 `## 메타데이터와 신선도` 직전까지를 빼고 읽는다. 이번 실행이
사용자가 지목한 원문 문서를 실제로 캡슐로 가공하거나, 도출한 능력 문서가 그 정본의 총 상한을
넘길 참이면 그 구역 전문을 먼저 열고 쓴다. 캡슐이 지금 디스크에 있는지 없는지는 이 판정에
쓰지 않는다 — 첫 캡슐은 언제나 캡슐이 없는 프로젝트에서 태어난다. 어느 쪽인지 불확실하거나
그 두 제목을 찾지 못하면 전문을 읽는다.

## migration-a0083 — migration:SKILL_ko.md:29-30

Source hash: sha256:009f8032c9d95dec58dac2f967ecd43fe4b89eaa526b562067d996a1f8d97bec

`product.md`가 없으면: 코드도 없으면 product 단계를, 기존 코드가 있으면
adopt(기존 프로젝트 도입 — product.md까지 역산으로 함께 만든다)를 먼저 안내한다.

## migration-a0084 — migration:SKILL_ko.md:32-35

Source hash: sha256:d3a0cf32bc3d4b3eaa1b76fc6918b04d3022d5ff65869dfed9ea185e96bcdd28

대상 능력 문서마다
`node ../principles/scripts/project-state.mjs state --capability <능력 번호>`를 실행한다.
그 `baseline:` 줄이 기대 집합·경로 상태·경계·형태·신선도·`legacy v0.10` 판정을 내고, 그 값을
그대로 쓴다. 기준선 판정 정본에서는 무엇이 본문에 들어갈 자격이 있는지를 읽는다.

## migration-a0085 — migration:SKILL_ko.md:37-37

Source hash: sha256:2fed59c2139f247e5c1f1560eb317e9c84ea39405f7d5340d64f6687518e7653

목적: 서비스 기획을 개발 계획으로 번역해 `devflow/project/arch.md`를 만든다.

## migration-a0086 — migration:SKILL_ko.md:39-41

Source hash: sha256:2197609dd5cc0e321a8e77349f3323ab4a11c676bb14a4f3f163ae8e33ab591b

resume이 Layer 0는 완성됐고 능력 문서만 없거나 수리가 필요하다고 라우팅했다면
아래 1~5단계와 arch.md·code-style.md 수정을 실행하지 않는다. 확정 문서를 그대로 두고
`능력 문서` 절만 실행한다.
