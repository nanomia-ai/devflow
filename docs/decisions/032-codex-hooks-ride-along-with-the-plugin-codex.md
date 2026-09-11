# DD-32 · Codex 훅은 플러그인이 배달한다 — `.codex-plugin/plugin.json`이 `hooks`를 선언, 설치는 원격 두 줄

- 상태: 유효
- 주제: 정체성 · 배포 · 플랫폼
- 도입: v0.9.20
- 결정일: 2026-08-11
- 최종 수정: 2026-08-13

v0.9.9가 기록한 근거("플러그인 전달 훅은 Codex에서 제거된 기능")를 실측으로 반박했다(2026-08-11): Codex 바이너리가 `hooks/hooks.json`·`CLAUDE_PLUGIN_ROOT` 문자열을 그대로 갖고 있고, 실사용 플러그인(claude-mem)이 `.codex-plugin/plugin.json`에서 `hooks`를 선언해 배달한다. devflow에 같은 매니페스트를 두자 수동 등록을 치운 상태에서 SessionStart가 실제로 발화했다. Claude 매니페스트에는 이 선언이 필요 없다 — Claude는 `hooks/hooks.json`을 자동 발견한다(중복 선언은 지웠다). 함께 확인: `codex plugin marketplace add`는 `owner/repo`를 그대로 받아 클론이 필요 없다. 그래서 README의 Codex 설치가 Claude와 같은 두 줄이 된다. 설치기는 폐기하지 않는다 — 로컬 개발 설치(저장소 기록의 정본 경로)와 슬래시 프롬프트 채널이 그 통로다
