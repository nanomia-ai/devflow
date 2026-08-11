# 검증 판정 정본

이 문서는 verify·resume이 함께 쓰는 revision·사건 디스크 판정만 정의한다. 작업 카드 해석은
함께 읽는 상태 판정 정본을 따른다.

## 검증 revision 판정

- Product revision: `git hash-object devflow/project/product.md`의 출력.
- Verification revision: `git ls-tree -r -z --full-tree HEAD --`에 정확히
  `devflow/project/arch.md`·`devflow/project/code-style.md`·존재하는
  `devflow/project/glossary.md` 경로를 주고, stdout의 raw byte를 그대로
  `git hash-object --stdin`의 stdin으로 보낸 출력.
- Code revision: `git log -1 --format=%H -- . ':(exclude)devflow/**'`의 출력. 출력이 없으면
  `none`.
- Capability revision: 능력층에서만 쓴다. 상태 접미사를 제거한 대상 능력 폴더 locator와
  정규화한 경로가 같은 HEAD 폴더를 정확히 하나 찾는다. 그 HEAD 폴더 아래의 대상 `.done.`
  작업 카드 전부와 각 카드의 직계 `의존` 카드 경로를 결정한다. 상태 판정 정본으로 의존을
  해석한다. 이 대상 카드·직계 의존 카드의 정확한 HEAD 경로만
  `git ls-tree -r -z --full-tree HEAD --`에 주고 Verification revision과 같은 방식으로 hash한다.
  Git이 중복 경로 제거와 tree 순서를 맡긴다. 폴더·대상 카드·의존 하나라도 정확히 결정되지
  않으면 값은 `미해결`이다.

두 tree 입력 revision은 NUL을 포함한 Git stdout을 text로 decode·재정렬·줄바꿈 변환하지
않는다. POSIX는 native binary pipe를 쓰고, Windows PowerShell에서는 같은 pipe를
`cmd /d /s /c` 안에서 실행한다. PowerShell object pipeline은 쓰지 않는다.

## 검증 사건 판정

자동 사건은 현재 형식의 verify.md에서 아래 key와 조건으로만 생긴다. 같은 key가 대기·사용자
결정 대기·라우팅·완료 상태 중 하나에 있으면 다시 만들지 않는다.

| 역할 | 사건 key | 발동 조건 |
|---|---|---|
| 감리 | `product` | 트리 루트 verify.md에 제품층 판정이 있고 감리에 그 key가 없음 |
| 감리 | `post-failure through <실패 항목의 가장 큰 출처 id>` | 능력 폴더가 `.done`이고 실패 이력에 `실패:` 항목이 하나 이상 있으며 감리에 그 key가 없음 |
| 회고 | `first closure <능력 번호>` | 능력 폴더가 `.done`이고 회고에 그 key가 없음 |
| 회고 | `product` | 트리 루트 verify.md에 제품층 판정이 있고 회고에 그 key가 없음 |

사용자 요청 사건의 key는 journal 요청 줄의 timestamp다. 같은 역할·대상에서 아직 남은 요청
줄이나 verify.md의 사건 timestamp가 현재 UTC 초와 같으면, 사용하지 않은 값을 만날 때까지
1초씩 더한 timestamp를 새 요청 줄에 쓴다. 같은 역할·대상의 두 요청에 같은 key를 쓰지 않는다.

네 revision 필드 중 하나라도 없는 verify.md는 v0.9.21 이전 기록이다. 그 기록은 현재 실패
라우팅·통과 재사용·자동 사건 판정에서 제외하며 업그레이드만을 위해 빠진 revision 필드를
추가하지 않는다. 그 기록을
대상으로 사용자 요청 사건을 처리할 때는 없는 `## 감리`·`## 회고` 절과 `- 실행 안 함`을 같은
pending 사건 커밋에 먼저 보탠다. 다음 실제 검증은 현재 형식으로 덮어쓰되 이 새 사건 절을
보존한다. 구형 scalar `감리:`·`회고:` 값은 현재 사건을 발동하거나 막지 않으며 과거 내용은
git 이력에 남는다.
