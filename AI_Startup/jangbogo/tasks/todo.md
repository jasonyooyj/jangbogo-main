# AI 대화와 지도 연동 작업 계획

## 문제점 분석
현재 ChatPage에서 AI 응답을 단순 키워드 매칭으로 상품을 찾아 지도로 연결하고 있습니다. 이 방식은 불안정하며, AI 응답과 지도 간의 연동이 원활하지 않습니다.

## 작업 목표
AI 대화 응답에서 언급된 상품들을 자동으로 감지하고, 해당 상품들을 지도 페이지로 직접 연동하여 보여줄 수 있도록 개선합니다.

## 작업 항목

### 1. OpenAI 서비스 개선 (간단한 JSON 응답 형식)
- [x] `openai.js`의 시스템 프롬프트 수정: AI가 응답 끝에 JSON 형식으로 상품 ID 목록 포함
- [x] AI 응답 파싱 함수 추가: JSON 부분 추출하여 상품 ID 배열 반환
- [x] 에러 처리 및 로깅 추가

### 2. ChatPage 업데이트
- [x] AI 응답에서 JSON 형식의 상품 ID 추출 로직 추가
- [x] 추출한 상품 ID로 실제 상품 객체 찾기
- [x] 키워드 매칭은 폴백(fallback)으로 유지
- [x] 상품이 있을 때 지도 연동 버튼 표시 개선

### 3. 테스트 및 디버깅
- [x] 콘솔 로그로 상품 추출 과정 확인 가능하도록 로깅 추가
- [x] 다양한 쿼리로 테스트 (예: "우유 어디 있어?", "떡볶이 재료 찾아줘")

## 검토 사항

### 변경 사항 요약

#### 1. `src/services/openai.js` 수정
- **시스템 프롬프트 개선**: AI 응답 끝에 `[PRODUCT_IDS]...[/PRODUCT_IDS]` 형식으로 상품 ID 배열을 포함하도록 지시 추가
- **JSON 파싱 함수 추가**:
  - `extractProductIds()`: AI 응답에서 JSON 블록을 추출하여 상품 ID 배열 반환
  - `removeJsonBlock()`: AI 응답에서 JSON 블록을 제거하여 깔끔한 텍스트만 반환
- **반환 형식 변경**: `getChatResponse()`가 이제 `{text, productIds}` 객체를 반환하도록 변경
- **에러 처리**: JSON 파싱 실패 시 빈 배열 반환 및 콘솔 로그 출력
- **로깅 추가**: 상품 ID 추출 과정을 콘솔에 로그로 출력

#### 2. `src/pages/ChatPage.jsx` 수정
- **응답 처리 개선**: `getChatResponse()`의 반환 객체에서 `text`와 `productIds` 추출
- **상품 매칭 로직 개선**:
  1. 먼저 AI가 반환한 상품 ID로 실제 상품 객체 찾기
  2. ID 매칭이 실패하면 기존 키워드 매칭 방식으로 폴백
- **로깅 추가**: 상품 추출 과정을 콘솔에 로그로 출력하여 디버깅 가능

### 작동 방식
1. 사용자가 채팅으로 질문 (예: "우유 어디 있어?")
2. AI가 자연어 응답 + JSON 블록으로 상품 ID 반환
3. JSON 블록 파싱하여 상품 ID 추출
4. 상품 ID로 실제 상품 객체 찾기
5. 찾은 상품이 있으면 지도 연동 버튼 표시
6. 버튼 클릭 시 MapPage로 해당 상품들의 위치 안내

### 추가 개선 가능한 부분
- AI가 JSON 블록을 반환하지 않는 경우를 대비한 더 강화된 키워드 매칭 로직
- 상품 이름의 부분 일치 처리 개선
- 여러 상품이 언급된 경우 우선순위 정렬

---

# 떡볶이 떡 이미지 파일 수정 작업

## 문제점
떡볶이 떡(id: 7)의 이미지 URL이 깨져서 표시되지 않습니다.

## 작업 목표
떡볶이 떡의 이미지 URL을 작동하는 이미지 URL로 교체합니다.

## 작업 항목
- [x] mockData.js에서 떡볶이 떡(id: 7)의 이미지 URL 확인
- [x] 작동하는 이미지 URL로 교체
- [ ] 브라우저에서 이미지가 정상적으로 표시되는지 확인

## 검토 사항

### 변경 사항 요약

