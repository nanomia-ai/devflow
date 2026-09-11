# DD-92 · 원칙 진입은 상태가 없고, 재개가 상태를 소유하며, 지식·작업 트리와 P2 패키지는 각자의 경계를 가진다

- 상태: 유효 · 일부 정정 → DD-93 (v0.20.0), DD-97 (v0.21.0), DD-103 (v0.23.10), DD-104 (v0.23.11)
- 주제: 지식층과 능력 문서
- 도입: v0.20.0

관찰된 문제: 한 규칙집이 진입 상태를 다시 판정하거나 훅이 내용을 주입하면 resume과 다른 답을 낼 수 있고, 능력 번호만으로 지식과 작업의 서로 다른 재귀 구조를 표현하면 연구·다중 소유 지식의 착지가 사라진다. 수동 색인과 중앙 레지스트리는 새 사실의 두 번째 집이 되고, 생성 패키지의 출처를 잃으면 배포물이 무엇을 실행하는지 검증할 수 없다.

선택 경계: `principles` 진입은 상태가 없고 오직 resume으로 가는 한 경로만 제공한다. SessionStart는 지연된 원칙 안내만 하며 상태·다음 단계·파일 본문을 판정하거나 주입하지 않는다. 지식 트리와 작업 트리는 직교하고, 프로젝트 연구 전용 카드는 `00` 아래에만 살며, 지식은 소유자 옆의 같은 stem 아래 재귀 `K`로만 확장한다; 중앙/수동 색인은 없고 `K`의 자식 수 0도 유효하다. 여섯 행동 제약은 이 경계를 지킨다: C1 product 전 research는 `00-project` 아래에서 지속적으로 남고, C2 card/source evidence는 이름 붙은 source evidence로 남으며, C3 conclusion은 가장 가까운 semantic owner 또는 정확한 crosscut owner에 착지하고, C4 `K`는 arch 또는 adopt만 쓰며, C5 closed history는 정확히 이름 붙은 provenance로만 열고, C6 multi-owner conclusion은 모든 owner를 보존해 원자적으로 착지한다. 정확한 JSON marker shape의 소유자는 principles FORMAT 하나이고, work template과 project-state parser는 seam test로 묶인 실행 투영이다; 이 결정에는 field를 중복하지 않는다. P2 Skill Rails 패키지는 영문으로 작성한 `spec.mjs`와 `body.md`를 실행 작성 정본으로 두고, 그 둘에서 `SKILL.md`를 생성하며 portable provenance와 생성·빌드·평가 증거를 패키지 안에 보존한다.

반박: DD-29의 부분 어댑터가 journal·신선도·정합성을 빠뜨렸다는 이유는 지연 안내가 절차를 복제하지 않고 resume만 가리키므로 적용되지 않는다. DD-44의 번호 도달성과 카드 필드 중복 이유는 지식/작업이 별 트리이고 `00`·`K`가 카드 필드가 아닌 경로 소유권이므로 적용되지 않는다. DD-76 및 DR-17·DR-25의 같은 번호·유계 개봉 이유는 같은 stem 인접성, 정확 소비자, 재귀마다의 유계 개봉 및 자식 0 유효성이 보존하므로 적용되지 않는다. DD-78 및 DR-03의 훅 판정·journal 주입 중복 이유는 훅이 판정·주입을 하지 않으므로 유지된다. DD-57의 플러그인 캐시 동반 문서 이유는 P2의 portable provenance가 패키지 내부에서 그 동행을 검증 가능한 사실로 만들므로 보강된다. 모든 research 질문·결정 경과·중간 결과를 카드나 progress log 하나에 합치면 current conclusion과 일시 진행이 mega-log에 다시 섞여 독자가 무엇이 여전히 현재인지 알 수 없다. 별도 cycle·evidence lifecycle·typed graph는 기존 card·owner/K·Git·verification 경계 옆에 두 번째 정본·생애·유지 의무를 만든다.

영향 좌표: DD-03·DD-25·DD-28·DD-43·DD-44·DD-76·DD-29·DD-57·DD-54·DD-87, 원칙/재개/훅/지식 작성자와 패키지 배포물, 그리고 다중 소유·지식·진입 매트릭스 셀. DD-05·DD-11·DD-83은 각각 SessionStart 하나, 보고만 하는 계산, 한 읽기 전용 상태 계산이라는 범위에서 그대로 유효하다.

재검토: 지연 안내가 resume과 다른 행동을 유발하거나, C1–C6 행동 제약이 깨지거나, 재귀 K가 정확 소비자 없이 열리거나, P2 패키지가 spec·출처·빌드 증거를 잃는 실제 장면이 관측될 때.

## 정본 토큰

이 결정이 정의하거나 참조하는 정본 문자열이다. **번역하지 않는다** — 문장은 한국어라도
이 토큰은 grep 좌표이므로 원문 그대로 유지한다.

- ` children is valid. Six behavioral constraints preserve this boundary: C1 pre-product research survives durably under `
- ` directories under the same stem; no central/manual index exists and zero `
