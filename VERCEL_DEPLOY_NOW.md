# 지금 바로 배포하기! 🚀

Vercel에 저장소를 연결하셨다면, 이제 다음 단계를 따라하세요!

## 현재 화면 확인

지금 Vercel에서 "Configure Project" 화면이 보이나요?
- 프로젝트 설정 화면
- Root Directory, Framework 등의 설정 옵션이 보임

## ⚠️ 필수 설정 (순서대로)

### 1️⃣ Root Directory 설정 (가장 중요!)

**Root Directory를 반드시 설정해야 합니다!**

1. 화면에서 **"Root Directory"** 항목 찾기
2. 오른쪽에 **"Edit"** 또는 **"Change"** 버튼 클릭
3. 입력창에 **`AI_Startup/jangbogo`** 입력
4. 확인 또는 저장 클릭

> ❗ **이 설정을 안 하면 빌드가 실패합니다!**

### 2️⃣ 환경 변수 설정

1. 화면을 아래로 스크롤
2. **"Environment Variables"** 섹션 찾기
3. **"Add"** 또는 **"+"** 버튼 클릭

다음 정보 입력:
- **Name**: `VITE_OPENAI_API_KEY`
- **Value**: (OpenAI API 키 입력)
  - 키를 모르시나요? `.env` 파일에 있거나 아래에서 확인하세요
- **Environment**: 
  - ✅ Production 체크
  - ✅ Preview 체크
  - ✅ Development 체크

4. **"Add"** 또는 **"Save"** 클릭

### 3️⃣ Framework 설정 확인

- Framework Preset: **Vite**로 자동 감지됨
- Build Command: `npm run vercel-build` (자동)
- Output Directory: `dist` (자동)

→ 변경 불필요, 자동 설정됨

### 4️⃣ 배포 시작!

모든 설정이 완료되면:

1. 화면 하단으로 스크롤
2. **"Deploy"** 버튼 클릭
3. 배포가 시작됩니다!

## 배포 진행 중

배포가 시작되면:
- 빌드 로그가 실시간으로 표시됩니다
- 약 1-2분 정도 소요됩니다
- 성공하면 "Congratulations!" 메시지가 나타납니다

## 배포 완료 후

배포가 완료되면:
- 배포된 URL을 확인하세요 (예: `jangbogo-main-xxxxx.vercel.app`)
- URL을 클릭하여 사이트가 정상 작동하는지 확인하세요

## 문제가 생겼나요?

### "Root Directory" 설정을 놓쳤다면:
1. Deployments 탭으로 이동
2. Settings → General
3. Root Directory를 `AI_Startup/jangbogo`로 설정
4. 다시 Deploy

### 환경 변수를 추가하지 않았다면:
1. Settings → Environment Variables
2. `VITE_OPENAI_API_KEY` 추가
3. 재배포 (Redeploy)

## OpenAI API 키 찾기

API 키가 필요하신가요?

1. 로컬 `.env` 파일 확인:
   ```
   /Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main/AI_Startup/jangbogo/.env
   ```

2. 또는 [OpenAI Platform](https://platform.openai.com/api-keys)에서 확인/생성

---

## 빠른 체크리스트

현재 화면에서 확인:
- [ ] Root Directory: `AI_Startup/jangbogo` 설정했나요?
- [ ] Environment Variables: `VITE_OPENAI_API_KEY` 추가했나요?
- [ ] Deploy 버튼을 클릭했나요?

모두 체크했으면 배포가 진행됩니다! 🎉



