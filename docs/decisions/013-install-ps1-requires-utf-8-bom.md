# DD-13 · install.ps1은 UTF-8 **BOM** 필수

- 상태: 유효
- 주제: 정체성 · 배포 · 플랫폼
- 도입: 최초 설계
- 날짜: 2026-08-08
- 날짜 근거: git 추정 (CHANGELOG에 해당 버전 없음)

PowerShell 5.1이 BOM 없으면 ANSI 파싱 → 한글 스크립트 파손 (실제 재현함)
