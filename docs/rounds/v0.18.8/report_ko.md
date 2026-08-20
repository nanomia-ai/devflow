# v0.18.8 라운드 기록 — 「도구가 실제 작성자를 만난다」

기준 `da8914e`(0.18.7) · 릴리스 0.18.8 · 시험 263 → **272**(코디네이터 직접 실행, 272/272)

## 1. 이 라운드가 시작된 이유

0.18.7 은 진입 상태 계산을 산문에서 읽기 전용 도구로 옮겼고 그 방향은 두 번의 독립 되짚기가
**옳다**고 판정했다. 틀린 것은 방향이 아니라 **도구가 누구와 맞춰 봤는가**다 — 도구는 자기 손으로
만든 픽스처하고만 만났고 **실제 작성자**(사람의 산문 · 옛 세션의 문서 · **정본 자신의 산출물
골격**)는 한 번도 만나지 않았다.

직전 라운드가 실사용 실행 게이트를 「대상 없음」으로 닫았는데 **그것이 거짓이었다.** 한 겹
안쪽(`service/<name>/devflow`)에 대상이 셋 있었다. 찾은 방법은 이렇다:

    find /d/Projects/Private -maxdepth 4 -type d -name devflow

    D:/Projects/Private/nanomia/nanomia-ade/service/nanomia-ade/devflow
    D:/Projects/Private/redevelopment-special-force/service/rdsf-data-server/devflow
    D:/Projects/Private/synky/service/synky-monorepo/devflow

**「없다」는 결과는 찾는 방법과 같이 적어야 다음 세션이 검산할 수 있다.** 이 규율이 이 자리에서
나왔다.

## 2. 라운드의 축을 정한 실측

실사용 저널을 줄 단위로 분류한 결과:

| 프로젝트 | 비어 있지 않은 줄 | ISO 타임스탬프로 시작 | 예약 머리말 13종 포함 |
|---|---:|---:|---:|
| rdsf-data-server | 82 | **0** | **0** |
| nanomia-ade | 16 | **0** | **0** |
| synky-monorepo | `journal.md` 파일 자체가 없음 | — | — |

**진입을 막던 98건 전부가 사람이 쓴 메모**이고, 무결성 12항이 막으려던 사고(형식이 어긋난 예약
줄)는 **0건**이었다. `journal.md` 를 devflow 는 기계 소유 파일로 보는데 사람은 공책으로 쓴다.

## 3. 채택된 설계 변경 — 저널의 줄 단위 소유권

**기계의 줄은 정본 타임스탬프로 시작하거나 예약 머리말로 시작하는 줄이고, 나머지는 사람의
것이다** — 판정에 들어가지 않고 그대로 남는다. 예약 머리말인데 형식이 틀린 줄은 타임스탬프
유무와 무관하게 여전히 진입을 멈춘다.

이 술어는 이제 세 자리에서 같은 말을 한다: 정본의 저널 형식 문단 · 무결성 12항 · 도구.
`repository-invariants` 가 그 셋을 단정으로 문다.

**거부가 아니라 소유권으로.** 옛 구조는 사람이 자기 파일에 메모를 쓰면 저장소를 봉쇄했다.

바깥 선례: Postel의 법칙 · Fowler의 Tolerant Reader · Markdown front matter · devflow 자신의
캡슐(*"There is no checker"*). 반대 선례: Conventional Commits 린터는 거부하지만 **쓰는 순간의
훅**이지 다음 날 읽을 때 저장소를 막지 않는다.

## 4. 실측 효과 (코디네이터가 직접 재현)

| 프로젝트 | 전 | 후 |
|---|---|---|
| nanomia-ade | 정지 16 · 이상 20 · `expected=10`(유령 1) | **정지 0** · 이상 4 · `expected=9` → `setup.brownfield-field` |
| rdsf-data-server | 정지 82 · compact 1,306 B **항목 0줄** | **정지 0** · full 3,760 B · `shape=1 capabilities-heading-missing` → `setup.brownfield-field` |
| synky-monorepo | 이상 1(거짓 advisory) | **이상 0** |

막혀 있던 두 프로젝트가 질문 하나(`"기존 코드가 devflow 이전에 있었나?"`)면 들어온다.

**rdsf 의 `expected` 는 여전히 1이다.** 제목이 `## Capabilities (구성)` 이고 임의 접미사는 받지
않기로 판정했기 때문이다. 제목을 현행 형식으로 고치면 **7**로 읽힌다(두 팔이 독립적으로 측정).
거부는 유지하되 **이제 무엇을 고쳐야 하는지 말한다.**

## 5. 검증 경과

