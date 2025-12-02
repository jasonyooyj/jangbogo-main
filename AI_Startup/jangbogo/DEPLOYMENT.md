# 배포 가이드 (Deployment Guide)

jangbogo 프로젝트를 배포하기 위한 단계별 가이드입니다.

## 필수 환경 변수

이 프로젝트는 다음 환경 변수가 필요합니다:

- `VITE_OPENAI_API_KEY`: OpenAI API 키 (필수)
  - [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급받을 수 있습니다.

## 배포 전 확인 사항

1. **Git 저장소 설정 (Hongik-main 전체를 Git 저장소로 사용하는 경우)**
   - Hongik-main 폴더가 Git 저장소로 초기화되어 있는지 확인
   - `.gitignore` 파일이 적절히 설정되어 있는지 확인 (node_modules, dist 등 무시)
   - GitHub 저장소에 푸시 완료

2. **환경 변수 설정 확인**
   - jangbogo 프로젝트 루트에 `.env` 파일을 생성하고 `VITE_OPENAI_API_KEY`를 설정하세요.

3. **로컬 빌드 테스트**
   ```bash
   npm run build
   npm run preview
   ```
   - 빌드가 성공하는지 확인
   - `dist` 폴더가 생성되는지 확인
   - 프리뷰 서버에서 애플리케이션이 정상 작동하는지 확인

## Vercel을 통한 배포 (권장)

이 프로젝트는 이미 Vercel 배포 설정이 완료되어 있습니다 (`vercel.json` 파일 참조).

### 1. Vercel 계정 준비

- [Vercel](https://vercel.com)에 가입 및 로그인

### 2. GitHub 저장소 연결 (권장)

1. Hongik-main 프로젝트를 GitHub 저장소에 푸시
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Vercel 대시보드에서 "New Project" 클릭

3. GitHub 저장소 선택 (Hongik-main 저장소)

4. 프로젝트 설정:
   - **Framework Preset**: Vite (자동 감지됨)
   - **Root Directory**: `AI_Startup/jangbogo` ⚠️ **중요: 이 설정이 필수입니다!**
   - **Build Command**: `npm run vercel-build` (vercel.json에 이미 설정됨)
   - **Output Directory**: `dist` (vercel.json에 이미 설정됨)
   - **Install Command**: `npm install`

   > **참고**: Root Directory를 `AI_Startup/jangbogo`로 설정하지 않으면, Vercel이 Hongik-main의 루트에서 빌드를 시도하여 실패합니다.

### 3. 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 설정 → "Environment Variables" 섹션으로 이동
2. 다음 환경 변수 추가:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: 실제 OpenAI API 키
   - **Environment**: Production, Preview, Development 모두 선택

### 4. 배포 실행

- GitHub 저장소에 연결한 경우: 코드 푸시 시 자동 배포
- 수동 배포: Vercel CLI 사용
  ```bash
  npm install -g vercel
  vercel
  ```

### 5. 배포 확인

- 배포 완료 후 제공되는 URL에서 애플리케이션 확인
- 콘솔에서 에러가 없는지 확인 (브라우저 개발자 도구)

## Netlify를 통한 배포

### 1. Netlify 계정 준비

- [Netlify](https://www.netlify.com)에 가입 및 로그인

### 2. 프로젝트 배포

1. Netlify 대시보드에서 "Add new site" → "Import an existing project"
2. GitHub 저장소 선택 또는 드래그 앤 드롭으로 배포
3. 빌드 설정:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 3. 환경 변수 설정

1. Site settings → "Environment variables"
2. 다음 환경 변수 추가:
   - **Key**: `VITE_OPENAI_API_KEY`
   - **Value**: 실제 OpenAI API 키

### 4. 배포 확인

- Netlify가 자동으로 배포를 완료하면 제공되는 URL 확인

## GitHub Pages를 통한 배포

### 1. 빌드 설정

`vite.config.js`에 base 경로 추가 (필요한 경우):

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/jangbogo/', // GitHub 저장소 이름에 맞게 수정
})
```

### 2. GitHub Actions 설정

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 3. GitHub Secrets 설정

1. 저장소 Settings → "Secrets and variables" → "Actions"
2. "New repository secret" 클릭
3. 다음 추가:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: 실제 OpenAI API 키

### 4. GitHub Pages 활성화

1. 저장소 Settings → "Pages"
2. Source를 "GitHub Actions"로 설정

## 배포 후 확인 사항

- [ ] 애플리케이션이 정상적으로 로드되는지 확인
- [ ] 모든 페이지가 정상적으로 작동하는지 확인
- [ ] AI 채팅 기능이 정상 작동하는지 확인 (환경 변수 설정 확인)
- [ ] 브라우저 콘솔에 에러가 없는지 확인
- [ ] 반응형 디자인이 모바일에서도 정상 작동하는지 확인

## 문제 해결

### 빌드 오류

- Node.js 버전 확인 (권장: 18.x 이상)
- `node_modules` 삭제 후 재설치: `rm -rf node_modules && npm install`

### 환경 변수 오류

- 환경 변수 이름이 정확한지 확인 (`VITE_` 접두사 필수)
- 배포 플랫폼에서 환경 변수가 올바르게 설정되었는지 확인
- 배포 후 환경 변수 변경 시 재배포 필요

### 런타임 오류

- 브라우저 콘솔에서 에러 메시지 확인
- 환경 변수가 클라이언트에서 접근 가능한지 확인 (Vite는 `VITE_` 접두사 필요)

### Vercel Root Directory 설정 오류

Hongik-main 전체를 Git 저장소로 사용하는 경우:
- **문제**: Vercel이 저장소 루트에서 빌드를 시도하여 실패
- **해결**: Vercel 프로젝트 설정에서 **Root Directory**를 `AI_Startup/jangbogo`로 설정
- 설정 위치: Vercel Dashboard → 프로젝트 → Settings → General → Root Directory

### Git 저장소 구조 문제

- **문제**: 다른 폴더(Algorithm_analysis, Database 등)의 파일들이 함께 푸시됨
- **해결**: `.gitignore` 파일을 루트에 생성하여 불필요한 파일 제외
  - `node_modules/`, `dist/` 등 빌드 결과물 무시
  - `.env*.local` 등 환경 변수 파일 무시

## 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Netlify 문서](https://docs.netlify.com)
- [GitHub Pages 문서](https://docs.github.com/en/pages)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)

