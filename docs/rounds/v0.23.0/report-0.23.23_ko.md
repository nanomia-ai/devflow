# v0.23.23 구현 보고서

- 날짜: 2026-09-10
- 기준: `d51ac0d185f56fb34e619a73d6b15b6614c67c74`
- 도구: Skill Rails runtime 0.3.6, validator 0.6.2

## 결과

실사용에서 드러난 예약 저널 timestamp 계약 불일치를 한 작성 사실의 projection 오류로
수리했다. Direct 1행, Verify 8행, Principles가 소유하는 journal·progress 예제 11행의
millisecond timestamp를 canonical `YYYY-MM-DDTHH:mm:ssZ` 형식으로 교체했다. Arch 형식은
별도 reader를 가지므로 바꾸지 않았다.

실제 fixture 행을 읽고 `RESERVED_JOURNAL_HEADS`로 범위를 정하는 Gate A 회귀 검사를
추가했다. 현재 spec에서 저널 WRITE를 발견하므로 Direct의 maintenance request와 Verify의
capability-closing 예제가 각각 canonical projection에 도달해야 한다. dormant Verify
audit/retrospective 예제처럼 body가 canonical과 다른 행도 이제 item 12로 보이며 조용히
사라지지 않는다.

## 기준 상태와 변경 범위

결정 index 행 이동은 0건이다. canonical owner인 journal grammar와 project-state parser,
Direct·Verify spec/body/collector, 모든 역할 경계는 그대로다. 작성 변경은 세 package의
`fixtures/formats.json`, Gate A test, 실사용 관찰을 남긴 design backlog뿐이고, builder가 세
`.generated.json` receipt를 다시 봉인했다. 새 파일은 이 보고서 하나이며 삭제·이동은 0건이다.

실사용 Claude가 광고된 `.000Z maintenance routing pending:` 행을 그대로 쓴 뒤
`request.current=NONE`, item 12 0건이 되었고 Direct가 같은 effect를 재발행한 장면은 parser의
별도 진단 경계 관찰로 backlog에 남겼다. 이번 수리는 timestamp 계약을 넓히거나 광범위한
validator를 추가하지 않는다.

## 검증

- Gate A targeted run: top-level 35/35 통과. 그 안에서 세 package의 예약 head fixture 18행을
  실제 파일에서 읽었고 live Direct·Verify writer 둘이 각각 request와 marker projection에 도달했다.
- progress parser targeted run: 10/10 통과.
- Skill Rails L-full과 eval: Direct 28/28, Verify 28/28, Principles 10/10 통과.
- 세 package의 공식 build 통과: runtime 0.3.6, validator 0.6.2로 generated receipt를 갱신했다.
- 긴 전체 suite는 owner 지시대로 실행하지 않아 **미검증**이다. verification contract를
  바꾸지 않았으므로 수동 Gate B는 적용 대상이 아니다.
- commit, push, 공식 Codex·Claude 설치 및 설치본 hash/smoke는 독립 검토 수렴 확인 전이라
  실행하지 않았고 **미검증**이다. 두 실사용 프로젝트는 건드리지 않았다.

## 전체 인과 검토와 한계

원인은 Skill Rails format renderer가 허용한 millisecond 예제가 Devflow의 초 단위 canonical
journal·progress parser와 만난 경계다. generated guide가 fixture의 `expect`를 광고하고, AI가
그 bytes를 쓰며, project-state가 읽지 못한 request를 Direct collector가 `NONE`으로 받는
경로까지 확인했다. 같은 timestamp owner를 향하는 Verify 전 행과 Principles owner 예제를
함께 맞춰 sibling divergence를 남기지 않았고, 별도 독자인 Arch 형식은 보존했다.

감사 지침 §5 종료 조건 중 범위 안 규칙 충돌·소실 경로는 이 수리와 fixture-driven test 뒤
0건, 새 해석을 여는 문장은 0건으로 평가했다. 같은 문장 세 번째 수정, 구체적 오독 없는
혼동 주장, 앞 수리 되돌리기, 지난 소견만을 근거로 한 소견의 개인 회로 차단기는 모두 0건이다.
남은 millisecond malformed-prefix item-12 누락은 실측 장면과 함께 관찰로 분리했으며, 독립
whole-diff 재감사와 전체 suite 결과는 아직 **미검증**이다.
