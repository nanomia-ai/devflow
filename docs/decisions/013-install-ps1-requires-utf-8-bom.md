# DD-13 · install.ps1은 UTF-8 **BOM** 필수

- 상태: 유효
- 주제: 정체성 · 배포 · 플랫폼
- 도입: 최초 설계

PowerShell 5.1이 BOM 없으면 ANSI 파싱 → 한글 스크립트 파손 (실제 재현함)
