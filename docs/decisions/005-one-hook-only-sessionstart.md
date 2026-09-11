# DD-05 · 훅은 SessionStart 하나만

- 상태: 유효
- 주제: 정체성 · 배포 · 플랫폼
- 도입: 최초 설계
- 날짜: 2026-08-08
- 날짜 근거: git 추정 (CHANGELOG에 해당 버전 없음)

Stop은 매 턴 발화라 소음, PreCompact는 "진행 로그가 항상 디스크에" 규약으로 불필요. SessionStart는 압축 직후에도 발화해 셋을 겸한다
