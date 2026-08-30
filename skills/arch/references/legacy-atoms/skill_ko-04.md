# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0115 — migration:SKILL_ko.md:121-121

Source hash: sha256:ff97d7a3fb21dcddb097bbdf57549562dd29887dfa5c28bf680bb7693b6e5e35

| 프론트엔드 있음 | **렌더링 결과를 읽고 조작할 수 있는 브라우저 조작 도구 필수** (현재 플랫폼이 제공한 것) | 사용 가능한 도구 연결을 안내한 뒤 중단. 눈으로 못 보는 UI 검증은 추측이다 |

## migration-a0116 — migration:SKILL_ko.md:122-122

Source hash: sha256:cca0033e3612c429d043e6f02407198e82cd043b61e512d96dbb7a5bb4b2a97d

| 화면 있는 비웹 (데스크톱 앱·TUI) | 화면·접근성 트리/실출력을 읽는 도구 + 실행 절차 문서 (프로세스 안전 포함) | 사용 가능한 도구 설치를 안내하고 실제로 실행할 수 있을 때까지 중단한다 — 같은 이유다. 실행 절차 문서가 없으면 첫 작업으로 만든다 |

## migration-a0117 — migration:SKILL_ko.md:123-123

Source hash: sha256:f40147efbe19f55130d53cb54cd3e3342df48da63e8d68b717a169eb9c7fc264

| 웹 백엔드 | HTTP 실호출 수단 (`.http` 파일 / curl 스크립트) | 첫 작업으로 만든다 |

## migration-a0118 — migration:SKILL_ko.md:124-124

Source hash: sha256:03965c5ee35202568c679bf4b7444e8fadd44ee167046d399871d4fd46565574

| CLI / 데몬 | 실행 명령 + 기대 출력 (+ 헬스 체크·로그 위치) | 첫 작업으로 만든다 |

## migration-a0119 — migration:SKILL_ko.md:125-125

Source hash: sha256:f7474fc99f55606127da756ee459cd62f5954f66b145272cae8dbda910b87a51

| 라이브러리 | 테스트 러너 | 첫 작업으로 만든다 |

## migration-a0120 — migration:SKILL_ko.md:127-128

Source hash: sha256:6463247da5409f1000432a5fb42a6701337c3f101db7809b83daa1c1446bb54d

git 확인: 리포가 아니면 `git init`을 제안하고 거부하면 멈춘다. 이 체계의 복구·되돌리기 전부가
git에 의존한다.

## migration-a0121 — migration:SKILL_ko.md:130-132

Source hash: sha256:93c23191d0ce397d6ddbfaaf22d90dc0751cb20b3c365f7cf41fdbddcc5f072c

stack·코드 구조·데이터·검증 창구처럼 되돌리기 어려운 선택을 구속하기 직전에 기획 증거 규율의
구속 전 재검토를 한 번 실행한다. product의 문제·능력·경계·성공 판정을 바꾸는 후보는 비교하지
않고 product로 돌려보낸다. 사용자가 재선택한 같은 묶음은 다시 재검토하지 않는다.

## migration-a0122 — migration:SKILL_ko.md:134-134

Source hash: sha256:18bef411509e286a20ea8f4a715b5ee1e36be0fb5b016a0823e1b2141b4326f9

## 산출 — devflow/project/arch.md

## migration-a0123 — migration:SKILL_ko.md:136-136

Source hash: sha256:78b997a37f5510bd65ccd9fa6a59634269a32817f5320c73bb56d8ac1fe9942e

`코드 구조` 값은 아래 셋 중 하나를 쓴다.

## migration-a0124 — migration:SKILL_ko.md:138-138

Source hash: sha256:6cf080c978a89c9e13182363d4dfd0b646c00c060171399c4073997966899edf

| | 구조 | 언제 |

## migration-a0125 — migration:SKILL_ko.md:140-140

Source hash: sha256:35e8d9c83bec4193e3476de460031ada8b4c104a6ba52b1ff085d575c07d2c0c

| A | 도메인 수직 모듈 — `src/<능력>/` 안에 route·service·repo·test 전부 | 기본 추천. 능력 3개 이상 |

## migration-a0126 — migration:SKILL_ko.md:141-141

Source hash: sha256:f905a752d5e119077b72cf6cf19642c88e3e0ba658cee32bc4983c8a6e16df89

| B | Feature-Sliced | 화면 많은 프론트엔드 |

## migration-a0127 — migration:SKILL_ko.md:142-142

Source hash: sha256:b241c1a7c0c815bf7bcad2ec7854de0390c413229ce8932cf8f23f50a5466194

| C | 평면 — `src/` 아래 파일만 | 20파일 미만. 여기서 A는 과잉이다 |

## migration-a0128 — migration:SKILL_ko.md:144-164

Source hash: sha256:dc5a2837fa03ffa133ae31199675c2a374122b814329429d9c2988f36905a1df

```markdown
# 아키텍처

브라운필드: 아니오

## 구성요소        <!-- ✔/✘ + 근거 1줄. 외부 계약 사실에 기대면 정확한 출처를 같은 줄에 -->
## 스택            <!-- 항목: 선택 — 근거 1줄. 외부 계약 사실에 기대면 정확한 출처를 같은 줄에 -->
## 코드 구조       <!-- A/B/C + 폴더 스케치. 폴더명 = 능력명 -->
## 데이터          <!-- 핵심 엔티티만 -->
## 기존 기록       <!-- 브라운필드 전용. 각 줄 <능력명|shared>: <정확한 경로>. 없으면 절 생략 -->
## 잠정값          <!-- 추측으로 적은 값. 아래 절 참조. 없으면 절 생략 -->
## 리스크          <!-- 가장 먼저 깨질 곳 3개 + 확인 방법 -->
## 비범위          <!-- 이번 아키텍처가 감당하지 않는 것 -->

frontend: none | needed
verify_channel:
  작업 서버: <실행 명령 + 포트>     # 검증은 반드시 여기서
  확인 수단: <검증자가 모는 정확한 명령들> — 깨끗한 컨텍스트에서 그중 하나를 글자 그대로 돌려 확인함: `<그 명령 그대로>` exit <코드>; 읽기 프로브: `<실행한 정확한 명령>` → <읽어 낸 실제 화면 요소와 그 값>; 상호작용 프로브: `<실행한 정확한 명령>` → <일으킨 실제 변화>
integration: <통합 브랜치>          # 발급·폐쇄·구속 결정이 착지하는 곳. 혼자 쓰면 지금 쓰는 브랜치
merge: merge-commit | rebase        # squash 금지 — NN.N 이력이 침식된다
```
