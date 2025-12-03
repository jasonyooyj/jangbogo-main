# GitHub 저장소 연결 방법

## 📋 현재 상태
✅ Git 저장소 초기화 완료  
✅ 모든 파일 커밋 완료  
✅ 연결 준비 완료

## 🚀 빠른 연결 (3단계)

### 1단계: GitHub에서 저장소 생성
1. https://github.com/new 접속
2. Repository name: `Hongik-main` 입력
3. Public 또는 Private 선택
4. ⚠️ **"Initialize with README" 체크하지 않기**
5. "Create repository" 클릭

### 2단계: 저장소 URL 복사
생성된 저장소 페이지에서 초록색 "Code" 버튼 클릭 → HTTPS URL 복사
예: `https://github.com/your-username/Hongik-main.git`

### 3단계: 연결 스크립트 실행
터미널에서 다음 명령어 실행:

```bash
cd "/Users/yoo/Library/Mobile Documents/com~apple~CloudDocs/00 University/25-2 (3학년 2학기)/AI활용과 스타트업/Hongik-main"
./connect_github.sh
```

저장소 URL을 입력하라고 나오면 복사한 URL을 붙여넣기 하세요.

## ✅ 완료 확인

연결이 완료되면:
- GitHub 웹사이트에서 파일들이 보여야 합니다
- 다음 커밋부터는 `git push`로 바로 푸시 가능합니다

## 🔄 다음 단계

GitHub 연결 완료 후 → [Vercel 배포](./AI_Startup/jangbogo/DEPLOYMENT.md) 진행



