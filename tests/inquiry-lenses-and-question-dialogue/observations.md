---
summary: Inquiry lenses and conditional human-question dialogue were delivered to the intended targets; representative fresh-use results and remaining unproven cases are recorded here.
read_when:
  - reviewing delivery or behavior evidence for inquiry lenses and question dialogue
---

# 관찰 결과

## Proven

- `question-dialogue`의 source graph consumer는 `adopt`, `architecture`, `design`, `direct`, `product`,
  `sketch` 여섯 target뿐이다. Resume, Work, Verify 생성물에는 module이 없다.
- 변경한 여섯 target은 각 target 단계에서 같은 source로 두 번 build했을 때 같은 tree hash를 냈다.
  최종적으로 아홉 target 모두 `artifactIntact: true`, `sourceCurrent: true`였다.
- Product의 모호한 brief는 선택형 form 없이 의존하는 최상위 질문 하나만 먼저 물었고, 명확한 brief는
  질문 없이 Product와 필요한 Domain만 게시했다.
- 질문 순서 보완 뒤 새 Product 세션은 질문 자체를 첫머리에 두고 현재 이해와 답의 영향을 뒤에
  연결했다. 서로 독립적인 열린 질문 두 개도 선택지로 축소하지 않고 한 메시지에 묶었으며, 각 답이
  바꾸는 제품 책임을 설명했다.
- Sketch의 복수 원인 사례는 하나의 지배 질문과 기존 기록을 결합하는 가장 작은 관찰만 남겼다.
  불필요한 finding, 사용자 질문과 구현 실험은 만들지 않았다.
- 하나의 설명만 지지하는 Sketch 통제 사례는 application dispatch 정지와 scheduler 증거로 기존 지배
  질문만 닫아 Product로 보냈다. 경쟁 후보나 추가 finding은 만들지 않았다.
- 작은 신규 Architecture는 미래 concern child나 기술 목록 질문 없이 단일 current model을 게시했고,
  실행할 수 없는 verification channel을 미검증으로 표시했다.
- code와 runtime evidence가 일부뿐인 기존 Architecture는 확인한 source·실행 사실, 그 사실을 설명하는
  단일-process 해석과 배포·운영 미확정을 구분했다. queue, datastore, replica 또는 운영 주체를
  발명하지 않았다.
- Design 비적용 사례는 문서나 질문을 만들지 않았다. 작은 UI의 열린 브랜드 성격은 style 선택지로
  제한하지 않고 추천과 영향이 포함된 일반 대화 질문 하나로 물었으며, 답 전에는 Design을 추측해
  게시하지 않았다.
- 실제 HTML review surface가 있는 Design은 누락된 queue 정보와 색·marker 의존을 관찰해 표현 수단과
  review 기준만 갱신했다. Product와 Architecture는 수정하지 않았고 read-only 제품 목적을 유지했다.
- Adopt는 source evidence를 먼저 조사한 뒤 README와 runtime의 실제 충돌 하나만 질문했다. Direct는
  이미 정해진 Product·Architecture를 재승인받지 않고 질문 없이 Work 계약으로 진행했다.

## Failed

- 첫 문장 보완안만 적용한 중간 Product 관찰에서는 기존 Product entry의 “현재 어떻게 이해했는지”
  문장이 여전히 배경을 질문보다 먼저 놓게 했다. Product 문장을 내용 계약으로 한정하고 공통 module이
  순서를 소유하게 한 뒤 같은 사례를 다시 실행해 해소했다.

## Unproven

- Design 세션은 실제 HTML source를 읽었지만 local `file:` URL의 브라우저 자동화가 host 정책에
  차단됐다. 따라서 렌더링된 화면에서의 시각 관찰은 입증하지 못했다.
- 열린 질문이 선택형 form으로 축소되지 않는 행동은 관찰했지만, 이 fresh-use host에는 실제 선택형
  form 제어가 없어 닫힌 승인·운영 선택에서의 form 사용은 입증하지 못했다.
- 대형 monorepo, 장기 운용, 다른 host와 모델에서의 일관성 및 실제 사용자 답변 이후 canonical
  문서의 정확도 향상 효과는 관찰하지 않았다.

## 최종 생성 hash

- `adopt`: `9fae553a094a0da21cc55bf7808a9ae396c7e56f3d9d202b52e4ab53a1577818`
- `architecture`: `8b764618773fa34c917e6dcc1b6ec0c97aed354e7cd8b3a4f72eca275b13e6aa`
- `design`: `181b62770b8928d097e393476ce5b5257b913c04257e6d8927aa410420cc5760`
- `direct`: `74cd47a05d623f0e1c2f87082467c276f2024bab26d81c58a65dd9741d12cf55`
- `product`: `4a30e247ebd1fdddcdc790d6e99373efcb16d04b7125312f3146f443fdc89238`
- `resume`: `f0780c682e96ff7357b829cadf8001214892b3af475ec9736dacf481d9375116`
- `sketch`: `d7b1de10e222260f7a9792b090ee075fa8ca6a651a4520e62ce1049b87f15fa1`
- `verify`: `00663b5dc6ccbb13869e46c2e31c15d7fbd0e54411624cf46e050008848fe791`
- `work`: `a1415734698f90a13986631b92288e17a8ff6d9d45056ad5b82651492d6fcccf`
