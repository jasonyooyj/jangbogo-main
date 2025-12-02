# Git 저장소 설정 가이드

Hongik-main 전체를 Git 저장소로 설정하고, jangbogo 프로젝트를 Vercel에 배포하는 방법입니다.

## Git 저장소 초기화

Hongik-main 폴더가 Git 저장소로 초기화되어 있지 않은 경우:

```bash
cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"
git init
```

## .gitignore 확인

루트 `.gitignore` 파일에 다음이 포함되어 있는지 확인:

- `node_modules/` - 의존성 폴더
- `dist/` - 빌드 결과물
- `.env*.local` - 환경 변수 파일
- `.DS_Store` - macOS 시스템 파일

자세한 내용은 루트의 `.gitignore` 파일을 확인하세요.

## GitHub 저장소에 푸시

1. GitHub에서 새 저장소 생성 (예: `Hongik-main`)

2. 로컬 저장소와 연결:

```bash
git add .
git commit -m "Initial commit: Add Hongik-main project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Hongik-main.git
git push -u origin main
```

> **참고**: `YOUR_USERNAME`을 실제 GitHub 사용자명으로 변경하세요.

## Vercel 배포 설정

Vercel에서 배포할 때:

1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택 (Hongik-main)
3. **중요**: 프로젝트 설정에서 **Root Directory**를 `AI_Startup/jangbogo`로 설정
4. 환경 변수 `VITE_OPENAI_API_KEY` 설정
5. 배포 완료

자세한 배포 가이드는 `AI_Startup/jangbogo/DEPLOYMENT.md`를 참조하세요.

## 문제 해결

### 다른 폴더의 파일들이 Git에 추가되는 문제

`.gitignore` 파일이 제대로 작동하지 않는 경우:

1. `.gitignore` 파일 확인
2. 이미 추가된 파일 제거:
   ```bash
   git rm -r --cached node_modules/
   git rm -r --cached dist/
   git commit -m "Remove ignored files from Git"
   ```

### Vercel에서 빌드 실패

- Root Directory가 `AI_Startup/jangbogo`로 설정되어 있는지 확인
- Vercel Dashboard → 프로젝트 → Settings → General → Root Directory 확인