#### `src/data/mockData.js` 수정
- **떡볶이 떡 이미지 URL 교체**: 깨진 Unsplash 이미지 URL을 새로운 이미지 URL로 교체
  - 이전 URL: `https://images.unsplash.com/photo-1626804475297-411f7c1b4c80?auto=format&fit=crop&w=800&q=80`
  - 새로운 URL: `https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=80`
- 변경된 라인: 9번 라인의 상품 ID 7 (떡볶이 떡)

### 확인 필요 사항
- 브라우저에서 이미지가 정상적으로 표시되는지 확인
- 이미지가 여전히 표시되지 않으면 브라우저 콘솔에서 에러 메시지 확인

---

# 떡볶이 떡 이미지 파일 재수정 작업 (근본적 해결)

## 문제점
떡볶이 떡(id: 7)의 이미지 URL이 계속 깨지고 있습니다. Unsplash 이미지 URL이 불안정하여 재발 가능성이 있습니다.

## 작업 목표
1. 이미지 로드 실패 시 에러 핸들링 추가
2. 더 안정적인 이미지 URL로 교체하거나 placeholder 표시
3. 이미지가 로드되지 않을 때 대체 이미지 표시

## 작업 항목
- [x] 이미지 컴포넌트에 onError 핸들러 추가 (이미지 로드 실패 시 콘솔 로그)
- [x] 떡볶이 떡 이미지 URL을 더 안정적인 이미지로 교체
- [x] 이미지가 로드되지 않을 때 placeholder 또는 기본 이미지 표시

## 검토 사항

### 변경 사항 요약

#### 1. `src/data/mockData.js` 수정
- **떡볶이 떡 이미지 URL 교체**: 안정적인 Unsplash 이미지 URL로 교체
  - 새로운 URL: `https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80`
  - 변경된 라인: 9번 라인의 상품 ID 7 (떡볶이 떡)

#### 2. `src/pages/ProductDetailPage.jsx` 수정
- **이미지 에러 핸들링 추가**:
  - `imageError` 상태 추가로 이미지 로드 실패 추적
  - `onError` 핸들러 추가: 이미지 로드 실패 시 콘솔에 에러 로그 출력 및 placeholder(📦) 표시
- 변경된 라인: 10번 라인 (상태 추가), 46번 라인 (이미지 태그에 onError 추가)

#### 3. `src/pages/HomePage.jsx` 수정
- **이미지 에러 핸들링 추가**:
  - `imageErrors` 상태 추가로 여러 이미지의 로드 실패 추적
  - `handleImageError` 함수 추가: 이미지 로드 실패 시 콘솔에 에러 로그 출력
  - 모든 상품 이미지에 `onError` 핸들러 추가: 로드 실패 시 placeholder(📦) 표시
- 변경된 라인: 1번 라인 (useState import), 9-13번 라인 (상태 및 핸들러 추가), 51번, 80번 라인 (이미지 태그에 onError 추가)

### 개선 사항
- 이미지가 로드되지 않을 때 placeholder(📦)를 표시하여 사용자 경험 개선
- 브라우저 콘솔에 이미지 로드 실패 정보를 출력하여 디버깅 가능
- 이미지 URL이 깨져도 애플리케이션이 정상적으로 작동

### 확인 필요 사항
- 브라우저에서 떡볶이 떡 이미지가 정상적으로 표시되는지 확인
- 이미지 로드 실패 시 placeholder가 정상적으로 표시되는지 확인
- 브라우저 콘솔에서 이미지 로드 실패 시 에러 메시지가 출력되는지 확인

---

# 레시피 질문 시 재료 표시 및 지도/장바구니 연동 기능

## 문제점
AI 대화에서 레시피를 물어봤을 때 재료 목록을 보여주지 않고, 각 재료의 위치 정보나 장바구니 추가 기능이 없습니다.

## 작업 목표
1. 레시피 관련 질문 시 필요한 재료들을 카드 형태로 표시
2. 각 재료에 위치 정보 표시 및 지도 연동
3. 각 재료에 장바구니 추가 기능 추가
4. 전체 재료를 한 번에 지도로 안내하는 기능

## 작업 항목

### 1. OpenAI 서비스에 RECIPES 정보 추가
- [ ] `openai.js`의 시스템 프롬프트에 RECIPES 데이터 포함
- [ ] 레시피 질문 시 레시피 ID를 JSON으로 반환하도록 설정

