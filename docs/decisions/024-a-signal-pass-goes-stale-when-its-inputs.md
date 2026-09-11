# DD-24 · 신호 통과는 입력이 바뀌면 낡는다 + 수정 카드의 완료 신호는 verifier의 재현 절차 (v0.9.4, 제품·능력층 확장 v0.9.21)

- 상태: 유효
- 주제: 검증과 역할
- 도입: v0.9.4

외부 루프 엔지니어링 검토(2026-08-09)가 지적하고 원문 대조로 확정한 두 공백: 검토 후 수정본이 수정 전 통과를 증거로 커밋되는 낡은 증거 경로, 실패와 무관하게 약하게 작성될 수 있는 수정 카드 신호. 근거 연구 대조 확인(맹목 재시도의 잠재·의미 오류 회복 0.0, 실제 오판 사례로 검증기 +14.8%p). 증거의 신선도와 신호의 출처만 규정하고 실행 순서는 규정하지 않는다 — red-green 절차 재도입이 아니며 TDD 기각은 유지된다(실패했다는 '전' 증거는 verify 기록이 이미 보유). v0.9.21은 제품층 판정을 product.md의 Product revision, arch.md·code-style.md·glossary.md의 Verification revision, devflow 밖 마지막 commit인 Code revision에 묶는다. 능력층의 Capability revision은 대상 `.done.` 작업 카드와 그 카드가 직접 의존하는 카드의 정확한 HEAD 경로만 포함한다. Verification·Capability revision은 정렬·Unicode·경로 separator를 별도로 해석하는 JSON이 아니라 `git ls-tree -r -z`의 raw byte를 그대로 hash한다. revision 입력·직계 의존 카드·devflow 밖 경로에 미커밋 변경이 있으면 판정을 금지한다
