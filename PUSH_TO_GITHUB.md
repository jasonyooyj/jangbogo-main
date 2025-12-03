# GitHub에 푸시하는 방법

저장소 연결은 완료되었습니다! 이제 인증만 하면 푸시할 수 있습니다.

## 현재 상태
✅ 원격 저장소 연결 완료: `https://github.com/jasonyooyj/jangbogo-main.git`  
⏳ GitHub 인증 필요

## 푸시 방법 (3가지 중 선택)

### 방법 1: Personal Access Token 사용 (권장)

1. **GitHub에서 Personal Access Token 생성**
   - https://github.com/settings/tokens 접속
   - "Generate new token" → "Generate new token (classic)" 클릭
   - Note: `Hongik-main push` 입력
   - Expiration: 원하는 기간 선택
   - Scopes: `repo` 체크 (전체 체크해도 됨)
   - "Generate token" 클릭
   - **생성된 토큰 복사** (한 번만 보여줌!)

2. **HTTPS URL로 변경 후 푸시**
   ```bash
   cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"
   git remote set-url origin https://github.com/jasonyooyj/jangbogo-main.git
   git push -u origin main
   ```
   - Username: `jasonyooyj` 입력
   - Password: **복사한 토큰** 붙여넣기

### 방법 2: GitHub Desktop 사용 (가장 쉬움!)

1. **GitHub Desktop 설치**
   - https://desktop.github.com/ 에서 다운로드
   - GitHub 계정으로 로그인

2. **저장소 추가**
   - File → Add Local Repository
   - 이 폴더 선택:
     `/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main`
   - "Publish repository" 클릭

### 방법 3: SSH 키 생성 후 사용

1. **SSH 키 생성**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   - 엔터를 3번 누르면 기본 설정으로 생성됨

2. **SSH 키를 GitHub에 등록**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   - 출력된 내용 복사
   - https://github.com/settings/keys 접속
   - "New SSH key" 클릭
   - Title 입력 후 복사한 키 붙여넣기
   - "Add SSH key" 클릭

3. **푸시**
   ```bash
   cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"
   git push -u origin main
   ```

## 빠른 푸시 (현재 설정된 SSH URL 사용)

SSH 키가 이미 설정되어 있다면 바로 실행:

```bash
cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"
git push -u origin main
```

## 푸시 확인

푸시가 성공하면:
- https://github.com/jasonyooyj/jangbogo-main 에서 파일들이 보여야 합니다

## 다음 단계

푸시 완료 후 → [Vercel 배포](./AI_Startup/jangbogo/DEPLOYMENT.md) 진행



