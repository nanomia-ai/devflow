# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0129 — migration:SKILL_ko.md:166-172

Source hash: sha256:3c3eafec1f6571a2d99631bc4efb8df1458dc2fcf95181ef118f34ada5a1c972

`확인 수단`의 확인은 창구가 실제로 도는 것을 본 기록이다. 도움말 출력·능력 목록·실행 파일
존재·exit 0으로 끝난 attach는 어느 것도 확인이 아니다 — 넷 다 창구가 화면에 닿지 못한 채로도
똑같이 나온다. `frontend: needed`이면 깨끗한 컨텍스트가 고른 창구로 **실제로 그려진 요소
하나를 읽고** **실제 상호작용 하나를 성공**시킨 뒤에야 arch가 확인으로 적는다. 두 프로브의
정확한 명령과 관측한 결과 — 읽은 요소는 그 값까지, 상호작용은 그것이 일으킨 변화까지 — 를 그
줄에 글자 그대로 적는다. 둘 중 하나라도 못 하면 그 창구는 미확인이고, 미확인 창구에는 값을
적지 않은 채 무엇이 안 됐는지 사용자에게 보고한다.

## migration-a0130 — migration:SKILL_ko.md:174-177

Source hash: sha256:28d0157c9cec4dafb897a49cb292ce35fd3d6dce1c0f017e57fdeced70a43cb0

`브라운필드`는 이 저장소에 devflow보다 먼저 구현 코드가 있었는지를 기록한다. arch로 새
프로젝트를 설계하면 `아니오`, adopt가 기존 코드에서 역산하면 `예`다. 이 값은 트리의 최초
생성 방식을 고르는 입력이며, 구현 진행률이 아니다. 기존 arch.md에 `브라운필드` 필드만
없으면 그 한 가지만 묻고 필드만 더하며 다른 것은 바꾸지 않는다.

## migration-a0131 — migration:SKILL_ko.md:179-185

Source hash: sha256:75825a947f4ed37b3971a0ccef773fcf7cc1da301df475808abb8ebe3921f15c

`integration`의 기본 제안은 `git worktree list`가 보고하는 워크트리 수로 갈린다. 하나면 현재
브랜치이고 추가 질문은 없다. 둘 이상이면 **어떤 워크트리도 체크아웃하지 않은 브랜치**를 기본으로
제안한다 — Git은 다른 워크트리가 체크아웃한 브랜치를 갱신하지 않으므로, 통합을 한 폴더가 쥐고
있으면 모든 점유·발급·폐쇄를 그 폴더에 가서 해야 하고 워크트리를 여러 개 깐 의미가 사라진다.
그런 브랜치가 없으면 만들 정확한 명령(`git branch <이름> <현재 통합>`)을 보여 주고 사용자가
실행한다 — devflow는 브랜치도 워크트리도 만들지 않는다. 그 값이 무엇을 뜻하는지는 규칙 정본이
지배한다.

## migration-a0132 — migration:SKILL_ko.md:187-191

Source hash: sha256:b1167848d6404b70a772f7d4bb8b8ce420464ba310c869891820ad8c58451e19

`기존 기록`은 adopt가 코드와 대조한 기존 핸드오프·사양 문서의 위치만 찾게 하는 색인이다.
각 줄은 product.md의 능력 이름 또는 `shared`, 콜론, 정확한 파일 경로 하나만 갖는다. 같은
이름을 여러 줄에 반복할 수 있다. 이 절의 경로는 읽기 지시가 아니며 문서에 정본 지위를
주지 않는다. split이 변경 범위에 맞는 경로를 다시 대조해 카드의 `읽을 것`에 넣었을 때만
work가 연다.

## migration-a0133 — migration:SKILL_ko.md:193-193

Source hash: sha256:ca6f4e7d844bae34f426695b83e153e0e8f0572e2bfcbc0afe7a53f9327a0833

### 잠정값 — 아직 모르는 아키텍처

## migration-a0134 — migration:SKILL_ko.md:195-196

Source hash: sha256:31dba53a63b60c60e182b5b02095d3a59acc9e01e47f7080de6739c940bae18f

버퍼 크기, 타임아웃, 역압 프로토콜의 필요 여부 같은 것들은 생각만으로 확정되지 않는다.
추측을 결정과 같은 문장으로 적는 순간 아키텍처 문서는 거짓말을 시작한다.

## migration-a0135 — migration:SKILL_ko.md:198-203

Source hash: sha256:afbcdf8cefa0e23b585c49d3b477601d7f934c4982bb7ea4e5289094ec3b1935

**추측으로 적는 값은 전부 이 표에 넣고, 모든 행에 그것을 해소할 카드 번호를 단다.**
해소 카드가 없다면 알아낼 생각이 없다는 뜻이고 — 그러면 잠정이 아니라 결정이므로
위 절에 적는다. 이 표는 진행 기록이 아니라 미지(未知)의 목록이다.
해소할 카드의 번호를 아직 모르면(트리가 없거나 그 층이 아직 안 열렸으면) 해소 카드
칸에 '미발급'이라 적는다 — split이 그 행을 해소할 층을 열 때 카드를 만들고 번호로
교체한다 (발견→갱신 표의 그 행).