### 2. ChatPage에서 레시피 처리 로직 추가
- [ ] AI 응답에서 레시피 ID 추출
- [ ] 레시피 ID로 RECIPES 데이터에서 재료 목록 가져오기
- [ ] 재료 이름으로 PRODUCTS 매칭하여 실제 상품 객체 찾기

### 3. 재료 카드 컴포넌트 추가
- [ ] 각 재료를 카드 형태로 표시 (이미지, 이름, 가격, 위치)
- [ ] 각 재료 카드에 장바구니 추가 버튼 추가
- [ ] 각 재료 카드에 위치 안내 버튼 추가 (ProductLocationModal)
- [ ] 전체 재료 지도 안내 버튼 추가

### 4. 장바구니 연동
- [ ] CartContext의 addToCart 함수 사용
- [ ] 장바구니 추가 시 피드백 표시

## 검토 사항
- 작업 완료 후 변경 사항 요약
- 사용자 경험 개선 사항

---

# 장바구니 페이지에서 AI 대화 아이콘 가려지는 문제 수정

## 문제점 분석
장바구니 페이지(`CartPage`)의 하단 결제 섹션에 `z-10`이 설정되어 있어, Footer의 AI 대화 아이콘이 가려지는 문제가 발생합니다.

## 작업 목표
Footer에 적절한 z-index를 추가하여 항상 다른 요소들 위에 표시되도록 수정합니다.

## 작업 항목
- [x] `Footer.jsx`에 z-index 추가하여 항상 위에 표시되도록 수정

## 검토 사항

### 변경 사항 요약

#### `src/components/layout/Footer.jsx` 수정
- **z-index 추가**: Footer의 nav 요소에 `z-20` 클래스를 추가하여 항상 다른 요소들 위에 표시되도록 수정
  - 변경된 라인: 20번 라인
  - 이전: `className="bg-white border-t border-gray-200 px-6 py-2 flex justify-around items-center h-20 pb-4 safe-area-bottom"`
  - 이후: `className="bg-white border-t border-gray-200 px-6 py-2 flex justify-around items-center h-20 pb-4 safe-area-bottom z-20"`

### 개선 사항
- 장바구니 페이지에서도 Footer의 AI 대화 아이콘이 항상 클릭 가능하도록 개선
- Footer가 다른 페이지 요소들 위에 항상 표시되어 사용자 경험 개선

### 확인 필요 사항
- 장바구니 페이지에서 AI 대화 아이콘이 정상적으로 표시되고 클릭 가능한지 확인
- 다른 페이지에서도 Footer가 정상적으로 작동하는지 확인

---

# 배포 방법 문서화

## 작업 목표
jangbogo 프로젝트를 배포하기 위한 단계별 가이드를 작성하고 필요한 설정을 확인합니다.

## 작업 항목

### 1. 배포 전 확인 사항
- [ ] 환경 변수 설정 파일 확인 (.env.example 생성 여부)
- [ ] 빌드 스크립트 테스트
- [ ] 프로덕션 빌드 테스트
- [ ] 환경 변수 목록 문서화

### 2. Vercel 배포 가이드 작성
- [ ] Vercel 배포 단계별 문서 작성
- [ ] 환경 변수 설정 방법 안내
- [ ] 배포 후 확인 사항 작성

### 3. 기타 배포 옵션 가이드 작성 (선택사항)
- [ ] Netlify 배포 가이드
- [ ] GitHub Pages 배포 가이드

### 4. README 업데이트
- [x] 배포 섹션 추가
- [x] 환경 변수 설정 방법 추가

## 검토 사항

### 변경 사항 요약

#### 1. `DEPLOYMENT.md` 파일 생성
- **배포 가이드 문서 작성**: 단계별 배포 가이드 포함
  - 환경 변수 설정 안내
  - 배포 전 확인 사항
  - Vercel 배포 방법 (권장)
  - Netlify 배포 방법
  - GitHub Pages 배포 방법
  - 문제 해결 섹션
  - 배포 후 확인 사항

#### 2. `README.md` 업데이트
- **프로젝트 소개 추가**: 장보고 프로젝트 설명
- **주요 기능 섹션 추가**: 프로젝트의 핵심 기능 나열
- **기술 스택 섹션 추가**: 사용된 기술 명시
- **개발 환경 설정 섹션 추가**: 설치 및 실행 방법
- **배포 섹션 추가**: 빠른 배포 가이드 및 DEPLOYMENT.md 링크
- **프로젝트 구조 섹션 추가**: 폴더 구조 설명

