---
title: Devflow vNext planning history
status: archive-index
purpose: Preserve why the plan changed without keeping full historical Markdown copies in the active search surface.
read_when: Read only when reviewing design lineage or recovering an exact frozen iteration.
canonical_for: Iteration deltas and the integrity pointer to archived snapshots.
tags: [devflow-vnext, planning, history]
---

# 설계 반복 기록

현재 계약은 루트의 `README`, `01`~`06`, `08`, `09`만 소유한다. 과거 전체 스냅샷은 AI 검색에서
현재 문서와 경쟁하지 않도록 압축 보관했다. 새 반복도 전체 tree를 복제하지 않고 이 파일에 결정 delta와
반증 결과만 추가한다.

## 반복별 변화

1. `01-initial-synthesis` — 레거시 실패, 중개노트 성공 사례, host 설치 조사 결과를 합친 최초 구조.
2. `02-reconciled` — 최초안과 독립 Fable 안을 대립시켜 스킬 경계와 점진 delivery를 수렴.
3. `03-inversion-review` — 더 적은 skill·document·state로 같은 효과를 낼 수 있는지 역발상 검증.
4. `04-internal-canon-and-lifecycle` — 외부 `docs/` 정본 의존을 폐기하고 모든 지식을 `.devflow/`에
   흡수; canonical home과 transient artifact 수명을 구체화.
5. `05-practical-durability-and-document-contracts` — 병렬 Git, 전 단계 checkpoint, 문서별 본문 계약,
   Skill Rails source graph를 보완.
6. `06-benchmark-boundaries-and-decomposition` — 중개노트·레거시·신규 도출 경계를 분리하고, K 대신
   owner·수명·조건부 읽기·fold에 기반한 문서 분해 계약을 확정.
7. 현재 working revision — 전체 스냅샷 증식을 중단하고, 시작 깊이·closure 구조·기록 지속성을
   독립시켰다. Shaping envelope, 의미 기반 ephemeral gate, 한 closure의 spec identity,
   Direct publication invariant, continue/reconcile/abandon 처분을 추가했다. 최종 증식 감사에서 실행
   계약을 08로 다시 수렴시키고, 손상된 managed project를 unmanaged bootstrap과 구분했다.

## 동결본 복구

- 파일: [archive/iterations-01-06.zip](archive/iterations-01-06.zip)
- 포함 Markdown: 54개
- 크기: 270,667 bytes
- SHA-256: `6CD0A7806CD56DD3AD838F85E9188BB488F0119AE4A17E554EA42FE6E21EB219`

복구할 때는 hash를 먼저 확인하고 별도 임시 위치에 푼다. 보관본을 활성 `plan/` tree 아래에 다시 풀어
현재 문서와 함께 검색하지 않는다. Iteration 06의 현재안 사본은 당시 root와 byte-identical한 파일을
포함하므로 별도 활성 복사본을 유지하지 않는다.
