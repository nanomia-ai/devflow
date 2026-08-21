# 루프 엔지니어링 리서치

> 조사 기준일: 2026-08-21
> 엄격한 최신 자료: 2026-07-21 ~ 2026-08-21
> 중요도 예외 자료: 2026-06-21 ~ 2026-07-20
> 문서 성격: 사람용 외부 근거 합성 보고서. 런타임 규칙이나 devflow의 설계 정본이 아니다.

## 0. 먼저 읽을 결론

### 한 문장 결론

현재 “루프 엔지니어링”에는 확정된 단일 표준이 없다. 다만 최근 연구와 실무 사례가 가장
강하게 수렴하는 형태는 **명확한 완료 조건을 가진 작업을 외부 검증기와 독립된 상태 저장소에
연결하고, 검증된 개선만 최선 상태로 승격하며, 회귀·표류·비용·무진전을 이유로 멈추거나
사람에게 넘기는 제한된 자가 개선 루프**다.

반복해서 같은 프롬프트를 실행하는 Ralph류 루프는 유용한 **지속 실행 장치**이지만, 그 자체로
자가 개선은 아니다. 자가 개선이 되려면 “무엇을 바꿀지”와 “바뀐 것이 실제로 나아졌는지”가
이전보다 더 강한 외부 근거로 판정되어야 한다.

### 최종 판단표

| 질문 | 이 조사에서의 판단 | 근거 수준 |
|---|---|---|
| 루프 엔지니어링은 이미 합의된 표준인가? | 아니다. 2026년 8월 현재 빠르게 정리되는 신생 용어이며, survey도 아직 경계가 유동적이라고 명시한다. | 높음 |
| 가장 공감대가 큰 공통 요소는 무엇인가? | 목표·완료 조건, 외부 검증, 외부 상태/메모리, 명시적 종료 상태, 예산 제한, 회귀 감시다. | 높음 |
| 모델의 자기평가만으로 완료를 판정해도 되는가? | 안 된다. 장기 루프에서 자기보고는 정체를 진전으로 오인하고, 실제 회귀를 승인할 수 있다. | 높음 |
| 가장 가벼운 실용형은 무엇인가? | 새 컨텍스트 실행 + 파일/Git 기반 상태 + 결정론적 테스트/검증기 + 예산·무진전 종료다. | 중간~높음 |
| 장기 작업에 가장 안정적인 구조는 무엇인가? | 관리자가 외부 상태를 소유하고, 신선한 실행자가 제한된 단위를 처리하며, 별도 감사자가 환경을 읽고 상태를 갱신하는 구조다. | 중간~높음 |
| 스킬·메모리·정책을 실제로 개선하는 방법은? | 후보 변경을 생성한 뒤 홀드아웃·회귀·전이 검증을 통과한 것만 승격하는 오프라인 또는 단계적 루프다. | 중간 |
| 드리프트 대응의 핵심은? | 고정 회귀군, 홀드아웃 평가, 현재 상태에 묶인 증거, 실패 메모리 정리, 최선 상태 보존, 주기적 독립 감사다. | 높음 |
| 루프를 무겁게 만들수록 좋아지는가? | 아니다. 짧고 결정론적인 작업에서는 하네스 비용이 효과를 상쇄할 수 있다. 작업 지평이 길고 실패 비용이 클 때만 감사·검색·메타 최적화를 추가해야 한다. | 높음 |

### 이 보고서가 권장하는 기본 선택

대부분의 코드·문서·분석 작업에는 다음 순서를 기본값으로 권장한다.

```text
목표/금지사항 고정
  → 한 번에 처리할 단위 제한
  → 신선한 실행 컨텍스트에서 작업
  → 외부 검증기 실행
  → 별도 판정 또는 결정론적 게이트 통과
  → 현재 최선 상태와 비교
  → 개선일 때만 승격하고 실패를 구조화해 기록
  → 회귀·홀드아웃·예산·무진전 확인
  → 성공 / 실패 / 보류 / 사람에게 질문 중 하나로 종료
```

처음부터 SkillOpt나 메타 스킬 진화처럼 무거운 최적화 시스템을 만들 필요는 없다. 먼저
**완료 판정이 외부에 있고, 실패한 상태가 다시 나오지 않도록 기록되며, 나빠진 변경이 최선
상태를 덮어쓰지 않는지**를 확보하는 것이 우선이다.

---

## 1. 조사 범위와 근거를 읽는 법

### 1.1 날짜 경계

사용자 요청에 따라 2026-07-21 이후 자료를 기본으로 삼았다. 2026-06-21부터 2026-07-20
사이의 자료는 루프 엔지니어링의 정의·검증 이론·실제 수치처럼 현재 결론을 바꿀 정도로
중요한 경우에만 포함했다. 그보다 오래된 자료는 이 보고서의 주된 근거로 사용하지 않았다.

논문은 대부분 arXiv 프리프린트이므로 “최신”과 “동료심사 완료”를 혼동하면 안 된다. 아래
근거 등급은 명성보다 **실험 설계와 재현 가능성**을 기준으로 삼았다.

| 등급 | 의미 | 대표 조건 |
|---|---|---|
| E1 | 강한 최근 실증 | 홀드아웃 또는 외부 검증, 비교군, 정량 결과, 실행 가능한 하네스 중 여러 조건을 충족 |
| E2 | 유용한 실증 사례 | 실제 시스템·공개 코드·생산 관찰 또는 자체 평가가 있으나 표본·대조·독립 재현이 제한됨 |
| E3 | 구조·이론·분류 근거 | 설계 원리, 형식, taxonomy, 검증 모델을 제시하지만 효과를 직접 입증하지 않음 |
| E4 | 실무 설명·커뮤니티 신호 | 구현 노하우와 운영 감각은 유용하나 독립적인 효능 증거가 없음 |

E1이라고 해서 반드시 정답이라는 뜻은 아니다. 최신 프리프린트는 표본이 작거나 한 모델군에
묶일 수 있다. 반대로 E2라고 해서 쓸모없다는 뜻도 아니다. 실무 배치에서만 보이는 비용·운영
실패를 보여줄 수 있다. 이 보고서는 **방법의 구조적 타당성**과 **효과의 실증 강도**를 분리해
기록한다.

### 1.2 이 조사에서 말하는 “효과”

효과는 단순히 한 번의 성공률이 아니다. 다음을 함께 본다.

1. 같은 과제에서 baseline보다 결과가 좋아졌는가?
2. 더 긴 작업에서 중단·회귀·정체를 줄였는가?
3. 다음 과제로 실패 경험이 전이되는가?
4. 홀드아웃·새 저장소·새 모델·새 도구에서도 유지되는가?
5. 토큰·시간·모델 호출·인간 개입을 포함한 비용이 정당한가?
6. 잘못된 완료를 최선 상태로 승격하지 않는가?

---

## 2. 개념 정리: 반복, 자기수정, 자가 개선은 다르다

