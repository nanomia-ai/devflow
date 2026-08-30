# Legacy atom projection

Repository-relative migration evidence for skills/adopt. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0039 — migration:SKILL_ko.md:1-4

Source hash: sha256:a50b4e4b3620f31084fa04612f7c2a7b4c9500ad81aabdbfaed87d01c35346c5

---
name: adopt
description: 기존 프로젝트 도입. 이미 코드가 있는 저장소에서 능력 후보별 대표 흐름을 추적해 Layer 0와 능력 설계 구역을 역산한다. 기존 프로젝트 도입, 코드베이스 문서 역산, 브라운필드 능력 문서 생성·복구 시 사용.
---

## migration-a0040 — migration:SKILL_ko.md:6-6

Source hash: sha256:0214e6a6b1c4fc13b769cac7dded0f763eaba3d4fb69251b3611e53df07e30ea

# adopt — 기존 프로젝트 도입

## migration-a0041 — migration:SKILL_ko.md:8-12

Source hash: sha256:47d9cc6c6ae9dff149f3114e1282fb6158bf94b46ac35ae98b1221240333210d

glossary.md는 항상 읽는 Layer 0 기준선이며, 역산한 능력 구성과 능력 문서 머리의 `Concepts:`를
정확한 정본 용어로 맞춘다. `marker.glossary-term`이면 도구 payload만 소비해 먼저 glossary
정의를 구속 커밋하고 마커를 남긴다. 다음 `adopt — capabilities` 배치에서 glossary definition
and every known affected `Concepts:` line을 함께 맞추고 모든 Design head를 갱신한 뒤 마커를
지운다. 공유 용어나 프로젝트 루트 `[]`에서 카드 번호를 의미 소유자로 추론하지 않는다.

## migration-a0042 — migration:SKILL_ko.md:14-20

Source hash: sha256:b183f84c8602e0a98316a6126502712de4cfacd88b266c9981eb4dbe0a4f4108

먼저 규칙 정본(`../principles/SKILL.md`)·기획 증거 규율
(`../principles/planning-evidence.md`)을 읽는다. 능력 지식 기준선 판정 정본
(`../principles/baseline-predicates.md`)은 바로 다음 문단의 캡슐 관문에 따라 읽는다. 존재하면
`devflow/project/product.md`·
`devflow/project/arch.md`·`devflow/project/code-style.md`·`devflow/project/design.md`·
`devflow/project/glossary.md`, `devflow/journal.md`, 그리고
`devflow/project/decisions/` 바로 아래의 legacy `ADR-NNN.md`를 각각 통독한다.

## migration-a0043 — migration:SKILL_ko.md:22-27

Source hash: sha256:d8f6e920c6f20d23654422701a6a4f522c324037e398189fa19c18b1449f4c1e

기준선 판정 정본은
`## 도메인 지식 캡슐`부터 `## 메타데이터와 신선도` 직전까지를 빼고 읽는다. 이번 실행이
사용자가 지목한 원문 문서를 실제로 캡슐로 가공하거나, 도출한 능력 문서가 그 정본의 총 상한을
넘길 참이면 그 구역 전문을 먼저 열고 쓴다. 캡슐이 지금 디스크에 있는지 없는지는 이 판정에
쓰지 않는다 — 첫 캡슐은 언제나 캡슐이 없는 프로젝트에서 태어난다. 어느 쪽인지 불확실하거나
그 두 제목을 찾지 못하면 전문을 읽는다.

## migration-a0044 — migration:SKILL_ko.md:29-32

Source hash: sha256:d3a0cf32bc3d4b3eaa1b76fc6918b04d3022d5ff65869dfed9ea185e96bcdd28

대상 능력 문서마다
`node ../principles/scripts/project-state.mjs state --capability <능력 번호>`를 실행한다.
그 `baseline:` 줄이 기대 집합·경로 상태·경계·형태·신선도·`legacy v0.10` 판정을 내고, 그 값을
그대로 쓴다. 기준선 판정 정본에서는 무엇이 본문에 들어갈 자격이 있는지를 읽는다.

## migration-a0045 — migration:SKILL_ko.md:34-36

Source hash: sha256:104fb8b416ecc0c90bfc6dcc2ea12bad3a729dbe71dbf9fd9ddaed3e74a84ec2

목적: **브라운필드(이미 코드가 있는 프로젝트에 중간 참여)**에 Layer 0 문서
(product.md·arch.md·code-style.md·glossary.md)를 역산으로 만들어 상속시킨다.
인터뷰하지 않는다. 역산한다. 이 절차가 곧 "이해 단계"다 — split은 이것 없이 돌지 않는다.

## migration-a0046 — migration:SKILL_ko.md:38-41

Source hash: sha256:66863022c041b4182f196397bb553f27b3833bac762842ea769c7c6b155efad3

산출 형식 참조는 유계다. `../product/SKILL.md`에서는 `산출 — devflow/project/product.md` 절부터
`게이트` 전까지, `../arch/SKILL.md`에서는 `검증 창구 결정` 절과 `산출 — devflow/project/arch.md`부터
`능력 문서 — Layer 0 뒤 마지막 출력` 전까지 읽는다. 두 스킬에서 이 범위 밖의 인터뷰·절차는
읽거나 실행하지 않는다.
