<!-- 폴백 전용. 설치기가 Codex 네이티브 SessionStart 훅을 등록한다
(~/.codex/config.toml 에 [features] hooks = true 필요) — Claude와 동일하게 트리 상태가
자동 주입된다. 이 블록은 훅을 못 쓰는 환경(플래그 꺼짐, 구버전 Codex)에서만
프로젝트 AGENTS.md에 추가한다. Claude Code에서도 불필요. -->

## devflow

이 프로젝트는 devflow로 관리된다. 세션 시작 시:

1. `devflow/tree/`가 있으면 목록을 훑어 상태를 파악한다 (`.wip.` = 진행 중, `.done.` = 완료).
2. 내 점유 카드가 있으면 통독한다 — 진행 로그가 어디서 멈췄는지 알려준다.
   (다중 모드 — `devflow/users/`가 있으면: 내 `.wip-<id>.`만. 남의 점유는 읽기 전용.)
3. `devflow/HANDOFF.md`가 있으면 읽는다 (다중 모드: 내 방 `devflow/users/<id>/HANDOFF.md`).
4. 파악한 상태를 한 문단으로 보고하고 승인받은 뒤에만 코드를 고친다.

작업 규율: 진행 상태는 파일명 접미사(`.wip.` `.done.`)로만 표현한다. 1 작업 = 1 커밋
(메시지는 `02.2 가입 API` 형식, 완료 신호 통과 후에만). 실행하지 않은 것은 통과가 아니라
미검증이다. 상세 절차는 /devflow-product /devflow-arch /devflow-adopt /devflow-design
/devflow-split /devflow-work /devflow-verify /devflow-resume 명령을 따른다.
