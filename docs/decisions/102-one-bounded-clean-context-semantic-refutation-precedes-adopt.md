# DD-102 · Adopt의 구속 질문 앞에는 한 번의 유계한 clean-context 의미 반증이 선다

- 상태: 유효 · 일부 정정 → DD-103 (v0.23.10), DD-106 (v0.23.13), DD-111 (v0.25.0)
- 주제: 브라운필드와 진입
- 도입: v0.23.7

관측된 문제: Adopt 제안서에는 구속 확인 바로 앞의 `Evidence verification` 구역이 있었지만 현행
정본은 무엇을 누가 어떻게 확인하는지 말하지 않았다. 같은 생산자가 좌표를 붙였다고 보고하면 전체
자료 처분과 Layer 0·능력/K 연결의 모순이나 누락이 그대로 구속될 수 있었다. 또한 Adopt가 써야 할
Architecture `verify_channel`의 값 공간과 ADR 조건은 Arch에만 있었고, Product의 `C<n>`과 disk
능력 번호 `NN`은 정확히 한 칸 어긋나면서도 모두 “capability number”로 불렸다. 과거 별도 계보의
실패 기록은 이 누락이 실제 잘못된 연결과 검증 수단 누락으로 이어질 수 있음을 보였고, 현행 byte의
빈 검증 구역과 두 모호한 권위 좌표가 같은 위험을 독립적으로 증명했다.

원하는 동작: 소유자가 전체 쓰기 집합을 구속하기 전에 생산 과정과 분리된 작은 문맥이 실제 의미
모순과 누락을 한 번 반증한다. 검사는 모든 사실을 기계화하거나 문체를 심사하지 않고, 잘못된 다음
행동을 만들 정도의 load-bearing 결함만 막는다.

선택한 경계: semantic-refutation 단계는 완전한 초안을 만든 뒤 한 번의 유계한 clean-context 의미
반증을 실행하고 그 결과를 `Evidence verification`에 적은 다음에만 제안과 구속 질문을 낸다. 입력은 전체 초안,
inventory와 disposition, 현재와 제안의 load-bearing source/code 좌표, 선택한 공용 능력·캡슐 계약,
Arch verification-channel 표의 Surface·Required channel 열과 첫 proposal 문단 및 ADR 조건뿐이다.
Missing-channel action 열, producer transcript, 이전 audit 결론, Arch의 다른 실행·verification-run·
승인·쓰기·commit 지시는 제외한다.

차단 finding은 출처가 뒷받침하는 모순 또는 누락 중 실제 wrong action, 필요한 결정이나 기각 방향의
소실, 잘못된 소유권, verification means 누락을 일으키는 것뿐이다. 초안 수정은 한 번까지이며 그 뒤
처음 반환된 좌표만 재검사하고 새 전수 패스를 열지 않는다. 차단 finding이 남거나 clean context를
얻지 못하면 구속하지 않는다. 반증 상태는 pending·clear·blocked의 판단 관측이고, blocked는 근거 있는
차단 finding이나 unavailable clean context를 함께 뜻한다. pending만 반증 단계를 실행하며 clear만
제안과 승인 쓰기에 도달하고, blocked는 제안 앞에서 멈춘다. 승인 표도 clear를 함께 요구한다. 공용
기준선 계약은 unqualified capability number를 disk `NN`으로
고정하고 Product-local id는 `Product C<n> <name>`으로 쓰게 해 두 좌표계를 분리한다.

필요한 이유: Adopt는 한 번의 승인으로 이후 세션이 정본으로 믿을 넓은 지식 표면을 만든다. 생산자
자기확인만으로는 누락을 독립적으로 볼 수 없지만, 전체 감사나 거대 validator는 이 단계를 제품의
정답지로 만들고 절차를 증식시킨다. 유계한 입력·차단 기준·한 번 수정은 비용과 재시도 수렴을 함께
고정한다. Arch에서 필요한 두 표 열과 첫 문단만 소비하므로 현재 기술 설계의 소유권도 옮기지 않는다.

기각한 대안: 기존 `Evidence verification` 제목만 두는 것은 생산자 자기진술을 검증으로 오인하게
한다. 모든 제안 사실을 규칙과 fixture로 기계화하는 안, Arch 절차 전체를 Adopt에 복사하는 안,
finding마다 새 전수 패스를 여는 안은 범위와 읽기 비용을 키운다. refutation을 위한 Product 규칙은
추가하지 않는다. 별도 DD-101의 Product 연결은 정본 state가 동시에 관찰한 미커밋 경계 사실만
소비하며 이 판단을 복제하지 않는다.

영향 좌표: Adopt `spec.mjs`의 refutation 관측·단계·승인 표와 선언, `body.md`, `references/workflow.md`, intent·
obligation ledger·fixture 및 생성 영수증, Principles의 capability baseline contract와
`opening-and-freshness.md`·`relations-and-lifecycle.md`, `scripts/repository-invariants.test.js`,
DD-97, 매트릭스 §3.24, 배포 manifest, CHANGELOG, maintenance protocol §9. 이 결정은 Arch runtime,
Product 작성 판단과 JZ Note 원본 표본을 바꾸지 않는다.

재검토 조건: 반증 입력이 전체 초안이나 load-bearing 권위 좌표를 받지 못하거나, 이전 결론이 답으로
주입되거나, finding이 실제 행동 실패 없이 문체 심사로 넓어지거나, 한 수정 뒤 전수 재시도가 반복되거나,
차단 finding이 남은 제안이 구속되거나, Product C와 disk NN 혼동으로 다른 능력을 가리킬 때.