#### 3. 빌드 테스트
- **프로덕션 빌드 성공 확인**: `npm run build` 명령어 실행 성공
- 빌드 결과물이 `dist` 폴더에 정상적으로 생성됨

#### 4. 환경 변수 확인
- **필수 환경 변수**: `VITE_OPENAI_API_KEY` (OpenAI API 키)
- 환경 변수 사용 위치: `src/services/openai.js`

### 배포 방법 요약

#### Vercel 배포 (가장 간단한 방법)
1. Vercel에 GitHub 저장소 연결
2. 환경 변수 `VITE_OPENAI_API_KEY` 설정
3. 자동 배포 완료

#### 기타 배포 옵션
- Netlify: 드래그 앤 드롭 또는 GitHub 연동
- GitHub Pages: GitHub Actions를 통한 자동 배포

### 확인 필요 사항
- 배포 전: 로컬에서 `npm run build` 및 `npm run preview`로 테스트
- 배포 후: 브라우저 콘솔에서 에러 확인
- 환경 변수: 배포 플랫폼에서 올바르게 설정되었는지 확인

---

# Git 저장소 설정 및 Vercel 배포 연동

## 문제점 분석
Hongik-main 전체를 Git 저장소로 만들어야 하는데, Vercel에서 배포할 때 jangbogo만 배포되도록 설정해야 합니다.

## 작업 목표
1. Hongik-main을 Git 저장소로 초기화
2. .gitignore 설정으로 불필요한 파일 제외
3. Vercel에서 Root Directory 설정 방법 문서화

## 작업 항목

### 1. Git 저장소 초기화
- [ ] Hongik-main 폴더를 Git 저장소로 초기화
- [ ] 기본 브랜치 설정

### 2. .gitignore 설정
- [ ] .gitignore 파일 업데이트
- [ ] node_modules, dist 등 빌드 결과물 무시
- [ ] 환경 변수 파일 무시
- [ ] .DS_Store 등 시스템 파일 무시

### 3. Vercel 배포 설정 문서화
- [x] Vercel Root Directory 설정 방법 추가
- [x] DEPLOYMENT.md 업데이트

## 검토 사항

### 변경 사항 요약

#### 1. Git 저장소 초기화
- **Hongik-main을 Git 저장소로 초기화**: `git init` 명령어 실행 완료
- Git 저장소가 `/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main/.git/`에 생성됨

#### 2. `.gitignore` 파일 업데이트
- **루트 `.gitignore` 파일 생성/업데이트**: 불필요한 파일 제외 설정
  - `node_modules/` - 모든 하위 폴더의 node_modules 무시
  - `dist/` - 빌드 결과물 무시
  - `.env*.local` - 환경 변수 파일 무시
  - `.DS_Store` - macOS 시스템 파일 무시
  - 기타 로그, 캐시, 에디터 파일 등 무시

#### 3. 배포 문서 업데이트
- **`DEPLOYMENT.md` 업데이트**:
  - Vercel에서 Root Directory를 `AI_Startup/jangbogo`로 설정하는 방법 추가
  - Git 저장소 연결 시 Hongik-main 전체를 푸시하는 방법 안내
  - Root Directory 설정 오류 관련 문제 해결 섹션 추가

- **`GIT_SETUP.md` 파일 생성** (루트):
  - Git 저장소 초기화 방법
  - GitHub 저장소 연결 방법
  - Vercel 배포 시 Root Directory 설정 방법
  - 문제 해결 가이드

### Vercel 배포 시 주의사항

**⚠️ 중요**: Vercel에서 배포할 때 반드시 다음 설정이 필요합니다:

1. **Root Directory**: `AI_Startup/jangbogo`로 설정
   - Vercel Dashboard → 프로젝트 → Settings → General → Root Directory
   - 이 설정을 하지 않으면 Hongik-main 루트에서 빌드를 시도하여 실패합니다

2. **환경 변수**: `VITE_OPENAI_API_KEY` 설정
   - Vercel Dashboard → 프로젝트 → Settings → Environment Variables

### 다음 단계

1. GitHub 저장소 생성 및 연결:
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Vercel에서 배포:
   - New Project → GitHub 저장소 선택
   - Root Directory를 `AI_Startup/jangbogo`로 설정
   - 환경 변수 설정
   - 배포 완료
