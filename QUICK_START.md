# 빠른 시작 가이드

## 현재 상태
- ✅ Git 저장소 초기화 완료
- ✅ 모든 파일 커밋 완료 (142개 파일, 2개 커밋)
- ✅ .env 파일은 Git에서 무시됨 (안전)
- ✅ 연결 스크립트 준비 완료 (`connect_github.sh`)
- ⏳ GitHub 저장소 연결 필요

## 다음 단계: GitHub 연결

### 방법 1: GitHub에서 새 저장소 생성 후 연결

1. **GitHub에서 저장소 생성**
   - https://github.com/new 접속
   - Repository name: `Hongik-main` (또는 원하는 이름)
   - Public 또는 Private 선택
   - ⚠️ "Initialize this repository with a README" 체크하지 않기
   - "Create repository" 클릭

2. **로컬 저장소와 연결**
   아래 명령어를 실행하세요 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경):

   ```bash
   cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"
   git remote add origin https://github.com/YOUR_USERNAME/Hongik-main.git
   git branch -M main
   git push -u origin main
   ```

### 방법 2: 연결 스크립트 사용 (가장 간단!)

저장소 URL만 있으면 스크립트가 자동으로 연결합니다:

```bash
cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"
./connect_github.sh
```

스크립트가 저장소 URL을 물어보면 입력하세요.

### 방법 3: 수동으로 명령어 실행

저장소 URL이 있는 경우 직접 실행:

```bash
cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"
git remote add origin <저장소_URL>
git branch -M main
git push -u origin main
```

## Vercel 배포

GitHub 연결이 완료되면:

1. https://vercel.com 접속
2. "New Project" 클릭
3. GitHub 저장소 선택
4. **중요 설정**:
   - Root Directory: `AI_Startup/jangbogo`
5. Environment Variables:
   - `VITE_OPENAI_API_KEY`: (OpenAI API 키 입력)

자세한 내용은 `AI_Startup/jangbogo/DEPLOYMENT.md` 참조

## 보안 확인

✅ `.env` 파일은 Git에서 제외되어 있습니다. API 키가 노출되지 않습니다.

