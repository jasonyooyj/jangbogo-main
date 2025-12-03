# 간단한 푸시 방법 (터미널 사용)

GitHub Desktop이 iCloud 경로를 인식하지 못하는 경우, 터미널에서 직접 푸시하세요.

## 1단계: Personal Access Token 생성

1. **GitHub에서 토큰 생성**
   - https://github.com/settings/tokens 접속
   - "Generate new token" → "Generate new token (classic)" 클릭
   - Note: `jangbogo-main` 입력
   - Expiration: `90 days` (또는 원하는 기간)
   - Scopes: **`repo` 체크박스 선택** (전체 repo 권한)
   - 하단 "Generate token" 클릭
   - **⚠️ 중요: 생성된 토큰을 복사하세요!** (한 번만 보여줍니다)

## 2단계: 터미널에서 푸시

터미널(Terminal) 앱을 열고 다음 명령어를 실행하세요:

```bash
cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"
git push -u origin main
```

### 인증 정보 입력

명령어 실행 후:
- **Username**: `jasonyooyj` 입력 후 엔터
- **Password**: **복사한 토큰을 붙여넣기** 후 엔터
  - ⚠️ 비밀번호가 아니라 **토큰**을 입력해야 합니다!
  - 화면에 아무것도 안 보여도 정상입니다 (보안상 이유)

### 성공 메시지

푸시가 성공하면 다음과 같은 메시지가 나타납니다:
```
Enumerating objects: ...
Counting objects: ...
Writing objects: ...
To https://github.com/jasonyooyj/jangbogo-main.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 3단계: 확인

https://github.com/jasonyooyj/jangbogo-main 에 접속하여 파일들이 업로드되었는지 확인하세요.

## 문제 해결

### "fatal: could not read Username" 오류
- 토큰을 제대로 복사했는지 확인
- Username에 `jasonyooyj` 정확히 입력

### "remote: Invalid username or password" 오류
- 토큰이 만료되었거나 잘못 복사됨
- 새 토큰 생성 후 다시 시도

### 토큰 입력이 안 될 때
- 터미널에서 비밀번호 입력 시 화면에 표시되지 않는 것이 정상입니다
- 토큰을 붙여넣기 한 후 엔터를 누르세요

## 다음 단계

푸시 완료 후 → [Vercel 배포](./AI_Startup/jangbogo/DEPLOYMENT.md) 진행