```
1차 수리   코드(Codex sol xhigh) · 산문(Claude Opus xhigh) — 파일 소유 겹침 0
   ↓
되짚기     Fable xhigh · Codex sol max — 맹검 교차, 「이것이 최선인가」
   ↓  릴리스 막힘 3건
2차 수리   코드 둘(Codex) · 산문 셋(코디네이터)
   ↓
최종 게이트  코디네이터가 직접 272/272 · 세 프로젝트 재측정 · ko/en 1:1
```

**두 팔이 서로 못 본 것을 각각 잡았다.** 결함 다섯 중 Claude 가 셋(제목 완전일치 · `--card`
불활성 · 거절 출력), Codex 가 둘(HANDOFF `none` · **시험이 결함을 계약으로 고정**). 한쪽만
돌렸으면 다섯 중 넷을 놓쳤다.

**되짚기가 갈린 두 자리와 판정:**
- `integrity.shape` 채널 — Codex 「틀린 채널」 vs Fable 「채널은 옳고 소비자 문장이 거짓」.
  **Fable 채택**: `resume` 이 `shape` 를 두 번 언급하고 `advisory` 는 0번이며, blocking 으로
  옮기면 rdsf 가 다시 막혀 이 라운드의 목적이 사라진다. 깨진 것은 채널이 아니라 문장이었다.
- `*` 제거 — Codex 「좋다」 vs Fable 「실사용 작성자를 침묵시킨다」(대안을 실제로 돌려
  RDSF 7·ADE 9·이상 0). **Fable 채택.** 굵은 산문의 진짜 특징은 굵기가 아니라 원문자가 둘
  붙어 있는 것이다.

## 6. 이 라운드가 남긴 교훈

**「시험이 초록이다」는 「계약이 지켜졌다」가 아니다** — 0.18.7 의 교훈이 이 라운드에서 한 단계
더 나빠진 형태로 나왔다. 시험이 결함을 **정답으로 못 박고** 있었다:

```js
test("output budget degrades to compact and then refuses without truncation", …
  assert.doesNotMatch(compact.stdout, /^open-item:/m);   // 항목이 없어야 «통과»
```

이름은 "without truncation" 인데 단정은 잘라내기를 요구한다. 무방비가 아니라 **계약으로 고정**된
상태였고, 수리하면 빨개져서 다음 사람이 「회귀」로 읽고 결함을 복원할 수 있었다.

**뿌리 양식**: *산문이 무조건으로 말하는데 코드가 조건부로 행동한다.* 이 라운드의 결함이 전부 이
모양이다 — 정본이 「도구가 보고한다」는데 안 하고, 「본문을 안 연다」는데 열고, 「모든 줄이 사람
것」이라는데 일부를 막았다.

## 7. 이번에 넣지 않은 것과 그 이유

- **삭제**(`state-predicates` 쌍 · 무결성 항목 열 개) — **0.18.9.** 그 항목들은 같은 파일 안에서
  번호로 네 번 불리고(`principles` 셋 · `product/SKILL.md` 하나), 수리 일곱과 섞으면 무엇이
  무엇을 깨뜨렸는지 가릴 수 없다(DR-44 의 기록된 이유가 정확히 그것이다)
- **`verification-predicates` 쌍** — `verify` 가 *"the tool reports missing"* 을 전제하는데 도구가
  그 보고를 하지 않고 시험도 없다. **도구 출력과 시험이 먼저다**
- **정본이 없는 도구 행동을 전제하는 자리 셋** — 위 하나 + closed-folder projection(정본은
  *"a machine query … opens no body"* 인데 도구는 모든 카드를 연다, 시험 0) + 무결성 8항의
  예외 셋(구현에 없음). **0.18.9 의 의제**
- 거절 출력의 `next:` 부재 — 실패 장면 미관측, 보고-전용

## 8. 미검증 — 실행하지 않은 것은 통과가 아니다

1. **AGENTS 완료 게이트의 「클린 세션 전후 비교」** — 실행하지 않았다. 0.18.5·0.18.7 도 같은
   부채를 남겼다. **다음 라운드(실사용 테스트)가 이것을 실측으로 답할 자리다**
2. **DD-39 의 POSIX 네이티브 파이프 갈래** — Windows 세션에서 실행하지 못했다
3. **Codex `/hooks` 발화 확인** — 소유자만 할 수 있는 한 번
4. **compact 시트를 실제 `resume` 세션이 읽어 교체안을 내는 끝까지의 행동**
5. **`--card` 파싱 경로** — 안내는 지웠으나 플래그는 여전히 파싱·검증된다(쓰이지 않는 표면)
6. **`--capability` 가 integrity 에 닿지 않는 것** — 사실로 남겼다
7. **rdsf 에 `Brownfield` 를 쓴 다음 세션이 어디로 가는지** — 추론했으나 실행하지 않았다