최근 [Self-Evolving Coding Agents survey](https://arxiv.org/html/2608.03392)는 코딩 에이전트를
단순 코드 생성기가 아니라 저장소·도구·테스트·실행 피드백과 결합된 시스템으로 보고, 자가
진화를 “이전 코딩 시도와 소프트웨어 특유의 피드백을 바탕으로 에이전트의 행동 또는 내부
구성요소가 갱신되는 것”으로 정리한다. 이 정의는 이 보고서의 범위와 가장 잘 맞는다.

### 2.1 네 가지 층위

| 층위 | 실제로 일어나는 일 | 자가 개선인가? | 예 |
|---|---|---:|---|
| 반복 실행 | 같은 지시를 새 컨텍스트에서 다시 실행한다. | 아니오 | Ralph, 단순 retry |
| 작업 중 자기수정 | 현재 실패를 보고 프롬프트·코드·계획을 고친다. | 부분적 | Self-Refine, 반성 단계 |
| 지속적 자가 개선 | 실패·성공을 메모리·스킬·규칙·도구에 기록하고 다음 작업에서 사용한다. | 예 | SkillOpt, 행동 규칙, failure-driven patch |
| 시스템 진화 | 에이전트 골조·정책·워크플로·평가 환경 자체를 바꾸고 홀드아웃으로 선별한다. | 강한 의미의 예 | MetaSkill-Evolve, EvoPolicyGym, AHA, Lean coevolution |

핵심 구분은 **다음 실행의 행동을 바꾸는 지속성**과 **그 변경이 좋아졌다는 독립 증거**다.
반복 실행은 첫 번째도 없을 수 있고, 자기비평은 두 번째가 약할 수 있다.

### 2.2 루프 엔지니어링의 작업 정의

[IBM의 2026-07-17 설명](https://www.ibm.com/think/topics/loop-engineering)은 루프를 목표 →
행동 → 관찰 → 조정의 반복으로 설명하고, 스케줄링·훅·컨텍스트 엔지니어링·도구·worktree·
스킬·서브에이전트·지속 메모리를 구성요소로 든다. [Stop Hand-Holding Your Coding Agent](https://arxiv.org/abs/2607.00038)는 이를 더 엄격하게 다뤄, 재사용 가능한 루프 명세가 최소한 다음을 포함해야 한다고 제안한다.

- 무엇이 루프를 시작하는가
- 무엇을 목표로 하는가
- 어떤 검증 단계가 있는가
- 언제 멈추는가
- 다음 실행이 읽을 메모리는 무엇인가

저자들이 손으로 수집한 실제 루프 50개에서는 약 70%가 자율 영역 안에서 검증을 수행했고,
74%가 terminal state를 이름 붙였다고 보고한다. 반면 자동 trigger와 durable memory는 상대적으로
덜 개발되어 있었다. 이는 최근 루프가 “실행”보다 “검증·종료”를 먼저 갖추고 있지만, 다음
작업으로 실패를 전이하는 기억은 아직 표준화되지 않았다는 신호다.

따라서 이 보고서에서는 루프 엔지니어링을 다음처럼 사용한다.

> **AI가 작업을 한 번 수행하게 하는 프롬프트가 아니라, 목표·행동·관찰·검증·상태 갱신·종료·다음 실행의 개선을 하나의 운영 가능한 시스템으로 설계하는 것.**

이 정의는 용어가 아직 정착되지 않았다는 점을 반영한다. IBM은 산업적 개요이고, arXiv 글은
신생 용어를 체계화하려는 제안이며, 어느 하나도 표준 기관의 규격은 아니다.

### 2.3 최소 수학적 모델

아래 식은 특정 논문의 공식이 아니라, 여러 자료를 비교하기 위한 이 보고서의 정리다.

```text
S_t = (G, X_t, M_t, B_t, D_t)
```

- `G`: 목표, 비목표, 완료 조건, 안전 제약
- `X_t`: 현재 작업·코드·환경 상태
- `M_t`: 지속 메모리와 실패 기록
- `B_t`: 남은 토큰·시간·호출·반복 예산
- `D_t`: 드리프트 및 회귀 감시 상태

실행자는 후보 변경 `c_t`를 만들고, 검증기는 증거 `e_t`를 만든다.

```text
c_t = actor(G, X_t, M_t, B_t)
e_t = verifier(c_t, X_t, G, hidden_or_regression_tests)

promote(c_t) iff
  admissible(e_t)
  AND score(c_t) >= score(best_t) + δ
  AND regression(c_t) = false
```

`δ`는 작업 특성에 따른 최소 개선 폭이다. 동일 점수라도 비용·안전·유지보수성이 개선되면
승격할 수 있지만, 그 기준은 사전에 정해야 한다. `promote`가 false이면 현재 최선 상태를
보존하고 실패 원인을 `M_t`의 후보 기록으로 남긴다.

최근 [Proof-or-Stop](https://arxiv.org/abs/2607.14890)은 완료 판정을 다음 증거 사슬로 엄격하게
분해한다.

```text
Actor output → Claim → Evidence → Gate → Lifecycle transition
```

그리고 증거가 통과하려면 다음 조건의 결합이 필요하다고 제안한다.

```text
Fresh
∧ Complete
∧ IntegrityVerified
∧ ProducerAuthorized
∧ ExecutionAttested
∧ Supports
∧ OutcomeAccepted
```

이 식의 실무적 의미는 간단하다. “에이전트가 끝났다고 말했다”는 claim일 뿐이고, 현재 코드에
대해 새로 실행된 완전한 결과가 아니면 상태를 `done`으로 바꾸지 않는다.

---

## 3. 최근 자료에서 수렴하는 공통 설계

### 3.1 무엇이 진화하는가

survey는 자가 진화 대상을 다섯 가지로 분류한다.

| 진화 대상 | 바뀌는 것 | 대표 최근 방향 | 장점 | 위험 |
|---|---|---|---|---|
| 에이전트 골조 | 실행 순서, 도구 호출, 자기 코드 | self-improving coding agent, Gödel-machine 계열 | 큰 구조적 개선 가능 | 잘못 바꾸면 이후 모든 행동이 망가짐 |
| 메모리 | 저장·요약·검색·퇴출 방식 | AutoMem, SESA, repository memory | 여러 작업에 실패를 전이 | 오래된·중복·충돌 기억이 오염을 일으킴 |
| 스킬·도구 | 절차 지식, 도구 선택, 실행 스킬 | SkillOpt, CODESKILL 계열 | 모델 가중치 없이 재사용 가능 | 특정 benchmark에 맞춘 문구가 될 수 있음 |
| 모델·정책 | policy, 학습 데이터, 추론 행동 | failure-driven self-improvement, policy evolution | 가장 큰 행동 변화 | 비용·안전·검증 부담이 큼 |
| 워크플로·토폴로지 | 에이전트 수, 역할 분담, 연결 구조 | MEA, AFlow, MetaSkill-Evolve | 긴 작업을 구조적으로 관리 | 오케스트레이션 비용·실패 지점 증가 |

이 분류는 “에이전트가 스스로 좋아진다”는 말을 구체적으로 바꿔 준다. 어떤 방법은 모델을
전혀 학습시키지 않고 외부 skill 파일만 바꾸며, 어떤 방법은 평가 환경과 정책을 함께 진화시킨다.
두 방법을 같은 종류의 성능 주장으로 비교하면 안 된다.

### 3.2 언제 진화하는가

- **Task-time**: 현재 작업이 진행되는 중에 계획·도구·메모리를 바꾼다.
- **Post-task**: 작업이 끝난 뒤 trajectory와 결과를 분석해 다음 작업용 지식을 만든다.
- **Stage-wise**: 여러 작업을 모아 스킬·정책·워크플로 버전을 오프라인으로 평가하고 교체한다.

Task-time은 즉시성이 좋지만 오류가 퍼지기 쉽다. Post-task는 실패를 더 차분히 분석할 수
있고, Stage-wise는 홀드아웃과 여러 seed를 사용하기 쉽지만 평가 비용이 커진다.

### 3.3 어떤 증거로 진화하는가

| 증거 | 예 | 신뢰도 특징 |
|---|---|---|
| 결과 증거 | 테스트 통과, 해결률, 수렴, 최종 산출물 | 직접적이지만 평가기가 약하면 속일 수 있음 |
| 환경 피드백 | 컴파일러, 런타임, 실제 UI, 서버 상태, CI | 현재 세계와 연결되어 강함. 환경 격리가 필요 |
| trajectory 증거 | 실패 단계, 반복 오류, 도구 순서, 리뷰 코멘트 | 재사용에 좋지만 기록 자체가 정답은 아님 |
| 인간 피드백 | 리뷰, 승인, 선호, 보안 판단 | 의미·안전에는 강하지만 자동성이 낮음 |

최근 연구가 공통으로 경고하는 점은 trajectory나 자기평가를 outcome 증거로 착각하지 말라는
것이다. 코딩 에이전트는 실행 가능한 테스트가 있어 상대적으로 유리하지만, 테스트가 의도를
다 담지 못하거나 agent가 테스트를 회피하면 “검증 가능”과 “정확함” 사이에 틈이 남는다.

### 3.4 실제 공감대와 아직 없는 공감대

**공감대가 빠르게 형성되는 것**

1. 완료는 텍스트 주장이 아니라 외부 증거로 승격한다.
2. 현재 최선 상태와 실패한 후보를 분리한다.
3. 컨텍스트를 무한히 누적하지 말고 외부 상태·요약·새 컨텍스트를 사용한다.
4. 한 루프가 할 수 있는 범위·예산·시간을 고정한다.
5. 독립 검증기 또는 결정론적 검증기를 둔다.
6. 홀드아웃·회귀·전이로 검증자와 메모리의 표류를 감시한다.

**아직 공감대가 없는 것**

- 에이전트를 몇 개 써야 하는가
- 모든 작업에서 별도 judge가 필요한가
- 자기수정의 단위가 프롬프트·스킬·정책·모델 중 무엇이어야 하는가
- 어떤 모델이 루프에 최적인가
- “완전 무인”을 어느 수준으로 정의하는가
- 모델 호출을 늘린 검증이 그만한 품질 향상을 보장하는가

따라서 “유명한 개발자가 이렇게 했다”는 사실만으로 기본값을 결정하지 않고, 이 보고서에서는
**외부 검증·홀드아웃·비용·회귀 통제**를 공통 판단 기준으로 사용한다.

### 3.5 중첩 루프: 시간척도별로 사람의 역할을 재배치하기

[Agent Native Engineering의 2026-07-02 field note](https://agentnativeengineering.com/field-notes/2026-07-02-loop-engineering-nested-agent-loops/)
는 하나의 거대한 루프보다 세 개의 중첩 루프를 제안한다.

| 루프 | 주기 | 역할 |
|---|---|---|
| 빠른 agentic coding loop | 수분 | 실행자가 작업·테스트·수정을 반복 |
| 개발자 피드백 loop | 수십 분~수시간 | 사람이 방향·품질·범위를 교정 |
| 외부 피드백 loop | 수일 | 사용자·운영·실제 환경의 결과로 다음 목표를 바꿈 |

핵심은 내부 루프를 무인으로 돌리더라도 바깥 루프의 인간 맥락을 제거할 수 있다고 가정하지
않는 것이다. 사양과 eval이 충분히 명확한 동안만 안쪽 루프를 unattended로 두고, 목표·품질·
사업적 의미가 바뀌는 지점은 바깥 루프에서 다시 결정한다. 이것은 “사람을 없애는 자동화”보다
사람이 개입할 시간척도를 바꾸는 운영 모델에 가깝다.

---

## 4. 방법론별 상세 검토

### 4.1 Ralph / fresh-context continuation

#### 원리

한 프롬프트를 쉘 또는 오케스트레이터가 반복 실행하되, 매번 새로운 컨텍스트를 열고 진척은
파일·Git·로그에 남긴다. [FutureAGI의 Ralph 설명](https://futureagi.com/blog/loop-engineering/ralph-loop/)과
[Santander AI Lab의 구현](https://github.com/SantanderAI/ralph)이 이 패턴을 실용적으로 보여준다.

#### 무엇이 좋아지는가

- 오래된 대화 기록이 컨텍스트를 잠식하는 현상을 줄인다.
- 실패한 한 실행의 내부 상태를 다음 실행이 그대로 상속하지 않는다.
- 모델이 스스로 다시 저장소를 읽고 현재 파일 상태를 확인하게 한다.
- Bash/PowerShell만으로 구현할 수 있어 매우 가볍다.

#### 무엇이 좋아지지 않는가

- 같은 잘못된 전략을 계속 반복할 수 있다.
- 실패 원인을 메모리로 추출하지 않으면 다음 실행은 같은 실수를 재발견한다.
- 완료 조건이 약하면 “변경이 생겼다”를 “개선됐다”로 오인한다.
- fresh context는 반복적인 입력 토큰 비용을 만들 수 있다.

#### 판정

Ralph는 자가 개선의 **기반 스케줄러**이지 자가 개선 알고리즘 전체가 아니다. 명확한 테스트와
외부 상태가 있는 저위험 작업의 최소 시작점으로는 매우 좋다. 고위험·기존 코드·의미적 품질이
중요한 작업에는 verifier, rollback, 실패 메모리를 반드시 추가해야 한다.

커뮤니티 구현의 readiness 구분도 실무적인 기준을 준다. [Cobus Greyling의 공개 저장소](https://github.com/cobusgreyling/loop-engineering)는
L0 draft, L1 report, L2 assisted, L3 unattended를 나누고, L3에는 목표·완료 조건·maker/checker·
상태/메모리·인간 handoff·최소 권한·예산·관측성·안전 점검이 모두 필요하다고 정리한다. 이는
과학적 benchmark는 아니지만 “무인 실행”을 선언하기 전에 어떤 계약이 빠졌는지 확인하는
체크리스트로 유용하다.

### 4.2 목표·완료 조건·maker/checker 게이트

#### 원리

실행자(maker)가 변경을 만들고, 별도 checker 또는 결정론적 테스트가 “완료”를 판정한다. 완료
조건은 자연어가 아니라 실행 가능한 predicate로 표현한다.

예:

```text
done = build_passes
    ∧ visible_tests_pass
    ∧ hidden_tests_pass
    ∧ diff_is_in_scope
    ∧ no_tamper_detected
```

[maxmilian/loop-engineering](https://github.com/maxmilian/loop-engineering)은 기계적으로 판정되는
done, deterministic verifier, success/failure/budget/no-progress/escalation의 모든 종료, 외부
파일 메모리, 인간 게이트를 일곱 원칙으로 정리한다. 자체 평가에는 16개 사례에서 subtle
case가 frontier 모델 기준 87%에서 100%, 약한 모델 기준 74.2%에서 90%로 올라갔다는 주장이
있지만, 한 셀 한 번 실행과 LLM-graded assertion에 의존하므로 독립적인 강한 증거로 보기는
어렵다.

#### 왜 강한가

[Park·Choi의 2026-07-27 파일럿](https://arxiv.org/abs/2607.25152)은 동일한 agent/tool 환경에서
평가 정보 채널만 바꿨다. 54회 사이클에서 에이전트는 매번 개선을 주장했지만 측정된 변화가
0 또는 음수인 경우가 56%였다. 자기보고 게이트는 잘못된 변경을 받아들이며 최선 상태를
19% 악화시켰다. 도구·diff·history를 보는 가장 강한 in-band judge도 실제 회귀의 44%를
받아들이고 실제 개선의 38%를 거절했다.

이 결과는 “더 큰 judge를 붙이면 해결된다”가 아니라 **세계 상태와 독립적인 검증 채널이
필요하다**는 뜻이다.

#### 한계

- 검증기 자체가 테스트 허점을 가질 수 있다.
- 테스트가 의도를 충분히 표현하지 않으면 pass가 곧 품질은 아니다.
- checker 모델을 추가하면 토큰·지연 비용이 증가한다.
- checker가 maker와 동일한 맹점을 가지면 독립성이 약해진다.

#### 판정

모든 자율 루프의 기본 안전장치로 가장 높은 우선순위를 둔다. 실행자 모델이 약할수록 복잡한
추론을 더 시키기보다 완료 판정을 외부로 빼는 것이 비용 대비 효과가 좋다.

### 4.3 Proof-or-Stop: 증거가 없으면 상태를 전진시키지 않기

[Proof-or-Stop](https://arxiv.org/abs/2607.14890)은 루프를 “에이전트 출력 → 주장 → 증거 → 게이트 →
수명주기 전환”으로 다룬다. 증거는 현재 소스 상태에 묶인 hash·receipt·실행 attestation을
가져야 하며, stale·tampered·재구성된 proof는 거부한다.

#### 보고된 결과

- unattended engine 10개 시나리오에서 false-DONE 0/10
- 서명된 local receipt가 18개 tamper class를 모두 거부
- 9,240 cell ablation에서 visible-pass/hidden-fail 증폭이 naive 31/1,800에서 gated 2/1,800으로 감소
- 같은 계산량에 가까운 review-gate 비교도 14/1,800에서 2/1,800으로 감소
- 자기 적용 과정에서 565 stories, 1,007 findings, 94.8% resolved 보고

#### 해석과 한계

현재 상태에 증거를 묶는 방식은 루프의 drift와 stale evidence에 직접 대응한다. 다만 연구는
한 모델 계열·24개 ablation task·자체 corpus에 집중했고, local trust model이 semantic proof나
다중 호스트 신뢰를 보장하는 것은 아니다. 따라서 “증명을 만들면 정확성이 보장된다”가 아니라
“증거 없는 완료를 구조적으로 차단한다”는 기여로 이해해야 한다.

### 4.4 LongHorizon-Harness: 관리–실행–감사(MEA)

[LongHorizon-Harness](https://arxiv.org/html/2608.01964)는 장기 작업을 세 역할로 나눈다.

1. **Manager**: 외부 작업 상태와 하위 작업을 소유한다.
2. **Executor**: 한 번에 제한된 단위만 신선한 컨텍스트에서 처리한다.
3. **Auditor**: 환경을 읽기 전용으로 검사하고, 감사된 사실만 manager 상태에 반영한다.

실행자의 raw trajectory는 그대로 상태가 되지 않는다. terminal state도 execute·done·blocked·
ask로 명시한다. 이 구조는 “실행자가 완료했다고 말함”과 “환경에서 완료가 확인됨”을 분리한다.

#### 보고된 결과

| 벤치마크/모델 | 기본선 | MEA | 변화 |
|---|---:|---:|---:|
| WeaveBench, Qwen3.7-Plus/Claude Code | 51.8 | 80.7 | +28.9 points |
| Terminal-Bench | 69.7 | 77.2 | +7.5 points |
| OSWorld 2.0 | 2.8 | 8.3 | +5.5 points |
| OSWorld 34-task subset, Claude Opus 4.7 | 20.0 | 34.3 | +14.3 points |

비용은 분명히 늘었다. OSWorld의 출력 토큰은 28.9K에서 104K로 증가했고, manager가 차지한
토큰 비중은 WeaveBench 2.8%, OSWorld 2.0%, Terminal-Bench 8.1%였다. 반면 auditor는 각각
19.4%, 24.8%, 38.1%를 차지했다. 즉 이 구조의 추가 비용은 주로 계획보다 **검증**에서 발생한다.

#### 사례가 보여주는 것

- 화면에 성공 표시가 있어도 Airflow 라벨이 틀리면 거부한다.
- RabbitMQ UI와 CLI를 교차 확인한다.
- 수리 전 증거를 보존해 수리 후의 그럴듯한 화면으로 대체하지 않는다.
- CAD·GIMP·스프레드시트처럼 “파일이 있다”와 “내용이 유효하다”가 다른 작업을 다룬다.

#### 판정

작업이 여러 시간 지속되고, 중간 상태가 손실되거나 완료를 속이기 쉬운 환경이면 가장 설득력
있는 최근 구조 중 하나다. 짧은 함수 수정에는 과하다. 검증 비용을 감당할 만큼 실패 비용이
높은지 먼저 계산해야 한다.

### 4.5 SkillOpt: 스킬 파일을 학습 가능한 외부 파라미터로 보기

[Microsoft Research의 SkillOpt 설명](https://www.microsoft.com/en-us/research/blog/skillopt-agent-skills-as-trainable-parameters/)
은 모델 가중치를 고치지 않고 외부 skill 파일을 최적화한다. 별도 optimizer가 rollout →
reflection → bounded add/delete/replace → 엄격한 held-out gate를 수행하고, best version만
남긴다. 실패한 수정은 rejected-edit buffer에 넣고, 빠른 task-level 수정과 느린 meta-level
수정을 분리한다.

#### 보고된 수치

- 6개 benchmark·7개 target model·3개 실행 모드에서 52개 cell 전부 best 또는 tied
- GPT-5.5: direct +23.5 points, Codex +24.8, Claude Code +19.1
- 최종 skill 중앙 길이 약 920 tokens, accepted edit 1~4개
- spreadsheet skill을 Codex에서 Claude Code로 옮긴 cross-harness: 22.1 → 81.8, +59.7 points
- meta/slow update를 제거한 SpreadsheetBench ablation: 77.5 → 55.0

#### 장점

- 추론 시 추가 model call 없이 export된 skill을 사용할 수 있다.
- prompt를 무작정 길게 만드는 대신 작은 외부 절차를 학습한다.
- rejected buffer와 held-out gate가 skill 오염을 줄인다.
- 모델·하네스 간 전이 가능성을 직접 측정했다.

#### 주의

이 수치는 Microsoft의 공식 블로그·프로젝트 보고에 기반한 최근 실증이며, underlying arXiv
paper는 2026-05-22로 조사 경계 밖이다. 이 보고서에서는 6월 30일 공식 설명의 결과만 사용하고,
독립 재현이 끝난 합의로 취급하지 않는다. SkillOpt는 평가 harness를 잘 설계할 수 있는 팀에
강하지만, 평가가 느리고 noisy하면 optimizer가 무엇을 개선해야 하는지 알 수 없다.

### 4.6 누적 행동 규칙: 가장 가벼운 지속 메모리

[Self-Improving AI Coding Agents Through Accumulated Behavioral Rules](https://arxiv.org/html/2607.13091)은
사람의 code review comment를 version-controlled persistent rule로 바꾸고, 다음 세션의
self-review checklist에서 사용한다. 35개 이상 서비스와 11개 세션의 관찰에서 9개 오류 분류,
74회 post-rule exposure에서 재발 0건을 보고했다. 36개 PR review에서 architecture/design/API/
performance 지적이 66%, mechanical/style이 14%였고, 규칙의 60%가 저장소·도구·작업 경계를
넘어 전이됐다. 메모리는 약 4,809 words, 6,250 tokens로 128k context의 5% 미만이라고 보고한다.

#### 이 방법이 실제로 의미하는 것

이 방식은 사람 개입이 완전히 없는 자가 개선이 아니다. 사람이 리뷰를 통해 규칙의 원천이 되고,
AI가 규칙의 저장·검색·self-review 적용을 자동화한다. 따라서 “무인”보다 **저비용의 누적
개선**으로 평가하는 것이 정확하다.

#### 적합한 장면

- 반복되는 프로젝트 규칙
- 같은 API·언어·저장소 convention 실수
- 매번 긴 설명을 넣기 싫은 팀
- 실패를 짧은 규칙으로 안정적으로 일반화할 수 있는 작업

#### 위험

- 잘못된 리뷰가 영구 규칙이 될 수 있다.
- 규칙이 많아지면 충돌·오래된 지침·숨은 편향이 생긴다.
- 규칙이 있다는 사실과 실제 적용·검증을 혼동할 수 있다.

### 4.7 실패 궤적에서 패치 만들기

[Learning from Failure](https://arxiv.org/abs/2606.31270)은 컴퓨터 사용 에이전트의 실패 궤적을
LLM이 진단하고 inference-time solution/code patch로 바꾼다. OpenCUA-72B의 OSWorld가 42.3에서
48.9로 +6.6 points 올랐고, 추가 학습 비용 없이 추론 오버헤드가 소폭 증가했다고 보고한다.

이 구조는 “실패를 기억한다”보다 한 단계 더 나아가 **실패를 다음 행동 정책의 수정으로
변환**한다. 그러나 lightly human verified라는 조건이 남아 있으므로 완전 무인 검증 사례는
아니다. 또한 컴퓨터 사용 환경과 코드 작업에 동일한 수치가 전이된다고 가정할 수 없다.

실무에 적용할 때는 다음 순서가 안전하다.

```text
실패 재현
  → 실패 원인과 표면 증상 분리
  → 최소 수정 후보 생성
  → 원래 실패를 재현하는 테스트 추가
  → 수정 전/후 회귀 + 다른 과제 전이 확인
  → 통과한 경우에만 패치/규칙을 저장
```

### 4.8 MetaSkill-Evolve: 두 시간척도의 루프

[MetaSkill-Evolve](https://arxiv.org/html/2607.05297)는 빠른 task-skill 루프와 느린 meta-skill
루프를 분리한다. meta-skill은 Analyzer·Retriever·Allocator·Proposer·Evolver의 동작을
조절하는 `(ψ, σ, α, π, ε)` 구조로 표현된다. 같은 backbone과 objective를 유지한 채, 무엇을
검색하고 어떤 후보를 만들고 언제 승격할지까지 개선한다.

#### 홀드아웃 결과

| 설정 | OfficeQA | SealQA | ALFWorld |
|---|---:|---:|---:|
| No-Skill | 31.78 | 29.17 | 92.31 |
| Static skill | 36.09 | 29.41 | 90.38 |
| Single-Level | 48.94 | 37.21 | 92.31 |
| MetaSkill-Evolve | 55.32 | 45.26 | 94.23 |

Single-Level 대비 full meta-loop의 증가는 각각 +6.38, +8.05, +1.92 points다. allocator를
끄면 OfficeQA가 55.32에서 35.58로, proposer를 끄면 SealQA가 45.26에서 36.84로 떨어졌다.
Meta update가 없으면 single-level과 같은 결과가 된다.

#### 중요한 세부 결과

Meta horizon `H=2,4,8` 중 `H=2`가 모든 benchmark에서 가장 좋았고, OfficeQA는 H=2의
48.94에서 H=8의 39.84로 떨어졌다. meta rewrite가 너무 드물면 이미 생산적인 변경을 오래된
전략이 덮어쓸 수 있다는 뜻이다.

#### 판정

메타 루프는 “한 번의 반성”보다 강력하지만, 세 개의 curated benchmark에 묶여 있고 실제
오픈엔드 저장소·업무에서 noisy feedback을 다룬 증거는 부족하다. 충분한 평가 예산이 있는
플랫폼 팀이 고려할 수 있지만, 기본 작업 루프의 첫 단계로는 무겁다.

### 4.9 AHA: falsifier와 재사용 가능한 취약점 개념 그래프

[AHA: Agent Hacks Agent](https://arxiv.org/html/2607.11698)는 production-agent red-teaming에서
다음 루프를 사용한다.

```text
가설 → 명시적 반증 조건 → sandbox attack → trajectory reflection
     → 확인된 취약점 개념 그래프(VCG)에 승격
```

VCG 항목은 claim, enabling condition, attack template, failure outcome, transfer prediction,
provenance, confirmation/falsification counter를 가진다. 개념은 다음 조건을 모두 만족해야
승격된다.

```text
n_conf(c) >= 3
AND n_conf(c) / max(1, n_conf(c) + n_fals(c)) >= 0.6
AND confirmed break가 하나 이상 존재
```

held-out frozen evaluation에서 frozen VCG가 strongest frozen baseline보다 +14.2 points였고,
개념이 scenario·channel·model을 넘어 전이됐다고 보고한다. critic은 reward hacking과
over-specialization을 주기적으로 검사하고, sandbox는 compute·memory·time을 제한한다.

이 방법은 보안 도메인에 특화되어 있지만 일반 루프에도 중요한 원칙을 준다. 실패를 메모리에
넣으려면 “성공했다”는 긍정 증거만 모으지 말고 **무엇이 이 가설을 반증하는가**를 함께 저장해야
한다.

### 4.10 EvoPolicyGym: 숨은 평가와 고정 예산 정책 진화

[EvoPolicyGym](https://arxiv.org/abs/2607.02440)은 harness가 policy 후보를 반복적으로 수정하게
하되, public feedback와 private held-out assessment를 분리한다. 후보를 제출한 agent가 private
평가를 보지 못하고, 호스트가 검증·평가를 소유한다.

16개 환경·4개 모델/agent lane·64 rerun·run당 128 episode 결과에서 GPT-5.5 Codex가 환경별
column-best 9/16, Claude Opus 4.7 Claude Code가 5/16, MiniMax와 DeepSeek가 각각 1/16이었다.
이는 aggregate champion이 아니라 환경별 최고 횟수라는 점을 주의해야 한다.

이 방법의 강점은 자가 개선을 “무한 탐색”으로 두지 않고 **interaction budget과 hidden test로
고정**한 것이다. 실제 루프에서 후보를 계속 생성할 때는 각 후보의 비용·평가 횟수·private
holdout 접근 여부를 먼저 제한해야 한다.

### 4.11 AutoMem: 메모리 아키텍처 자체를 탐색하기

[AutoMem](https://arxiv.org/html/2608.14621)은 5 encoder × 5 store × 6 retriever × 4 manager 조합을
탐색한다. 단순히 메모리를 더 저장하지 않고, 실패를 stale·duplicate·conflicting 같은
모듈별 원인으로 분류해 어느 memory module을 바꿀지 결정한다.

#### 보고된 결과

- GAIA·WebWalkerQA·xBench-DeepSearch, 두 backbone에서 6개 설정 평균 정확도 +2.8 points
- Qwen3.5-122B-A10B에서 strongest accuracy baseline 대비 token cost -14.3%
- 5-round search가 best-of-10 random보다 71.5% 대 69.7%
- GAIA token 사용량: full run 142.7M 대 random 259M, 약 0.55배
- xBench token 사용량: 160.1M 대 339M, 약 0.47배
- failure-guided module diagnosis를 빼면 5-round 성능 71.5에서 64.2로 하락

AutoMem은 후보를 Pareto 지배할 때만 승격한다.

```text
Acc_i >= Acc_j
AND Δ_i >= Δ_j
AND Cost_i <= Cost_j
AND 적어도 하나는 엄격히 개선
```

이 조건은 루프의 “더 정확하지만 비용이 폭증하는 변경”과 “싸지만 성능이 무너지는 변경”을
구별하는 데 유용하다. 다만 알려진 모듈 조합을 재배열하는 task-level search이지, 완전히
새로운 기억 구조를 무제한으로 발명하는 증거는 아니다.

### 4.12 SESA: self-play와 skill bank의 공진화

[Self-Play Meets Skill Evolution](https://arxiv.org/html/2607.29468)은 challenger가 문제를 만들고,
solver가 풀며, 실패에서 재사용 skill을 뽑는다. skill bank는 bounded queue·중복 제거·novelty
threshold·eviction을 사용하고, challenger가 만든 미래 문제를 solver memory가 미리 보지 못하게
분리한다.

#### 결과

- 7개 open-domain/multi-hop QA benchmark, 3,125 held-out questions
- SSP 대비 backbone별 평균 향상: Qwen3-4B +2.3, Qwen3-4B-Instruct +2.7, Qwen3-8B +3.2, LLaMA3.1-8B +1.2
- Qwen2.5-7B 통합 비교: SSP 49.5, SkillRL 50.1, SESA 51.0
- Qwen3-4B ablation: full 56.2, no memory priming 54.7, no frontier shaping 54.0, no failure distillation 53.5

메모리 운영 규칙도 실무적으로 참고할 만하다. pending queue 300, 한 번의 consolidate 최대
30, cosine novelty threshold 0.93, 세 번 retrieval 후 helpful/hurt 신호가 나쁜 항목을 퇴출,
전체 bank 800 초과 시 seed가 아닌 최저 항목부터 제거한다.

이 방법은 메모리 오염을 “저장량”이 아니라 **선별·퇴출·실패 증류** 문제로 본다. 다만 학습
루프에 가까워서, 사람이 전혀 없는 배포 루프의 효능으로 바로 해석하면 안 된다.

### 4.13 AgenticSTS: bounded-memory contract의 작은 효과도 통계적으로 확인하기

[AgenticSTS](https://arxiv.org/abs/2607.02255)는 장기 기억을 대화 transcript 전체로 두지 않고,
typed retrieval로 조립한 bounded-memory contract로 제한한다. 298개 completed trajectory를
사용한 Slay the Spire 2 실험에서 no-store는 10회 중 3회, strategic skill을 사용한 설정은
6회 승리했다고 보고한다. 방향은 좋아졌지만 Fisher p≈0.37로 통계적 확정은 아니며, 이 자료의
가치는 큰 상승폭보다 **메모리 길이와 접근 규칙을 실험 변수로 분리했다**는 데 있다.

실무적으로는 “모든 과거 대화 붙이기”를 기본값으로 두지 말고 다음을 명시해야 한다.

- 어떤 타입의 기억을 검색하는가
- 한 결정에 몇 개의 기억만 들어가는가
- 원문 transcript가 아닌 요약·규칙·증거 중 무엇을 넣는가
- 검색되지 않은 기억이 행동에 영향을 주지 않는가
- memory를 끈 baseline과 비교할 수 있는가

### 4.14 Verifier-grounded benchmark coevolution: Lean 사례

[Self-Modifying Lean Proof Agents](https://arxiv.org/html/2607.17352)은 2026-07-19 제출로 중요도
예외 범위에 포함했다. 런타임과 trusted Lean 검증기는 고정하고, workflow·prompt·tool은 바꿀
수 있게 한다. champion이 benchmark 난도를 올리지만, single-anchor recalibration으로 세대 간
점수 비교를 유지한다.

#### 보고된 held-out 결과

- coevolving benchmark: 45.1%
- seed: 12.7%
- fixed benchmark의 best baseline: 32.0%

증명 본문은 trusted Lean snapshot에서 재검증하고, self-report는 무시한다. runtime은
tamper-protected·isolated worker이며 `sorry`/`admit`을 금지한다.

이 사례는 평가 대상과 평가기를 동시에 진화시킬 때 생기는 문제를 잘 보여준다. 고정 benchmark가
너무 빨리 포화되면 에이전트가 실제로 강해졌는지 알 수 없다. 반대로 benchmark를 마음대로
바꾸면 세대별 점수가 비교되지 않는다. 따라서 난도를 올리더라도 **검증기와 점수의 기준축은
고정**해야 한다.

### 4.15 Persistent Recursive Worlds: 장기 자율 소프트웨어 진화

[Persistent Recursive Worlds Enable Autonomous Software Evolution](https://arxiv.org/abs/2608.10450)은
EvoX Genesis에서 프로젝트를 지속 세계로 만들고, 수명이 제한된 local agent들이 이어서 작업하게
한다. accepted change만 persistent version history를 전진시킨다.

#### 보고된 사례

- DeepSeek V4 Flash가 Rust C compiler를 120시간 이상, 1,000개 이상 episode, model token cost 약 $44로 구축
- 약 250k tracked lines, complete c-testsuite와 LLVM/Csmith 대부분 통과
- GLM 5.2로 agent를 교체한 뒤에도 test performance 유지
- MESA 13개 모듈을 Fortran에서 Rust로 재구현: 100k 이상 Fortran에서 약 90k Rust
- 6개 workload의 median speedup 1.55~6.87배

매우 인상적인 장기 사례지만 single system·self-report preprint이며 baseline control과 독립
재현이 부족하다. 이 사례에서 확실히 배울 수 있는 것은 “에이전트가 신기하게 강하다”보다
**영속 세계, version history, test-gated acceptance, agent replacement 뒤 상태 보존**이다.

### 4.16 반복 루프를 평가하는 최근 benchmark

방법론과 benchmark를 혼동하지 않기 위해 별도로 둔다.

- [LoopsBench](https://arxiv.org/abs/2608.00267): 112개 실제 장기 작업, 5,300개 이상 unit에 대한
  dependency DAG, 8개 언어·9개 domain. 준비된 frontier에 맞춰 테스트를 내보내고 완료된
  노드를 regression obligation으로 유지한다. 가장 강한 설정도 해결률이 25%에 그쳐, 장기
  의존성·회귀·계획 누락이 아직 큰 병목임을 보여준다.
- [TestEvo-Bench](https://arxiv.org/abs/2607.02469): 코드와 테스트가 함께 변하는 746 generation +
  509 update task, 59,950 records와 152 Java project에서 구성. Claude Code·Gemini CLI·SWE-Agent가
  조건에 따라 최대 77.5% generation, 74.6% update를 보였지만 최신 task와 비용 제한에서는
  성능이 낮아졌다. 테스트 자체도 drift한다는 점을 평가한다.
- [DeepSWE](https://arxiv.org/abs/2607.07946): 91 repo·5개 언어·113 long-horizon coding task와
  held-out handwritten verifier. 독립 judge disagreement가 1.4%로 SWE-Bench Pro의 32.4%보다
  낮았다고 보고한다. “검증기 설계가 benchmark 결과의 일부”라는 근거다.

---

## 5. 실제 효과와 비교 수치

아래 표는 서로 다른 작업·모델·평가 방법의 수치를 한눈에 보이게 한 것이다. 절대 수치를
직접 합산하거나 “가장 큰 상승폭이 가장 좋은 방법”으로 읽으면 안 된다.

| 방법 | 환경/모델 | 비교 결과 | 증거 등급 | 핵심 한계 |
|---|---|---:|---:|---|
| 외부 검증 연구 | 54 cycles | 자기보고는 매번 개선, 측정 변화 0/음수 56%; accept-all이 최선 상태 19% 악화 | E1 | 작은 preregistered pilot, task 범위 제한 |
| Proof-or-Stop | 9,240-cell ablation | visible-pass/hidden-fail 31/1,800 → 2/1,800 | E1/E2 | 한 모델군·자체 corpus |
| MEA | WeaveBench | 51.8 → 80.7 | E1/E2 | 추가 토큰과 auditor 비용 큼 |
| MEA | OSWorld, Qwen | 2.8 → 8.3 | E1/E2 | UI benchmark, 일반 코드 작업 전이 불명 |
| SkillOpt | GPT-5.5/Codex/Claude Code | +23.5 / +24.8 / +19.1 points | E2 | 공식 vendor 보고, independent replication 없음 |
| 행동 규칙 | 74 post-rule exposures | 재발 0건 | E2 | 사람 review가 규칙 원천, A/B 없음 |
| Failure-driven patch | OSWorld, OpenCUA-72B | 42.3 → 48.9, +6.6 points | E2 | lightly human verified |
| MetaSkill-Evolve | OfficeQA | Single-Level 48.94 → 55.32 | E2 | 3개 curated benchmark |
| AHA | frozen VCG | strongest frozen baseline 대비 +14.2 points | E1/E2 | 보안 red-team 특화 |
| EvoPolicyGym | 16 environment | GPT-5.5 column-best 9/16 | E1/E2 | 환경별 최고 횟수이지 aggregate 점수 아님 |
| AutoMem | 6 설정 평균 | accuracy +2.8, token cost -14.3% | E2 | 알려진 memory module 조합 탐색 |
| SESA | 7 QA benchmark | SSP 대비 backbone별 +1.2~3.2 points | E2 | 학습·self-play loop, 배포 자율성 아님 |
| Lean coevolution | held-out miniF2F | 12.7 seed, 32.0 fixed best, 45.1 coevolving | E2 | formal proof 도메인, preprint |
| Genesis | Rust compiler | 120h+, 1,000+ episode, 약 $44 token cost | E2 | baseline·독립 재현 부족 |
| LoopsBench | 112 long-horizon task | strongest config도 25% 해결 | E1 | benchmark 난도가 매우 높고 공개 초기 연구 |

### 5.1 무엇을 이 수치에서 믿을 수 있는가

가장 신뢰할 수 있는 일반 결론은 특정 방법의 “+몇 점”이 아니라 다음 네 가지다.

1. **자기보고는 부족하다.** Park·Choi 연구가 직접 측정했다.
2. **외부 상태와 독립 감사는 장기 작업을 개선할 수 있다.** MEA와 Proof-or-Stop이 서로 다른
   환경에서 같은 방향의 결과를 보였다.
3. **스킬·메모리의 작은 외부 변경도 가중치 업데이트 없이 효과를 낼 수 있다.** SkillOpt·행동
   규칙·SESA가 보여주지만, 평가 harness 품질에 매우 민감하다.
4. **긴 지평 자체가 아직 해결되지 않았다.** LoopsBench의 25%는 “루프를 붙이면 모두
   자동화된다”는 해석을 반박한다.

### 5.2 수치를 비교할 때 반드시 확인할 것

- baseline이 같은 모델·같은 도구·같은 prompt인지
- visible test와 hidden test가 분리되어 있는지
- 평가 중 retry·test-time search가 허용됐는지
- 한 셀을 한 번만 실행했는지, 여러 seed인지
- judge가 실제 artifact를 보았는지, agent transcript만 보았는지
- 성공률과 함께 비용·지연·토큰을 보고했는지
- benchmark에 맞춘 skill이 다른 저장소·모델·작업으로 전이되는지
- 실패한 candidate가 best state를 덮어쓰지 않았는지

---

## 6. 드리프트: 무엇이 변하고 어떻게 막을 것인가

### 6.1 드리프트의 종류

| 드리프트 | 발생 장면 | 증상 |
|---|---|---|
| 모델 드리프트 | provider/model version, inference behavior 변경 | 같은 prompt와 skill이 다른 행동을 함 |
| 도구·환경 드리프트 | API, dependency, OS, UI, shell 변경 | 예전 command·검증기가 조용히 틀림 |
| 요구사항 드리프트 | 목표·비목표·품질 기준이 바뀜 | 과거 완료를 현재 완료로 착각 |
| 테스트 드리프트 | 테스트가 오래되거나 너무 쉬움 | pass하지만 의도 위반, 또는 불필요한 실패 |
| 평가기 드리프트 | judge가 benchmark shortcut을 학습 | proxy 점수 상승, 실제 품질 정체 |
| 메모리 드리프트 | stale·중복·충돌 규칙 축적 | 과거 예외가 현재 규칙을 덮음 |
| 작업분포 드리프트 | 새 저장소·새 도메인·새 난도 | 과거 skill이 전이되지 않음 |
| 자원 드리프트 | 토큰 가격·quota·지연·예산 변경 | 같은 루프의 비용/지연이 폭증 |
| 상태 드리프트 | 외부 파일·Git·서비스 상태가 바뀜 | stale 증거로 잘못된 완료 승인 |

### 6.2 대응 원칙

| 방어 | 구현 방법 | 잡는 드리프트 |
|---|---|---|
| 현재 상태 결합 | code/environment hash, commit id, input manifest를 receipt에 기록 | stale 상태·재구성된 proof |
| fresh evidence | 후보마다 테스트·검증을 다시 실행하고 이전 결과 재사용 금지 | 코드·도구·환경 변화 |
| 회귀군 | 고정된 핵심 테스트를 매 승격에 실행 | 기능·품질 후퇴 |
| 홀드아웃 | optimizer가 보지 못한 task/benchmark를 최종 게이트로 보관 | benchmark overfit |
| 독립 검증 | 다른 모델·결정론적 도구·읽기 전용 auditor 사용 | 자기평가 편향 |
| best-so-far | 최선 artifact와 점수를 별도 보존, 새 후보가 나빠도 덮지 않음 | 탐색 중 회귀 |
| rejection ledger | 실패 원인·조건·증거·재현 명령·적용 범위를 기록 | 같은 실수의 반복 |
| memory eviction | TTL, 중복 제거, conflict detection, retrieval 후 hurt 판정 | 메모리 오염 |
| 난도 재조정 | evaluator가 너무 쉬워지면 hidden task·frontier·curriculum 갱신 | 평가 포화 |
| circuit breaker | 반복 횟수·시간·비용·무진전 한도에서 정지 | 무한 루프·비용 폭증 |
| 인간 게이트 | irreversible action, 보안·금전·외부 배포에서 승인 | 고위험 오작동 |

### 6.3 가장 중요한 드리프트 방어: evaluator도 진화시켜라

[The Verification Horizon](https://arxiv.org/html/2606.26300)은 verifier가 확장성·충실성·강건성을
동시에 가져야 하며, 정책이 강해질수록 고정 reward 하나는 더 이상 충분하지 않다고 주장한다.
unit test·quality judge·trajectory monitor를 결합한 세 SWE 변형에서 hacked-resolved 비율이
평균 28.57%에서 0.56%로 줄고 clean resolved가 40.22%에서 60.53%로 늘었다고 보고한다.

각 검증 방식의 성격은 다르다.

- unit test: 싸고 확장 가능하지만 의도 범위가 얇다.
- LLM judge: 의미·품질을 볼 수 있지만 prompt와 평가 허점을 공략당할 수 있다.
- trajectory monitor: 과정의 이상을 찾지만 결과 정확성을 직접 증명하지 않는다.
- human: 의미·보안·유지보수에는 강하지만 비용과 속도가 낮다.

따라서 하나의 judge를 더 크게 만드는 것보다, 서로 다른 실패 모드를 가진 검증기를 겹치는
것이 더 안정적이다.

### 6.4 메모리 드리프트 방어 규칙

메모리에는 다음 필드를 권장한다.

```text
memory_id
source_task / repository / model / tool_version
failure_or_success_claim
reproduction_command
evidence_reference
scope_of_applicability
created_at / last_verified_at / expiry
conflict_set / retrieval_count / helpful_count / harmful_count
status = candidate | accepted | stale | rejected
```

저장 자체를 승격으로 취급하지 않는다. 최소한 다음 단계를 분리한다.

1. 한 번의 실패는 `candidate`로 기록한다.
2. 재현 명령과 현재 상태를 저장한다.
3. 같은 조건에서 재현하거나 다른 task로 전이되는지 확인한다.
4. 회귀군을 통과하면 `accepted`로 승격한다.
5. 적용 후 harmful signal이 반복되면 `stale` 또는 `rejected`로 퇴출한다.

SESA의 bounded bank, AutoMem의 stale/duplicate/conflicting 분류, SkillOpt의 rejected-edit
buffer를 함께 적용하면 “기억을 많이 쌓는 루프”가 아니라 “검증된 기억만 남기는 루프”가 된다.

---

## 7. 무게·비용·성능의 균형

### 7.1 토큰 비용의 기본식

[The Harness Effect](https://arxiv.org/html/2607.06906)은 한 작업의 입력·출력 토큰 가격을 포함한
비용을 다음처럼 정리한다.

```text
C = Σ_i (p_in · T_in_i + p_out · T_out_i)
T_in_i = S_i + H_i + G_i + R_i + U_i
```

- `S_i`: 시스템·기본 지시
- `H_i`: 이전 history
- `G_i`: 현재 목표·요구사항
- `R_i`: repository/tool context
- `U_i`: 사용자·도구 결과

전체 history를 매번 다시 보내면 반복 수 `k`에 대해 입력 비용이 대략 `O(k²)`로 커질 수 있다.
요약·cache·외부 상태·context offload를 사용하면 이상적으로 `O(k)`에 가까워진다. 단, 요약이
상태의 권위가 되면 중요한 증거가 사라질 수 있으므로, 요약은 탐색용이고 receipt·artifact·
현재 테스트 결과가 판정용이어야 한다.

### 7.2 실제 비용 결과

#### Harness Effect

22개 고정 task, 6개 모델, 같은 prompt·judge·가격에서 orchestration만 바꾼 paired swap 결과다.

- 비용/task: $0.21 → $0.12, -41%
- median wall-clock: 48 → 27초, -44%
- tokens: 14.2k → 8.8k, -38%
- quality: 0.78 → 0.81, 실질 parity 또는 방향성 개선
- quality/$: +82%
- completion/Mtok: 54.9 → 92.0, +68%

다만 Writer 소속 저자들이 낸 vendor-sponsored preprint이고, task는 enterprise assistant에
가깝고 long-horizon coding 전체를 대표하지 않는다. 좋은 결론은 “오케스트레이션 설계가
토큰 경제를 바꾼다”이지 “항상 41% 싸다”가 아니다.

#### Harness Tax

[The Harness Tax](https://igniting.github.io/harness-tax/)는 raw API·single-shot harness·agentic
실행을 비교한다.

- Opus 4-8 raw 72% → harness 100%
- single-shot harness는 +28 points
- harness context는 raw보다 40~125배, 실행 비용은 5~8배가 될 수 있음
- Sonnet의 한 odd run은 1.02M context tokens/$2.94 대 raw $0.05
- 5개 invented spec/oracle과 소수의 agentic run이라 일반화에는 한계

검증을 붙이는 것은 품질을 올릴 수 있지만, **검증기를 무조건 많이 호출하는 것이 능사는
아니다**. 짧은 작업에서는 같은 테스트를 한 번 더 부르는 비용이 개선보다 크다.

#### HarnessBench

[HarnessBench](https://github.com/tdrml/harness-bench)의 공개 pilot은 production dev-class run
368건 중 106건(28.8%)이 deterministic guardrail block에 닿았다고 보고한다. 짧은 54/54 task에서는
모든 arm/model이 성공해 harness ROI가 0이었지만, 시간 단위 dependent issue pilot에서는
Haiku+harness가 bare Haiku보다 나아지고 Sonnet과 비슷한 결과를 약 1/3 비용으로 낸 사례가
있었다. 표본이 작고 private repository에 의존하므로 방향성 근거로 사용한다.

### 7.3 세 가지 무게 프로필

| 프로필 | 구성 | 비용 | 적합한 장면 | 위험 |
|---|---|---:|---|---|
| Lite | fresh context, 외부 상태, 결정론적 테스트, max iteration, no-progress stop | 낮음 | 명확한 코드·문서·변환, 낮은 위험 | 의미적 오류를 놓칠 수 있음 |
| Standard | Lite + manager state + 별도 checker/auditor + receipt + best checkpoint | 중간 | 장기 작업, 여러 파일, UI·서비스 상태 | auditor 토큰·지연 증가 |
| Heavy | Standard + held-out search + multi-seed + skill/meta optimizer + adversarial critic | 높음 | 반복 업무 플랫폼, 보안 red-team, 정책/스킬 재사용 | setup·평가·메모리 비용, overfit |

### 7.4 무게를 선택하는 실무 규칙

다음 조건이 많을수록 한 단계 무거운 구조를 선택한다.

- 작업이 여러 컨텍스트를 넘어간다.
- 중간 상태가 사라지면 복구 비용이 크다.
- artifact 존재와 artifact 유효성이 다르다.
- 실패가 금전·보안·데이터 손실로 이어진다.
- 같은 유형의 작업이 반복되어 메모리·스킬 투자가 회수된다.
- 평가가 빠르고 결정론적이라 자동 선별이 가능하다.

반대로 다음이면 Lite가 낫다.

- 정답을 빠른 테스트로 명확히 판정할 수 있다.
- 작업이 짧고 재실행 비용이 낮다.
- 외부 부작용이 없다.
- 장기 메모리로 얻을 전이가 작다.
- evaluator가 noisy해서 optimizer가 신뢰할 수 없다.

---

## 8. 권장 기본 루프 설계

아래는 여러 연구의 공통 요소를 실무에서 바로 적용할 수 있게 합성한 설계다. 특정 논문의
공식 구현을 그대로 복사한 것이 아니라, 이 조사에서 가장 안정적인 기본선으로 도출한 것이다.

### 8.1 상태와 산출물

```text
goal.md              목표·비목표·완료 조건·금지사항
state.json           현재 단계·예산·마지막 상태·다음 행동
best/                현재 최선 artifact 또는 commit
candidates/          후보별 변경·점수·판정
evidence/            테스트 결과·receipt·환경 hash·실행 시각
failures/            재현 명령이 있는 실패 기록
memory/              검증된 규칙·스킬·전이 조건·퇴출 정보
run.log              반복·비용·모델·도구·종료 이유
```

파일명은 구현에 맞게 바꿀 수 있지만, **현재 실행 컨텍스트와 지속 상태를 한 문서에 모두
넣지 않는 것**이 중요하다. 대화는 작업 공간이고, 파일·Git·receipt가 수명주기 상태다.

### 8.2 한 iteration의 권장 순서

1. **Scope gate**: 목표·금지사항·변경 범위·외부 부작용을 확인한다.
2. **State read**: 현재 best, 마지막 실패, 남은 예산, stale 여부를 읽는다.
3. **One bounded action**: 한 번에 하나의 변경·하위 task만 처리한다.
4. **Fresh verification**: 현재 artifact와 환경에 대해 테스트·검증을 다시 실행한다.
5. **Independent judgment**: deterministic gate 또는 별도 checker가 결과를 판정한다.
6. **Compare**: best와 후보의 품질·회귀·비용·범위를 비교한다.
7. **Promote or reject**: 개선이면 best를 갱신하고, 아니면 best를 보존한다.
8. **Memory update**: 재현 가능한 실패·일반화 가능한 규칙만 candidate로 기록한다.
9. **Drift probe**: 고정 회귀군·홀드아웃·전이 샘플을 주기적으로 실행한다.
10. **Terminal gate**: success, failure, blocked, no-progress, budget-exhausted, ask 중 하나로
    끝낸다.

### 8.3 종료 상태를 반드시 이름 붙이기

| 상태 | 의미 | 다음 행동 |
|---|---|---|
| success | 현재 완료 조건과 회귀군을 통과 | best 보존, 결과 보고 |
| failure | 예산 안에 조건을 만족하지 못함 | 실패 원인·증거 보존, 사람 또는 새 계획 |
| blocked | 외부 권한·자료·환경이 필요 | 자동 추측하지 않고 질문 |
| no-progress | 일정 횟수/시간 동안 score·state가 개선되지 않음 | 루프 중지, 전략 변경 또는 escalation |
| budget-exhausted | 토큰·시간·호출·비용 상한 도달 | 현재 best와 미완료 상태를 함께 보존 |
| regression-detected | 새 후보가 기존 best보다 나쁨 | candidate 폐기, 원인 기록 |
| ask | irreversible action 또는 모호한 목표 | 인간 승인 후 재개 |

`done` 하나만 두면 실패·정체·질문이 모두 같은 상태로 뭉개진다. named terminal state는
무인 실행이 언제 정상적으로 멈췄는지 판정하는 데 중요하다.

### 8.4 완료 판정 체크리스트

```text
[ ] 목표와 비목표가 현재 입력에 맞는가
[ ] 후보 변경이 허용 범위를 벗어나지 않았는가
[ ] 증거가 현재 artifact/commit/environment에 묶여 있는가
[ ] 검증은 후보마다 새로 실행되었는가
[ ] visible test뿐 아니라 가능한 경우 hidden/holdout/regression도 통과했는가
[ ] best 상태가 별도로 보존되어 있는가
[ ] 비용·시간·반복·무진전 한도를 넘지 않았는가
[ ] 실패를 성공으로 이름만 바꾼 proxy가 없는가
[ ] irreversible action은 사람 게이트를 통과했는가
[ ] 다음 실행이 읽을 memory의 적용 조건과 만료가 적혀 있는가
```

### 8.5 실패를 개선으로 바꾸는 최소 계약

실패 기록은 다음 네 가지 없이는 스킬이나 규칙으로 승격하지 않는다.

1. **재현**: 동일 조건에서 실패가 다시 나오는 명령 또는 입력
2. **원인**: 표면 오류와 실제 원인의 구분
3. **수정**: 무엇을 바꾸었는지와 바꾸지 않은 것
4. **전이**: 다른 task·파일·모델에서 유효한지 확인한 결과

한 번의 실패는 candidate다. 두 번의 동일 실패는 우선순위가 높은 candidate다. 그러나 두 번
나왔다고 자동으로 정본에 쓰지 않는다. 수정이 회귀군과 전이를 통과할 때만 accepted로 만든다.

### 8.6 모델 역할 배치

무거운 모델을 모든 단계에 쓰기보다 역할을 분리한다.

- **executor**: 빠르고 저렴한 모델. 범위가 제한된 변경 수행
- **deterministic verifier**: 테스트·컴파일·schema·hash·환경 검사
- **checker/auditor**: artifact의 의미와 외부 상태를 독립적으로 확인
- **optimizer**: 여러 실패·성공을 보고 skill/memory 후보를 제안
- **human gate**: 보안·금전·삭제·배포·모호한 목표

검증기에는 실행자의 대화 전체를 주지 않고, 필요한 artifact·diff·receipt·검증 결과만 주는
것이 비용과 독립성 모두에 유리하다.

---

## 9. 평가 프로토콜: 실제로 효과가 있었는가를 판정하는 방법

### 9.1 최소 비교 설계

루프를 도입하기 전 다음을 고정한다.

1. baseline: 같은 모델·도구·task에서 loop 없는 실행
2. loop arm: loop를 붙인 실행
3. task split: 개발에 사용한 task와 최종 평가 task를 분리
4. budget: 모델 호출·토큰·시간·retry를 양쪽에 기록
5. human policy: 개입 가능 횟수와 개입 시점을 사전에 고정
6. scoring: 성공률뿐 아니라 회귀·품질·비용·지연·개입을 함께 측정
7. seed: 가능하면 3개 이상, 최소한 변동성이 큰 task는 반복 실행

한 번의 성공률 상승은 개선의 증거가 아니라 관측값이다. PyMC Labs의 [Self-Improving AI
Agents 실험](https://www.pymc-labs.com/blog-posts/self-improving-ai-agents)은 이 점을 잘 보여준다.
63개 synthetic task에서 hard gate 기준 14/18이 18/18로 바뀌었지만, 여섯 seed 실험에서는
baseline이 6/10~10/10으로 흔들렸고 평가 noise가 ±0.06이었다. 두 genuine win은 +0.157,
+0.169였지만 한 regression은 -0.286, 세 번은 no-op이었다. 한 번만 보면 +40 points처럼
보일 수 있다는 결론이다.

### 9.2 권장 지표

```text
absolute_gain = score(loop) - score(baseline)
cost_adjusted_gain = absolute_gain / (cost(loop) - cost(baseline))
autonomous_completion = no_human_intervention_success / all_tasks
false_done_rate = accepted_but_failed / accepted_done
regression_rate = promoted_candidate_worse_than_best / promoted_candidates
memory_transfer = heldout_tasks_improved_by_prior_memory / heldout_tasks
drift_loss = score_at_end_of_window - score_at_start_of_window
```

여기에 다음 운영 지표를 추가한다.

- task당 입력·출력 token
- wall-clock 및 모델 호출 수
- auditor/checker가 차지한 비용 비율
- no-progress로 정지한 비율
- human escalation 비율
- rollback 횟수
- stale memory가 발견·퇴출된 횟수
- hidden test와 visible test의 차이

### 9.3 판정 게이트

루프를 기본 운영에 넣을 최소 기준은 다음과 같이 권장한다.

| 게이트 | 통과 기준 예 |
|---|---|
| 효과 | baseline 대비 핵심 목표가 개선되거나 같은 품질에서 비용·지연이 감소 |
| 안전 | false-DONE과 best 회귀가 허용 한도 아래 |
| 전이 | 개발 task와 분리된 holdout 또는 새 저장소에서 개선 유지 |
| 비용 | 추가 검증 비용이 실패 회피·품질 향상으로 설명됨 |
| 안정성 | 여러 seed·반복에서 방향이 유지되고 no-op/regression이 관리됨 |
| 운영 | 예산 초과·무진전·외부 권한에서 멈출 수 있음 |

하나라도 “측정하지 않음”이면 pass가 아니라 `unverified`로 기록한다.

### 9.4 benchmark gaming 방지

- optimizer가 보지 못하는 held-out task를 보관한다.
- visible test와 hidden test를 다르게 한다.
- task 생성기와 평가기를 같은 agent에게 주지 않는다.
- artifact·diff·환경 상태를 직접 검사한다.
- score만 오르고 유지보수성·보안·비용이 나빠지는지 별도 측정한다.
- benchmark가 너무 쉬워지면 난도를 올리되, 과거 점수와 비교할 anchor를 보존한다.
- prompt·skill·memory를 바꾼 후보는 이전 버전과 rollback 가능해야 한다.

---

## 10. 방법론 선택표

| 방법 | 자가 개선 대상 | 자율성 | 검증 강도 | 비용/무게 | 드리프트 대응 | 권장 용도 |
|---|---|---:|---:|---:|---:|---|
| Ralph/fresh context | 없음 또는 외부 상태 | 중간 | 낮음~중간 | 매우 낮음 | 파일 상태만 | 짧고 명확한 반복 작업의 기반 |
| deterministic gate | 후보 artifact | 높음 | 높음(검사 범위 내) | 낮음 | 회귀·receipt | 모든 코드/문서 루프의 기본 |
| maker/checker | artifact·완료 판단 | 높음 | 중간~높음 | 중간 | 독립 판정 | 의미적 품질과 장기 작업 |
| Proof-or-Stop | lifecycle state·evidence | 높음 | 높음 | 중간 | stale/tamper 차단 | 중요한 unattended operation |
| MEA | 외부 상태·작업 DAG | 높음 | 높음 | 중간~높음 | auditor·fresh state | 여러 시간·도구·환경 작업 |
| 행동 규칙 | 규칙·checklist | 중간 | 인간+실행 | 매우 낮음 | versioning 필요 | 반복되는 팀/저장소 실수 |
| failure-driven patch | policy/solution patch | 중간 | 중간 | 중간 | 실패 재현 필요 | 컴퓨터 사용·복구 패턴 |
| SkillOpt | skill file | 높음(offline) | 높음(held-out) | 초기 높음, 추론 낮음 | rejected buffer·best | 반복 업무 플랫폼 |
| MetaSkill-Evolve | skill 생성·선별 정책 | 높음 | 중간~높음 | 높음 | meta horizon 관리 | 대규모 skill 최적화 |
| AHA | 취약점 개념 그래프 | 높음 | 높음 | 높음 | falsifier·frozen eval | 보안 red-team |
| EvoPolicyGym | 실행 policy | 높음 | 높음 | 중간~높음 | private eval·budget | 정책·행동 최적화 |
| AutoMem | memory architecture | 높음 | 중간~높음 | 높음 | failure diagnosis·Pareto | 메모리 비용/품질 최적화 |
| SESA | skill bank·문제 분포 | 높음(학습) | 중간 | 높음 | bounded bank·eviction | self-play 연구·검색 |
| Lean coevolution | workflow·benchmark | 높음 | 매우 높음(도메인 내) | 높음 | trusted verifier·anchor | 형식 검증·평가 진화 |
| Genesis | 지속 프로젝트 세계 | 높음 | 실행 테스트 | 높음 | version history | 장기 소프트웨어 진화 연구 |

### 추천 순서

1. **Lite**: Ralph가 아니라 “외부 상태 + deterministic gate + stop rule”부터 만든다.
2. **Standard**: false-DONE 또는 장기 상태 손실이 관측되면 manager/auditor를 추가한다.
3. **Memory**: 같은 실패가 반복될 때만 규칙·skill·memory 승격을 추가한다.
4. **Held-out**: skill/memory 변경이 여러 작업에 전이되는지 별도 평가한다.
5. **Heavy**: 반복 작업의 규모와 평가 속도가 충분할 때 optimizer·meta-loop를 추가한다.

---

## 11. 가장 실용적인 구현 원칙 12가지

1. **완료는 claim이 아니라 evidence다.**
2. **검증기는 실행자와 다른 실패 모드를 가져야 한다.**
3. **현재 best와 새 candidate를 별도 저장한다.**
4. **검증 결과는 현재 코드·환경·입력에 묶는다.**
5. **한 iteration의 범위를 작게 한다.**
6. **컨텍스트가 아니라 파일·Git·receipt가 영속 상태다.**
7. **실패를 바로 규칙으로 만들지 말고 candidate로 둔다.**
8. **메모리는 저장보다 퇴출 정책이 중요하다.**
9. **visible test만으로 승격하지 않는다.**
10. **무진전과 예산 초과를 정상 종료로 취급한다.**
11. **비가역 작업은 인간 게이트 밖으로 내보내지 않는다.**
12. **루프의 성능보다 루프가 틀렸을 때 최악의 상태를 먼저 제한한다.**

---

## 12. 출처 카탈로그

### 12.1 엄격한 최신 범위: 2026-07-21 ~ 2026-08-21

| 출처 | 일자 | 등급 | 이 보고서에서 사용한 내용 | 주의 |
|---|---|---|---|---|
| [Self-Evolving Coding Agents](https://arxiv.org/html/2608.03392) | 2026-08-04 | E3 | 골조·메모리·스킬/도구·모델·워크플로 taxonomy, task-time/post-task/stage-wise, evidence 분류 | survey preprint, 분야가 아직 유동적이라고 스스로 밝힘 |
| [Persistent Recursive Worlds](https://arxiv.org/abs/2608.10450) | 2026-08-11 | E2 | 120시간 이상·1,000+ episode·Rust compiler·agent replacement 사례 | single system, self-report, baseline 부족 |
| [LongHorizon-Harness](https://arxiv.org/html/2608.01964) | 2026-08-03 | E1/E2 | MEA 구조, WeaveBench·Terminal-Bench·OSWorld 수치, auditor 비용 | preprint, 일반 업무 전이 제한 |
| [LoopsBench](https://arxiv.org/abs/2608.00267) | 2026-07-31 | E1 | 112 long-horizon task, DAG, 25% ceiling, regression obligation | 공개 초기 benchmark |
| [SESA](https://arxiv.org/html/2607.29468) | 2026-07-31 | E2 | challenger/solver, bounded skill bank, failure distillation, +1.2~3.2 | 학습 루프, 배포 무인성의 직접 증거 아님 |
| [Self-Evaluation Bias](https://arxiv.org/abs/2607.25152) | 2026-07-27 | E1 | 54 cycles, 56% stagnation/regression, 19% best erosion, judge 오류 | preregistered pilot, 작은 표본 |
| [Ralph Loop 설명](https://futureagi.com/blog/loop-engineering/ralph-loop/) | 2026-07-28/08-06 갱신 | E4 | fresh context, 외부 파일 상태, 한계와 비용 | 실무 설명, 효능 benchmark 아님 |
| [HarnessBench](https://github.com/tdrml/harness-bench) | 2026-07 | E2 | 106/368 guardrail block, 짧은 task ROI 0, 긴 pilot 비용 사례 | single author/private repo, 작은 n |
| [The Harness Tax](https://igniting.github.io/harness-tax/) | 2026-07 | E2 | harness의 품질 향상과 40~125배 context·5~8배 비용 | 5개 task·소수 run, 구현 버전 의존 |

### 12.2 중요도 예외 범위: 2026-06-21 ~ 2026-07-20

| 출처 | 일자 | 등급 | 이 보고서에서 사용한 내용 | 주의 |
|---|---|---|---|---|
| [Proof-or-Stop](https://arxiv.org/abs/2607.14890) | 2026-07-16 | E1/E2 | evidence gate, admissibility conjunction, false-DONE·tamper ablation | 한 모델군·자체 corpus |
| [Self-Modifying Lean Proof Agents](https://arxiv.org/abs/2607.17352) | 2026-07-19 | E2 | trusted verifier, benchmark coevolution, 45.1 vs 32.0/12.7 | formal proof 특화 |
| [AutoMem](https://arxiv.org/html/2608.14621) | 2026-07-14 | E2 | memory architecture search, failure diagnosis, Pareto, token 절감 | 알려진 module recombination |
| [Self-Improving Coding Agents](https://arxiv.org/html/2607.13091) | 2026-07-13 | E2 | persistent behavioral rules, 74 exposures 재발 0, 6,250 token memory | human review가 원천, A/B 없음 |
| [AHA](https://arxiv.org/html/2607.11698) | 2026-07-13 | E1/E2 | falsifier, VCG, confirmation threshold, +14.2 held-out | 보안 red-team 특화 |
| [Self-Improvements in Modern Agentic Systems survey](https://arxiv.org/abs/2607.13104) | 2026-07-14 | E3 | foundation model + scaffold, 312 curated entries라는 분야 지도 | taxonomy, efficacy evidence 아님 |
| [The Harness Effect](https://arxiv.org/html/2607.06906) | 2026-07-08 | E1/E2 | -41% cost, -44% time, -38% token, quality/$ +82%, cost formula | Writer 소속 vendor-sponsored, 22 task |
| [DeepSWE](https://arxiv.org/abs/2607.07946) | 2026-07-08 | E1/E2 | held-out handwritten verifier, 1.4% vs 32.4% judge disagreement | benchmark/verifier 설계 근거, loop 자체 아님 |
| [MetaSkill-Evolve](https://arxiv.org/html/2607.05297) | 2026-07-06 | E2 | 두 시간척도, OfficeQA/SealQA/ALFWorld, horizon ablation | 3 benchmark, 현실 전이 미검증 |
| [EvoPolicyGym](https://arxiv.org/abs/2607.02440) | 2026-07-02 | E1/E2 | fixed budget, private held-out assessment, model 비교 | 환경별 column-best 해석 필요 |
| [TestEvo-Bench](https://arxiv.org/abs/2607.02469) | 2026-07-02 | E1/E2 | test/code co-evolution, 746+509 task, 최신 task·cost cap 저하 | benchmark 연구 |
| [AgenticSTS](https://arxiv.org/abs/2607.02255) | 2026-07-02 | E2 | bounded-memory contract, 3/10→6/10 directional 결과 | p≈.37, 통계적 확정 아님 |
| [SkillOpt 공식 설명](https://www.microsoft.com/en-us/research/blog/skillopt-agent-skills-as-trainable-parameters/) | 2026-06-30 | E2 | skill 외부 파라미터, +23.5/+24.8/+19.1, cross-harness +59.7 | 공식 vendor report; underlying paper는 경계 밖 |
| [Learning from Failure](https://arxiv.org/abs/2606.31270) | 2026-06-30 | E2 | 실패 궤적→patch, OSWorld 42.3→48.9 | computer-use, lightly human verified |
| [Verification Horizon](https://arxiv.org/html/2606.26300) | 2026-06-29 | E2 | verifier co-evolution, hacked-resolved 28.57→0.56% | Qwen team preprint |
| [Loop Engineering](https://arxiv.org/abs/2607.00038) | 2026-06-28 | E3 | loop specification, trigger/goal/verify/stop/memory, 50 loops 관찰 | 신생 개념 제안, peer review 미확정 |
| [IBM loop engineering](https://www.ibm.com/think/topics/loop-engineering) | 2026-07-17 | E4 | 산업적 정의와 scheduling/hooks/context/tools/memory 구성 | 효능 연구 아님 |
| [PyMC Labs 적용 사례](https://www.pymc-labs.com/blog-posts/self-improving-ai-agents) | 2026-07-03 | E2 | held-out gate, multi-seed, noise·regression·benchmark engineering | practitioner self-report |

### 12.3 실무 구현·보조 자료

| 출처 | 성격 | 사용한 내용 |
|---|---|---|
| [maxmilian/loop-engineering](https://github.com/maxmilian/loop-engineering) | 공개 실무 프레임워크 | machine-checkable done, verifier, terminal state, budget, filesystem memory |
| [Open-Spek loop/jsonq](https://github.com/open-spek/jsonq) | 공개 test-gated 사례 | 21 iterations, 252 tests, 100% coverage, 0 human-edited lines라는 자체 사례; 독립 검증 아님 |
| [SantanderAI/ralph](https://github.com/SantanderAI/ralph) | dependency-free 구현 | Bash/PowerShell, fresh agent, external files/Git, max iterations, hard memory limit |
| [Loop Engineering community repository](https://github.com/cobusgreyling/loop-engineering) | 커뮤니티 운영 체크리스트 | maker/checker, durable memory, drift sync, circuit breaker, readiness level; efficacy 근거 아님 |

### 12.4 기간 밖이라 핵심 결론에 사용하지 않은 자료

요청한 최신성 경계를 지키기 위해, 2026-06-21보다 오래된 [Addy Osmani의 2026-06-07 글](https://addyosmani.com/blog/loop-engineering/),
[Cobus Greyling의 2026-06-09 글](https://cobusgreyling.substack.com/p/loop-engineering), 5월 arXiv 논문들은
용어 발견과 배경 파악에만 참고하고 이 보고서의 핵심 수치·판정 근거에서는 제외했다. 오래된
자료가 더 유명하다는 이유로 현재 요청의 날짜 제한을 완화하지 않았다.

---

## 13. 제한 사항과 해석상의 주의

1. 자료 대부분이 2026년 최신 프리프린트·공식 blog·공개 repository라서 독립 replication이
   아직 적다.
2. benchmark별 task·model·prompt·judge가 달라 숫자를 직접 ranking할 수 없다.
3. vendor가 보고한 성능은 구현 세부와 평가 설정을 모두 공개하지 않을 수 있다.
4. “자가 개선”이라고 부르는 방법 중 상당수는 학습·오프라인 최적화이거나 인간 리뷰를
   포함한다. 완전 무인 배포와 같은 말이 아니다.
5. 외부 verifier도 완전한 의미 증명은 아니다. 테스트가 실제 요구사항을 대표하는지 별도
   점검해야 한다.
6. 루프가 실패를 줄여도 모델 자체의 능력·도구 품질·작업 정의가 병목이면 효과가 작다.
7. 메모리와 skill은 길게 만드는 것보다 올바른 승격·퇴출·전이 검증이 중요하다.
8. 장기 작업의 성능이 낮다는 결과는 루프가 무의미하다는 뜻이 아니라, 의존성 계획·상태
   보존·검증·회귀가 모두 함께 해결되어야 한다는 뜻이다.

---

## 14. 최종 권고

### 기본 도입안

```text
1. 목표·비목표·완료 조건을 작성한다.
2. 한 iteration을 작게 하고 fresh context를 사용한다.
3. 상태와 best artifact를 파일/Git에 저장한다.
4. 결정론적 검증기를 먼저 붙인다.
5. false-DONE 또는 장기 상태 손실이 보이면 별도 auditor를 추가한다.
6. 실패는 재현 가능한 candidate memory로 기록한다.
7. 홀드아웃과 회귀군을 통과한 skill/rule만 승격한다.
8. 비용·무진전·회귀·비가역 작업에서 루프를 멈춘다.
```

### 무엇을 먼저 선택할 것인가

- **가볍게 좋은 성능**이 목표면: fresh context + 외부 상태 + deterministic gate + best checkpoint
- **장기·다중 도구 작업**이면: manager–executor–auditor(MEA)
- **완료 위조·stale evidence가 문제**면: Proof-or-Stop식 current-state-bound receipt
- **반복 작업의 미래 성능을 올리고 싶으면**: SkillOpt식 held-out skill optimization
- **같은 실패가 반복되면**: 행동 규칙 또는 failure-driven patch, 단 재현·전이 게이트 포함
- **보안·적대적 표류가 문제**면: AHA식 falsifier·confirmation counter·frozen evaluation
- **메모리 비용이 문제**면: AutoMem식 failure diagnosis·Pareto promotion·eviction
- **연구 플랫폼 수준의 최적화**면: MetaSkill-Evolve·SESA·EvoPolicyGym

가장 중요한 순서는 언제나 같다.

> **더 많이 생각하게 하기 전에, 잘못된 완료를 받아들이지 않게 만들어라.**

루프의 본질은 모델 호출을 늘리는 것이 아니다. 모델이 틀릴 수 있다는 사실을 전제로, 무엇이
현재 최선인지·무엇이 실패했는지·무엇이 아직 검증되지 않았는지를 시스템이 잃지 않게 만드는
것이다. 그 위에만 스킬·메모리·정책의 자가 개선을 올려야 비용 대비 효과와 드리프트 저항성을
함께 얻을 수 있다.
