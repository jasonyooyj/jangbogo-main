# Vercel 배포 단계별 가이드

## 📋 준비 사항
- ✅ GitHub 저장소: https://github.com/jasonyooyj/jangbogo-main
- ✅ OpenAI API 키 준비 (`.env` 파일에 있음)

## 🚀 배포 단계

### 1️⃣ Vercel 로그인

1. 브라우저에서 https://vercel.com 접속
2. 우측 상단 **"Sign Up"** 또는 **"Log In"** 클릭
3. **"Continue with GitHub"** 버튼 클릭
   - GitHub 계정으로 자동 로그인됨
   - 권한 허용 필요

### 2️⃣ 프로젝트 가져오기

1. Vercel 대시보드에서:
   - **"Add New..."** 버튼 클릭
   - **"Project"** 선택

2. Import Git Repository 화면:
   - GitHub 저장소 목록에서 **`jasonyooyj/jangbogo-main`** 찾기
   - 또는 검색창에 `jangbogo-main` 입력
   - 저장소를 클릭

3. **"Import"** 버튼 클릭

### 3️⃣ 프로젝트 설정 ⚠️ 중요!

Configure Project 화면:

#### ① Root Directory 설정 (가장 중요!)

1. **"Root Directory"** 항목 찾기
2. 오른쪽의 **"Edit"** 버튼 클릭
3. `AI_Startup/jangbogo` 입력
4. 확인 또는 체크 표시 클릭

> ⚠️ **이 설정을 하지 않으면 빌드가 실패합니다!**

#### ② Framework 설정

- Framework Preset: **Vite** (자동으로 감지됨)
- 변경 불필요

#### ③ Build Settings

- Build Command: `npm run vercel-build` (자동 감지)
- Output Directory: `dist` (자동 감지)
- Install Command: `npm install` (기본값)

모두 자동으로 설정되므로 확인만 하면 됩니다.

### 4️⃣ 환경 변수 설정 ⚠️ 필수!

1. 화면 아래로 스크롤하여 **"Environment Variables"** 섹션 찾기

2. 환경 변수 추가:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: OpenAI API 키 입력
     - 💡 키는 `.env` 파일에 있거나
     - [OpenAI Platform](https://platform.openai.com/api-keys)에서 확인 가능
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - (모두 체크)

3. **"Add"** 버튼 클릭

### 5️⃣ 배포 시작

1. 모든 설정이 완료되면
2. 화면 하단의 **"Deploy"** 버튼 클릭
3. 배포 진행 상황을 확인하세요
   - 빌드 로그가 실시간으로 표시됨
   - 약 1-2분 소요

### 6️⃣ 배포 완료 확인

배포가 완료되면:

1. ✅ **"Congratulations!"** 메시지 확인
2. 배포된 URL 확인:
   - 예: `jangbogo-main-xxxxx.vercel.app`
   - 또는 `jangbogo-main.vercel.app`
3. URL을 클릭하여 사이트 확인:
   - 모든 페이지가 정상 작동하는지 확인
   - AI 채팅 기능 테스트

## ✅ 배포 완료!

배포가 완료되면:
- ✅ 코드를 GitHub에 푸시할 때마다 자동으로 재배포됩니다
- ✅ 배포된 URL을 공유할 수 있습니다
- ✅ 커스텀 도메인을 연결할 수 있습니다

## 🔍 문제 해결

### 빌드 실패하는 경우

1. **Root Directory 확인**
   - 프로젝트 Settings → General → Root Directory
   - `AI_Startup/jangbogo`로 설정되어 있는지 확인

2. **로그 확인**
   - Deployments 탭에서 실패한 배포 클릭
   - Build Logs 확인하여 오류 메시지 확인

### AI 채팅이 작동하지 않는 경우

1. **환경 변수 확인**
   - Settings → Environment Variables
   - `VITE_OPENAI_API_KEY`가 설정되어 있는지 확인
   - 모든 Environment에 설정되어 있는지 확인

2. **재배포**
   - 환경 변수를 변경한 경우 재배포 필요
   - Deployments → Redeploy

## 📚 추가 도움말

- 자세한 내용: `AI_Startup/jangbogo/DEPLOYMENT.md`
- Vercel 공식 문서: https://vercel.com/docs

🎉 배포 성공을 기원합니다!


