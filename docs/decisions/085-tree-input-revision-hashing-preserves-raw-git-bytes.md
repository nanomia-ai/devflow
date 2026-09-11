# DD-85 · tree 입력 revision hash는 process 경계에서 Git raw byte를 보존하며 Buffer 전달이 Windows 전용 shell pipe를 대체한다

- 상태: 유효
- 주제: Git 기계와 중단 복구
- 도입: v0.19.0
- 최종 수정: 2026-08-23

DD-39는 기존 `cmd` binary pipe가 raw-byte hash와 같고 PowerShell 객체 파이프라인만
달랐음을 이미 측정했다. v0.19.0 S3 fixture는 이제 이관된 실행자를 직접 봉합한다.
그 결과는 정확한 `ls-tree -z` stdout `Buffer`를 입력한 `git hash-object --stdin`과 같다.
공백·shell metacharacter·Unicode가 든 경로도 그 byte를 그대로 보존한다. 첫 Git process의
정확한 stdout `Buffer`는 text decode나 shell parsing 없이 `git hash-object --stdin`의 stdin으로
넘어간다. 끝에 NUL byte 하나를 더하면 hash가 달라지고, 입력 Git 실패는 빈 hash가 아니라
`unresolved`로 남는다.

따라서 지켜야 할 경계는 특정 shell이 아니라 두 process 사이의 raw-byte 불변성이다. Windows
전용 `cmd /d /s /c` wrapper를 유지하면 같은 byte를 더 잘 보존하지 않으면서 quoting과 플랫폼
분기를 다시 만든다. PowerShell 객체 파이프라인은 실제 재현 사유가 그대로이므로 계속 금지한다.

영향 좌표: `skills/principles/scripts/project-state.mjs`의 tree-input hash 실행자,
`skills/principles/verification-predicates{,_ko}.md`의 raw-byte 불변식,
`scripts/project-state.test.js`의 S3 fixture, `scripts/repository-invariants.test.js`, DD-39.
재검토 조건: 지원 플랫폼에서 첫 Git process의 raw stdout `Buffer`를 직접 입력한 hash와 상태
도구 결과가 달라지거나, 두 Git process 사이 실행 경계가 바뀔 때. shell 선호만으로는 다시 열지 않는다.
