# v0.23.5 구현 보고 — users-only Adopt 소속 판정 정정

## 결과

프로젝트 소속은 이제 현재 product가 있거나 현재 색인에 `.devflow/users/**` 밖의 `.devflow`
경로가 있을 때만 성립한다. users-only 방 상태와 untracked pre-product 자료는 명시 Adopt가 직접
소비하는 `setup.unmanaged`이고, 색인의 비사용자 잔재와 관측 실패는 보수적으로 소속에 남는다.

## 경계와 소유

상태 술어와 T2만 계산을 바꾸고 Resume은 그 결과의 설명 한 문장만 바꿨다. DD-102가 DD-100의
루트 존재 이유를 실측으로 정정하고, 매트릭스 §3.24는 기존 H2×A3·A10·A17 칸 안에서 users-only
장면을 받는다. 새 schema·zone·state·guard·stage·effect·기제는 없고 Git 이력·형제 ref는 읽지 않는다.

## 검증 증거

- 공식 Skill Rails `maintain.mjs --skill skills/resume --change <change.json>`은 종료 코드 0이다.
  의미 diff는 `body: stage: scope-entry` 하나뿐이고 runtime·validator hash는 그대로이며 생성 runtime·
  schema·bootstrap 변화는 0이다. 첫 문구는 등록 artifact 경로 중복으로 L8에서 build 전에 거절되어,
  같은 뜻을 정본 용어 `current product`로 고친 뒤 공식 transaction을 다시 실행했다.
- `node --test --test-name-pattern "T2 unmanaged activation needs no current product and no indexed non-user devflow path" scripts/project-state.test.js`는 상위 1개와 하위 13개가 모두 통과했다.
- `node --test --test-name-pattern "generated decision projections remain source-ordered one-to-one views|decision and rejection identifiers remain dense|release manifests match" scripts/repository-invariants.test.js`는 집중 3개가 모두 통과했다.
- `node scripts/decision-index.mjs`와 `--lang ko`는 DD-100의 부분 정정과 DD-102를 같은 순서로 투영했다.
- 변경한 상태 도구를 읽기 전용 JZ Note acceptance worktree `121015bdaf7640653832191f8463f1a459d5c655`에 실행하자 `setup: kind=unmanaged`, `next: setup.unmanaged`였다. 실행 전 `git status --short`는 비어 있었다.
- `git diff --check`는 공백 오류 0이고 일반 line-ending 변환 경고만 냈다.

## 감사 지침 §5 종료 점검

같은 문장을 세 번째 고치지 않았고, 구체적 오독 없는 표현 소견·앞 수리를 되돌리는 진자 운동·
지난 소견만을 근거로 한 추가 규칙은 없다. 자기 검토와 retained Fable·Sol의 읽기 전용 실제 diff
검토는 범위 안 P0/P1 0으로 닫혔고 coordinator가 커밋을 승인했다. 수리는 기계 술어 축소와 직접
거짓 문장 교체로 수렴하며 새 규칙 충돌·소실 경로가 없다.

## 제한과 이월

요청대로 전체 저장소 suite, end-to-end Adopt producer, 설치, push, merge는 실행하지 않았다.
설치 후 Codex·Claude Adopt 수용은 coordinator가 수행하므로 미검증이다.
