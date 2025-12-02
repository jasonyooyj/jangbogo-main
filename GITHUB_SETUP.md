# GitHub 저장소 연결 가이드

Hongik-main 프로젝트를 GitHub에 푸시하는 방법입니다.

## 1. GitHub에서 새 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 오른쪽 상단의 "+" 버튼 클릭 → "New repository" 선택
3. 저장소 설정:
   - **Repository name**: `Hongik-main` (또는 원하는 이름)
   - **Description**: (선택사항) 프로젝트 설명
   - **Visibility**: Public 또는 Private 선택
   - ⚠️ **중요**: "Initialize this repository with a README" 체크하지 않기
4. "Create repository" 클릭

## 2. 로컬 저장소와 GitHub 연결

GitHub에서 제공하는 명령어를 사용하거나, 아래 명령어를 실행하세요:

```bash
cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"

# GitHub 저장소 URL로 연결 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/Hongik-main.git

# 또는 SSH 사용 (SSH 키가 설정되어 있는 경우)
# git remote add origin git@github.com:YOUR_USERNAME/Hongik-main.git

# 브랜치 이름을 main으로 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

## 3. 푸시 확인

GitHub 웹사이트에서 저장소를 확인하여 모든 파일이 업로드되었는지 확인하세요.

## 다음 단계: Vercel 배포

GitHub 저장소 연결이 완료되면:

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택 (Hongik-main)
4. **중요 설정**:
   - **Root Directory**: `AI_Startup/jangbogo` 설정
   - **Framework Preset**: Vite (자동 감지)
5. 환경 변수 설정:
   - `VITE_OPENAI_API_KEY`: OpenAI API 키
6. "Deploy" 클릭

자세한 배포 가이드는 `AI_Startup/jangbogo/DEPLOYMENT.md`를 참조하세요.

## 문제 해결

### 푸시 오류

만약 GitHub 저장소에 이미 README나 다른 파일이 있는 경우:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 인증 오류

GitHub 인증이 필요한 경우:
- Personal Access Token 사용 (HTTPS)
- 또는 SSH 키 설정 (SSH)

