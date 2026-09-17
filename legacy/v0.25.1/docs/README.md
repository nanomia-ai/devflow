# 문서 체계

이 디렉터리는 **지금 devflow 를 판단하는 데 쓰이는 유지 문서만** 둔다.
여기 있는 것은 전부 현재이고, 전부 아래 표의 한 행에 대응한다. 대응하지 않는 파일은 시험이 잡는다.

항상 읽는 진입 집합은 `AGENTS.md` §3.1 이 정한다. 그 밖에는 **자기 질문을 아래 정본에 연결하고
그 정본을** 연다. 나머지를 통째로 읽지 않는다.

| 질문 | 정본 |
|---|---|
| 어떻게 일하는가 · 소유자에게 어떻게 묻는가 · 무엇을 반복하면 안 되는가 | [`working-method.md`](working-method.md) |
| devflow 는 무엇이고 왜 이렇게 만들어졌는가 · 불변식은 무엇인가 | [`design.md`](design.md) |
| 지금 무엇을 향해 가는가 · 무엇이 미결인가 · 무엇이 아직 측정되지 않았는가 | [`direction.md`](direction.md) |
| 이 결정은 왜 이렇게 됐는가 · 무엇이 기각됐는가 | [`decisions/`](decisions/) — `node scripts/decision-index.mjs` |
| 아직 규칙이 아닌 관찰은 무엇인가 · 무엇이 그것을 다시 열게 하는가 | [`backlog.md`](backlog.md) |
| 지금 런타임이 실제로 어떤 형태인가 | `node scripts/runtime-map.mjs` (생성 투영) |
| 이 저장소를 바꾸는 절차는 무엇인가 | [`maintenance-protocol.md`](maintenance-protocol.md) |
| 검증과 감사는 어떻게 하는가 | [`audit-guideline.md`](audit-guideline.md) |
| 사람의 요청 형태 × AI 진입 지점의 전수는 | [`usecase-matrix.md`](usecase-matrix.md) |
| 언제 무엇이 출하됐는가 | `../CHANGELOG.md` — 현재와 직전 마이너만. 그보다 오래된 것은 [`changelog-archive.md`](changelog-archive.md) 에서 복구한다(읽기 집합 밖) |
| 무엇을 **읽고 무엇을 쓰는가** | `../AGENTS.md` §3 · §4 |

**언어는 한 줄이다 — `skills/` 는 영어, `docs/` 는 한국어, `CHANGELOG.md` 와 그 아카이브는 영어.**
예외는 `maintenance-protocol.md` §2 가 소유한다.
`docs/` 에 `_ko` 짝은 없다. 짝은 한 사실 두 집이기 때문이다.

## 이 체계가 자라는 방식

**결정이 나면 두 곳이 같은 변경에서 움직인다.**

```
결정 하나  ──▶  docs/decisions/<nnn>-<slug>.md   왜 · 범위 · 상태 · 기각 대안
                무한히 누적된다. 통째로 읽지 않는다. 색인은 생성된다.
           │
           └──▶  그것을 소유하는 정본의 현재형 규칙 한 줄
                 정본은 지금 참인 것만 담으므로 결정 수에 비례해 자라지 않는다.
```

**현재 규칙을 결정 파일에만 두지 않는다** — 정본이 낡으면서 계보만 자란다.
**이유를 정본에 옮겨 적지도 않는다** — 정본이 결정마다 커진다.
그 두 방향이 실패이고, 위 분업이 둘 다 막는다.

## 여기 두지 않는 것

일시적인 계획·조사·실행 보고는 유지 문서가 아니다. 채택된 현재 진실만 위 정본 중 관할이 맞는 곳에
**흡수**하고, 조사 과정·실행 로그·그날의 수치는 Git commit 에서 복구한다. 완료된 원천 문서를 그대로
남겨 현재 정본과 경쟁시키지 않는다.

2026-09-11 에 이 규칙이 `docs/rounds/`(76편 1,970 KB)와 `docs/blueprints/`(2편)를 정리했다.
지속되는 내용 일부를 위 정본으로 승격했고, 원본은 git 태그 **`rounds-archive-v1`** 이 보관한다.
