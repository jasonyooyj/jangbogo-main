# Jangbogo - 장보고

장보고는 AI 기반 쇼핑 어시스턴트를 제공하는 온라인 마트 웹 애플리케이션입니다.

## 주요 기능

- 🛒 상품 탐색 및 검색
- 🤖 AI 챗봇을 통한 상품 추천
- 📍 상품 위치 안내
- 📝 레시피 추천
- 🛍️ 장바구니 기능

## 기술 스택

- React 19
- Vite
- React Router
- Tailwind CSS
- OpenAI API

## 개발 환경 설정

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```
OpenAI API 키는 [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급받을 수 있습니다.

3. 개발 서버 실행:
```bash
npm run dev
```

4. 브라우저에서 `http://localhost:5173` 접속

## 배포

이 프로젝트는 Vercel 배포를 위한 설정이 포함되어 있습니다. 자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

### 빠른 배포 (Vercel)

1. [Vercel](https://vercel.com)에 가입 및 로그인
2. GitHub 저장소와 연결
3. 환경 변수 `VITE_OPENAI_API_KEY` 설정
4. 자동 배포 완료

더 자세한 배포 옵션은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 확인하세요.

## 빌드

프로덕션 빌드:
```bash
npm run build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

프리뷰:
```bash
npm run preview
```

## 프로젝트 구조

```
jangbogo/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── contexts/       # React Context
│   ├── services/       # API 서비스
│   └── data/           # 데이터 파일
├── public/             # 정적 파일
└── dist/               # 빌드 결과물
```

## 라이선스

MIT
