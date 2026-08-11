<!-- 폴백 전용. Codex 플러그인이 네이티브 SessionStart 훅을 배달한다
(~/.codex/config.toml 에 [features] hooks = true 필요) — Claude와 동일하게 devflow를 감지하면
공유 resume 절차로 안내한다. 이 블록은 훅을 못 쓰는 환경(플래그 꺼짐, 구버전 Codex)에서만
프로젝트 AGENTS.md에 추가한다. Claude Code에서도 불필요. -->

## devflow

이 프로젝트는 devflow로 관리된다. 세션 시작 시 모델 호출이 가능한 resume 스킬이 있으면
그 스킬을 실행하고 절차를 그대로 따른다. resume이 상태를 보고하고 사용자가 승인하기 전에는
코드를 고치지 않는다.

모델 호출이 가능한 resume 스킬이 없으면 코드를 고치지 않는다. 로컬 설치기가 슬래시 프롬프트를
만든 환경에서는 사용자에게 `/devflow-resume`을 직접 실행해 달라고 요청한다. 그 프롬프트도
없으면 devflow 플러그인을 설치하거나 활성화해 달라고 요청한다. 모델이 슬래시 명령을 직접
실행할 수 있다고 가정하지 않는다.
