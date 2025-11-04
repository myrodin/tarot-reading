# Vercel 배포 가이드

이 가이드는 Gemini API를 사용한 타로 리딩 서비스를 Vercel에 배포하는 방법을 안내합니다.

## 📋 사전 준비

### 1. Gemini API 키 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 방문
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. 생성된 API 키 복사 및 안전하게 보관

### 2. Vercel 계정 생성

1. [Vercel](https://vercel.com) 방문
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인 (추천)

## 🚀 Vercel 배포 단계

### 1단계: 프로젝트 Import

1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. GitHub 저장소 목록에서 `tarot-reading` 선택
3. "Import" 클릭

### 2단계: 프로젝트 설정

**Framework Preset**: Vite 선택 (자동 감지됨)

**Build Settings** (기본값 사용):
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 3단계: 환경 변수 설정

**Environment Variables** 섹션에서:

1. 변수 이름: `GEMINI_API_KEY`
2. 값: 앞서 발급받은 Gemini API 키 입력
3. Environment: Production, Preview, Development 모두 체크

### 4단계: 배포

1. "Deploy" 버튼 클릭
2. 배포 완료까지 약 2-3분 대기
3. 배포 완료 후 Vercel이 제공하는 URL 확인 (예: `https://your-app.vercel.app`)

## 🔗 GitHub Pages와 Vercel 연결

### 5단계: API URL 설정

프론트엔드(GitHub Pages)에서 Vercel API를 호출하도록 설정:

1. GitHub 저장소의 Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. 이름: `VITE_API_URL`
4. 값: `https://your-vercel-app.vercel.app/api/interpret`
   (your-vercel-app 부분을 실제 Vercel URL로 변경)

### 6단계: GitHub Actions 워크플로우 수정

`.github/workflows/deploy.yml` 파일에 환경변수 추가:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

## ✅ 테스트

### 로컬 테스트 (선택사항)

1. `.env.local` 파일 생성:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

2. Vercel CLI 설치 및 로컬 실행:
```bash
npm install -g vercel
vercel dev
```

3. 브라우저에서 `http://localhost:3000` 접속

### 프로덕션 테스트

1. GitHub Pages URL 접속 (예: `https://myrodin.github.io/tarot-reading/`)
2. 타로 리딩 진행:
   - 스프레드 타입 선택
   - 고민 카테고리 선택
   - 세부 상황 선택
   - 카드 선택
3. AI 해석 결과 확인

## 🎯 아키텍처

```
사용자
  ↓
GitHub Pages (프론트엔드)
  ↓ fetch()
Vercel Serverless Function (/api/interpret)
  ↓
Google Gemini API
  ↓
AI 해석 결과 반환
```

## 💰 비용

- **Gemini API**: 무료 (일일 1,500 요청)
- **Vercel**: 무료 (Hobby 플랜, 월 100GB 대역폭)
- **GitHub Pages**: 무료

→ **완전 무료!** 🎉

## 🔧 문제 해결

### API 호출 실패 시

1. Vercel 대시보드에서 환경변수 확인
2. Vercel Functions 로그 확인 (Dashboard → Deployments → 클릭 → Functions 탭)
3. CORS 에러: `/api/interpret.js`의 CORS 헤더 확인

### 배포 실패 시

1. Vercel 빌드 로그 확인
2. `package.json`의 dependencies 확인
3. Node.js 버전 호환성 확인

## 📝 유지보수

### API 키 교체

1. Vercel Dashboard → 프로젝트 선택
2. Settings → Environment Variables
3. `GEMINI_API_KEY` 편집
4. Deployments → 최신 배포 → "Redeploy" 클릭

### API URL 변경

1. GitHub Repository → Settings → Secrets
2. `VITE_API_URL` 편집
3. 새로운 커밋 푸시 (자동 재배포)

## 🎓 추가 자료

- [Vercel 문서](https://vercel.com/docs)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
