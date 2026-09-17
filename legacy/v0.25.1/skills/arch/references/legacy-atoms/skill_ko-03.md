# Legacy atom projection

Repository-relative migration evidence for skills/arch. Each entry retains the exact source coordinate, hash, and source text; the P2 package consumes these records through its legacy-reference reading path.

## migration-a0100 — migration:SKILL_ko.md:84-84

Source hash: sha256:0aa2ee671e138c5f45a38e65aee8b57ba7727a0fc1e27021d7d2895af536d208

### 3. 파생 질문 — 스택이 정해져야 비로소 생기는 결정들

## migration-a0101 — migration:SKILL_ko.md:85-89

Source hash: sha256:4292ececef8888cbee64e9458de69b1b96a3a24e02a2b8a4aaa9595a79c43b5a

선택된 스택 때문에 갈리는 결정을 찾아 한 묶음으로 묻는다 — 결정마다 형식은
2단계와 같다.
(예: Next.js 선택 → 서버/클라이언트 경계, 데이터 페칭 위치, 인증 저장소)
미리 정해둘 수 없다 — 스택을 보고 그 자리에서 만든다.
**여기서 나온 결정들이 code-style.md의 "이 프로젝트의 선택" 절이 된다.**

## migration-a0102 — migration:SKILL_ko.md:91-91

Source hash: sha256:574a9a24dba04d8d1f99b8fa43ae694f0475a23170538254ae8977d3cc00842c

### 4. 코드 구조 결정

## migration-a0103 — migration:SKILL_ko.md:92-92

Source hash: sha256:b21f521ebfc47135dfe45f39b8f07398615f13d69533fcb8ed887ea69d865b3a

AI가 운용하기 좋은 구조가 기준이다. 사람 기준과 다른 지점:

## migration-a0104 — migration:SKILL_ko.md:94-94

Source hash: sha256:27e07126f1812a76ef5d7ecd55e32dc8c52979bec3f53b13e34ee894e513385b

- 파일명은 유일하고 검색 가능하게 (`user-repository.ts`, `index.ts` 남발 금지)

## migration-a0105 — migration:SKILL_ko.md:95-95

Source hash: sha256:cd52c9b762d9d1ee52d792ecef2c1196fa0a24420eb41bdf33d267e240aaec0e

- 암묵 연결 금지 — 코드에 안 적힌 것은 AI가 모른다

## migration-a0106 — migration:SKILL_ko.md:96-96

Source hash: sha256:f46a574953afd0f2ef68fcdb3a5732bdbe57032c7d2301c2189e10b7b03bc235

- 폴더 깊이 3단계 이하, 파일 ~400줄 이하

## migration-a0107 — migration:SKILL_ko.md:97-98

Source hash: sha256:92487d5f696d43181e809b28d6d7c6da734d4e1de44130f6202fbff0ef107503

- 모듈 경계마다 계약(타입·스키마)은 한 파일에


## migration-a0108 — migration:SKILL_ko.md:99-99

Source hash: sha256:86528fe28a7733a1da7e9f054d2e2a245f737e2ee85ee93c802def701fff8074

구조 선택지와 사용 조건은 아래 산출의 A/B/C 표가 정본이다. 규모에 맞는 하나를 고른다.

## migration-a0109 — migration:SKILL_ko.md:101-101

Source hash: sha256:a140cfcce3d624e0f7de8188539f70b57ecd7377faeeed3dfd5a2e0f9c178a39

**폴더 이름 = product.md의 능력 이름.** 문서와 코드가 같은 단어를 쓴다.

## migration-a0110 — migration:SKILL_ko.md:103-103

Source hash: sha256:f5d2494529dec1a3c9516dedf15777d0a54a163083ee4af25e552a913f3f6f44

### 5. 검증 창구 결정 — 통과 게이트

## migration-a0111 — migration:SKILL_ko.md:104-104

Source hash: sha256:5806ac522e29b31721128ea15b419ced45c2416ed5980f703af8b654c9cd8db2

정해지기 전에는 이 스킬이 끝나지 않는다.

## migration-a0112 — migration:SKILL_ko.md:106-109

Source hash: sha256:38f3501a66606e0cc32b851cbb4d5359829efb8135930c085dda3e9638d5b8d7

창구의 이름이나 설치 문장만으로 정해졌다고 판정하지 않는다. 현재 환경에서 아래 명령·도구가
실제로 실행 가능한지 확인한다. 허용된 안전 실행으로 확인하고, 쓰기·비용·권한이 필요하면
기획 증거 규율의 차단 여부에 따라 정확한 허가를 요청하거나 잠정값으로 보낸다. 실행 가능성이
확인되지 않은 차단 창구는 arch.md에 구속하지 않는다.

## migration-a0113 — migration:SKILL_ko.md:111-117

Source hash: sha256:fb10d7bb90941c90df8de9b83db52725b98763426a6bdd4d5f658b78f904bdb3

검증자가 몰 창구는 깨끗한 컨텍스트에서 실제로 한 번 돌려 확인한다 — verify가 `verifier.md`로
브리핑하는 것과 같은 방식으로, 가장 작은 명령 하나와 그 종료 코드로. **확인에 쓴 명령과
arch.md에 적는 명령은 같은 문자열이다** — 적을 명령 중 하나를 글자 그대로 돌려 확인하고 그
명령을 그대로 적는다. 같은 도구의 다른 선택자나 다른 표면으로 확인한 것은 확인이 아니다.
이 세션에서만 도는 창구는 정해진 것이 아니다: 깨끗한 컨텍스트에서 도는 창구로 안내하거나
아래 「없으면」 열대로 중단한다.
깨끗한 컨텍스트를 띄울 수 없는 플랫폼이면 그 사실을 보고하고 사용자가 정한다.

## migration-a0114 — migration:SKILL_ko.md:119-119

Source hash: sha256:e43efa51c3a8725bce731d3a08ff25801f28171c3366e36f83e464b258bc8777

| 유형 | 창구 | 없으면 |
