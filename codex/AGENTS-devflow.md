<!-- 이 블록을 프로젝트 AGENTS.md에 추가하라. Claude Code에서는 불필요(SessionStart 훅이 대신한다). -->

## nano-devflow

이 프로젝트는 nano-devflow로 관리된다. 세션 시작 시:

1. `devflow/tree/`가 있으면 목록을 훑어 상태를 파악한다 (`.wip.` = 진행 중, `.done.` = 완료).
2. `*.wip.md`가 있으면 통독한다 — 진행 로그가 어디서 멈췄는지 알려준다.
3. `devflow/HANDOFF.md`가 있으면 읽는다 (함정·배운 것·열린 결정).
4. 파악한 상태를 한 문단으로 보고하고 승인받은 뒤에만 코드를 고친다.

작업 규율: 진행 상태는 파일명 접미사(`.wip.` `.done.`)로만 표현한다. 1 작업 = 1 커밋
(메시지는 `02.2 가입 API` 형식, 완료 신호 통과 후에만). 실행하지 않은 것은 통과가 아니라
미검증이다. 상세 절차는 /nano-devflow-product /nano-devflow-arch /nano-devflow-design
/nano-devflow-split /nano-devflow-work /nano-devflow-verify /nano-devflow-resume 명령을 따른다.
