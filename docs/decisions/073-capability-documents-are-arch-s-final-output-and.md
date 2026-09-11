# DD-73 · 능력 문서는 arch의 마지막 출력이며 첫 트리 개방 전에 존재해야 하고, 결정·외부 계약 근거는 확인 경계에서 보존한다

- 상태: 유효
- 주제: 지식층과 능력 문서
- 도입: v0.17.0
- 최종 검토: 2026-09-11

구간 진단을 나눈다. 확정된 Layer 0 문서와 다음 문서 사이는 각 문서의 커밋과 resume이 보존하고, 한 문서를 확인받는 도중에는 승인 전 core-document 경로를 바꾸지 않는 계약 때문에 값싼 중간 착지가 없다. 결함은 arch.md·code-style.md가 착지한 뒤 arch의 최종 출력인 능력 문서가 하나도 없는 채 실행이 끝날 수 있다는 데 있다. DD-43은 첫 카드 전 도메인 경계와 개념이 항상 존재해야 한다고 정했지만, arch에는 가장 큰 단일 산출물을 시작하기 전의 컨텍스트 경계가 없었고 split은 파일 0장 상태를 막지 않았다.

경계는 다섯이다. product의 `해결 방식`은 이제 목표가 충돌할 때 무엇이 이기는지를 함께 소유한다 — 이 값을 요구하는 소비자가 정본에 둘 있는데(`arch:72`의 후보 tie-break, `planning-evidence:67`의 구속 전 재검토) 생산자가 없었고, 그 결과 synky `product.md:18`이 어디에도 정의되지 않은 속도·비용 원칙을 기각 근거로 인용했다. arch는 능력 문서 절 안에서 기대 문서 수를 먼저 말하고, 하네스가 컨텍스트를 경고하면 이 실행이 arch의 완료가 아님을 밝힌 채 확정된 Layer 0 커밋에서 멈춘다. 점유한 카드가 없는 다음 세션은 resume으로 들어와 그 절만 실행한다. split은 첫 트리 개방 때 `01`과 product.md 비은퇴 능력 번호 각각에 대해 `.devflow/project/capabilities/` 바로 아래에 파일명의 첫 `-` 앞 토큰이 그 번호와 정확히 같은 소문자 `.md`가 있는지 확인하고 하나라도 없으면 멈춰 `resume` 재진입을 안내한다. 술어의 다섯 조각은 각각 실측된 우회를 막는다 — 토큰 일치는 접두 일치가 기대 번호 `10`과 `100`이 함께 있을 때 `100-*.md`로 `10` 누락을 가렸기 때문이고, 번호 파일만 보는 것은 `.gitkeep` 하나가 게이트를 통과시켰기 때문이고, 개수가 아니라 번호별 존재를 보는 것은 부분 생성이 통과한 뒤 work의 `baseline missing`과 verify의 `baseline no-op`이 지식 문서 없는 폐쇄를 허용했고 개수 비교에서는 보존된 은퇴 문서와 초과·중복 파일이 누락 번호를 가렸기 때문이며, `바로 아래`는 재귀 독법이 하위 폴더의 번호 파일로 우회했기 때문이고, 소문자 고정은 대소문자 비구분 환경이 `.MD`를 포착했기 때문이다. 기대 번호는 split이 이미 읽는 product.md 능력 목록에서 나오고 그 목록 행에 은퇴 표기가 있으므로 읽기 집합이 늘지 않는다. 스킬을 직접 부르지 않고 `resume`을 거치는 것은 arch의 능력 문서 전용 분기가 resume 라우팅으로만 열리기 때문이며, 그 회수는 점유한 카드가 없을 때 성립한다. 연기 실행은 이 게이트도 함께 건너뛴다. arch는 arch.md 확인 직전에 ADR 세 조건을 통과한 결정을 전부 열거해 각각 기록할지 확인하고, Components·Stack의 근거가 외부 계약 사실에 기대면 정확한 출처를 같은 줄에 남긴다. 이 ADR 심사 문장은 adopt가 출력 형식 참조로 읽는 범위 안에 놓았으므로 브라운필드도 같은 심사를 받는다 — 그 좌표가 브라운필드 적용의 유일한 근거이므로 옮기려면 이 이유를 먼저 반증한다. 착지 뒤에는 미기록 ADR을 되찾는 정본 경로가 없다는 것이 이 경계의 값이다.

이 배치는 resume의 능력 문서 행이 활성 점유에 선점되는 경로와 무관하게 첫 트리 입구에서 부재를 잡고, 브라운필드는 adopt가 같은 능력 문서 생애를 소유하게 한다. synky 실측에서 ADR 통과 후보 10건 중 8건이 기록되지 않았고 Stack 11줄의 외부 계약 출처는 0건이었다. 계획은 이 게이트를 0장에 두고 부분 생성은 기존 resume과 기준선 판정에 맡겼다. 시뮬레이션이 그 근거를 반증했다 — 자기 점유 상태에서는 `resume:219`가 미존재 기대 파일 행을 선점하고 work와 verify가 모두 계속하므로 능력 하나가 지식 문서 없이 닫힐 수 있다. 번호별 존재 확인이 그것을 닫는다. 개수 비교로는 닫히지 않았다 — 보존된 은퇴 문서와 초과·중복 파일이 누락 번호를 가렸다. 이 심사 뒤에도 미기록 ADR이 사후 발견되거나, 능력 목록과 문서 집합이 정당하게 다른 프로젝트에서 비은퇴 번호마다 문서 하나를 요구하는 것이 틀린 것으로 드러나면 이 경계를 다시 연다.

## 정본 토큰

이 결정이 정의하거나 참조하는 정본 문자열이다. **번역하지 않는다** — 문장은 한국어라도
이 토큰은 grep 좌표이므로 원문 그대로 유지한다.

- ` and `
- ` and verify's `
- ` both expected a lone `
- ` is exactly that number exists directly below `
- ` masked the missing `
- ` passed the gate; checking per-number existence rather than a count because partial creation passed and then work's `
- `, stops when any is missing, and directs the user back through `
- `. Each piece of the predicate closes a measured bypass: matching the token rather than a prefix because with `
- `; looking only at number-led files because one `
- `Approach`
- `directly below`
