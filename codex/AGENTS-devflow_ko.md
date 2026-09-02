<!-- 폴백 전용. Codex 플러그인이 네이티브 SessionStart 훅을 배달한다
(~/.codex/config.toml 에 [features] hooks = true 필요) — Claude와 동일하게 devflow를 감지하면
공유 principles 안내를 제공한다. 이 블록은 훅을 못 쓰는 환경(플래그 꺼짐, 구버전 Codex)에서만
프로젝트 AGENTS.md에 추가한다. Claude Code에서도 불필요. -->

## devflow

이 프로젝트는 devflow로 관리된다. 이름을 명시한 devflow 단계는 직접 실행한다. 그 밖의 devflow
의도는 모델 호출이 가능한 `devflow:principles` 스킬로 분류하고 그 경로를 그대로 따른다. devflow 역할
계약을 받았다면 principles로 재진입하지 않고 그 계약을 직접 따른다. principles가 정한 경로와
필요한 승인 전에는 코드를 고치지 않는다.

이 프로젝트에서 다른 에이전트에게 devflow 단계를 수행시키려면 첫 디스패치 전에 devflow의
`coordinator` 역할 계약을 읽고 따른다.

필요한 모델 호출 가능 스킬이 없으면 코드를 고치지 않는다. 사용자에게 devflow 플러그인을
설치하거나 활성화해 달라고 요청한다. 모델이 슬래시 명령을 직접 실행할 수 있다고 가정하지
않는다.
