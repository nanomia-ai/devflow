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
- Sketch의 복수 원인 사례는 하나의 지배 질문과 기존 기록을 결합하는 가장 작은 관찰만 남겼다.
  불필요한 finding, 사용자 질문과 구현 실험은 만들지 않았다.
- 작은 신규 Architecture는 미래 concern child나 기술 목록 질문 없이 단일 current model을 게시했고,
  실행할 수 없는 verification channel을 미검증으로 표시했다.
- Design 비적용 사례는 문서나 질문을 만들지 않았다. 작은 UI의 열린 브랜드 성격은 style 선택지로
  제한하지 않고 추천과 영향이 포함된 일반 대화 질문 하나로 물었으며, 답 전에는 Design을 추측해
  게시하지 않았다.
- Adopt는 source evidence를 먼저 조사한 뒤 README와 runtime의 실제 충돌 하나만 질문했다. Direct는
  이미 정해진 Product·Architecture를 재승인받지 않고 질문 없이 Work 계약으로 진행했다.

## Failed

- 없음.

## Unproven

- 하나의 설명만 지지하는 Sketch 통제 사례, code/runtime evidence가 불완전한 기존 Architecture,
  큰 live UI에서의 Design 조정은 별도 fresh-use로 실행하지 않았다.
- 독립적인 열린 질문 두세 개를 한 메시지에 묶는 장면과 host의 실제 선택형 form 사용은 관찰하지
  않았다. 계약은 이를 허용하지만 정적 연결만으로 행동을 입증하지 않는다.
- 대형 monorepo, 장기 운용, 다른 host와 모델에서의 일관성 및 실제 사용자 답변 이후 canonical
  문서의 정확도 향상 효과는 관찰하지 않았다.

## 최종 생성 hash

- `adopt`: `5a4b5eb53cd90383af18511ad6f7ae7ef0614addc7463bddee4a872b770c5d87`
- `architecture`: `c2b66c74deac26b8f2e53db1a25a9c777165a5983337236448eeed2bfee60cd3`
- `design`: `87bb931778bc5760b4de696e4e1411dfca5f663179928c1eaeed44df6678e7de`
- `direct`: `5cb2adabd63769e4cb69ce9e07455b4e4314b51af49c316910b2b995f62b552d`
- `product`: `08bfb6d5a3afc57ecbc7f5e4002a830c1d95fe4a4a14458508ee19075b9ecdeb`
- `resume`: `f0780c682e96ff7357b829cadf8001214892b3af475ec9736dacf481d9375116`
- `sketch`: `9d86d86fbfd0405feddd80d303114881e35d34c13903c974c4aee97c0c6bb221`
- `verify`: `00663b5dc6ccbb13869e46c2e31c15d7fbd0e54411624cf46e050008848fe791`
- `work`: `a1415734698f90a13986631b92288e17a8ff6d9d45056ad5b82651492d6fcccf`
