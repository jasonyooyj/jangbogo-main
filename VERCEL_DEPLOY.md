# Vercel 배포 가이드

GitHub 푸시가 완료되었습니다! 이제 Vercel에서 배포하세요.

## 배포 전 확인

✅ GitHub 저장소: https://github.com/jasonyooyj/jangbogo-main  
✅ 모든 파일 푸시 완료

## Vercel 배포 단계

### 1단계: Vercel 계정 생성/로그인

1. https://vercel.com 접속
2. "Sign Up" 또는 "Log In" 클릭
3. **"Continue with GitHub"** 클릭 (가장 쉬움)
4. GitHub 계정으로 로그인 및 권한 허용

### 2단계: 새 프로젝트 생성

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **Import Git Repository** 섹션에서:
   - GitHub 저장소 목록에서 **`jasonyooyj/jangbogo-main`** 찾아서 클릭
   - 또는 검색창에 `jangbogo-main` 입력

### 3단계: 프로젝트 설정 (⚠️ 중요!)

프로젝트 설정 화면에서:

1. **Root Directory**
   - "Root Directory" 옆의 **"Edit"** 버튼 클릭
   - `AI_Startup/jangbogo` 입력
   - ⚠️ **이 설정이 매우 중요합니다!** 하지 않으면 빌드 실패

2. **Framework Preset**
   - 자동으로 "Vite"로 감지됨 (변경 불필요)

3. **Build Command**
   - `npm run vercel-build` (vercel.json에 설정되어 있음, 자동 감지)

4. **Output Directory**
   - `dist` (자동 감지)

5. **Install Command**
   - `npm install` (기본값)

### 4단계: 환경 변수 설정 (⚠️ 필수!)

1. **"Environment Variables"** 섹션으로 스크롤
2. 다음 환경 변수 추가:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: (OpenAI API 키 입력)
   - **Environment**: 
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
     - (모두 체크)

> 💡 OpenAI API 키는 `.env` 파일에 있거나, [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급받을 수 있습니다.

### 5단계: 배포 시작

1. 하단 **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인 (약 1-2분 소요)

### 6단계: 배포 완료 확인

배포가 완료되면:

1. ✅ "Congratulations!" 메시지 확인
2. 배포된 URL 확인 (예: `jangbogo-main.vercel.app`)
3. URL 클릭하여 사이트가 정상 작동하는지 확인

## 배포 후 확인 사항

- [ ] 사이트가 정상적으로 로드되는가?
- [ ] AI 채팅 기능이 작동하는가? (환경 변수 확인)
- [ ] 모든 페이지가 정상 작동하는가?
- [ ] 브라우저 콘솔에 에러가 없는가?

## 문제 해결

### 빌드 실패

**"Root Directory"가 설정되지 않은 경우:**
- 프로젝트 Settings → General → Root Directory를 `AI_Startup/jangbogo`로 설정
- 재배포

**빌드 오류가 발생하는 경우:**
- Vercel 대시보드의 Deployments 탭에서 로그 확인
- 환경 변수가 올바르게 설정되었는지 확인

### 환경 변수 오류

**AI 채팅이 작동하지 않는 경우:**
- 프로젝트 Settings → Environment Variables에서 `VITE_OPENAI_API_KEY` 확인
- 모든 환경(Production, Preview, Development)에 설정되어 있는지 확인
- 환경 변수 변경 후 재배포 필요

## 자세한 배포 가이드

더 자세한 내용은 `AI_Startup/jangbogo/DEPLOYMENT.md`를 참조하세요.

## 배포 완료 후

배포가 완료되면:
- 배포된 URL을 공유할 수 있습니다
- 코드를 푸시할 때마다 자동으로 재배포됩니다
- 커스텀 도메인을 연결할 수 있습니다

🎉 축하합니다! 배포 완료!



